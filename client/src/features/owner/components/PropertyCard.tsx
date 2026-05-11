import React from 'react';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Hotel } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    city: string;
    province: string;
    review_count: number;
    min_price?: string | number;
    max_price?: string | number;
    main_image?: string;
    images?: { id: number; url: string; is_main: boolean }[];
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onManageRooms: (id: number) => void;
}

export const PropertyCard = ({ property, onEdit, onDelete, onManageRooms }: PropertyCardProps) => {
  const mainImage = property.main_image || property.images?.find(img => img.is_main)?.url || property.images?.[0]?.url;
  const imageUrl = mainImage 
    ? (mainImage.startsWith('http') || mainImage.startsWith('/images/')) 
      ? mainImage 
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${mainImage}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex-center text-muted-foreground italic">
            (ไม่มีรูปภาพ)
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-primary truncate">{property.name}</h3>
          <div className="flex items-center gap-1 text-xs bg-yellow-100 px-2 py-1 rounded text-yellow-800 font-bold border border-yellow-200 shadow-sm">
            <span>
              {Number(property.min_price || 0) === Number(property.max_price || 0)
                ? `฿${Number(property.min_price || 0).toLocaleString()}`
                : `฿${Number(property.min_price || 0).toLocaleString()} - ฿${Number(property.max_price || 0).toLocaleString()}`}
            </span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {property.city}, {property.province}
        </p>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => onManageRooms(property.id)}>
            <Hotel size={14} className="mr-1.5" />
            จัดการห้องพัก
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(property.id)}>
            <Edit size={14} className="mr-1.5" />
            แก้ไข
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(property.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
