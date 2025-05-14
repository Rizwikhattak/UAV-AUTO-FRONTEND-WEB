import { Skeleton } from "@/Component/ui/skeleton";

// Card Skeleton with Stats
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function DocumentDashboardSkeleton() {
  return (
    <div className="w-full  px-4 flex flex-col min-h-[calc(100vh-50px)]">
      {/* Top Navigation/Filter Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {/* Tab items */}
          <div className="flex items-center space-x-1">
            <Skeleton className="h-5 w-20 rounded-md bg-blue-600" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-5 w-28 rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Add New Document Button */}
        <Skeleton className="h-12 w-48 rounded-lg bg-blue-600" />
      </div>

      {/* Kanban Board */}
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-6">
          {/* Processing Column */}
          <div className="bg-gray-100 rounded-lg p-4">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-8 rounded-full" />
            </div>

            {/* Document Cards */}
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-5 w-28 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Review Column */}
          <div className="bg-gray-100 rounded-lg p-4">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-8 rounded-full" />
            </div>

            {/* Empty State */}
            <div className="h-40 flex items-center justify-center">
              <Skeleton className="h-20 w-20 rounded-full opacity-30" />
            </div>
          </div>

          {/* Ready Column */}
          <div className="bg-gray-100 rounded-lg p-4">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-8 rounded-full" />
            </div>

            {/* Empty State */}
            <div className="h-40 flex items-center justify-center">
              <Skeleton className="h-20 w-20 rounded-full opacity-30" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export function DocumentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm m-3">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-5 w-28 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-16 rounded-full" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="bg-muted/50 p-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="divide-y">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center p-4 gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
export function BusinessProfileFormSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <Skeleton className="h-6 w-16 mb-2" />
        <Skeleton className="h-40 w-40 rounded-md bg-red-50" />
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Business Name */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Country of Origin */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Base Currency */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* State */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Address - Full Width */}
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Practice Code */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* CRN */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function ComboboxSkeleton() {
  return (
    <div className="space-y-2 w-full">
      {/* Label */}
      <Skeleton className="h-5 w-16" />

      {/* Combobox input field */}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function BusinessProfileSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="space-y-8">
        {/* Logo and basic info section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Company logo */}
          <Skeleton className="h-48 w-48 rounded-md bg-red-50" />

          {/* First row of info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-6 flex-1">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-48" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-7 w-28" />
            </div>
          </div>
        </div>

        {/* Second row of info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-20" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-16" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-36" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-36" />
          </div>
        </div>

        {/* Address section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
          <div className="space-y-2 md:col-span-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-1/2" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <Skeleton className="h-px w-full mt-8" />
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-[240px] flex items-end gap-2">
          {[...Array(12)].map((_, i) => {
            const height = Math.floor(Math.random() * 100) + 40;
            return (
              <Skeleton
                key={i}
                className={`w-full h-[${height}px] rounded-t-md`}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-10" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Activity Feed Skeleton
export function ActivitySkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard Layout Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <ActivitySkeleton />
        </div>
      </div>

      <TableSkeleton />
    </div>
  );
}

// Animated Pulse Skeleton
export function PulseSkeleton({ className, ...props }) {
  return <Skeleton className={`animate-pulse ${className}`} {...props} />;
}

// Gradient Skeleton
export function GradientSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm overflow-hidden relative">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
}

// Sidebar Skeleton
export function SidebarSkeleton() {
  return (
    <div className="w-64 h-screen border-r p-4 flex flex-col gap-6">
      <Skeleton className="h-10 w-32 mx-auto" />
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="h-px w-full my-2" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
