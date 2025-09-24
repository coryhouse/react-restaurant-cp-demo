#!/bin/bash

# Check prerequisites and find available design documents
# Usage: ./check-prerequisites.sh --json

set -e

# Find the feature directory with design documents
FEATURE_DIR=""
for dir in .specify/features/*-specs; do
    if [ -d "$dir" ]; then
        FEATURE_DIR="$dir"
        break
    fi
done

if [ -z "$FEATURE_DIR" ]; then
    echo "Error: No feature specs directory found"
    exit 1
fi

# Check for available design documents
AVAILABLE_DOCS=()

# Always check for these core documents
if [ -f "$FEATURE_DIR/../*-plan.md" ]; then
    AVAILABLE_DOCS+=("plan.md")
fi

if [ -f "$FEATURE_DIR/data-model.md" ]; then
    AVAILABLE_DOCS+=("data-model.md")
fi

if [ -f "$FEATURE_DIR/research.md" ]; then
    AVAILABLE_DOCS+=("research.md")
fi

if [ -f "$FEATURE_DIR/quickstart.md" ]; then
    AVAILABLE_DOCS+=("quickstart.md")
fi

if [ -d "$FEATURE_DIR/contracts" ]; then
    AVAILABLE_DOCS+=("contracts/")
fi

# Output JSON for parsing
echo "{"
echo "  \"FEATURE_DIR\": \"$(pwd)/$FEATURE_DIR\","
echo "  \"AVAILABLE_DOCS\": ["

# Format available docs as JSON array
for i in "${!AVAILABLE_DOCS[@]}"; do
    if [ $i -eq 0 ]; then
        echo "    \"${AVAILABLE_DOCS[$i]}\""
    else
        echo "    ,\"${AVAILABLE_DOCS[$i]}\""
    fi
done

echo "  ]"
echo "}"