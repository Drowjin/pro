export default function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/3 h-10 bg-gray-100 animate-pulse rounded-md"></div>
        <div className="flex gap-2">
          <div className="w-[180px] h-10 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="w-[180px] h-10 bg-gray-100 animate-pulse rounded-md"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}

