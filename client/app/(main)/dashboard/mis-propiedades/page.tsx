"use client";
import Link from "next/link";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";
import MyPropertiesSections from "@/modules/renter-dashboard/sections/MyPropertiesSections";

export default function MisPropiedades() {
  const { userType } = useAuthContext() as { userType: "student" | "arrendador" | null };

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

  return (
    <>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-brand-dark transition">
          Dashboard
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-brand-dark font-semibold">Mis Propiedades</span>
      </nav>
      <MyPropertiesSections />
    </>
  );
}
