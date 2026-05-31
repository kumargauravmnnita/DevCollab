const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded-lg ${className}`} />
);

export const ProjectCardSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
    <div className="flex items-start justify-between">
      <Skeleton className="w-10 h-10 rounded-lg" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="pt-2 border-t border-slate-700 flex justify-between">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const TaskCardSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-2 space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-5 w-16 rounded-full" />
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6 space-y-2">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-8 w-12" />
  </div>
);

export default Skeleton;
