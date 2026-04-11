"use client";
import React from "react";
import { MapPin, Calendar, User, Repeat } from "lucide-react";
import { renterStatusLabels, renterOfferStatusLabels } from "../mock/renterRequests";

const MAX_COUNTEROFFERS = 2;

const RenterRequestCard = ({ request, index, onViewDetails, onCounterOffer }) => {
  const { tenant, property, status, offerStatus, offerAmount, createdAt, message, counterOffersMade = 0 } = request;
  const hasActiveOffer = offerAmount != null && offerStatus !== "sin_oferta";
  const isRechazada = status === "rechazada";

  const showCounterOffer = !isRechazada && hasActiveOffer;
  const counterDisabled = counterOffersMade >= MAX_COUNTEROFFERS;

  const handleCardClick = () => onViewDetails?.(request);
  const stop = (e) => e.stopPropagation();

  const getStatusStyles = () => {
    switch (status) {
      case "en_proceso": return "bg-brand-accent text-brand-dark";
      case "aprobada": return "bg-green-500 text-white";
      case "rechazada": return "bg-red-500 text-white";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getOfferStatusStyles = () => {
    switch (offerStatus) {
      case "sin_oferta": return "bg-gray-100 text-gray-600";
      case "contraoferta_por_revisar": return "bg-yellow-100 text-yellow-800";
      case "oferta_aceptada": return "bg-green-100 text-green-800";
      case "oferta_rechazada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const formatPrice = (v) => typeof v === "number" ? v.toLocaleString("es-MX") : v;
  const formatDate = (d) => new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short" });

  return (
    <div
      onClick={handleCardClick}
      className="bg-white font-sans rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideIn w-full h-[420px] flex flex-col cursor-pointer"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
    >
      <div className="relative">
        <img src={property.image} alt={property.title} className="w-full h-32 object-cover" />
        <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-md ${getStatusStyles()}`}>
          {renterStatusLabels[status]}
        </div>
        <div className="absolute bottom-2 right-2 bg-white text-brand-dark text-xs font-bold px-2 py-1 rounded-md">
          ${formatPrice(property.price)}/mes
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-brand-dark">{property.title}</h3>
            <p className="text-xs text-gray-500">{property.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
          <img src={tenant.avatar} alt={tenant.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Inquilino</span>
            </div>
            <p className="text-sm font-medium text-brand-dark truncate">{tenant.name}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic flex-1">"{message}"</p>

        {showCounterOffer && (
          <button
            onClick={(e) => { stop(e); if (!counterDisabled) onCounterOffer?.(request); }}
            disabled={counterDisabled}
            className={`flex items-center justify-center gap-1 w-full mb-3 px-2 py-1.5 rounded text-xs font-semibold transition ${
              counterDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-brand-dark text-white hover:bg-brand-dark/90"
            }`}
          >
            <Repeat className="w-3 h-3" />
            Contraoferta {counterOffersMade}/{MAX_COUNTEROFFERS}
          </button>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-medium px-2 py-1 rounded ${getOfferStatusStyles()}`}>
              {renterOfferStatusLabels[offerStatus]}
            </span>
            {offerAmount && (
              <span className="text-xs text-brand-dark font-bold">Oferta: ${formatPrice(offerAmount)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterRequestCard;
