"use client";
import React from "react";
import { X, MapPin, User, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { statusLabels, offerStatusLabels } from "../mock/requests";

const formatPrice = (v) =>
  typeof v === "number" ? v.toLocaleString("es-MX") : v;

const PropertyDetailsModal = ({ request, onClose }) => {
  if (!request) return null;
  const { property, landlord, status, offerStatus, offerAmount, createdAt, message } = request;

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
                  Oferta inicial del arrendador: ${formatPrice(property.initialOffer)}
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
            <h3 className="text-sm font-bold text-brand-dark mb-3">Arrendador</h3>
            <div className="flex items-center gap-3">
              <img
                src={landlord.avatar}
                alt={landlord.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  Contacto
                </div>
                <p className="font-semibold text-brand-dark">{landlord.name}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                  <a href={`mailto:${landlord.email}`} className="flex items-center gap-1 hover:text-brand-dark">
                    <Mail className="w-3 h-3" />
                    {landlord.email}
                  </a>
                  <a href={`tel:${landlord.phone.replace(/\s/g, "")}`} className="flex items-center gap-1 hover:text-brand-dark">
                    <Phone className="w-3 h-3" />
                    {landlord.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-brand-dark mb-2">Mensaje del arrendador</h3>
            <p className="text-sm text-gray-700 italic">"{message}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
