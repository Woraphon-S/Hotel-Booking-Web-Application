'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerService } from '../services/owner.service';
import { useAuthStore } from '@/stores/authStore';
import { PropertyCard } from './PropertyCard';
import { PropertyForm } from './PropertyForm';
import { Button } from '@/components/ui/Button';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';

export const OwnerDashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingProperty, setEditingProperty] = React.useState<any>(null);
  const [modal, setModal] = React.useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const showModal = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setModal({ isOpen: true, title, message, type });
  };

  const { data: properties, isLoading } = useQuery({
    queryKey: ['owner-properties', user?.id],
    queryFn: () => ownerService.getMyProperties(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ownerService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
      setIsAdding(false);
      showModal('สำเร็จ', 'เพิ่มที่พักเรียบร้อยแล้ว');
    },
    onError: (error: any) => {
      showModal('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถเพิ่มที่พักได้', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ownerService.updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
      setEditingProperty(null);
      showModal('สำเร็จ', 'บันทึกการแก้ไขเรียบร้อยแล้ว');
    },
    onError: (error: any) => {
      showModal('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ownerService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
      showModal('สำเร็จ', 'ลบที่พักเรียบร้อยแล้ว');
    },
  });

  if (isLoading) {
    return (
      <div className="flex-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">ที่พักของฉัน</h1>
          <p className="text-muted-foreground mt-1">จัดการข้อมูลที่พักและห้องพักของคุณ</p>
        </div>
        {!isAdding && !editingProperty && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            เพิ่มที่พักใหม่
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8">
          <PropertyForm
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data);
            }}
            onCancel={() => setIsAdding(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      )}

      {editingProperty && (
        <div className="mb-8">
          <PropertyForm
            propertyId={editingProperty.id}
            initialValues={{
              name: editingProperty.name,
              description: editingProperty.description,
              address: editingProperty.address,
              city: editingProperty.city,
              province: editingProperty.province,
              zipCode: editingProperty.zip_code,
              minPrice: editingProperty.min_price > 0 ? Number(editingProperty.min_price) : undefined,
              maxPrice: editingProperty.max_price > 0 ? Number(editingProperty.max_price) : undefined,
              amenities: editingProperty.amenities || [],
              images: editingProperty.images,
            }}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({ id: editingProperty.id, data });
            }}
            onCancel={() => setEditingProperty(null)}
            isLoading={updateMutation.isPending}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property: any) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={() => setEditingProperty(property)}
            onDelete={() => {
              if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบที่พักนี้?')) {
                deleteMutation.mutate(property.id);
              }
            }}
            onManageRooms={(id) => {
              router.push(`/owner/properties/${id}/rooms`);
            }}
          />
        ))}
      </div>

      {properties?.length === 0 && !isAdding && (
        <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed border-border">
          <p className="text-muted-foreground mb-4">คุณยังไม่มีที่พักที่ลงทะเบียนไว้</p>
          <Button variant="outline" onClick={() => setIsAdding(true)}>
            เพิ่มที่พักเครื่องแรกของคุณ
          </Button>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => {
          setModal({ ...modal, isOpen: false });
          if (modal.type === 'success') {
            window.location.reload();
          }
        }}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};
