'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchService } from '../services/search.service';
import { SearchSidebar } from './SearchSidebar';
import { PropertyListItem } from './PropertyListItem';
import { PropertyListItemSkeleton } from './PropertyListItemSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import dynamic from 'next/dynamic';
import { List, Map as MapIcon, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';


const MapView = dynamic(() => import('./MapView'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-2xl flex-center">กำลังโหลดแผนที่...</div>
});

export const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = React.useState<'list' | 'map'>('list');

  const currentFilters = {

    name: searchParams.get('name') || '',
    city: searchParams.get('city') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'DESC',
    page: searchParams.get('page') || '1',
  };

  const { data: properties, isLoading } = useQuery({
    queryKey: ['search-properties', currentFilters],
    queryFn: () => searchService.searchProperties(currentFilters),
  });

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    router.push(`/?${params.toString()}#search-section`);
  };

  const resetFilters = () => {
    router.push('/#search-section');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-80">
          <SearchSidebar
            initialFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-border shadow-sm">
            <h1 className="text-xl font-bold text-primary">
              {isLoading ? (
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              ) : (
                `พบ ${properties?.length || 0} ที่พัก`
              )}
            </h1>

            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl">
              <button
                onClick={() => setView('list')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  view === 'list' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                )}
              >
                <List size={16} />
                รายการ
              </button>
              <button
                onClick={() => setView('map')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  view === 'map' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                )}
              >
                <MapIcon size={16} />
                แผนที่
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <PropertyListItemSkeleton key={i} />
              ))
            ) : view === 'map' ? (
              <MapView properties={properties || []} />
            ) : properties && properties.length > 0 ? (

              properties.map((property: any) => (
                <PropertyListItem key={property.id} property={property} />
              ))
            ) : (
              <EmptyState
                title="ไม่พบที่พักที่คุณต้องการ"
                description="ลองปรับเงื่อนไขการค้นหาหรือล้างตัวกรองทั้งหมดเพื่อให้เห็นผลลัพธ์ที่มากขึ้น"
                icon={SearchX}
                actionLabel="ล้างตัวกรองทั้งหมด"
                onAction={resetFilters}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

