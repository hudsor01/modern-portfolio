import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialProps {
  content: string
  author: {
    name: string
    title: string
    avatar?: string
  }
  rating: number
}

export function TestimonialCard({ content, author, rating }: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{author.name}</h4>
            <p className="text-sm text-muted-foreground">{author.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
            />
          ))}
        </div>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  )
}

