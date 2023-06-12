# Semantic Release Workflows

This example demonstrates how to use [semantic releases](https://github.com/semantic-release/semantic-release) 
to automatically tag a commit with a version number and then have that trigger a new Maven release.

The example uses two different workflows to allow us to publish Kotlin Multiplatform artifacts,
which require a MacOS build worker.

To trigger both workflows, push the code you want to release to the `release` branch. The version 
tag and artifacts will be created automatically.

```yaml
# .github/workflows/github-release.yaml
name: GitHub Release
on:
  push:
    branches:
      - release

jobs:
  # Bump the semantic version number and publishes a GitHub release
  release:
    runs-on: ubuntu-latest

    steps:
      - name: Check out release tag
        uses: actions/checkout@v3

      # Bumps the version number, creates a GitHub release, and tags this commit
      # with the new version number, like `refs/tag/v1.2.3`. This tag will then
      # be used to create the Maven release in maven-release.yaml.
      - name: Create Github Release
        uses: cycjimmy/semantic-release-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
# .github/workflows/maven-release.yaml
name: Maven Release
on:
  # Trigger this workflow when the other workflow finishes.
  # Note that we can't trigger directly on pushing the version tag due to
  # this: https://github.community/t/triggering-a-new-workflow-from-another-workflow/16250
  workflow_run:
    workflows: ["GitHub Release"]
    types:
      - completed

jobs:
  # Publish a Maven release
  release:
    runs-on: macos-latest

    steps:
      - name: Check out release tag
        uses: actions/checkout@v3
        with:
          # Required due to the way Git works
          # Without this the action won't be able to find the correct tags
          fetch-depth: 0

      # If the GitHub release (and tag) failed, then this step will fail.
      - name: Read version tag
        id: versiontag
        uses: efirestone/get-version-tag-action@v1

      # This Gradle publish task is provided by vanniktech/gradle-maven-publish-plugin
      - name: Push artifacts to Maven
        run: ./gradlew --no-daemon --no-parallel publish
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.SONATYPE_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.SONATYPE_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: ${{ secrets.SIGNING_KEY }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyId: ${{ secrets.SIGNING_KEY_ID }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: ${{ secrets.SIGNING_KEY_PASSWORD }}
          VERSION: ${{ steps.get_version.outputs.version-without-v }}

      - name: Finalize and publish Maven release
        run: ./gradlew --no-daemon closeAndReleaseRepository
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.SONATYPE_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.SONATYPE_PASSWORD }}
```
