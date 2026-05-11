'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Hotel, Calendar, CreditCard, ChevronRight, MapPin, Star, History } from 'lucide-react';
import Link from 'next/link';
import { ownerService } from '@/features/owner/services/owner.service';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<'bookings' | 'properties'>('bookings');

  // Fetch Owner Properties
  const { data: properties } = useQuery({
    queryKey: ['owner-properties', user?.id],
    queryFn: () => ownerService.getMyProperties(user!.id),
    enabled: !!user && user.role === 'owner',
  });

  // Mock Bookings Data (In real app, fetch from bookingService)
  const mockBookings = [
    {
      id: 1,
      propertyName: 'แสนสิริ โฮเทล',
      city: 'พัทยา',
      date: '15-17 มิ.ย. 2026',
      price: 2400,
      status: 'สำเร็จ',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'
    },
    {
      id: 2,
      propertyName: 'เชียงใหม่ การ์เดน',
      city: 'เชียงใหม่',
      date: '20-22 พ.ค. 2026',
      price: 1800,
      status: 'กำลังมาถึง',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200'
    }
  ];

  if (!user) return <div className="p-20 text-center">กรุณาเข้าสู่ระบบ</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-border">
        <div className="w-20 h-20 bg-primary rounded-full flex-center text-white text-2xl font-bold">
          {user.first_name[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">{user.first_name} {user.last_name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
            {user.role === 'owner' ? 'เจ้าของที่พัก (Owner)' : 'นักเดินทาง (Traveler)'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 font-bold transition-all ${activeTab === 'bookings' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          ประวัติการจอง
        </button>
        {user.role === 'owner' && (
          <button 
            onClick={() => setActiveTab('properties')}
            className={`pb-4 px-2 font-bold transition-all ${activeTab === 'properties' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          >
            ที่พักที่ฉันเพิ่ม
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'bookings' ? (
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <img src={booking.image} alt={booking.propertyName} className="w-full md:w-32 h-32 object-cover rounded-xl" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold text-primary">{booking.propertyName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'สำเร็จ' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {booking.city}
                    </p>
                    <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1">
                      <Calendar size={14} /> {booking.date}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed">
                    <p className="font-bold text-secondary">฿{booking.price.toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">
                      ดูรายละเอียด
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties?.map((prop: any) => (
              <div key={prop.id} className="bg-white p-4 rounded-2xl border border-border flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-muted rounded-xl flex-center text-primary">
                  <Hotel size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary truncate">{prop.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{prop.city}, {prop.province}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-accent font-bold text-sm">
                      <Star size={14} fill="currentColor" />
                      {Number(prop.rating_avg || 0).toFixed(1)}
                    </div>
                    <Link href={`/owner/dashboard`}>
                      <Button size="sm" variant="ghost" className="text-primary text-xs underline">
                        จัดการที่พัก
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {properties?.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <p className="text-muted-foreground mb-4">คุณยังไม่ได้เพิ่มที่พักใดๆ</p>
                <Link href="/owner/dashboard">
                  <Button variant="outline">ไปที่แผงควบคุมเจ้าของ</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
