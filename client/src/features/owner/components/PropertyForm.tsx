'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import apiClient from '@/services/apiClient';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const propertySchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อที่พัก'),
  description: z.string().min(10, 'คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร'),
  address: z.string().min(5, 'กรุณากรอกที่อยู่'),
  city: z.string().min(2, 'กรุณากรอกเมือง/เขต'),
  province: z.string().min(2, 'กรุณากรอกจังหวัด'),
  zipCode: z.string().min(5, 'รหัสไปรษณีย์ไม่ถูกต้อง'),
  minPrice: z.preprocess((val) => (val === '' || val === null || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(0, 'ราคาต้องไม่ต่ำกว่า 0').optional()),
  maxPrice: z.preprocess((val) => (val === '' || val === null || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(0, 'ราคาต้องไม่ต่ำกว่า 0').optional()),
  amenities: z.array(z.string()).default([]),
});

type PropertyFormInput = z.input<typeof propertySchema>;
type PropertyFormValues = z.output<typeof propertySchema>;

interface PropertyFormProps {
  propertyId?: number;
  initialValues?: Partial<PropertyFormInput> & { images?: any[] };
  onSubmit: (data: PropertyFormValues & { images?: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AMENITIES_OPTIONS = [
  { id: 'wifi', label: 'Wi-Fi ฟรี' },
  { id: 'pool', label: 'สระว่ายน้ำ' },
  { id: 'parking', label: 'ที่จอดรถฟรี' },
  { id: 'ac', label: 'เครื่องปรับอากาศ' },
  { id: 'gym', label: 'ฟิตเนส' },
  { id: 'restaurant', label: 'ห้องอาหาร' },
  { id: 'spa', label: 'สปา' },
  { id: 'breakfast', label: 'รวมอาหารเช้า' },
];

export const PropertyForm = ({ propertyId, initialValues, onSubmit, onCancel, isLoading }: PropertyFormProps) => {
  const [images, setImages] = React.useState<any[]>(initialValues?.images || []);
  const [newImageUrls, setNewImageUrls] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialValues || { amenities: [] },
  });

  const selectedAmenities = watch('amenities') || [];

  const handleAmenityChange = (id: string) => {
    const current = [...selectedAmenities];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue('amenities', current);
  };

  const handleUploadComplete = (urls: string[]) => {
    setNewImageUrls((prev) => [...prev, ...urls]);
    const tempImages = urls.map((url, index) => ({
      id: Date.now() + index,
      url,
    }));
    setImages((prev) => [...prev, ...tempImages]);
  };

  const handleRemoveImage = async (url: string) => {
    const existingImage = images.find((img) => img.url === url);
    
    if (existingImage && propertyId && !newImageUrls.includes(url)) {
      try {
        await apiClient.delete(`/properties/${propertyId}/images/${existingImage.id}`);
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('ลบรูปภาพไม่สำเร็จ');
        return;
      }
    }

    setImages((prev) => prev.filter((img) => img.url !== url));
    setNewImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleFormSubmit = (data: PropertyFormValues) => {
    onSubmit({ ...data, images: newImageUrls });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 bg-white p-6 rounded-lg border border-border">
      <h3 className="text-xl font-bold text-primary mb-4">
        {propertyId ? 'แก้ไขข้อมูลที่พัก' : 'เพิ่มที่พักใหม่'}
      </h3>

      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium">รูปภาพที่พัก</label>
        <ImageUpload
          existingImages={images}
          onUploadComplete={handleUploadComplete}
          onRemove={handleRemoveImage}
          maxFiles={5}
        />
      </div>

      <Input
        label="ชื่อที่พัก"
        placeholder="เช่น โรงแรมแสนสุข"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">รายละเอียด</label>
        <textarea
          className="w-full min-h-[100px] p-3 rounded-md border border-input focus:ring-2 focus:ring-ring focus:outline-none"
          placeholder="อธิบายเกี่ยวกับที่พักของคุณ..."
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <Input
        label="ที่อยู่"
        placeholder="เลขที่บ้าน ถนน..."
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="เมือง/เขต"
          placeholder="เช่น สยาม"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="จังหวัด"
          placeholder="เช่น กรุงเทพฯ"
          error={errors.province?.message}
          {...register('province')}
        />
      </div>

      <Input
        label="รหัสไปรษณีย์"
        placeholder="10XXX"
        error={errors.zipCode?.message}
        {...register('zipCode')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ราคาต่ำสุด (บาท)"
          type="number"
          placeholder="0"
          error={errors.minPrice?.message}
          {...register('minPrice', { valueAsNumber: true })}
        />
        <Input
          label="ราคาสูงสุด (บาท)"
          type="number"
          placeholder="0"
          error={errors.maxPrice?.message}
          {...register('maxPrice', { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">สิ่งอำนวยความสะดวก</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AMENITIES_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex items-center p-3 rounded-lg border cursor-pointer transition-colors text-sm",
                selectedAmenities.includes(option.id)
                  ? "bg-primary/5 border-primary text-primary font-semibold"
                  : "bg-white border-border text-muted-foreground hover:bg-muted/50"
              )}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedAmenities.includes(option.id)}
                onChange={() => handleAmenityChange(option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {propertyId ? 'บันทึกการแก้ไข' : 'เพิ่มที่พัก'}
        </Button>
      </div>
    </form>
  );
};
