"use client";
import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import RequestCard from "../components/RequestCard";

// Secciones horizontales de solicitudes agrupadas por estado
const RequestColumns = ({ requests }) => {
  // En proceso: ordenadas de mas antigua a mas reciente
  const enProceso = requests
    .filter((r) => r.status === "en_proceso")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const aprobadas = requests.filter((r) => r.status === "aprobada");
  const rechazadas = requests.filter((r) => r.status === "rechazada");

  const SectionHeader = ({ icon: Icon, title, count, colorClass }) => (
    <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${colorClass}`}>
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-bold text-brand-dark">{title}</h2>
      <span className="ml-2 bg-gray-100 text-brand-dark text-sm font-medium px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-8 text-gray-400 w-full">
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans space-y-8">
        {/* Seccion: En Proceso */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={Clock}
            title="En proceso"
            count={enProceso.length}
            colorClass="border-brand-accent text-brand-dark"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {enProceso.length > 0 ? (
              enProceso.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes en proceso" />
            )}
          </div>
        </div>

        {/* Seccion: Aprobadas */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={CheckCircle}
            title="Aprobadas"
            count={aprobadas.length}
            colorClass="border-green-500 text-green-600"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {aprobadas.length > 0 ? (
              aprobadas.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes aprobadas" />
            )}
          </div>
        </div>

        {/* Seccion: Rechazadas */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader
            icon={XCircle}
            title="Rechazadas"
            count={rechazadas.length}
            colorClass="border-red-500 text-red-600"
          />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {rechazadas.length > 0 ? (
              rechazadas.map((request, index) => (
                <div key={request.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                  <RequestCard request={request} index={index} />
                </div>
              ))
            ) : (
              <EmptyState message="No hay solicitudes rechazadas" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestColumns;
