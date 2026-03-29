export default function MentorDashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Welcome Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 w-full max-w-md">
          <div className="h-10 bg-white/5 rounded-xl w-2/3"></div>
          <div className="h-6 bg-white/5 rounded-lg w-1/2"></div>
        </div>
        <div className="h-12 bg-white/5 rounded-xl w-40"></div>
      </header>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 h-32">
            <div className="h-4 bg-white/10 rounded-lg w-1/2 mb-4"></div>
            <div className="h-8 bg-white/10 rounded-xl w-1/3"></div>
          </div>
        ))}
      </div>

      {/* List Skeleton */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-white/5">
          <div className="h-6 bg-white/10 rounded-lg w-64 mb-2"></div>
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 bg-white/10 rounded-lg w-40"></div>
                  <div className="h-6 bg-white/10 rounded-lg w-24"></div>
                </div>
                <div className="h-16 bg-white/10 rounded-xl w-full"></div>
                <div className="h-4 bg-white/10 rounded-lg w-1/3"></div>
              </div>
              <div className="w-32 space-y-3">
                <div className="h-10 bg-white/10 rounded-xl w-full"></div>
                <div className="h-10 bg-white/10 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
