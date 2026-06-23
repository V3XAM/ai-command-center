# Android Skills import

This branch prepares an automated import of Android Skills into this repository.

## What it does

The GitHub Actions workflow `.github/workflows/import-android-skills.yml` can be run manually from the Actions tab. It downloads the Android Skills ZIP from:

```text
https://dl.google.com/dac/dac_skills.zip
```

Then it extracts the contents into:

```text
android-skills/
```

and commits the result back to the repository.

## Suggested workflow

1. Merge this branch or pull request into `main`.
2. Open **Actions**.
3. Choose **Import Android Skills**.
4. Click **Run workflow**.
5. Leave `target_path` as `android-skills`.
6. Run it.

## Why this approach

The Android Skills package contains many files. Importing it through a workflow keeps the Git history clean and avoids hundreds of individual commits.
