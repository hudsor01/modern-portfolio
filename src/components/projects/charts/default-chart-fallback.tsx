interface DefaultChartFallbackProps {
  chartBarHeights: number[]
}

export function DefaultChartFallback({ chartBarHeights }: DefaultChartFallbackProps) {
  return (
    <div className="bg-black/20 rounded-2xl p-8 border border-blue-500/30">
      <div className="text-center text-gray-300 mb-6">
        <div className="text-lg font-semibold mb-2">Interactive Data Visualization</div>
        <div className="text-sm text-gray-400">Real-time metrics and analytics from this project</div>
      </div>

      {/* Mock chart placeholder with animated elements */}
      <div className="relative h-80 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[image:linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

        {/* Animated data points */}
        <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-16 right-12 w-3 h-3 bg-green-400 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:2s]"></div>

        {/* Chart representation */}
        <div className="absolute bottom-8 left-8 right-8 h-32">
          <div className="flex items-end justify-between h-full">
            {chartBarHeights.map((height, i) => (
              <div
                key={i}
                className={`bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-1000 hover:from-blue-400 hover:to-cyan-300`}
                style={{
                  height: `${height}%`,
                  width: '6%',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-black/60 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-white mb-2">Live Data Preview</div>
            <div className="text-sm text-gray-300">Charts coming soon for this project</div>
          </div>
        </div>
      </div>
    </div>
  )
}