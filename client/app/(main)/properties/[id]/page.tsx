import PropertyDetail from '@/modules/home/sections/PropertyDetail';
import BaseLayaout from './BaseLayout';
import { properties } from '@/modules/home/mock/properties';
import { propertySummary } from "@/modules/home/mappers/propertySummary";
import PropertyExtraCharacteristics from "@/modules/home/components/propertyExtraComponents/propertyExtraCharacteristics"
import PropertyExtraSection from "@/modules/home/components/propertyExtraComponents/propertyExtraSection"

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  
  const raw = properties.find((p) => p.id === Number(id));
  if (!raw) return <p>No se encontró el id.</p>;
  const property = propertySummary(raw);
  if (!property) return <p>No se encontró la propiedad.</p>;

  return (
      <BaseLayaout property={property} 
        CaracteristicaExtra={
          property.type == "Casa" ?
            <PropertyExtraCharacteristics property={property}/> : null} 
         SeccionesExtra={
          property.type == "Casa" ?
          <PropertyExtraSection property={property}/> : null} 
      />
  );
}

