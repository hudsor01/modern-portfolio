import { Suspense } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { getSettings } from "@/lib/actions/settings"

export const metadata = {
  title: "Settings",
  description: "Manage your portfolio settings",
}

export default async function SettingsPage() {
  // Fetch settings server-side
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <PageHeader heading="Settings" text="Manage your portfolio settings and preferences." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Settings</CardTitle>
            <CardDescription>Configure your portfolio settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <SettingsForm initialData={settings} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

