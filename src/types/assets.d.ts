// Side-effect-only imports for static assets. Required under TS 6's
// noUncheckedSideEffectImports default; local CSS files have no shipped types.
declare module '*.css'
