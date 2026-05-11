'use client';

import React from 'react';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/features/search/services/search.service';
import { PropertyListItem } from '@/features/search/components/PropertyListItem';
import { PropertyListItemSkeleton } from '@/features/search/components/PropertyListItemSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Heart, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const { favoriteIds } = useFavoriteStore();
  
  // In a real app, we'd have an API to fetch multiple properties by IDs.
  // For now, we'll fetch all and filter, or just fetch if there are IDs.
  const { data: properties, isLoading } = useQuery({
    queryKey: ['favorite-properties', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      // Fetching all properties and filtering for demo
      // In production, use: apiClient.get(`/properties/batch?ids=${favoriteIds.join(',')}`)
      const all = await searchService.searchProperties({});
      return all.filter((p: any) => favoriteIds.includes(p.id));
    },
    enabled: true
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <Heart className="mr-3 text-red-500 fill-red-500" size={32} />
            ที่พักที่บันทึกไว้
          </h1>
          <p className="text-muted-foreground mt-2">รายการที่พักที่คุณสนใจและบันทึกไว้ดูภายหลัง</p>
        </div>
        <Link href="/#search-section">
          <Button variant="outline" className="rounded-xl">
            <Home className="mr-2" size={18} />
            ค้นหาที่พักเพิ่ม
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <PropertyListItemSkeleton key={i} />
          ))
        ) : properties && properties.length > 0 ? (
          properties.map((property: any) => (
            <PropertyListItem key={property.id} property={property} />
          ))
        ) : (
          <EmptyState
            title="ยังไม่มีรายการที่บันทึกไว้"
            description="กดไอคอนรูปหัวใจบนที่พักที่คุณสนใจ เพื่อบันทึกไว้ในรายการนี้"
            icon={Heart}
            actionLabel="ไปค้นหาที่พัก"
            onAction={() => window.location.href = '/#search-section'}
          />

        )}
      </div>
    </div>
  );
}
