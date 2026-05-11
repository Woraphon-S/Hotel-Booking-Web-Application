import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const PropertyListItemSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm border border-border">
      <Skeleton className="w-full md:w-64 h-48 rounded-lg" />
      <div className="flex-1 space-y-4 py-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-end pt-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
};
