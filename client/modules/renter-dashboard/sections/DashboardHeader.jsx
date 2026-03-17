"use client";
import React from "react";
import { ClipboardList } from "lucide-react";

// Header del dashboard con titulo y contadores de solicitudes recibidas
const DashboardHeader = ({ counts }) => {
  return (
    <div className="bg-brand-accent pt-32 pb-8 md:pt-40 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-8 h-8 text-brand-dark" />
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
                Solicitudes Recibidas
              </h1>
            </div>
            <p className="text-brand-dark text-lg">
              Revisa las solicitudes de tus propiedades y mantente en contacto con los arrendatarios.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">En proceso</span>
              <p className="text-2xl font-bold text-brand-dark">{counts.enProceso}</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <p className="text-2xl font-bold text-green-600">{counts.aprobadas}</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Rechazadas</span>
              <p className="text-2xl font-bold text-red-600">{counts.rechazadas}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
