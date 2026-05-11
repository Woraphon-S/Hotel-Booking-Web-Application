'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search.service';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Loader2, Check, X } from 'lucide-react';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';




interface PropertyDetailsViewProps {
  propertyId: number;
}

export const PropertyDetailsView = ({ propertyId }: PropertyDetailsViewProps) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const { data: property, isLoading } = useQuery({
    queryKey: ['property-details', propertyId],
    queryFn: () => searchService.getPropertyDetails(propertyId),
  });

  if (isLoading) {
    return (
      <div className="flex-center h-96">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }


  if (!property) return <div>ไม่พบข้อมูลที่พัก</div>;

  const AMENITIES_MAP: Record<string, string> = {
    wifi: 'Wi-Fi ฟรี',
    pool: 'สระว่ายน้ำ',
    parking: 'ที่จอดรถฟรี',
    ac: 'เครื่องปรับอากาศ',
    gym: 'ฟิตเนส',
    restaurant: 'ห้องอาหาร',
    spa: 'สปา',
    breakfast: 'รวมอาหารเช้า',
  };

  const images = property.images && property.images.length > 0 
    ? property.images.slice(0, 5).map((img: any) => {
        const url = img.url;
        return (url.startsWith('http') || url.startsWith('/images/'))
          ? url
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Image Gallery - Simple & Clear 5-Image Layout */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 h-[500px] md:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-md border border-border">
        {[0, 2, 1, 3, 4].map((index, i) => {
          const img = images[index];
          return (
            <div 
              key={i} 
              onClick={() => img && setSelectedImage(img)}
              className={cn(
                "relative h-full w-full overflow-hidden group bg-muted cursor-pointer",
                i === 0 ? "col-span-2 md:col-span-1" : "col-span-1"
              )}
            >
              {img ? (
                <img 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-80 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex-center text-muted-foreground/30 text-xs italic">
                  (ไม่มีรูป)
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal with Framer Motion */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center bg-black/90 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedImage} 
              alt="Full view" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>





      <div className="p-0">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-primary mb-3">{property.name}</h1>
            <p className="flex items-center text-muted-foreground text-lg">
              <MapPin size={20} className="mr-2 text-secondary" />
              {property.address}, {property.city}, {property.province} {property.zip_code}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-2xl font-bold shadow-md">
              <span>{Number(property.rating_avg || 0).toFixed(1)}</span>
              <Star size={20} fill="white" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-medium">{property.review_count} รีวิวจากผู้เข้าพัก</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 pt-12 border-t border-border">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-6">เกี่ยวกับที่พักนี้</h3>
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
          
          <div className="bg-muted/20 p-8 rounded-2xl border border-border/50 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6">สิ่งอำนวยความสะดวกยอดนิยม</h3>
            <div className="grid grid-cols-1 gap-4">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((id: string) => (
                  <div key={id} className="flex items-center text-md font-medium text-foreground/80">
                    <div className="bg-green-100 p-1.5 rounded-full mr-3">
                      <Check size={16} className="text-green-600" />
                    </div>
                    {AMENITIES_MAP[id] || id}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">ไม่มีระบุไว้</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary mb-6">ประเภทห้องพักที่มีให้เลือก</h2>
      <div className="space-y-4">
        {property.rooms?.map((room: any) => (
          <div key={room.id} className="bg-white rounded-xl border border-border overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-72 h-48 bg-muted relative">
              {room.image_url ? (
                (() => {
                  const url = room.image_url;
                  const fullUrl = (url.startsWith('http') || url.startsWith('/images/'))
                    ? url
                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`;
                  return (
                    <img 
                      src={fullUrl} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  );
                })()
              ) : (
                <div className="w-full h-full flex-center text-muted-foreground/30 italic text-sm">
                  (ไม่มีรูปภาพห้องพัก)
                </div>
              )}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-primary">{room.name}</h4>
                  <span className="bg-muted px-3 py-1 rounded-full text-xs font-semibold">{room.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{room.description}</p>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <span>ผู้เข้าพักสูงสุด: {room.capacity} ท่าน</span>
                  <span>จำนวนเตียง: 1 เตียงใหญ่</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-6">
                <div className="text-sm text-green-600 font-medium">
                  ✓ รวมอาหารเช้า
                  <br />
                  ✓ ยกเลิกฟรี
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary">฿{Number(room.price_per_night).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mb-3">ต่อคืน (รวมภาษีแล้ว)</p>
                  <Button onClick={() => window.location.href = `/booking/${room.id}`}>
                    จองตอนนี้
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-12 border-t border-border">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <ReviewList propertyId={propertyId} />
          </div>
          <div className="w-full md:w-96">
            <ReviewForm propertyId={propertyId} />
          </div>
        </div>
      </div>
    </div>
  );
};

