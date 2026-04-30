"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";
import { arrendadorService } from "@/lib/api/arrendadorService";
import Link from "next/link";
import ConfirmDialog from "@/modules/global_components/components/ConfirmDialog";

type ProfileData = Record<string, unknown> & {
  email?: string;
  fullName?: string;
  telefono?: string;
  phone?: string;
  profile?: {
    profilePicture?: string;
    fullName?: string;
    phone?: string;
  };
};

export default function Perfil() {
  const { userType, logout } = useAuthContext() as {
    userType: "student" | "arrendador" | null;
    logout: () => void;
  };
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoutConfirm = () => {
    setConfirmLogout(false);
    logout();
  };

  useEffect(() => {
    if (userType === "arrendador") {
      const id = localStorage.getItem("arrendadorId");
      if (id) {
        arrendadorService.getProfile(id)
          .then((res) => {
            const data = res.data || res;
            setProfile(data);
            setEditName(data?.profile?.fullName || data?.fullName || "");
            setEditPhone(data?.profile?.phone || data?.telefono || data?.phone || "");
          })
          .catch(() => setErrorToast("No pudimos cargar tu perfil. Intenta recargar la página."))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [userType]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = localStorage.getItem("arrendadorId");
    if (!id) return;
    setUploadingPhoto(true);
    try {
      const res = await arrendadorService.uploadProfilePhoto(id, file);
      const url = res?.data?.profilePicture || res?.profilePicture;
      if (url) {
        setProfile((prev) => prev ? { ...prev, profile: { ...(prev.profile || {}), profilePicture: url } } : prev);
        setSavedToast("Foto de perfil actualizada");
      }
    } catch {
      setErrorToast("No pudimos subir la foto. Intenta de nuevo.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    const id = localStorage.getItem("arrendadorId");
    if (!id) return;
    setSaving(true);
    try {
      await arrendadorService.updateProfile(id, {
        fullName: editName,
        phone: editPhone,
      });
      setProfile((prev) => prev ? {
        ...prev,
        profile: { ...(prev.profile || {}), fullName: editName, phone: editPhone }
      } : prev);
      setEditing(false);
      setSavedToast("Perfil actualizado");
    } catch {
      setErrorToast("No pudimos guardar los cambios. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!savedToast) return;
    const t = setTimeout(() => setSavedToast(null), 2500);
    return () => clearTimeout(t);
  }, [savedToast]);

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

  const email = profile?.email || localStorage.getItem("userEmail") || "";
  const fullName = profile?.profile?.fullName || profile?.fullName || "";
  const telefono = profile?.profile?.phone || profile?.telefono || profile?.phone || "";
  const photoUrl = profile?.profile?.profilePicture || null;
  const displayName = fullName || email;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Mi Perfil</h1>

        {savedToast && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex justify-between items-center">
            <span>{savedToast}</span>
            <button onClick={() => setSavedToast(null)} className="ml-4 font-bold">×</button>
          </div>
        )}
        {errorToast && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex justify-between items-center">
            <span>{errorToast}</span>
            <button onClick={() => setErrorToast(null)} className="ml-4 font-bold">×</button>
          </div>
        )}

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
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="relative w-16 h-16 rounded-full bg-brand-accent/30 flex items-center justify-center text-2xl font-bold text-brand-dark overflow-hidden group disabled:opacity-50"
              title="Cambiar foto de perfil"
            >
              {uploadingPhoto ? (
                <div className="w-6 h-6 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
              ) : photoUrl ? (
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

          {editing ? (
            <div className="grid gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">Nombre completo</label>
                <input
                  id="fullName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="10 dígitos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Correo electrónico</label>
                <p className="text-brand-dark">{email}</p>
                <p className="text-xs text-gray-400 mt-1">El correo no se puede cambiar.</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-accent text-brand-dark font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditName(fullName);
                    setEditPhone(telefono);
                  }}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-brand-dark font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
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
              {userType === "arrendador" && (
                <button
                  onClick={() => setEditing(true)}
                  className="self-start mt-1 text-sm text-brand-accent hover:text-brand-dark font-semibold"
                >
                  ✎ Editar perfil
                </button>
              )}
            </div>
          )}

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
              onClick={() => setConfirmLogout(true)}
              className="px-5 py-2.5 rounded-xl border-2 border-red-400 text-red-600 font-semibold hover:bg-red-50 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmLogout}
        title="¿Cerrar sesión?"
        message="Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmLabel="Cerrar sesión"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
