import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="flex-center min-h-[calc(100vh-64px)] flex-col px-4 text-center">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-2">การจองสำเร็จ!</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        เราได้รับข้อมูลการจองของคุณเรียบร้อยแล้ว รายละเอียดการจองถูกส่งไปยังอีเมลของคุณ และคุณสามารถตรวจสอบสถานะได้ที่เมนู "การจองของฉัน"
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/my-bookings">
          <Button variant="primary">ไปที่การจองของฉัน</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">กลับสู่หน้าแรก</Button>
        </Link>
      </div>
    </div>
  );
}
