'use client';

import React from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import apiClient from '@/services/apiClient';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  onRemove?: (url: string) => void;
  existingImages?: { id: number; url: string }[];
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  onRemove,
  existingImages = [],
  maxFiles = 10,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (existingImages.length + files.length > maxFiles) {
      alert(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    setIsUploading(true);
    try {
      const response = await apiClient.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadComplete(response.data.urls);
    } catch (error: any) {
      console.error('Upload failed:', error);
      const message = error.response?.data?.message || error.message || 'Unknown error';
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {existingImages.map((image) => (
          <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
            <img
              src={getFullUrl(image.url)}
              alt="Property"
              className="w-full h-full object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(image.url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {existingImages.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="p-2 bg-muted rounded-full">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">เพิ่มรูปภาพ</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-[10px] text-muted-foreground">
        * รองรับไฟล์ JPG, PNG, WEBP (สูงสุด 5MB ต่อไฟล์)
      </p>
    </div>
  );
};
