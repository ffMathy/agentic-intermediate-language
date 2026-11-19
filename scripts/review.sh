#!/usr/bin/env bash
# Used by action.yml, from inside the project. Writes the spec review (with
# screenshots on pull requests) to the job summary, pushes the screenshots to
# the `ail-shots` branch, and keeps one PR comment per project up to date.
# Pushing and commenting are best effort: a fork's read-only token only warns.
set -uo pipefail
cli="$1"

if ! git rev-parse --verify --quiet "$AIL_BASE" >/dev/null; then
  echo "::notice::$AIL_BASE not found; skipping the spec review (check out with fetch-depth: 0)"
  exit 0
fi

slug=$(echo "$AIL_PROJECT" | tr -c 'A-Za-z0-9_-' '-' | sed 's/^-*//; s/-*$//')
slug=${slug:-root}
review="$RUNNER_TEMP/ail-review-$slug.md"
args=(show changes --since "$AIL_BASE")
if [ "$AIL_SHOTS" = "true" ]; then
  shots="$RUNNER_TEMP/ail-shots-$slug"
  rm -rf "$shots"
  path="pr-$AIL_PR/${AIL_SHA:0:12}/$slug"
  args+=(--shots "$shots" --shots-url "https://raw.githubusercontent.com/$AIL_REPO/ail-shots/$path")
fi
bun "$cli" "${args[@]}" > "$review" || { echo "::warning::ail show changes failed"; exit 0; }
cat "$review" >> "$GITHUB_STEP_SUMMARY"

if [ "$AIL_SHOTS" = "true" ] && [ -n "$(find "$shots" -name '*.png' 2>/dev/null | head -1)" ]; then
  work="$RUNNER_TEMP/ail-shots-branch-$slug"
  rm -rf "$work" && mkdir -p "$work" && cd "$work" || exit 0
  git init -q
  git remote add origin "https://x-access-token:$GH_TOKEN@github.com/$AIL_REPO.git"
  if git fetch -q --depth 1 origin ail-shots 2>/dev/null; then git checkout -q FETCH_HEAD; else git checkout -q --orphan ail-shots; fi
  mkdir -p "$path" && cp -R "$shots/." "$path/"
  git add -A
  git -c user.name="ail" -c user.email="ail@users.noreply.github.com" commit -qm "Screenshots for #$AIL_PR at ${AIL_SHA:0:12} ($AIL_PROJECT)"
  pushed=false
  for i in 1 2 3 4; do
    if git push -q origin HEAD:ail-shots 2>/dev/null; then pushed=true; break; fi
    sleep $((i * 2))
    git fetch -q --depth 1 origin ail-shots && git rebase -q FETCH_HEAD
  done
  $pushed || echo "::warning::could not push screenshots to the ail-shots branch (does the job have contents: write?)"
  cd - >/dev/null || exit 0
fi

if [ "$AIL_COMMENT" = "true" ]; then
  marker="<!-- ail-review:$AIL_PROJECT -->"
  body="$RUNNER_TEMP/ail-comment-$slug.md"
  { echo "$marker"; echo "**AIL** · \`$AIL_PROJECT\`"; echo; cat "$review"; } > "$body"
  if [ "$(wc -c < "$body")" -gt 60000 ]; then
    head -c 60000 "$body" > "$body.cut"
    printf '\n\n_Cut short; the full review is in the job summary._\n' >> "$body.cut"
    mv "$body.cut" "$body"
  fi
  existing=$(gh api "repos/$AIL_REPO/issues/$AIL_PR/comments" --paginate --jq ".[] | select(.body | startswith(\"$marker\")) | .id" 2>/dev/null | head -1)
  if [ -n "$existing" ]; then
    gh api -X PATCH "repos/$AIL_REPO/issues/comments/$existing" -F "body=@$body" >/dev/null || echo "::warning::could not update the review comment"
  elif ! grep -q "^No semantic IL changes" "$review"; then
    gh api -X POST "repos/$AIL_REPO/issues/$AIL_PR/comments" -F "body=@$body" >/dev/null || echo "::warning::could not comment (does the job have pull-requests: write?)"
  fi
fi
exit 0
