#!/usr/bin/env bash
set -euo pipefail

# Verify that all i18n JSON files contain the same keys as the reference file.
# Usage: ./verify-i18n-json.sh [i18n-directory] [reference-locale]
# Example: ./verify-i18n-json.sh ./src/assets/i18n en

I18N_DIR="${1:-./src/assets/i18n}"
REFERENCE_LOCALE="${2:-en}"
REFERENCE_FILE="$I18N_DIR/$REFERENCE_LOCALE.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed."
  exit 1
fi

if [[ ! -f "$REFERENCE_FILE" ]]; then
  echo "Error: Reference file not found: $REFERENCE_FILE"
  exit 1
fi

extract_keys() {
  jq -r 'paths(scalars) | map(tostring) | join(".")' "$1" | sort
}

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

extract_keys "$REFERENCE_FILE" > "$TMP_DIR/reference.keys"

EXIT_CODE=0

echo "Using reference: $REFERENCE_FILE"
echo

for file in "$I18N_DIR"/*.json; do
  [[ "$file" == "$REFERENCE_FILE" ]] && continue

  locale=$(basename "$file" .json)
  echo "Checking $locale..."

  extract_keys "$file" > "$TMP_DIR/$locale.keys"

  missing=$(comm -23 "$TMP_DIR/reference.keys" "$TMP_DIR/$locale.keys" || true)
  extra=$(comm -13 "$TMP_DIR/reference.keys" "$TMP_DIR/$locale.keys" || true)

  if [[ -n "$missing" ]]; then
    echo "  Missing keys:"
    echo "$missing" | sed 's/^/    - /'
    EXIT_CODE=1
  fi

  if [[ -n "$extra" ]]; then
    echo "  Extra keys:"
    echo "$extra" | sed 's/^/    - /'
    EXIT_CODE=1
  fi

  if [[ -z "$missing" && -z "$extra" ]]; then
    echo "  ✓ OK"
  fi

  echo
 done

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "All translation files are consistent."
else
  echo "Translation inconsistencies found."
fi

exit $EXIT_CODE
