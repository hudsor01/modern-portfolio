"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { testServerAction } from "@/lib/actions/test-action"

export function TestServerAction() {
  const [result, setResult] = useState<string>("")

  const handleClick = async () => {
    try {
      const data = await testServerAction()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(
        JSON.stringify(
          {
            status: "error",
            message: error.message || "Something went wrong",
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleClick}>Test Server Action</Button>
      {result && <pre className="p-4 bg-muted rounded-lg overflow-auto">{result}</pre>}
    </div>
  )
}

