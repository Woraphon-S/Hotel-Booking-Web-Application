'use client';

import React from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { reviewService } from '../services/review.service';
import { bookingService } from '@/features/booking/services/booking.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ReviewFormProps {
  propertyId: number;
}

export const ReviewForm = ({ propertyId }: ReviewFormProps) => {
  const { isAuthenticated } = useAuthStore();
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const queryClient = useQueryClient();

  const { data: myBookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings(),
    enabled: isAuthenticated,
  });

  const eligibleBooking = React.useMemo(
    () =>
      (myBookings || []).find(
        (b: any) =>
          b.property_id === propertyId &&
          (b.status === 'confirmed' || b.status === 'completed'),
      ),
    [myBookings, propertyId],
  );

  const mutation = useMutation({
    mutationFn: (data: any) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-reviews', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['property-details', propertyId] });
      setComment('');
      setRating(5);
      alert('ขอบคุณสำหรับรีวิวของคุณ!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งรีวิว');
    }
  });

  if (!isAuthenticated) return null;

  if (!eligibleBooking) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mb-8 text-center text-sm text-muted-foreground">
        <MessageSquare size={18} className="mx-auto mb-2 text-muted-foreground/60" />
        เฉพาะผู้ที่เคยจองและเข้าพักที่นี่แล้วเท่านั้นจึงจะเขียนรีวิวได้
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    mutation.mutate({
      bookingId: eligibleBooking.id,
      rating,
      comment,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mb-8">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
        <MessageSquare size={18} className="mr-2" />
        เขียนรีวิวของคุณ
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">คะแนนความพึงพอใจ</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={28}
                  fill={(hoveredRating || rating) >= star ? "#EAB308" : "none"}
                  className={(hoveredRating || rating) >= star ? "text-yellow-500" : "text-muted-foreground/30"}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">ความคิดเห็น</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[120px] p-4 rounded-xl border border-input focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none text-sm"
            placeholder="แบ่งปันประสบการณ์ของคุณที่พักนี้..."
            required
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={mutation.isPending || !comment.trim()}
            className="rounded-xl px-8"
          >
            {mutation.isPending ? 'กำลังส่ง...' : 'ส่งรีวิว'}
            <Send size={16} className="ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
