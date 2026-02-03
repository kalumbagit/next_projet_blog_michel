export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 animate-pulse"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-xl mb-5" />
          <div className="h-4 bg-slate-800 rounded w-24 mb-3" />
          <div className="h-10 bg-slate-800 rounded w-32" />
        </div>
      ))}
    </div>
  );
}

export function ContentsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-slate-800/50 rounded w-64 animate-pulse" />
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 animate-pulse"
          >
            <div className="w-24 h-7 bg-slate-800 rounded-lg mb-4" />
            <div className="h-6 bg-slate-800 rounded mb-2" />
            <div className="h-4 bg-slate-800 rounded mb-4" />
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
              <div className="h-5 bg-slate-800 rounded w-16" />
              <div className="h-6 bg-slate-800 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 animate-pulse">
      <div className="w-16 h-16 bg-slate-800 rounded-xl mb-5" />
      <div className="h-4 bg-slate-800 rounded w-24 mb-3" />
      <div className="h-10 bg-slate-800 rounded w-32" />
    </div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 animate-pulse">
      <div className="w-24 h-7 bg-slate-800 rounded-lg mb-4" />
      <div className="h-6 bg-slate-800 rounded mb-2" />
      <div className="h-4 bg-slate-800 rounded mb-4" />
      <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="h-5 bg-slate-800 rounded w-16" />
        <div className="h-6 bg-slate-800 rounded w-20" />
      </div>
    </div>
  );
}
