import { TestServerAction } from "@/components/test-server-action"

export default function TestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Server Action Test</h1>
      <TestServerAction />
    </div>
  )
}

