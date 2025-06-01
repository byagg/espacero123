import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <Skeleton className="h-12 md:h-20 w-64 md:w-96 mx-auto mb-4 md:mb-6" />
          <Skeleton className="h-6 md:h-8 w-full max-w-3xl mx-auto mb-6 md:mb-8" />
          <Skeleton className="h-4 md:h-6 w-full max-w-2xl mx-auto mb-8 md:mb-12" />

          {/* Search Bar Skeleton */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 max-w-3xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 md:h-10 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="py-10 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-8 md:mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <Skeleton className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto mb-2 md:mb-3" />
                <Skeleton className="h-3 w-full mb-2 md:mb-3" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Skeleton */}
      <div className="py-10 md:py-16 px-4 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto text-center">
          <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-4 md:mb-6 bg-amber-400" />
          <Skeleton className="h-6 md:h-8 w-full max-w-2xl mx-auto mb-6 md:mb-8 bg-amber-400" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 max-w-4xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 md:h-8 w-16 mx-auto mb-2 bg-amber-400" />
                <Skeleton className="h-3 w-20 mx-auto bg-amber-400" />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48 bg-amber-400" />
            <Skeleton className="h-12 w-56 bg-amber-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
