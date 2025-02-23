import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function SignInForm() {
  const { theme } = useTheme()

  return (
    <SignIn
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
  )
}

