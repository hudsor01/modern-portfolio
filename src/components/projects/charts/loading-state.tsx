export function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Loading Charts...</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Initializing data visualization...
        </div>
      </div>
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Loading Analytics...</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Preparing analytics dashboard...
        </div>
      </div>
    </div>
  )
}