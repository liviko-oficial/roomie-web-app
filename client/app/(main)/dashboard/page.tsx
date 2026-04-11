"use client";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";

import DashboardHeader from "@/modules/dashboard/sections/DashboardHeader";
import RequestColumns from "@/modules/dashboard/sections/RequestColumns";
import { requests } from "@/modules/dashboard/mock/requests";

import RenterDashboardHeader from "@/modules/dashboard/rentero/sections/RenterDashboardHeader";
import RenterRequestColumns from "@/modules/dashboard/rentero/sections/RenterRequestColumns";
import { renterRequests } from "@/modules/dashboard/rentero/mock/renterRequests";

export default function Dashboard() {
  const { userType } = useAuthContext();

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Inicia sesión para ver tu dashboard</h2>
          <p className="text-gray-600">Accede a tu cuenta para gestionar tus solicitudes y propiedades.</p>
        </div>
      </div>
    );
  }

  if (userType === "arrendador") {
    const counts = {
      enProceso: renterRequests.filter((r) => r.status === "en_proceso").length,
      aprobadas: renterRequests.filter((r) => r.status === "aprobada").length,
      rechazadas: renterRequests.filter((r) => r.status === "rechazada").length,
    };

    return (
      <>
        <RenterDashboardHeader counts={counts} />
        <RenterRequestColumns requests={renterRequests} />
      </>
    );
  }

  const counts = {
    enProceso: requests.filter((r) => r.status === "en_proceso").length,
    aprobadas: requests.filter((r) => r.status === "aprobada").length,
    rechazadas: requests.filter((r) => r.status === "rechazada").length,
  };

  return (
    <>
      <DashboardHeader counts={counts} />
      <RequestColumns requests={requests} />
    </>
  );
}
