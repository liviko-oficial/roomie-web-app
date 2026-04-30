export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-6">
        {/* Hero image */}
        <div className="h-72 md:h-96 bg-gray-200 rounded-2xl" />

        {/* Title + price row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded-xl" />
        </div>

        {/* Tabs / characteristics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}
