import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils/formatting"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { BlogPost } from "@/types/blog"

interface BlogFeaturedProps {
  post: BlogPost
}

export function BlogFeatured({ post }: BlogFeaturedProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative aspect-video md:aspect-auto md:h-full">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        </div>
        <CardContent className="flex flex-col justify-center space-y-4 p-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">{post.title}</h2>
            <p className="text-muted-foreground">{post.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="group inline-flex items-center gap-2 text-primary hover:underline"
          >
            Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </div>
    </Card>
  )
}

