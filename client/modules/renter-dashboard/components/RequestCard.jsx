"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, User, CheckCircle, XCircle, Send } from "lucide-react";
import { statusLabels, offerStatusLabels } from "../mock/requests";

// Tarjeta de solicitud - muestra propiedad, arrendatario y estado
// index se usa para la animacion escalonada de entrada
const RequestCard = ({ request, index }) => {
  const { tenant, property, status, offerStatus, offerAmount, createdAt, message } = request;

  // Estado local para manejar flujo de aceptar / contraoferta
  const [cardState, setCardState] = useState("idle"); // idle | accepted | counteroffering
  const [counterAmount, setCounterAmount] = useState("");

  const showOfferActions =
    status === "en_proceso" && offerStatus === "contraoferta_por_revisar";

  const handleAcceptOffer = () => {
    // TODO: conectar con lógica de aceptar oferta
    console.log("Oferta aceptada:", request.id);
    setCardState("accepted");
  };

  const handleStartCounteroffer = () => {
    setCardState("counteroffering");
  };

  const handleSendCounteroffer = () => {
    if (!counterAmount) return;
    // TODO: conectar con lógica de enviar contraoferta
    console.log("Contraoferta enviada:", request.id, counterAmount);
    setCardState("idle");
  };

  const handleRejectFromCounter = () => {
    // TODO: conectar con lógica de rechazar oferta
    console.log("Oferta rechazada:", request.id);
    setCardState("idle");
  };

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

  // Render de la zona de acciones segun estado del card
  const renderActions = () => {
    // Estado: oferta aceptada
    if (cardState === "accepted") {
      return (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-md">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              ¡Oferta aceptada!
            </span>
          </div>
        </div>
      );
    }

    // Estado: ingresando contraoferta
    if (cardState === "counteroffering") {
      return (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">$</span>
            <input
              type="number"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder="Cantidad"
              className="w-full pl-6 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent text-brand-dark placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRejectFromCounter}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition"
            >
              <XCircle className="w-3 h-3" />
              Rechazar
            </button>
            <button
              onClick={handleSendCounteroffer}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-brand-accent text-brand-dark rounded text-xs font-medium hover:bg-yellow-400 transition"
            >
              <Send className="w-3 h-3" />
              Contraoferta
            </button>
          </div>
        </div>
      );
    }

    // Estado por defecto: mostrar botones aceptar / contraoferta
    if (showOfferActions) {
      return (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleAcceptOffer}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition"
          >
            <CheckCircle className="w-3 h-3" />
            Aceptar oferta
          </button>
          <button
            onClick={handleStartCounteroffer}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-brand-accent text-brand-dark rounded text-xs font-medium hover:bg-yellow-400 transition"
          >
            <Send className="w-3 h-3" />
            Contraoferta
          </button>
        </div>
      );
    }

    // Sin oferta pendiente: botones de contacto
    return (
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <a
          href={`mailto:${tenant.email}`}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-brand-dark rounded text-xs font-medium hover:bg-gray-200 transition"
        >
          <Mail className="w-3 h-3" />
          Email
        </a>
        <a
          href={`tel:${tenant.phone.replace(/\s/g, "")}`}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-brand-accent text-brand-dark rounded text-xs font-medium hover:bg-yellow-400 transition"
        >
          <Phone className="w-3 h-3" />
          Llamar
        </a>
      </div>
    );
  };

  return (
    <div
      className="bg-white font-sans rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideIn w-full h-[456px] flex flex-col"
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

        {/* Info del arrendatario */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
          <img
            src={tenant.avatar}
            alt={tenant.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Arrendatario</span>
            </div>
            <p className="text-sm font-medium text-brand-dark truncate">{tenant.name}</p>
          </div>
        </div>

        {/* Mensaje del arrendatario */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic flex-1">
          &ldquo;{message}&rdquo;
        </p>

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

        {/* Acciones */}
        {renderActions()}
      </div>
    </div>
  );
};

export default RequestCard;
