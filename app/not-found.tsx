import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  )
}

