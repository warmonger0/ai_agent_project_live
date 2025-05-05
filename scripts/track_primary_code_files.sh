#!/bin/bash
set -e

PROJECT_ROOT="/home/war/ai_agent_project"
TRACKING_FILE="$PROJECT_ROOT/primary_code_files.txt"
BACKUP_FILE="$PROJECT_ROOT/primary_code_files.bak.txt"
IGNORE_FILE="$PROJECT_ROOT/primary_code_files.ignore"
DIFF_FILE="$PROJECT_ROOT/primary_code_files.diff.txt"

RAW_FILE_LIST=$(mktemp)
FILTERED_LIST=$(mktemp)

echo "📁 Scanning for primary source files..."

# Backup existing file
if [ -f "$TRACKING_FILE" ]; then
    echo "📦 Backing up previous list to $BACKUP_FILE"
    mv "$TRACKING_FILE" "$BACKUP_FILE"
fi

# Generate initial candidate list
find "$PROJECT_ROOT" \
    -type f \
    \( -name "*.py" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.html" -o -name "*.css" \) \
    ! -path "$TRACKING_FILE" \
    ! -path "$BACKUP_FILE" \
    ! -name "$(basename "$0")" \
    | sed "s|$PROJECT_ROOT/||" \
    | sort > "$RAW_FILE_LIST"

# Apply ignore rules
if [ -f "$IGNORE_FILE" ]; then
    grep -vf <(grep -v '^#' "$IGNORE_FILE" | sed '/^$/d') "$RAW_FILE_LIST" > "$FILTERED_LIST"
else
    echo "⚠️ No ignore file found. Using full file list."
    cp "$RAW_FILE_LIST" "$FILTERED_LIST"
fi

# Optional diff output if backup exists
if [ -f "$BACKUP_FILE" ]; then
    echo "📝 Generating diff from previous tracked files..."
    diff --unchanged-line-format= --old-line-format='[-] %L' --new-line-format='[+] %L' "$BACKUP_FILE" "$TRACKING_FILE" || true > "$DIFF_FILE"
fi

# Start new output
{
    echo "##### TRACKED FILES #####"
    while read -r rel_path; do
        full_path="$PROJECT_ROOT/$rel_path"
        echo "###PATH###"
        echo "$full_path"
        echo "### START OF FILE ###"
        echo '```'$(basename "$rel_path" | awk -F. '{print $NF}')
        cat "$full_path"
        echo '```'
        echo "### END OF FILE ###"
        echo ""
    done < "$FILTERED_LIST"
} > "$TRACKING_FILE"

# Clean up temp files
rm -f "$RAW_FILE_LIST" "$FILTERED_LIST"

echo "✅ primary_code_files.txt regenerated with inline content."
echo "📄 If a previous version existed, differences were saved to $DIFF_FILE"
