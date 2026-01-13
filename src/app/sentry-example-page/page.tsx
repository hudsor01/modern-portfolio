'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SentryExamplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Sentry Test Page</CardTitle>
          <CardDescription>
            Click the button below to trigger a test error and verify Sentry is capturing exceptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Error Button */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test 1: Client-Side Error</h3>
            <p className="text-sm text-muted-foreground">
              Throws an error in the browser. Check Sentry for a client-side exception.
            </p>
            <Button
              onClick={() => {
                throw new Error('Sentry Test Error (Client-Side) - This is intentional!')
              }}
              variant="destructive"
              size="lg"
            >
              Throw Client Error
            </Button>
          </div>

          {/* Test API Error */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test 2: API Error</h3>
            <p className="text-sm text-muted-foreground">
              Triggers an error in the API route. Check Sentry for a server-side exception.
            </p>
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-sentry', { method: 'POST' })
                  const data = await response.json()
                  alert(data.message || 'Error sent to Sentry!')
                } catch (_error) {
                  alert('API call failed but error should be in Sentry')
                }
              }}
              variant="secondary"
              size="lg"
            >
              Trigger API Error
            </Button>
          </div>

          {/* Test Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test 3: Info Message</h3>
            <p className="text-sm text-muted-foreground">
              Sends an info-level message to Sentry (not an error).
            </p>
            <Button
              onClick={async () => {
                const response = await fetch('/api/test-sentry', { method: 'GET' })
                const data = await response.json()
                alert(data.message || 'Message sent to Sentry!')
              }}
              variant="outline"
              size="lg"
            >
              Send Test Message
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold">After Clicking:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to: <a href="https://sentry.thehudsonfam.com/organizations/sentry/issues/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Sentry Dashboard</a></li>
              <li>Click "Issues" in the left sidebar</li>
              <li>You should see the error appear within 10-30 seconds</li>
              <li>Click on it to see full details, stack trace, and context</li>
            </ol>
          </div>

          {/* Cleanup Note */}
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              <strong>Note:</strong> This page is for testing only. You can delete <code className="bg-yellow-500/20 px-1 rounded">src/app/sentry-example-page/</code> and <code className="bg-yellow-500/20 px-1 rounded">src/app/api/test-sentry/</code> after verifying Sentry works.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
