import { Suspense } from "react"
import { db, media } from "@/lib/db"
import { desc } from "drizzle-orm"
import { MediaGrid } from "@/components/admin/media/media-grid"
import { MediaUploader } from "@/components/admin/media/media-uploader"
import { PageHeader } from "@/components/ui/page-header"

export const metadata = {
  title: "Media Library",
  description: "Manage your media files",
}

export default async function MediaPage() {
  const files = await db.query.media.findMany({
    orderBy: [desc(media.uploadedAt)],
  })

  return (
    <div className="container space-y-8 py-8">
      <PageHeader heading="Media Library" text="Upload and manage your media files" />

      <MediaUploader />

      <Suspense fallback={<div>Loading media...</div>}>
        <MediaGrid files={files} />
      </Suspense>
    </div>
  )
}

