export const authConfig = {
  // Session configuration
  session: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  // Rate limiting
  rateLimit: {
    window: 60 * 15, // 15 minutes
    max: 100, // maximum requests per window
  },
  // CSRF Protection
  csrf: {
    cookie: {
      name: "csrf",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}

