import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de propiedad",
  description: "Conoce los detalles, fotos y ubicación de esta propiedad disponible en Happy Roomie.",
};

import Link from 'next/link';
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

type FetchOutcome =
  | { kind: "ok"; raw: unknown }
  | { kind: "not_found" }
  | { kind: "network_error" };

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <h2 className="text-2xl font-bold text-brand-dark mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link href="/properties" className="inline-block px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition">
        Ver otras propiedades
      </Link>
    </div>
  </div>
);

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiBase = resolveServerBaseUrl();

  let outcome: FetchOutcome = { kind: "network_error" };
  try {
    const res = await fetch(`${apiBase}/api/propiedades-renta/${id}`, { cache: 'no-store' });
    if (res.status === 404) {
      outcome = { kind: "not_found" };
    } else if (res.ok) {
      const json = await res.json();
      outcome = { kind: "ok", raw: json.data ?? null };
    }
  } catch {
    outcome = { kind: "network_error" };
  }

  if (outcome.kind === "not_found") {
    return <ErrorState title="Esta propiedad ya no está disponible" message="Puede que haya sido despublicada o el enlace sea inválido." />;
  }
  if (outcome.kind === "network_error" || !outcome.raw) {
    return <ErrorState title="No pudimos cargar la información" message="Hubo un problema de conexión. Intenta de nuevo en un momento." />;
  }

  const property = propertySummary(outcome.raw);
  if (!property) {
    return <ErrorState title="Información incompleta" message="Esta propiedad tiene datos faltantes y no podemos mostrarla todavía." />;
  }

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
