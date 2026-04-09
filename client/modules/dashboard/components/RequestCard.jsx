"use client";
import React from "react";
import { Mail, Phone, MapPin, Calendar, User, Repeat } from "lucide-react";
import { statusLabels, offerStatusLabels } from "../mock/requests";

const MAX_COUNTEROFFERS = 2;

// Tarjeta de solicitud - muestra propiedad, inquilino y estado
// index se usa para la animacion escalonada de entrada
const RequestCard = ({ request, index, onCounterOffer }) => {
  const { landlord, property, status, offerStatus, offerAmount, createdAt, message, counterOffersMade = 0 } = request;
  const hasActiveOffer = offerAmount != null && offerStatus !== "sin_oferta";
  const counterDisabled = !hasActiveOffer || counterOffersMade >= MAX_COUNTEROFFERS;

  // Estilos del badge segun estado de solicitud (en_proceso, aprobada, rechazada)
  const getStatusStyles = () => {
    switch (status) {
      case "en_proceso":
        return "bg-brand-accent text-brand-dark";
      case "aprobada":
        return "bg-green-500 text-white";
      case "rechazada":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Estilos del badge segun estado de oferta
  const getOfferStatusStyles = () => {
    switch (offerStatus) {
      case "sin_oferta":
        return "bg-gray-100 text-gray-600";
      case "contraoferta_por_revisar":
        return "bg-yellow-100 text-yellow-800";
      case "oferta_aceptada":
        return "bg-green-100 text-green-800";
      case "oferta_rechazada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatPrice = (value) =>
    typeof value === "number" ? value.toLocaleString("es-MX") : value;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  };

  return (
    <div
      className="bg-white font-sans rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideIn w-full h-[470px] flex flex-col"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* Imagen de la propiedad */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-32 object-cover"
        />
        <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-md ${getStatusStyles()}`}>
          {statusLabels[status]}
        </div>
        <div className="absolute bottom-2 right-2 bg-white text-brand-dark text-xs font-bold px-2 py-1 rounded-md">
          ${formatPrice(property.price)}/mes
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Info de la propiedad */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-brand-dark">{property.title}</h3>
            <p className="text-xs text-gray-500">{property.address}</p>
          </div>
        </div>

        {/* Info del arrendador */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
          <img
            src={landlord.avatar}
            alt={landlord.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Inquilino</span>
            </div>
            <p className="text-sm font-medium text-brand-dark truncate">{landlord.name}</p>
          </div>
        </div>

        {/* Mensaje del inquilino */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic flex-1">
          "{message}"
        </p>

        {/* Boton de contraoferta - solo habilitado si hay oferta activa */}
        <button
          onClick={() => !counterDisabled && onCounterOffer?.(request)}
          disabled={counterDisabled}
          title={
            !hasActiveOffer
              ? "Sin oferta activa"
              : counterOffersMade >= MAX_COUNTEROFFERS
              ? "Límite de contraofertas alcanzado"
              : "Hacer contraoferta"
          }
          className={`flex items-center justify-center gap-1 w-full mb-3 px-2 py-1.5 rounded text-xs font-semibold transition ${
            counterDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-brand-dark text-white hover:bg-brand-dark/90"
          }`}
        >
          <Repeat className="w-3 h-3" />
          Contraoferta {counterOffersMade}/{MAX_COUNTEROFFERS}
        </button>

        {/* Oferta y fecha */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-medium px-2 py-1 rounded ${getOfferStatusStyles()}`}>
              {offerStatusLabels[offerStatus]}
            </span>
            {offerAmount && (
              <span className="text-xs text-brand-dark font-bold">
                Oferta: ${formatPrice(offerAmount)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Contacto rapido */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <a
            href={`mailto:${landlord.email}`}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-brand-dark rounded text-xs font-medium hover:bg-gray-200 transition"
          >
            <Mail className="w-3 h-3" />
            Email
          </a>
          <a
            href={`tel:${landlord.phone.replace(/\s/g, "")}`}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-brand-accent text-brand-dark rounded text-xs font-medium hover:bg-yellow-400 transition"
          >
            <Phone className="w-3 h-3" />
            Llamar
          </a>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
