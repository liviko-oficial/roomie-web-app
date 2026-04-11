"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

const DeletePropertyModal = ({ property, onCancel, onConfirm }) => {
  if (!property) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            ¿Estás seguro de eliminar esta propiedad?
          </h3>
          <p className="text-gray-600">
            Esta acción no se puede deshacer. La propiedad{" "}
            <span className="font-semibold">{property.title}</span> será eliminada permanentemente.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-100 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePropertyModal;
