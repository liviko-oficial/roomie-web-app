import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de propiedad",
  description: "Conoce los detalles, fotos y ubicación de esta propiedad disponible en Happy Roomie.",
};

import PropertyDetail from '@/modules/home/sections/PropertyDetail';
import BaseLayaout from './BaseLayout';
import { propertySummary } from "@/modules/home/mappers/propertySummary";
import PropertyExtraCharacteristics from "@/modules/home/components/propertyExtraComponents/propertyExtraCharacteristics"
import PropertyExtraSection from "@/modules/home/components/propertyExtraComponents/propertyExtraSection"

function resolveServerBaseUrl(): string {
  const fromProxy = process.env.BACKEND_PROXY_TARGET;
  if (fromProxy) return fromProxy;
  const fromPublic = process.env.NEXT_PUBLIC_API_URL;
  if (fromPublic) return fromPublic;
  return 'http://localhost:3001';
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiBase = resolveServerBaseUrl();

  let raw = null;
  try {
    const res = await fetch(`${apiBase}/api/propiedades-renta/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      raw = json.data ?? null;
    }
  } catch {
    // fetch failed
  }

  if (!raw) return <p>No se encontró la propiedad.</p>;
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
