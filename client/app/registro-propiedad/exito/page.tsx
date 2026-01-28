'use client';

import Link from 'next/link';

/**
 * Success Page Component
 * Shown after successful property registration
 */
export default function RegistroExito() {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-lg border border-[#042a5c]/10 shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#fdd76c] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#042a5c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#042a5c] mb-3">
              ¡Propiedad registrada!
            </h1>
            <p className="text-[#042a5c]/70 text-lg">
              Tu propiedad ha sido registrada exitosamente y está siendo revisada por nuestro equipo.
            </p>
            <p className="text-[#042a5c]/60 text-sm mt-2">
              Te notificaremos cuando esté publicada.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/lessor/dashboard"
              className="w-full bg-[#fdd76c] text-[#042a5c] font-semibold py-3 px-6 rounded-lg hover:bg-[#fdd76c]/90 transition-colors duration-200 text-center block"
            >
              Ir a mi Dashboard
            </Link>
            <Link
              href="/registro-propiedad"
              className="w-full bg-white text-[#042a5c] font-semibold py-3 px-6 rounded-lg border-2 border-[#042a5c] hover:bg-[#042a5c] hover:text-white transition-colors duration-200 text-center block"
            >
              Registrar otra propiedad
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-[#042a5c]/60 text-sm">
            ¿Tienes preguntas? Contáctanos en{' '}
            <a
              href="mailto:soporte@happyroomie.com"
              className="text-[#042a5c] underline hover:no-underline"
            >
              soporte@happyroomie.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}