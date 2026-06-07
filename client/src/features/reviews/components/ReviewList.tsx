'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { Button } from '@/components/ui/Button';
import { Star, MessageSquare, Reply } from 'lucide-react';

interface ReviewListProps {
  propertyId: number;
  isOwner?: boolean;
}

const ReviewItem = ({
  review,
  propertyId,
  isOwner,
}: {
  review: any;
  propertyId: number;
  isOwner: boolean;
}) => {
  const queryClient = useQueryClient();
  const [reply, setReply] = React.useState('');
  const [showReply, setShowReply] = React.useState(false);

  const mutation = useMutation({
    mutationFn: () => reviewService.replyToReview(review.id, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-reviews', propertyId] });
      setReply('');
      setShowReply(false);
    },
    onError: (err: any) => alert(err.response?.data?.message || 'ตอบกลับไม่สำเร็จ'),
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-border">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex-center text-secondary font-bold">
            {review.first_name?.[0] || '?'}
          </div>
          <div>
            <p className="font-bold">{review.first_name || 'ผู้ใช้'} {review.last_name || ''}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded text-sm font-bold text-accent-foreground">
          <span>{review.rating}</span>
          <Star size={12} fill="currentColor" />
        </div>
      </div>

      <p className="text-foreground leading-relaxed">{review.comment}</p>

      {review.owner_reply && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-secondary">
          <p className="text-xs font-bold text-secondary mb-1">การตอบกลับจากเจ้าของที่พัก</p>
          <p className="text-sm text-foreground italic">"{review.owner_reply}"</p>
        </div>
      )}

      {isOwner && !review.owner_reply && (
        <div className="mt-4">
          {showReply ? (
            <div className="space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-lg border border-input focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                placeholder="ตอบกลับรีวิวนี้ในฐานะเจ้าของที่พัก..."
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowReply(false)}>
                  ยกเลิก
                </Button>
                <Button
                  size="sm"
                  onClick={() => mutation.mutate()}
                  isLoading={mutation.isPending}
                  disabled={!reply.trim()}
                >
                  ส่งคำตอบ
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowReply(true)}
              className="text-sm text-secondary font-medium flex items-center gap-1 hover:underline"
            >
              <Reply size={14} /> ตอบกลับรีวิว
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const ReviewList = ({ propertyId, isOwner = false }: ReviewListProps) => {
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
          <ReviewItem key={review.id} review={review} propertyId={propertyId} isOwner={isOwner} />
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
