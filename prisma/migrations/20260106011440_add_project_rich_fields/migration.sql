/*
  Warnings:

  - You are about to drop the column `budget` on the `contact_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `contact_submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_submissions" DROP COLUMN "budget",
DROP COLUMN "timeline",
ALTER COLUMN "subject" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "caseStudyUrl" TEXT,
ADD COLUMN     "charts" JSONB,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "displayMetrics" JSONB,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "gallery" JSONB,
ADD COLUMN     "impact" JSONB,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "metrics" JSONB,
ADD COLUMN     "results" JSONB,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "testimonial" JSONB,
ADD COLUMN     "year" INTEGER;

-- CreateIndex
CREATE INDEX "projects_year_idx" ON "projects"("year");
