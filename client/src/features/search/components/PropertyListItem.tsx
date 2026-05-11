import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Heart } from 'lucide-react';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { cn } from '@/lib/utils';


interface PropertyListItemProps {
  property: {
    id: number;
    name: string;
    city: string;
    province: string;
    min_price: string;
    max_price: string;
    rating_avg: number;
    review_count: number;
    images?: any[];
  };
}

export const PropertyListItem = ({ property }: PropertyListItemProps) => {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorited = isFavorite(property.id);

  return (
    <div className="relative bg-white flex flex-col md:flex-row rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 group">
      {/* Invisible Link covering the entire card */}
      <Link href={`/properties/${property.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${property.name}`} />
      
      <div className="w-full md:w-72 h-52 bg-muted relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          (() => {
            const rawUrl = property.images.find((img: any) => img.is_main)?.url || property.images[0].url;
            const fullUrl = (rawUrl.startsWith('http') || rawUrl.startsWith('/images/'))
              ? rawUrl
              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${rawUrl}`;
            
            return (
              <img
                src={fullUrl}
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2080&auto=format&fit=crop';
                }}
              />
            );
          })()
        ) : (
          <div className="w-full h-full flex-center text-muted-foreground italic bg-muted">
            (ไม่มีรูปภาพที่พัก)
          </div>
        )}
        
        {/* Favorite Button - positioned above the invisible link */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 z-20",
            favorited ? "bg-white text-red-500" : "bg-black/20 text-white hover:bg-white hover:text-red-500"
          )}
        >
          <Heart size={20} fill={favorited ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary transition-colors line-clamp-1">
                {property.name}
              </h3>
              <p className="flex items-center text-sm text-muted-foreground">
                <MapPin size={14} className="mr-1 text-secondary" />
                {property.city}, {property.province}
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 bg-primary text-white px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                <span>{Number(property.rating_avg || 0).toFixed(1)}</span>
                <Star size={12} fill="white" className="text-white" />
              </div>
              <span className="text-xs text-muted-foreground mt-1.5 font-medium">{property.review_count} รีวิว</span>
            </div>
          </div>
        </div>

        
        <div className="flex justify-between items-end mt-4">
          <div className="text-xs text-green-600 font-medium">
            ✓ ยกเลิกฟรี
            <br />
            ✓ ไม่ต้องชำระเงินล่วงหน้า
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ราคา</p>
            <p className="text-2xl font-bold text-secondary">
              {Number(property.min_price) === Number(property.max_price)
                ? `฿${Number(property.min_price).toLocaleString()}`
                : `฿${Number(property.min_price).toLocaleString()} - ฿${Number(property.max_price).toLocaleString()}`}
            </p>
            <Button size="sm" className="mt-2 relative z-0">
              ดูรายละเอียด
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
