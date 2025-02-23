import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Sign up to get started</p>
        </div>
        <SignUp
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              card: "shadow-lg border border-border",
              headerTitle: "font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerAction: "text-muted-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
            },
          }}
        />
      </div>
    </div>
  )
}

