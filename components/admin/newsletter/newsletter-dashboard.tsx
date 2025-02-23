import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNewsletterStats, exportSubscriberList } from "@/lib/newsletter"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./subscribers-columns"
import { Download, Mail, Send } from "lucide-react"

export async function NewsletterDashboard() {
  const stats = await getNewsletterStats()
  const subscribers = await exportSubscriberList()

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">+{stats.newSubscribers} this month</p>
            </CardContent>
          </Card>
          {/* Add more stat cards */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>{/* Add activity feed */}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscribers">
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Input placeholder="Search subscribers..." className="max-w-sm" />
              <Button variant="outline">Filter</Button>
            </div>
            <DataTable columns={columns} data={subscribers} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="campaigns">
        <Card>
          <CardHeader>
            <CardTitle>Email Campaigns</CardTitle>
          </CardHeader>
          <CardContent>{/* Add campaigns table */}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

