import { CheckoutPage } from '@/features/booking/components/CheckoutPage';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckoutPage roomId={parseInt(id)} />;
}
