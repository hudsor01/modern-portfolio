-- First Drizzle migration in this project. The full schema was created
-- by the previous Prisma migrations (now removed from the repo) and
-- remains in place on prod, so this is intentionally a forward-only
-- patch — NOT the full schema recreation that `drizzle-kit generate`
-- emits when the migrations dir is empty (that auto-output was
-- discarded; this hand-written replacement only contains the diff).
--
-- The accompanying meta/0000_snapshot.json snapshots the *post-migration*
-- schema state (with `referrer` columns) so future
-- `bunx drizzle-kit generate` runs diff against the correct baseline.
--
-- Rename rationale: the HTTP wire-format header "Referer" (RFC 7231 §5.5.2)
-- is a historical typo. JavaScript corrected the API to `document.referrer`
-- and modern analytics products use the standard spelling. These are
-- persisted analytics columns, not header values being parsed verbatim,
-- so the canonical English spelling is the right choice.

ALTER TABLE "post_views" RENAME COLUMN "referer" TO "referrer";--> statement-breakpoint
ALTER TABLE "contact_submissions" RENAME COLUMN "referer" TO "referrer";
