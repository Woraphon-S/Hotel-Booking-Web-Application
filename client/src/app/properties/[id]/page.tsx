import { PropertyDetailsView } from '@/features/search/components/PropertyDetailsView';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyDetailsView propertyId={parseInt(id)} />;
}
