// Collection of gradient background options for the portfolio

export const gradientBackgrounds = {
  // Current - Purple Mesh Gradient
  purpleMesh: {
    name: "Purple Mesh",
    description: "Sophisticated purple and blue mesh with animated layers",
    jsx: (
      <>
        {/* Base Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-shift"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Additional Gradient Layers */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-500/5 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
      </>
    )
  },

  // Option 1: Aurora Borealis
  aurora: {
    name: "Aurora Borealis",
    description: "Northern lights inspired gradient with green and blue waves",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-cyan-500/10 to-blue-500/10 animate-gradient-shift"></div>
        <div className="absolute top-0 left-0 right-0 h-[70%] bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-blue-600/10 to-transparent"></div>
      </>
    )
  },

  // Option 2: Sunset Gradient
  sunset: {
    name: "Sunset Gradient",
    description: "Warm sunset colors with orange, pink, and purple",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-900/20 to-purple-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-pink-500/10 to-purple-600/10 animate-gradient-shift"></div>
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      </>
    )
  },

  // Option 3: Ocean Depths
  oceanDepths: {
    name: "Ocean Depths",
    description: "Deep ocean blues with teal accents",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-600/10 to-teal-600/10 animate-gradient-shift"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-cyan-500/10 via-blue-500/5 to-transparent blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </>
    )
  },

  // Option 4: Cyberpunk Neon
  cyberpunk: {
    name: "Cyberpunk Neon",
    description: "Vibrant neon colors with pink and cyan",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-cyan-600/20 animate-gradient-shift"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>
      </>
    )
  },

  // Option 5: Cosmic Nebula
  cosmic: {
    name: "Cosmic Nebula",
    description: "Space-inspired with deep purples and cosmic dust",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-pink-600/10 to-indigo-600/10 animate-gradient-shift"></div>
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-purple-600/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </>
    )
  },

  // Option 6: Emerald Matrix
  emeraldMatrix: {
    name: "Emerald Matrix",
    description: "Matrix-inspired green gradient with digital vibes",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-950/40 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-green-600/10 to-cyan-600/10 animate-gradient-shift"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-500/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
      </>
    )
  },

  // Option 7: Minimal Dark
  minimalDark: {
    name: "Minimal Dark",
    description: "Clean and minimal with subtle gradients",
    jsx: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 animate-gradient-shift"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
      </>
    )
  }
}

// Helper function to get gradient by key
export function getGradientBackground(key: keyof typeof gradientBackgrounds) {
  return gradientBackgrounds[key]?.jsx || gradientBackgrounds.purpleMesh.jsx
}