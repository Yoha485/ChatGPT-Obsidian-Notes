#!/bin/bash

# Check if --version argument is provided
if [[ $1 == "--version" && -n $2 ]]; then
  VERSION=$2
  echo "Setting version to $VERSION"
else
  echo "No version provided. Running npm run build without updating manifest."
  npm run build
  exit 0
fi

# Check if manifest.json exists
if [[ ! -f src/manifest.json ]]; then
  echo "Error: src/manifest.json not found!"
  exit 1
fi

# Check if manifest.json contains a version key and add if missing
if jq -e '.version' src/manifest.json > /dev/null; then
  echo "Updating existing version key in manifest.json"
else
  echo "Version key not found in manifest.json, adding new version key."
  echo "$(jq --arg version "$VERSION" '. + {version: $version}' src/manifest.json)" > src/manifest.json
fi

# Update only the version line in manifest.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src/manifest.json

# Run the build command
npm run build

# zip the dist folder
zip -r dist/obsidian-chatgpt-notes-$VERSION.zip dist
