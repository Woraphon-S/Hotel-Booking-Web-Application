'use client';

import React from 'react';
import { Calendar, Users, CreditCard } from 'lucide-react';

interface BookingSummaryProps {
  room: any;
  property: any;
  checkIn: string;
  checkOut: string;
}

export const BookingSummary = ({ room, property, checkIn, checkOut }: BookingSummaryProps) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * Number(room.price_per_night);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="p-6 bg-primary text-white">
        <h3 className="text-xl font-bold">สรุปรายละเอียดการจอง</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-bold text-primary text-lg">{property.name}</h4>
          <p className="text-sm text-muted-foreground">{property.city}, {property.province}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">เช็คอิน</p>
              <p className="text-sm font-bold">{checkInDate.toLocaleDateString('th-TH')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <Calendar size={18} className="text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">เช็คเอาท์</p>
              <p className="text-sm font-bold">{checkOutDate.toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center"><Users size={14} className="mr-2" /> {room.name}</span>
            <span>{nights} คืน</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>ราคาต่อคืน</span>
            <span>฿{Number(room.price_per_night).toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <span className="text-lg font-bold text-primary">ราคารวมทั้งสิ้น</span>
          <div className="text-right">
            <span className="text-2xl font-black text-secondary">฿{totalPrice.toLocaleString()}</span>
            <p className="text-[10px] text-muted-foreground">รวมภาษีและค่าธรรมเนียมแล้ว</p>
          </div>
        </div>
      </div>
    </div>
  );
};
