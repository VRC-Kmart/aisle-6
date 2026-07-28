# Contributing database changes

Only VRC-Kmart organisation members may submit pull requests. Direct pushes to `main` are blocked.

Open a pull request containing the JSON change. There is no questionnaire or checklist. GitHub checks organisation membership, parses every JSON file, and applies the available database schemas.

If validation fails, a bot comment gives the exact file, location, and error. Push the correction to the same pull request and the checks run again.

Pull requests that only modify existing data JSON files are merged automatically after both checks pass. Additions, deletions, renames, and changes to schemas, workflows, dependencies, or documentation require manual review.

After an automatic merge, `main` is validated again and GitHub Pages is deployed.

<!-- Temporary live rollout verification; this change will not be merged. -->
