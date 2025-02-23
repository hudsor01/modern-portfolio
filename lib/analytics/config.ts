import { GoogleAnalytics } from "@next/third-parties/google"

export const TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const analyticsConfig = {
  pageView: {
    ignorePathsStartingWith: ["/admin", "/api"],
  },
  events: {
    // Project interactions
    projectView: "project_view",
    projectClick: "project_click",

    // Blog interactions
    blogView: "blog_view",
    blogScroll: "blog_scroll_depth",
    blogReadTime: "blog_read_time",

    // Resume interactions
    resumeDownload: "resume_download",

    // Media interactions
    mediaView: "media_view",
    mediaDownload: "media_download",
  },
}

export function Analytics() {
  return (
    <>
      <Analytics />
      <GoogleAnalytics gaId={TRACKING_ID} />
    </>
  )
}

