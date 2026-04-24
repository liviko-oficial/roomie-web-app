"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";
import { arrendadorService } from "@/lib/api/arrendadorService";
import Link from "next/link";

export default function Perfil() {
  const { userType, logout } = useAuthContext();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("profilePhoto");
    if (saved) setPhotoUrl(saved);

    if (userType === "arrendador") {
      const id = localStorage.getItem("arrendadorId");
      if (id) {
        arrendadorService.getProfile(id)
          .then((res) => setProfile(res.data || res))
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [userType]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem("profilePhoto", result);
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Inicia sesión para ver tu perfil</h2>
          <p className="text-gray-600">Accede a tu cuenta para gestionar tu información.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const email = (profile?.email as string) || localStorage.getItem("userEmail") || "";
  const fullName = (profile?.fullName as string) || "";
  const telefono = (profile?.telefono as string) || "";
  const displayName = fullName || email;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Mi Perfil</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full bg-brand-accent/30 flex items-center justify-center text-2xl font-bold text-brand-dark overflow-hidden group"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </button>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">{displayName}</h2>
              <p className="text-sm text-gray-500 capitalize">{userType}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Correo electrónico</label>
              <p className="text-brand-dark">{email}</p>
            </div>
            {telefono && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                <p className="text-brand-dark">{telefono}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-brand-accent text-brand-dark font-semibold hover:bg-yellow-400 transition">
              Mi Dashboard
            </Link>
            {userType === "arrendador" && (
              <Link href="/dashboard/mis-propiedades" className="px-5 py-2.5 rounded-xl border border-gray-200 text-brand-dark font-semibold hover:border-gray-300 transition">
                Mis propiedades
              </Link>
            )}
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl border-2 border-red-400 text-red-600 font-semibold hover:bg-red-50 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
