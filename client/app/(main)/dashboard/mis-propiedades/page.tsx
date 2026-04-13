"use client";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";
import MyPropertiesSections from "@/modules/renter-dashboard/sections/MyPropertiesSections";

export default function MisPropiedades() {
  const { userType } = useAuthContext();

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Inicia sesión para ver tus propiedades</h2>
          <p className="text-gray-600">Accede a tu cuenta de arrendador para gestionar tus propiedades.</p>
        </div>
      </div>
    );
  }

  if (userType !== "arrendador") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Acceso no disponible</h2>
          <p className="text-gray-600">Esta sección está disponible únicamente para arrendadores.</p>
        </div>
      </div>
    );
  }

  return <MyPropertiesSections />;
}
