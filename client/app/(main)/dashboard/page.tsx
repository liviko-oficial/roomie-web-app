"use client";
import { useEffect, useState } from "react";
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
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!userType) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
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

  const counts = {
    enProceso: requests.filter((r) => r.status === "en_proceso").length,
    aprobadas: requests.filter((r) => r.status === "aprobada").length,
    rechazadas: requests.filter((r) => r.status === "rechazada").length,
  };

  if (userType === "arrendador") {
    return (
      <>
        <RenterDashboardHeader counts={counts} />
        <RenterRequestColumns requests={requests} onAccept={handleAccept} onReject={handleReject} onRefresh={refresh} />
      </>
    );
  }

  return (
    <>
      <DashboardHeader counts={counts} />
      <RequestColumns requests={requests} onCounterOfferSubmit={() => {}} onRefresh={refresh} />
    </>
  );
}
