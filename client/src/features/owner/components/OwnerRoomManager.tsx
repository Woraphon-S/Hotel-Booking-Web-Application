'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerService } from '../services/owner.service';
import { RoomForm } from './RoomForm';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface OwnerRoomManagerProps {
  propertyId: number;
}

export const OwnerRoomManager = ({ propertyId }: OwnerRoomManagerProps) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<any>(null);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['property-rooms', propertyId],
    queryFn: () => ownerService.getRooms(propertyId),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ownerService.createRoom({ ...data, propertyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-rooms', propertyId] });
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ownerService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-rooms', propertyId] });
      setEditingRoom(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ownerService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-rooms', propertyId] });
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
      <Link href="/owner/dashboard" className="inline-flex items-center text-secondary hover:underline mb-6">
        <ChevronLeft size={16} className="mr-1" />
        กลับไปยังแผงควบคุม
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">จัดการห้องพัก</h1>
          <p className="text-muted-foreground mt-1">รหัสที่พัก: {propertyId}</p>
        </div>
        {!isAdding && !editingRoom && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={20} className="mr-2" />
            เพิ่มห้องพักใหม่
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8">
          <RoomForm
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data);
            }}
            onCancel={() => setIsAdding(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      )}

      {editingRoom && (
        <div className="mb-8">
          <RoomForm
            initialValues={{
              name: editingRoom.name,
              description: editingRoom.description,
              type: editingRoom.type,
              pricePerNight: Number(editingRoom.price_per_night),
              capacity: editingRoom.capacity,
              totalRooms: editingRoom.total_rooms,
              imageUrl: editingRoom.image_url,
            }}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({ id: editingRoom.id, data });
            }}
            onCancel={() => setEditingRoom(null)}
            isLoading={updateMutation.isPending}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-primary">ชื่อห้อง</th>
              <th className="px-6 py-3 text-sm font-semibold text-primary">ประเภท</th>
              <th className="px-6 py-3 text-sm font-semibold text-primary text-right">ราคา/คืน</th>
              <th className="px-6 py-3 text-sm font-semibold text-primary text-center">ความจุ</th>
              <th className="px-6 py-3 text-sm font-semibold text-primary text-center">จำนวนห้อง</th>
              <th className="px-6 py-3 text-sm font-semibold text-primary text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rooms?.map((room: any) => (
              <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{room.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{room.type}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-secondary">
                  ฿{Number(room.price_per_night).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">{room.capacity} ท่าน</td>
                <td className="px-6 py-4 text-sm text-center">{room.total_rooms} ห้อง</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRoom(room)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => {
                      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบห้องพักนี้?')) {
                        deleteMutation.mutate(room.id);
                      }
                    }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {rooms?.length === 0 && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            ยังไม่มีรายการห้องพักในที่พักนี้
          </div>
        )}
      </div>
    </div>
  );
};
