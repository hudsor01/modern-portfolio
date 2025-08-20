// Unique gradient alternatives that differentiate from hudsondigitalsolutions.com
// These avoid purple/pink tones and focus on professional, revenue-focused colors

export const uniqueGradients = {
  // Option 1: Revenue Operations Theme (Current)
  revenueOps: `
    {/* Deep Carbon Base with Subtle Blue Undertones */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-gray-900 to-black"></div>
    
    {/* Revenue Growth Gradient - Teal to Gold */}
    <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/10 via-transparent to-amber-500/5 opacity-60"></div>
    
    {/* Data Visualization Inspired Orbs */}
    <div className="absolute top-[20%] right-[15%] w-72 h-72 bg-gradient-conic from-teal-500/20 via-cyan-500/10 to-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-[30%] left-[10%] w-96 h-96 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
  `,

  // Option 2: Executive Graphite
  executiveGraphite: `
    {/* Premium Graphite Base */}
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-stone-900 to-zinc-950"></div>
    
    {/* Silver Accent Gradient */}
    <div className="absolute inset-0 bg-gradient-to-tr from-slate-400/5 via-transparent to-zinc-400/5"></div>
    
    {/* Metallic Orbs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-slate-300/10 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-zinc-400/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
  `,

  // Option 3: Data Stream Dark
  dataStream: `
    {/* Deep Tech Black */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
    
    {/* Electric Teal Data Streams */}
    <div className="absolute inset-0">
      <div className="absolute top-0 bottom-0 left-[20%] w-px bg-gradient-to-b from-transparent via-teal-500/30 to-transparent"></div>
      <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse-slow"></div>
      <div className="absolute top-0 bottom-0 left-[80%] w-px bg-gradient-to-b from-transparent via-teal-500/30 to-transparent"></div>
    </div>
    
    {/* Data Nodes */}
    <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-teal-500 rounded-full glow-teal"></div>
    <div className="absolute top-[60%] left-[50%] w-2 h-2 bg-cyan-500 rounded-full glow-cyan animate-pulse"></div>
    <div className="absolute top-[45%] left-[80%] w-2 h-2 bg-teal-500 rounded-full glow-teal"></div>
  `,

  // Option 4: Midnight Steel
  midnightSteel: `
    {/* Steel Blue Base */}
    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#1e293b_0deg,#0f172a_90deg,#1e293b_180deg,#334155_270deg,#1e293b_360deg)]"></div>
    
    {/* Cool Blue Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent"></div>
    
    {/* Metallic Highlights */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-slate-400/5"></div>
  `,

  // Option 5: Growth Analytics
  growthAnalytics: `
    {/* Dark Analytics Base */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-emerald-950/20 to-gray-950"></div>
    
    {/* Growth Chart Gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-emerald-500/10 via-emerald-500/5 to-transparent"></div>
    
    {/* Success Metrics Orbs */}
    <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-gradient-radial from-emerald-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-[20%] left-[30%] w-80 h-80 bg-gradient-radial from-teal-500/10 to-transparent rounded-full blur-3xl"></div>
  `,

  // Option 6: Carbon Fiber
  carbonFiber: `
    {/* Carbon Black Base */}
    <div className="absolute inset-0 bg-black"></div>
    
    {/* Carbon Fiber Pattern */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]"></div>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]"></div>
    </div>
    
    {/* Subtle Blue Sheen */}
    <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent"></div>
  `,

  // Option 7: Professional Slate
  professionalSlate: `
    {/* Clean Slate Base */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
    
    {/* Subtle Warmth */}
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/5 via-transparent to-sky-900/5"></div>
    
    {/* Professional Accent */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-slate-700/5 to-transparent rounded-full blur-3xl"></div>
  `
}