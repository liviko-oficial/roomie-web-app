"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";
import { petitionService } from "@/lib/api/petitionService";
import { mapStudentPetition, mapLandlordPetition } from "@/modules/dashboard/utils/petitionMapper";

import DashboardHeader from "@/modules/dashboard/sections/DashboardHeader";
import RequestColumns from "@/modules/dashboard/sections/RequestColumns";

import RenterDashboardHeader from "@/modules/dashboard/rentero/sections/RenterDashboardHeader";
import RenterRequestColumns from "@/modules/dashboard/rentero/sections/RenterRequestColumns";

export default function Dashboard() {
  const { userType } = useAuthContext();
  const [requests, setRequests] = useState<Array<{ id: string; status: string; offerStatus: string; [key: string]: unknown }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!userType) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (userType === "student") {
          const userId = localStorage.getItem("userId");
          if (!userId) return;
          const res = await petitionService.getByStudent(userId);
          setRequests((res.data || []).map(mapStudentPetition));
        } else if (userType === "arrendador") {
          const arrendadorId = localStorage.getItem("arrendadorId");
          if (!arrendadorId) return;
          const res = await petitionService.getByLandlord(arrendadorId);
          setRequests((res.data || []).map(mapLandlordPetition));
        }
      } catch (err) {
        console.error("Error fetching petitions:", err);
        setError("No pudimos cargar tus solicitudes. Verifica tu conexión e intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userType, refreshKey]);

  const handleAccept = async (req: { id: string }) => {
    const landlordId = localStorage.getItem("arrendadorId");
    if (!landlordId) return;
    try {
      await petitionService.accept(req.id, landlordId);
      refresh();
    } catch (err) {
      console.error("Error accepting:", err);
      setActionError("No pudimos aceptar la solicitud. Intenta de nuevo.");
    }
  };

  const handleReject = async (req: { id: string }, reason: string) => {
    const landlordId = localStorage.getItem("arrendadorId");
    if (!landlordId) return;
    try {
      await petitionService.reject(req.id, landlordId, reason);
      refresh();
    } catch (err) {
      console.error("Error rejecting:", err);
      setActionError("No pudimos rechazar la solicitud. Intenta de nuevo.");
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Inicia sesion para ver tu dashboard</h2>
          <p className="text-gray-600">Accede a tu cuenta para gestionar tus solicitudes y propiedades.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Algo salió mal</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={refresh} className="px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition shadow-md">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const counts = {
    enProceso: requests.filter((r) => r.status === "en_proceso").length,
    aprobadas: requests.filter((r) => r.status === "aprobada").length,
    rechazadas: requests.filter((r) => r.status === "rechazada").length,
  };

  if (requests.length === 0) {
    const Header = userType === "arrendador" ? RenterDashboardHeader : DashboardHeader;
    return (
      <>
        <Header counts={counts} />
        <div className="text-center py-20 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            {userType === "arrendador" ? "Aún no tienes solicitudes" : "Aún no has enviado solicitudes"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {userType === "arrendador"
              ? "Cuando los estudiantes apliquen a tus propiedades, sus solicitudes aparecerán aquí."
              : "Explora las propiedades disponibles y envía tu primera solicitud."}
          </p>
          {userType === "student" ? (
            <Link href="/properties" className="inline-block px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition">
              Buscar propiedades
            </Link>
          ) : (
            <Link href="/registrar-propiedad" className="inline-block px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition">
              Registrar propiedad
            </Link>
          )}
        </div>
      </>
    );
  }

  const ActionErrorBanner = () => actionError ? (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 max-w-7xl mx-auto mt-4 rounded-md flex justify-between items-center">
      <span>{actionError}</span>
      <button onClick={() => setActionError(null)} className="text-red-500 hover:text-red-700 ml-4 font-bold">×</button>
    </div>
  ) : null;

  if (userType === "arrendador") {
    return (
      <>
        <RenterDashboardHeader counts={counts} />
        <ActionErrorBanner />
        <RenterRequestColumns requests={requests} onAccept={handleAccept} onReject={handleReject} onRefresh={refresh} />
      </>
    );
  }

  return (
    <>
      <DashboardHeader counts={counts} />
      <ActionErrorBanner />
      <RequestColumns requests={requests} onCounterOfferSubmit={() => {}} onRefresh={refresh} />
    </>
  );
}
