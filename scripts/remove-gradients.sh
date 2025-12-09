#!/bin/bash
# =============================================================================
# Remove Gradients and Apply shadcn/ui Semantic Tokens
# =============================================================================
# This script replaces gradient patterns with solid shadcn/ui semantic tokens
# Uses: rg (ripgrep) for finding, sd for replacing
# =============================================================================

set -e

cd /Users/richard/Developer/modern-portfolio/src

echo "=== Removing Gradients and Applying shadcn/ui Semantic Tokens ==="
echo ""

# -----------------------------------------------------------------------------
# PHASE 1: Primary Button Gradients -> bg-primary
# -----------------------------------------------------------------------------
echo "Phase 1: Replacing primary button gradients..."

# Main primary button gradient
sd 'bg-gradient-to-r from-primary to-primary/80' 'bg-primary' $(rg -l 'bg-gradient-to-r from-primary to-primary/80' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-primary to-primary/90' 'bg-primary' $(rg -l 'bg-gradient-to-r from-primary to-primary/90' --glob '*.tsx' 2>/dev/null || echo "")

# Hover states - convert gradient hover to solid hover
sd 'hover:from-primary/90 hover:to-primary/70' 'hover:bg-primary/90' $(rg -l 'hover:from-primary/90 hover:to-primary/70' --glob '*.tsx' 2>/dev/null || echo "")
sd 'hover:from-primary hover:to-primary' 'hover:bg-primary/95' $(rg -l 'hover:from-primary hover:to-primary' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 2: Background Gradients -> bg-background / bg-card / bg-muted
# -----------------------------------------------------------------------------
echo "Phase 2: Replacing background gradients..."

# Dark slate/gray backgrounds -> bg-background
sd 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 'bg-background' $(rg -l 'bg-gradient-to-b from-slate-900' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-gray-900 to-gray-800' 'bg-background' $(rg -l 'bg-gradient-to-br from-gray-900' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800' 'bg-background' $(rg -l 'bg-gradient-to-br from-gray-50' --glob '*.tsx' 2>/dev/null || echo "")

# Navbar/header gradients -> solid bg-background with opacity
sd 'bg-gradient-to-r from-background/95 via-background/98 to-background/95' 'bg-background/95' $(rg -l 'from-background/95 via-background/98' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' 'bg-background' $(rg -l 'from-background via-background to-background' --glob '*.tsx' 2>/dev/null || echo "")

# White/card gradients -> bg-card
sd 'bg-gradient-to-br from-white/10 via-white/5 to-white/5' 'bg-card/10' $(rg -l 'from-white/10 via-white/5' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-white/8 via-white/4 to-white/4' 'bg-card/10' $(rg -l 'from-white/8 via-white/4' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-white/10 to-white/5' 'bg-card/10' $(rg -l 'from-white/10 to-white/5' --glob '*.tsx' 2>/dev/null || echo "")

# Card gradients -> bg-card
sd 'bg-gradient-to-r from-card/50 to-card/30 dark:from-primary/20 dark:to-primary/10' 'bg-card/50' $(rg -l 'from-card/50 to-card/30' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-card/50 to-card/30 dark:from-gray-800 dark:to-gray-700' 'bg-card' $(rg -l 'from-card/50 to-card/30 dark:from-gray-800' --glob '*.tsx' 2>/dev/null || echo "")

# Muted/gray gradients -> bg-muted
sd 'bg-gradient-to-br from-gray-500/10 to-slate-500/10' 'bg-muted' $(rg -l 'from-gray-500/10 to-slate-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-b from-transparent to-black/20' 'bg-muted/20' $(rg -l 'from-transparent to-black/20' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 3: Active/Selected State Gradients -> bg-primary/15 or bg-accent
# -----------------------------------------------------------------------------
echo "Phase 3: Replacing active state gradients..."

sd 'bg-gradient-to-r from-primary/20 to-primary/10' 'bg-primary/15' $(rg -l 'from-primary/20 to-primary/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/20 to-primary/10' 'bg-primary/15' $(rg -l 'from-primary/20 to-primary/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/10 to-primary/5' 'bg-primary/10' $(rg -l 'from-primary/10 to-primary/5' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/5 to-primary/10' 'bg-primary/10' $(rg -l 'from-primary/5 to-primary/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5' 'bg-primary/5' $(rg -l 'from-primary/5 via-primary/3' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10' 'bg-primary/10' $(rg -l 'from-primary/10 via-primary/5 to-primary/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-primary/10 via-primary/5 to-background' 'bg-primary/10' $(rg -l 'from-primary/10 via-primary/5 to-background' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-primary/20 via-primary/30 to-primary/10' 'bg-primary/20' $(rg -l 'from-primary/20 via-primary/30' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 4: Colorful Gradients -> Unified Primary Color
# -----------------------------------------------------------------------------
echo "Phase 4: Replacing colorful gradients with primary..."

# Green/Emerald variants -> bg-primary (all project accent colors unified)
sd 'bg-gradient-to-r from-green-400 to-primary/80' 'text-primary' $(rg -l 'from-green-400 to-primary/80' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-green-400 to-emerald-600' 'text-primary' $(rg -l 'from-green-400 to-emerald-600' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-emerald-400 to-green-600' 'text-primary' $(rg -l 'from-emerald-400 to-green-600' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-emerald-400 to-primary/80' 'text-primary' $(rg -l 'from-emerald-400 to-primary/80' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-orange-400 to-red-600' 'text-primary' $(rg -l 'from-orange-400 to-red-600' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-purple-600 to-pink-600' 'text-primary' $(rg -l 'from-purple-600 to-pink-600' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-purple-400 to-pink-400' 'text-primary' $(rg -l 'from-purple-400 to-pink-400' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-r from-green-500 to-emerald-600' 'bg-primary' $(rg -l 'from-green-500 to-emerald-600' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 5: Remove Gradient Text Effects (bg-clip-text text-transparent)
# -----------------------------------------------------------------------------
echo "Phase 5: Removing gradient text effects..."

sd ' bg-clip-text text-transparent' '' $(rg -l 'bg-clip-text text-transparent' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 6: Remove Decorative Gradient Overlays (blur glow effects)
# -----------------------------------------------------------------------------
echo "Phase 6: Removing decorative gradient blur overlays..."

# These are the absolute positioned blur glow effects under cards
sd '<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'rounded-3xl blur-xl opacity-25' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-primary/80 to-primary/60 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-primary/80 to-primary rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")

# Violet/Purple blur effects
sd '<div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-violet-600 to-purple-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-purple-600 to-pink-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-pink-600 to-purple-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")

# Green/Emerald blur effects
sd '<div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-green-600 to-emerald-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-emerald-600 to-green-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-primary/80 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-emerald-600 to-primary/80 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-green-600 to-primary/80 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-green-600 to-primary/80 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")

# Amber/Orange blur effects
sd '<div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-amber-600 to-orange-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-orange-600 to-red-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-red-600 to-orange-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")
sd '<div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />' '' $(rg -l 'from-red-600 to-pink-600 rounded-3xl blur-xl' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 7: Colored Card Backgrounds -> Unified Semantic Colors
# -----------------------------------------------------------------------------
echo "Phase 7: Replacing colored card backgrounds..."

# Green/Emerald cards -> bg-accent or bg-muted
sd 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 'bg-accent' $(rg -l 'from-green-500/10 to-emerald-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-emerald-500/10 to-green-500/10' 'bg-accent' $(rg -l 'from-emerald-500/10 to-green-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-emerald-500/20 to-green-500/20' 'bg-accent' $(rg -l 'from-emerald-500/20 to-green-500/20' --glob '*.tsx' 2>/dev/null || echo "")

# Purple/Pink cards -> bg-secondary
sd 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 'bg-secondary' $(rg -l 'from-purple-500/10 to-pink-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-purple-500/20 to-pink-600/20' 'bg-secondary' $(rg -l 'from-purple-500/20 to-pink-600/20' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-violet-500/10 to-purple-500/10' 'bg-secondary' $(rg -l 'from-violet-500/10 to-purple-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20' 'bg-secondary' $(rg -l 'from-purple-100 to-pink-100' --glob '*.tsx' 2>/dev/null || echo "")

# Amber/Orange cards -> bg-accent
sd 'bg-gradient-to-br from-amber-500/10 to-orange-500/10' 'bg-accent' $(rg -l 'from-amber-500/10 to-orange-500/10' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-br from-orange-500/10 to-red-500/10' 'bg-accent' $(rg -l 'from-orange-500/10 to-red-500/10' --glob '*.tsx' 2>/dev/null || echo "")

# Primary overlay cards
sd 'bg-gradient-to-br from-primary/5 via-transparent to-primary/5' '' $(rg -l 'from-primary/5 via-transparent to-primary/5' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 8: Image Overlays -> Simplified
# -----------------------------------------------------------------------------
echo "Phase 8: Simplifying image overlays..."

sd 'bg-gradient-to-t from-black/40 to-transparent' 'bg-black/30' $(rg -l 'from-black/40 to-transparent' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' 'bg-black/40' $(rg -l 'from-black/70 via-black/30' --glob '*.tsx' 2>/dev/null || echo "")
sd 'bg-gradient-to-t from-black/10 to-transparent' 'bg-black/10' $(rg -l 'from-black/10 to-transparent' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 9: Component Library Fixes (card.tsx, button.tsx, etc.)
# -----------------------------------------------------------------------------
echo "Phase 9: Fixing component library gradients..."

# Card primary variant
sd 'bg-gradient-to-br from-primary/20 via-card/50 to-card/50' 'bg-primary/15' $(rg -l 'from-primary/20 via-card/50 to-card/50' --glob '*.tsx' 2>/dev/null || echo "")

# Button gradient
sd 'bg-gradient-to-r from-primary to-primary/80 text-black' 'bg-primary text-primary-foreground' $(rg -l 'bg-gradient-to-r from-primary to-primary/80 text-black' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# PHASE 10: Misc Cleanup - Remaining gradient patterns
# -----------------------------------------------------------------------------
echo "Phase 10: Final cleanup..."

# Reading progress bars - keep functional but simplify
sd 'bg-gradient-to-r from-primary to-primary/80 transition-all' 'bg-primary transition-all' $(rg -l 'from-primary to-primary/80 transition-all' --glob '*.tsx' 2>/dev/null || echo "")

# Green CTA banners
sd 'bg-gradient-to-r from-green-600/20 to-primary/80/20' 'bg-accent' $(rg -l 'from-green-600/20 to-primary/80/20' --glob '*.tsx' 2>/dev/null || echo "")

# Muted swiper backgrounds
sd 'from-muted/40 to-muted/70' 'bg-muted' $(rg -l 'from-muted/40 to-muted/70' --glob '*.tsx' 2>/dev/null || echo "")

# Newsletter
sd 'bg-gradient-to-br from-primary/5 to-primary/10' 'bg-primary/10' $(rg -l 'from-primary/5 to-primary/10' --glob '*.tsx' 2>/dev/null || echo "")

echo "  Done."

# -----------------------------------------------------------------------------
# FINAL: Report remaining gradients
# -----------------------------------------------------------------------------
echo ""
echo "=== Checking for remaining gradients ==="
REMAINING=$(rg -c 'bg-gradient' --glob '*.tsx' 2>/dev/null | wc -l)
echo "Files with remaining gradients: $REMAINING"

if [ "$REMAINING" -gt 0 ]; then
  echo ""
  echo "Remaining gradient patterns:"
  rg 'bg-gradient' --glob '*.tsx' -n 2>/dev/null || true
fi

echo ""
echo "=== Script Complete ==="
