#!/bin/bash

# Setup planning phase for feature development
# Usage: ./setup-plan.sh --json

set -e

# Find the most recent spec file
FEATURE_SPEC=$(find .specify/features -name "*-spec.md" -type f | head -1)

if [ -z "$FEATURE_SPEC" ]; then
    echo "Error: No spec file found in .specify/features/"
    exit 1
fi

# Get current branch name
BRANCH=$(git branch --show-current)

# Generate implementation plan path
SPEC_BASENAME=$(basename "$FEATURE_SPEC" -spec.md)
IMPL_PLAN=".specify/features/${SPEC_BASENAME}-plan.md"

# Create specs directory for artifacts
SPECS_DIR=".specify/features/${SPEC_BASENAME}-specs"
mkdir -p "$SPECS_DIR"

# Copy plan template to implementation plan location
cp .specify/templates/plan-template.md "$IMPL_PLAN"

# Output JSON for parsing
echo "{"
echo "  \"FEATURE_SPEC\": \"$(pwd)/$FEATURE_SPEC\","
echo "  \"IMPL_PLAN\": \"$(pwd)/$IMPL_PLAN\","
echo "  \"SPECS_DIR\": \"$(pwd)/$SPECS_DIR\","
echo "  \"BRANCH\": \"$BRANCH\""
echo "}"