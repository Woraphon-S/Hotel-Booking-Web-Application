'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { Star, MessageSquare } from 'lucide-react';

interface ReviewListProps {
  propertyId: number;
}

export const ReviewList = ({ propertyId }: ReviewListProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['property-reviews', propertyId],
    queryFn: () => reviewService.getPropertyReviews(propertyId),
  });

  if (isLoading) return <div className="animate-pulse h-20 bg-muted rounded-lg"></div>;

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
        <MessageSquare size={20} className="mr-2" />
        รีวิวจากผู้เข้าพัก ({reviews?.length || 0})
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {reviews?.map((review: any) => (
          <div key={review.id} className="bg-white p-6 rounded-xl border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex-center text-secondary font-bold">
                  {review.first_name[0]}
                </div>
                <div>
                  <p className="font-bold">{review.first_name} {review.last_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString('th-TH')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded text-sm font-bold text-accent-foreground">
                <span>{review.rating}</span>
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed">
              {review.comment}
            </p>

            {review.owner_reply && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-secondary">
                <p className="text-xs font-bold text-secondary mb-1">การตอบกลับจากเจ้าของที่พัก</p>
                <p className="text-sm text-foreground italic">"{review.owner_reply}"</p>
              </div>
            )}
          </div>
        ))}

        {reviews?.length === 0 && (
          <div className="text-center py-10 bg-muted/10 rounded-lg border border-dashed border-border text-muted-foreground">
            ยังไม่มีรีวิวสำหรับที่พักนี้
          </div>
        )}
      </div>
    </div>
  );
};
