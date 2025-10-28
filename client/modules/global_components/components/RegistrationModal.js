import React from 'react';
import Link from "next/link";

const RegistrationModal = ({ isOpen, onClose, onOptionSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo quieres registrarte?</h2>
          <p className="text-gray-600">Selecciona la opción que mejor te describa</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Link
            href={"/students"}
            onClick={onClose}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#ffd662] hover:bg-yellow-50 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffd662] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Soy estudiante</h3>
              <p className="text-sm text-gray-600">Busco un lugar para vivir mientras estudio</p>
            </div>
          </Link>
          
          <Link
            href={"/lessor"}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#ffd662] hover:bg-yellow-50 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffd662] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Busco rentar</h3>
              <p className="text-sm text-gray-600">Tengo una propiedad que quiero rentar</p>
            </div>
          </Link>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition duration-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RegistrationModal; 
