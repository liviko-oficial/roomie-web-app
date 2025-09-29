import PropertyDetail from '@/modules/home/sections/PropertyDetail';
import BaseLayaout from './BaseLayout';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  

  return (
      <BaseLayaout id={id} />
  );
}

