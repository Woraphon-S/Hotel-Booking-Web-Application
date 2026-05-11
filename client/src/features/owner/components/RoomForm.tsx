'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ImageUpload } from '@/components/ui/ImageUpload';

const roomSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อห้อง'),
  description: z.string().optional(),
  type: z.string().min(2, 'กรุณาระบุประเภทห้อง'),
  pricePerNight: z.number().min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  capacity: z.number().min(1, 'จำนวนคนต้องมีอย่างน้อย 1'),
  totalRooms: z.number().min(1, 'จำนวนห้องต้องมีอย่างน้อย 1'),
  imageUrl: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  initialValues?: Partial<RoomFormValues>;
  onSubmit: (data: RoomFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoomForm = ({ initialValues, onSubmit, onCancel, isLoading }: RoomFormProps) => {
  const [images, setImages] = React.useState<any[]>(
    initialValues?.imageUrl ? [{ id: 1, url: initialValues.imageUrl }] : []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialValues,
  });

  const handleUploadComplete = (urls: string[]) => {
    const url = urls[0];
    if (url) {
      setImages([{ id: Date.now(), url }]);
      setValue('imageUrl', url);
    }
  };

  const handleRemoveImage = () => {
    setImages([]);
    setValue('imageUrl', undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-4">
        {initialValues ? 'แก้ไขข้อมูลห้องพัก' : 'เพิ่มห้องพักใหม่'}
      </h3>

      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium">รูปภาพห้องพัก</label>
        <ImageUpload
          existingImages={images}
          onUploadComplete={handleUploadComplete}
          onRemove={handleRemoveImage}
          maxFiles={1}
        />
      </div>

      <Input
        label="ชื่อห้อง"
        placeholder="เช่น Deluxe King Room"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">รายละเอียด (ตัวเลือกเสริม)</label>
        <textarea
          className="w-full min-h-[80px] p-3 rounded-md border border-input focus:ring-2 focus:ring-ring focus:outline-none"
          placeholder="อธิบายเกี่ยวกับห้องพัก..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ประเภทห้อง"
          placeholder="เช่น Standard, Suite"
          error={errors.type?.message}
          {...register('type')}
        />
        <Input
          label="ราคาต่อคืน (บาท)"
          type="number"
          error={errors.pricePerNight?.message}
          {...register('pricePerNight', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="จำนวนคนเข้าพัก"
          type="number"
          error={errors.capacity?.message}
          {...register('capacity', { valueAsNumber: true })}
        />
        <Input
          label="จำนวนห้องที่มีทั้งหมด"
          type="number"
          error={errors.totalRooms?.message}
          {...register('totalRooms', { valueAsNumber: true })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues ? 'บันทึกการแก้ไข' : 'เพิ่มห้องพัก'}
        </Button>
      </div>
    </form>
  );
};
