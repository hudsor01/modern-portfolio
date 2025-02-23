"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAnalytics } from "@/hooks/use-analytics"

export function TopContent() {
  const { data, isLoading } = useAnalytics()

  if (isLoading) {
    return <div>Loading top content...</div>
  }

  if (!data?.topPages?.length) {
    return <div>No data available</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Unique Visitors</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.topPages.map((page) => (
          <TableRow key={page.path}>
            <TableCell className="font-medium">{page.path}</TableCell>
            <TableCell className="text-right">{page.views}</TableCell>
            <TableCell className="text-right">{page.uniqueVisitors}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

