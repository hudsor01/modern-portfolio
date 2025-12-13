#!/bin/bash
# Typography migration script - Apply semantic typography tokens across codebase

set -e

echo "🎨 Applying typography tokens across codebase..."

# H1 patterns
echo "→ Updating H1 patterns..."
rg -l 'text-4xl lg:text-6xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-4xl lg:text-6xl font-bold' 'typography-h1 text-4xl lg:text-6xl' {} 2>/dev/null || true
rg -l 'text-5xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-5xl font-bold' 'typography-h1 text-5xl' {} 2>/dev/null || true
rg -l 'text-4xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-4xl font-bold' 'typography-h1 text-4xl' {} 2>/dev/null || true

# H2 patterns
echo "→ Updating H2 patterns..."
rg -l 'text-3xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-3xl font-bold' 'typography-h2 border-none pb-0 text-3xl' {} 2>/dev/null || true
rg -l 'text-3xl lg:text-4xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-3xl lg:text-4xl font-bold' 'typography-h2 border-none pb-0 text-3xl lg:text-4xl' {} 2>/dev/null || true

# H3 patterns
echo "→ Updating H3 patterns..."
rg -l 'text-2xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-2xl font-bold' 'typography-h3' {} 2>/dev/null || true
rg -l 'text-2xl font-semibold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-2xl font-semibold' 'typography-h3' {} 2>/dev/null || true
rg -l 'text-xl md:text-2xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-xl md:text-2xl font-bold' 'typography-h3 text-xl md:text-2xl' {} 2>/dev/null || true

# H4 patterns
echo "→ Updating H4 patterns..."
rg -l 'text-xl font-semibold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-xl font-semibold' 'typography-h4' {} 2>/dev/null || true
rg -l 'text-xl font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-xl font-bold' 'typography-h4' {} 2>/dev/null || true
rg -l 'text-lg font-bold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-lg font-bold' 'typography-h4' {} 2>/dev/null || true

# Large text patterns
echo "→ Updating large text patterns..."
rg -l 'text-lg font-semibold' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-lg font-semibold' 'typography-large' {} 2>/dev/null || true
rg -l 'text-lg font-medium' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-lg font-medium' 'typography-large' {} 2>/dev/null || true

# Lead paragraph patterns
echo "→ Updating lead paragraph patterns..."
rg -l 'text-xl text-muted-foreground' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-xl text-muted-foreground' 'typography-lead' {} 2>/dev/null || true
rg -l 'text-lg text-muted-foreground' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-lg text-muted-foreground' 'typography-lead' {} 2>/dev/null || true

# Small text patterns
echo "→ Updating small text patterns..."
rg -l 'text-sm text-muted-foreground' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-sm text-muted-foreground' 'typography-small text-muted-foreground' {} 2>/dev/null || true
rg -l 'text-xs text-muted-foreground' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-xs text-muted-foreground' 'typography-small text-muted-foreground' {} 2>/dev/null || true

# Muted text patterns (careful - only when standalone)
echo "→ Updating muted text patterns..."
rg -l 'text-muted-foreground leading-relaxed' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'text-muted-foreground leading-relaxed' 'typography-muted' {} 2>/dev/null || true

# Code patterns
echo "→ Updating code patterns..."
rg -l 'font-mono text-sm' src/ -g '*.tsx' 2>/dev/null | xargs -I {} sd 'font-mono text-sm' 'typography-code' {} 2>/dev/null || true

echo "✅ Typography tokens applied!"
echo ""
echo "Running validation..."
bun run type-check && bun run lint
echo ""
echo "✅ All done! Typography migration complete."
