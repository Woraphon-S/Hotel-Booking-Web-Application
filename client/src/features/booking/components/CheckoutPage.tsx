'use client';

import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchService } from '@/features/search/services/search.service';
import { bookingService } from '../services/booking.service';
import { BookingSummary } from './BookingSummary';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import apiClient from '@/services/apiClient';

interface CheckoutPageProps {
  roomId: number;
}

const toDateInput = (d: Date) => d.toISOString().split('T')[0];

export const CheckoutPage = ({ roomId }: CheckoutPageProps) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = React.useState(1);
  const [bookingId, setBookingId] = React.useState<number | null>(null);

  const today = React.useMemo(() => toDateInput(new Date()), []);
  const [checkIn, setCheckIn] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toDateInput(d);
  });
  const [checkOut, setCheckOut] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return toDateInput(d);
  });
  const [specialRequests, setSpecialRequests] = React.useState('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking/${roomId}`);
    }
  }, [isAuthenticated, roomId, router]);

  const { data: room, isLoading: isLoadingRoom } = useQuery({
    queryKey: ['room-details', roomId],
    queryFn: () => apiClient.get(`/rooms/${roomId}`).then(res => res.data),
  });

  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['property-by-room', roomId],
    queryFn: () => room ? apiClient.get(`/properties/${room.property_id}`).then(res => res.data) : null,
    enabled: !!room,
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => bookingService.createBooking(data),
    onSuccess: (data) => {
      setBookingId(data.id);
      setStep(2);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'ไม่สามารถจองห้องพักได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (data: any) => bookingService.processPayment(bookingId!, data),
    onSuccess: () => {
      router.push('/booking/success');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const handleCreateBooking = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      alert('กรุณาเลือกวันที่เช็คเอาท์ให้หลังวันเช็คอิน');
      return;
    }
    if (checkIn < today) {
      alert('วันเช็คอินต้องเป็นวันนี้หรือหลังจากนี้');
      return;
    }
    createBookingMutation.mutate({
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      specialRequests: specialRequests.trim() || undefined,
    });
  };

  if (!isAuthenticated) return null;

  if (isLoadingRoom || isLoadingProperty) {
    return (
      <div className="flex-center h-screen">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-6">รายละเอียดผู้เข้าพัก</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="ชื่อ" value={user?.first_name} disabled />
                <Input label="นามสกุล" value={user?.last_name} disabled />
              </div>
              <div className="mt-4">
                <Input label="อีเมล" value={user?.email} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">วันเช็คอิน</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">วันเช็คเอาท์</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 rounded-md border border-input focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium mb-1 block">คำขอเพิ่มเติม (ตัวเลือกเสริม)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full min-h-[100px] p-3 rounded-md border border-input focus:ring-2 focus:ring-ring"
                  placeholder="เช่น ต้องการเตียงเสริม, เช็คอินเร็ว..."
                />
              </div>
              <Button
                className="w-full mt-8"
                size="lg"
                onClick={handleCreateBooking}
                isLoading={createBookingMutation.isPending}
              >
                ต่อไป: ขั้นตอนการชำระเงิน
              </Button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-6">เลือกวิธีชำระเงิน</h2>
              <div className="space-y-4">
                <div className="p-4 border-2 border-secondary rounded-lg flex items-center justify-between cursor-pointer bg-secondary/5">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded border border-border">
                      <CreditCard className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold">บัตรเครดิต / เดบิต</p>
                      <p className="text-xs text-muted-foreground">ชำระเงินผ่านบัตร Visa, Mastercard</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-4 border-secondary"></div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted/30 rounded-lg flex gap-3">
                <ShieldCheck className="text-green-600 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  ข้อมูลการชำระเงินของคุณถูกเข้ารหัสและปกป้องอย่างปลอดภัยตามมาตรฐานความปลอดภัยสูงสุด
                </p>
              </div>

              <Button 
                className="w-full mt-8" 
                size="lg"
                onClick={() => paymentMutation.mutate({ paymentMethod: 'credit_card' })}
                isLoading={paymentMutation.isPending}
              >
                ยืนยันการชำระเงิน
              </Button>
            </div>
          )}
        </div>

        <aside>
          <BookingSummary 
            room={room} 
            property={property} 
            checkIn={checkIn} 
            checkOut={checkOut} 
          />
        </aside>
      </div>
    </div>
  );
};
