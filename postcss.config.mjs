const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Adding config for proper configuration
      experimental: {
        optimizeUniversalDefaults: true,
      },
    },
  },
}

export default config
