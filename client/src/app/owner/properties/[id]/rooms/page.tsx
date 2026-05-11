import { OwnerRoomManager } from '@/features/owner/components/OwnerRoomManager';

export default async function OwnerPropertyRoomsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OwnerRoomManager propertyId={parseInt(id)} />;
}
