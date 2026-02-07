/**
 * Dashboard Loading Skeleton
 * Displays placeholder UI while dashboard data is loading
 * Matches the actual dashboard layout for smooth transition
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-[380px] bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-[300px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg animate-pulse flex items-end justify-around px-8 pb-8">
                {[...Array(7)].map((_, j) => (
                  <div
                    key={j}
                    className="w-full max-w-[40px] bg-gray-300 rounded-t"
                    style={{
                      height: `${Math.random() * 60 + 40}%`,
                      animationDelay: `${j * 50}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings table skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-50 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 75}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
