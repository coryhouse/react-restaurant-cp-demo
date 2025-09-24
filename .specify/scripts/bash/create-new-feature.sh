#!/bin/bash

# Create new feature branch and spec file
# Usage: ./create-new-feature.sh --json "feature description"

set -e

FEATURE_DESCRIPTION="$2"

# Generate branch name from feature description
BRANCH_NAME=$(echo "$FEATURE_DESCRIPTION" | sed 's/[^a-zA-Z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g' | cut -c1-50)
BRANCH_NAME="feature/$BRANCH_NAME"

# Generate spec file name
SPEC_FILE_NAME=$(echo "$FEATURE_DESCRIPTION" | sed 's/[^a-zA-Z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g' | cut -c1-30)
SPEC_FILE=".specify/features/${SPEC_FILE_NAME}-spec.md"

# Create features directory if it doesn't exist
mkdir -p .specify/features

# Create and checkout new branch
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# Initialize spec file
touch "$SPEC_FILE"

# Output JSON for parsing
echo "{"
echo "  \"BRANCH_NAME\": \"$BRANCH_NAME\","
echo "  \"SPEC_FILE\": \"$(pwd)/$SPEC_FILE\""
echo "}"