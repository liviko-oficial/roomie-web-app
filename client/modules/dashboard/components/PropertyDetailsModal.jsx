"use client";
import React, { useState, useEffect } from "react";
import { X, MapPin, User, Calendar, DollarSign } from "lucide-react";
import { statusLabels, offerStatusLabels } from "../mock/requests";

const REJECTION_REASONS = {
  landlord: [
    "Oferta muy baja",
    "Oferta inaceptable",
    "Prefiero no decir",
  ],
  student: [
    "Precio muy alto para lo que ofrece",
    "No incluye muebles y el precio no corresponde",
    "No incluye servicios y el precio no corresponde",
    "Malas reseñas del anfitrión o del alojamiento",
    "Ya encontré otras opciones",
    "Muy lejos del campus (costos extra de traslado) para el precio",
  ],
};

const formatPrice = (v) =>
  typeof v === "number" ? v.toLocaleString("es-MX") : v;

const PropertyDetailsModal = ({ request, onClose, role = "student", onAcceptOffer, onRejectOffer }) => {
  const [showRejectReasons, setShowRejectReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  useEffect(() => {
    setShowRejectReasons(false);
    setSelectedReason(null);
  }, [request]);

  if (!request) return null;
  const { property, status, offerStatus, offerAmount, createdAt, message } = request;

  const person = role === "student" ? request.landlord : request.tenant;
  const personLabel = role === "student" ? "Arrendador" : "Inquilino";
  const messageLabel = role === "student" ? "Mensaje del arrendador" : "Mensaje del inquilino";
  const initialOfferLabel = role === "student" ? "Oferta inicial del arrendador" : "Oferta inicial";

  const canActOnOffer = offerAmount != null && offerStatus === "contraoferta_por_revisar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
          <div className="absolute bottom-3 left-3 bg-brand-accent text-brand-dark text-sm font-bold px-3 py-1 rounded-md">
            {statusLabels[status]}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{property.title}</h2>
            <div className="flex items-center gap-1 mt-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                Precio mensual
              </div>
              <p className="text-xl font-bold text-brand-dark">
                ${formatPrice(property.price)}
              </p>
              {property.initialOffer && (
                <p className="text-xs text-gray-600 mt-1">
                  {initialOfferLabel}: ${formatPrice(property.initialOffer)}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                Solicitud creada
              </div>
              <p className="text-sm font-semibold text-brand-dark">{createdAt}</p>
              <p className="text-xs text-gray-600 mt-1">
                Estado de oferta: {offerStatusLabels[offerStatus]}
              </p>
              {offerAmount && (
                <p className="text-xs text-brand-dark font-bold mt-1">
                  Oferta actual: ${formatPrice(offerAmount)}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-brand-dark mb-3">{personLabel}</h3>
            <div className="flex items-center gap-3">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  Contacto
                </div>
                <p className="font-semibold text-brand-dark">{person.name}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                  <span>{person.email}</span>
                  <span>{person.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-brand-dark mb-2">{messageLabel}</h3>
            <p className="text-sm text-gray-700 italic">"{message}"</p>
          </div>

          {canActOnOffer && (
            <div className="border-t border-gray-100 pt-4">
              {showRejectReasons ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-brand-dark">Motivo del rechazo</h3>
                  <div className="space-y-2">
                    {REJECTION_REASONS[role].map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition ${
                          selectedReason === reason
                            ? "border-brand-dark bg-brand-dark/5 font-medium text-brand-dark"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setShowRejectReasons(false); setSelectedReason(null); }}
                      className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!selectedReason}
                      onClick={() => { onRejectOffer?.(request, selectedReason); onClose(); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                        selectedReason ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Confirmar rechazo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => onAcceptOffer?.(request)}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition"
                  >
                    Aceptar oferta
                  </button>
                  <button
                    onClick={() => setShowRejectReasons(true)}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition"
                  >
                    Rechazar oferta
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
