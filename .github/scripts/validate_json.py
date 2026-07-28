#!/usr/bin/env python3

import json
import os
import sys
from pathlib import Path

from jsonschema import Draft4Validator, Draft7Validator, SchemaError, validators


ROOT = Path(__file__).resolve().parents[2]
SCHEMA_PAIRS = {
    Path("clockboy/combo-pizza-Dev.json"): Path("clockboy/combo-pizza-Dev.schema.json"),
    Path("clockboy/combo-pizza.json"): Path("clockboy/combo-pizza.schema.json"),
    Path("highscores/scoreboard.json"): Path("highscores/scoreboard.schema.json"),
    Path("WorldRecentUpdates/ExpressRecentUpdates.json"): Path("WorldRecentUpdates/schema.json"),
    Path("WorldRecentUpdates/MainStoreRecentUpdates.json"): Path("WorldRecentUpdates/schema.json"),
    Path("WorldRecentUpdates/SuperKRecentUpdates.json"): Path("WorldRecentUpdates/schema.json"),
}
DECLARED_SCHEMA_REFERENCES = {
    Path("clockboy/combo-pizza-Dev.json"): "./combo-pizza-Dev.schema.json",
    Path("clockboy/combo-pizza.json"): "./combo-pizza.schema.json",
    Path("WorldRecentUpdates/ExpressRecentUpdates.json"): "./schema.json",
    Path("WorldRecentUpdates/MainStoreRecentUpdates.json"): "./schema.json",
    Path("WorldRecentUpdates/SuperKRecentUpdates.json"): "./schema.json",
}
IGNORED_DIRECTORIES = {".git", "_site", "node_modules"}
MAX_ERRORS_PER_FILE = 50
LEGACY_SCHEMA_VALIDATORS = {
    "https://json-schema.org/draft-04/schema#": Draft4Validator,
    "https://json-schema.org/draft-07/schema#": Draft7Validator,
}


def workflow_escape(value):
    return str(value).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def relative_path(path):
    return path.relative_to(ROOT).as_posix()


def report_error(path, message, line=None, column=None, title="JSON validation failed"):
    metadata = [f"file={workflow_escape(relative_path(path))}", f"title={workflow_escape(title)}"]
    if line is not None:
        metadata.append(f"line={line}")
    if column is not None:
        metadata.append(f"col={column}")
    print(f"::error {','.join(metadata)}::{workflow_escape(message)}")


def json_location(error):
    location = "$"
    for part in error.absolute_path:
        if isinstance(part, int):
            location += f"[{part}]"
        else:
            location += f"[{json.dumps(part)}]"
    return location


def write_summary(json_count, schema_count, errors):
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return

    if errors:
        body = (
            "## JSON validation failed\n\n"
            f"Found **{errors}** error(s). Open the **Validate JSON files** step for file-level details.\n"
        )
    else:
        body = (
            "## JSON validation passed\n\n"
            f"Parsed **{json_count}** JSON files and validated **{schema_count}** database/schema pair(s).\n"
        )

    with open(summary_path, "a", encoding="utf-8") as summary:
        summary.write(body)


def validator_for_schema(schema):
    if isinstance(schema, dict):
        legacy_validator = LEGACY_SCHEMA_VALIDATORS.get(schema.get("$schema"))
        if legacy_validator is not None:
            return legacy_validator
    return validators.validator_for(schema)


def main():
    json_paths = sorted(
        path
        for path in ROOT.rglob("*.json")
        if not any(part in IGNORED_DIRECTORIES for part in path.relative_to(ROOT).parts)
    )

    documents = {}
    error_count = 0

    for path in json_paths:
        try:
            documents[path] = json.loads(path.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as error:
            report_error(
                path,
                error.msg,
                line=error.lineno,
                column=error.colno,
                title="Invalid JSON syntax",
            )
            error_count += 1
        except UnicodeDecodeError as error:
            report_error(path, str(error), title="JSON must use UTF-8")
            error_count += 1

    for data_relative, expected_reference in DECLARED_SCHEMA_REFERENCES.items():
        data_path = ROOT / data_relative
        document = documents.get(data_path)
        if document is None:
            continue
        if not isinstance(document, dict) or document.get("$schema") != expected_reference:
            report_error(
                data_path,
                f'$schema must be exactly "{expected_reference}"',
                title="Required schema reference changed",
            )
            error_count += 1

    checked_schemas = set()
    validated_pairs = 0

    for data_relative, schema_relative in sorted(SCHEMA_PAIRS.items()):
        data_path = ROOT / data_relative
        schema_path = ROOT / schema_relative

        if data_path not in documents:
            if data_path.exists():
                continue
            report_error(data_path, "Configured database file does not exist")
            error_count += 1
            continue

        if schema_path not in documents:
            if schema_path.exists():
                continue
            report_error(data_path, f"Schema file does not exist: {schema_relative.as_posix()}")
            error_count += 1
            continue

        schema = documents[schema_path]
        try:
            validator_class = validator_for_schema(schema)
            validator_class.check_schema(schema)
        except SchemaError as error:
            report_error(schema_path, error.message, title="Invalid JSON schema")
            error_count += 1
            continue

        checked_schemas.add(schema_path)
        validation_errors = sorted(
            validator_class(schema).iter_errors(documents[data_path]),
            key=lambda error: [str(part) for part in error.absolute_path],
        )

        for error in validation_errors[:MAX_ERRORS_PER_FILE]:
            report_error(
                data_path,
                f"{json_location(error)}: {error.message}",
                title="JSON schema mismatch",
            )
            error_count += 1

        if len(validation_errors) > MAX_ERRORS_PER_FILE:
            omitted = len(validation_errors) - MAX_ERRORS_PER_FILE
            report_error(
                data_path,
                f"{omitted} additional schema error(s) omitted",
                title="JSON schema mismatch",
            )
            error_count += omitted

        if not validation_errors:
            validated_pairs += 1

    for schema_path in sorted(
        path
        for path in documents
        if path.name == "schema.json" or path.name.endswith(".schema.json")
    ):
        if schema_path in checked_schemas:
            continue
        try:
            validator_class = validator_for_schema(documents[schema_path])
            validator_class.check_schema(documents[schema_path])
        except SchemaError as error:
            report_error(schema_path, error.message, title="Invalid JSON schema")
            error_count += 1

    write_summary(len(json_paths), validated_pairs, error_count)

    if error_count:
        print(f"JSON validation failed with {error_count} error(s).")
        return 1

    print(f"Validated {len(json_paths)} JSON files and {validated_pairs} schema-backed databases.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
