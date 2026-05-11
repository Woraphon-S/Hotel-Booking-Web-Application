'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Star, Wifi, Car, Utensils, Waves, Dumbbell } from 'lucide-react';

interface SearchSidebarProps {
  onFilterChange: (filters: any) => void;
  initialFilters: any;
}

export const SearchSidebar = ({ onFilterChange, initialFilters }: SearchSidebarProps) => {
  const [filters, setFilters] = React.useState(initialFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const currentAmenities = filters.amenities ? filters.amenities.split(',') : [];
      let newAmenities;
      if (checkbox.checked) {
        newAmenities = [...currentAmenities, value];
      } else {
        newAmenities = currentAmenities.filter((a: string) => a !== value);
      }
      setFilters((prev: any) => ({ ...prev, amenities: newAmenities.join(',') }));
    } else {
      setFilters((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (rating: string) => {
    setFilters((prev: any) => ({ ...prev, min_rating: rating }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      city: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      amenities: '',
      sort_by: 'created_at',
      sort_order: 'DESC',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const amenitiesList = [
    { id: 'wifi', label: 'Wi-Fi ฟรี', icon: Wifi },
    { id: 'pool', label: 'สระว่ายน้ำ', icon: Waves },
    { id: 'parking', label: 'ที่จอดรถ', icon: Car },
    { id: 'restaurant', label: 'ห้องอาหาร', icon: Utensils },
    { id: 'gym', label: 'ฟิตเนส', icon: Dumbbell },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-border sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary flex items-center">
          <Filter size={18} className="mr-2" />
          ตัวกรอง
        </h3>
        <button onClick={handleReset} className="text-sm text-secondary hover:underline">
          ล้างทั้งหมด
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Search */}
        <div className="space-y-3">
          <Input
            name="name"
            label="ชื่อที่พัก"
            placeholder="ค้นหาชื่อโรงแรม..."
            value={filters.name || ''}
            onChange={handleChange}
          />
          <Input
            name="city"
            label="เมือง/จังหวัด"
            placeholder="เช่น กรุงเทพฯ, เชียงใหม่"
            value={filters.city || ''}
            onChange={handleChange}
          />
        </div>

        <hr className="border-border" />

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-bold">งบประมาณต่อคืน</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="min_price"
              type="number"
              placeholder="ต่ำสุด"
              value={filters.min_price || ''}
              onChange={handleChange}
              className="h-9"
            />
            <Input
              name="max_price"
              type="number"
              placeholder="สูงสุด"
              value={filters.max_price || ''}
              onChange={handleChange}
              className="h-9"
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Rating Filter */}
        <div className="space-y-3">
          <label className="text-sm font-bold">คะแนนรีวิว</label>
          <div className="flex flex-col gap-2">
            {['4.5', '4.0', '3.5', '3.0'].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="min_rating"
                  checked={filters.min_rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-secondary accent-secondary"
                />
                <span className="text-sm flex items-center group-hover:text-secondary transition-colors">
                  {rating}+ <Star size={12} className="ml-1 fill-yellow-400 text-yellow-400" />
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-sm font-bold">สิ่งอำนวยความสะดวก</label>
          <div className="flex flex-col gap-2">
            {amenitiesList.map((item) => {
              const Icon = item.icon;
              const isChecked = filters.amenities?.split(',').includes(item.id);
              return (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={item.id}
                    checked={isChecked}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-secondary accent-secondary"
                  />
                  <span className="text-sm flex items-center group-hover:text-secondary transition-colors">
                    <Icon size={14} className="mr-2 text-muted-foreground" />
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleApply} className="w-full h-11 rounded-xl shadow-lg shadow-primary/20">
            แสดงผลการค้นหา
          </Button>
        </div>
      </div>
    </div>
  );
};

