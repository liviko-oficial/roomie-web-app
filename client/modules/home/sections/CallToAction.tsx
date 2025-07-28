"use client";
import Image from "next/image";
import React from "react";
type Props = {
  onNavigate?: () => void;
};
const CallToAction = ({ onNavigate }: Props) => {
  return (
    <section className="py-16 bg-brand-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-brand-dark mb-4">
                ¿Tienes una propiedad cerca del Tec?
              </h2>
              <p className="text-lg text-brand-dark mb-6">
                Publica tu propiedad gratis y conecta con estudiantes
                verificados que buscan un lugar como el tuyo.
              </p>

              <ul className="mb-8 space-y-2">
                {[
                  "Publicación gratuita",
                  "Estudiantes verificados",
                  "Contratos seguros",
                  "Soporte personalizado",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-brand-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    <span className="text-brand-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                className="px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold transition duration-300 hover:bg-[#f4c63b] hover:shadow-xl hover:scale-105"
                onClick={() => {
                  console.log("TODO: agregar lógica de navegación aquí");
                  // onNavigate?.(
                  //   "propertyOwnerRegistration",
                  //   null,
                  //   null,
                  //   "propertyOwner"
                  // );
                }}
              >
                Publicar mi propiedad
              </button>
            </div>

            <div className="hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80"
                alt="Publica tu propiedad"
                width={1400}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
