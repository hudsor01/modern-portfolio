"use client"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, MoreVertical, Eye, RotateCcw, Check } from "lucide-react"

interface Version {
  id: string
  version: number
  createdAt: Date
  createdBy: {
    name: string
    avatar?: string
  }
  comment?: string
  status: "draft" | "pending" | "published"
}

interface VersionHistoryProps {
  versions: Version[]
  currentVersion: number
  onPreview: (versionId: string) => void
  onRestore: (versionId: string) => void
  onPublish: (versionId: string) => void
}

export function VersionHistory({ versions, currentVersion, onPreview, onRestore, onPublish }: VersionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      Version {version.version}
                      {version.version === currentVersion && " (Current)"}
                    </span>
                    <span className="text-sm text-muted-foreground">{format(version.createdAt, "PPpp")}</span>
                  </div>
                  <Badge variant={getStatusVariant(version.status)}>{version.status}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onPreview(version.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRestore(version.id)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore this version
                      </DropdownMenuItem>
                      {version.status !== "published" && (
                        <DropdownMenuItem onClick={() => onPublish(version.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Publish this version
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "published":
      return "default"
    case "pending":
      return "warning"
    case "draft":
      return "secondary"
    default:
      return "outline"
  }
}

