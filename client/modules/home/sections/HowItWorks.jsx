import React from "react";

const steps = [
  {
    id: 1,
    title: "Crea tu perfil",
    description:
      "Regístrate y completa tu perfil con tus preferencias, presupuesto y estilo de vida.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Explora opciones",
    description:
      "Navega por propiedades verificadas y conoce a potenciales roomies compatibles.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Conecta y visita",
    description:
      "Contacta con propietarios o roomies, agenda visitas y resuelve tus dudas.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "¡Múdate feliz!",
    description:
      "Firma tu contrato con confianza y comienza tu nueva etapa con tranquilidad.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-brand-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-dark">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-lg text-brand-dark max-w-3xl mx-auto">
            Encontrar tu hogar ideal cerca del Tec nunca había sido tan fácil y
            seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ id, title, description, icon }) => (
            <div
              key={id}
              className="bg-white p-6 rounded-lg shadow-md text-center transition hover:scale-[1.02]"
            >
              <div className="flex justify-center mb-4 text-brand-accent">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
