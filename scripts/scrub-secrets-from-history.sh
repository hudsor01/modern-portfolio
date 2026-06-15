#!/usr/bin/env bash
#
# scrub-secrets-from-history.sh — ONE-TIME git history rewrite.
#
# Purges leaked-secret files (and partner-data CSV exports) from ALL of
# modern-portfolio's git history, then force-pushes the rewritten history.
#
# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ⚠️  DESTRUCTIVE & IRREVERSIBLE ON THE REMOTE                               │
# │   • Rewrites EVERY commit hash in history.                                │
# │   • Force-pushes origin/main (and all branches/tags).                     │
# │   • Breaks every existing clone/fork — collaborators must re-clone.       │
# │   • Open PRs/branches on old history must be recreated/rebased.           │
# │                                                                           │
# │ ⚠️  ROTATE THE SECRETS FIRST. Scrubbing does NOT un-expose what already   │
# │   leaked (clones/forks/attackers may have copies). The real fix is        │
# │   rotation; this is defense-in-depth AFTER rotating:                      │
# │     • db.prisma.io Postgres password (generate-blog-via-k8s.sh)           │
# │     • Sentry auth token (SENTRY_TROUBLESHOOT.md)                          │
# └─────────────────────────────────────────────────────────────────────────┘
#
# Usage (run from the repo, in your own terminal):
#   bash scripts/scrub-secrets-from-history.sh            # DRY RUN: rewrite a throwaway copy + verify. No backup, no push.
#   bash scripts/scrub-secrets-from-history.sh --apply    # REWRITE this repo + (gated) force-push.
#
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

APPLY="${1:-}"
SHA="$(git rev-parse --short HEAD)"
ORIGIN="git@github.com:hudsor01/modern-portfolio.git"

command -v git-filter-repo >/dev/null || {
  echo "ERROR: git-filter-repo not installed.  brew install git-filter-repo"; exit 1; }

# --- Targets: real secrets + partner-data exports (purged from ALL history) ---
PATHS=(
  "scripts/generate-blog-via-k8s.sh"   # REAL secret: PGPASSWORD for db.prisma.io
  "SENTRY_TROUBLESHOOT.md"             # REAL secret: SENTRY_AUTH_TOKEN
)
GLOBS=(
  "PartnerRecordExport_*"              # partner/customer/deal/transaction data exports
)
# OPTIONAL (NOT secrets — uncomment to also shrink history of dead Prisma blobs):
#   PATHS+=("scripts/generate-test-blog.mjs")
#   GLOBS+=("prisma/generated/*" "src/generated/prisma/*")

ARGS=(--invert-paths --force)
for p in "${PATHS[@]}"; do ARGS+=(--path "$p"); done
for g in "${GLOBS[@]}"; do ARGS+=(--path-glob "$g"); done

verify() { # $1 = dir to check
  local d="$1" miss=0 tmpf
  tmpf="$(mktemp)"
  git -C "$d" log --all --pretty=format: --name-only 2>/dev/null | sort -u > "$tmpf"
  for f in "${PATHS[@]}" "PartnerRecordExport"; do
    local n; n="$(grep -c -- "$f" "$tmpf" || true)"
    printf '    %-40s %s references remaining (expect 0)\n' "$f" "${n:-0}"
    [ "${n:-0}" = "0" ] || miss=1
  done
  rm -f "$tmpf"
  return $miss
}

if [ "$APPLY" != "--apply" ]; then
  TMP="../mp-scrub-dryrun-$SHA"
  rm -rf "$TMP"
  echo "==> DRY RUN — cloning to $TMP and rewriting there (origin & this repo untouched)"
  git clone --no-local --quiet . "$TMP"
  ( cd "$TMP" && git filter-repo "${ARGS[@]}" >/dev/null )
  echo "==> Verifying targets removed from the rewritten copy's history:"
  if verify "$TMP"; then echo "    ✅ all targets purged in preview"; else echo "    ⚠️ some targets still present — review before --apply"; fi
  rm -rf "$TMP"
  echo "Dry run OK. When ready (and AFTER rotating): bash scripts/scrub-secrets-from-history.sh --apply"
  exit 0
fi

# ---- APPLY ----
[ -z "$(git status --porcelain)" ] || { echo "ERROR: working tree not clean. Commit/stash first."; exit 1; }
BACKUP="../modern-portfolio-backup-$SHA.git"
echo "==> 1/4 Full mirror backup -> $BACKUP (restore source if anything goes wrong)"
rm -rf "$BACKUP"; git clone --mirror --quiet . "$BACKUP"

echo "==> 2/4 Rewriting THIS repository's history"
git filter-repo "${ARGS[@]}"

echo "==> 3/4 Re-adding origin (filter-repo drops it by design) + verifying"
git remote add origin "$ORIGIN" 2>/dev/null || git remote set-url origin "$ORIGIN"
verify "." && echo "    ✅ purged locally" || { echo "    ⚠️ targets still present — NOT pushing. Restore from $BACKUP."; exit 1; }

echo "==> 4/4 Force-push rewritten history (DESTRUCTIVE, outward-facing)"
read -r -p "    Type EXACTLY 'force-push' to proceed (anything else aborts): " c
[ "$c" = "force-push" ] || { echo "Aborted before push. Local history is rewritten; 'git clone $BACKUP' to recover the original."; exit 1; }
git push origin --force --all
git push origin --force --tags
echo "Done. Now: (a) re-clone everywhere, (b) recreate any open branches/PRs, (c) in Aikido mark the 2 secret findings solved + rescan. Keep $BACKUP until you've confirmed everything."
