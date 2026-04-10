// WhyChooseUs: Sección de beneficios que explica por qué elegir la plataforma.
// Incluye un título principal y tres tarjetas con iconos, títulos y descripciones.

const WhyChooseUs = () => {
  return (
    // Sección principal con padding vertical y horizontal, fondo blanco
    <section className="py-16 px-4 bg-white">
      {/* Contenedor centrado con ancho máximo */}
      <div className="max-w-6xl mx-auto">

        {/* Título principal de la sección */}
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#042a5c] mb-12 font-['Poppins']">
          ¿Por qué elegir Happy Roomie?
        </h2>

        {/* Grid de 3 columnas (en móvil 1 columna, en desktop 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ---------- TARJETA 1 ---------- */}
          {/* Encuentra el lugar perfecto */}
          <div className="bg-white border-2 border-[#fdd76c] rounded-lg p-6 text-left">
            {/* Icono ilustrativo (casita) */}
            <svg
              className="w-12 h-12 mb-4 text-white stroke-yellow-400 stroke-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>

            {/* Título de la tarjeta */}
            <h3 className="text-xl font-medium text-[#042a5c] mb-3 font-['Poppins']">
              Encuentra el lugar perfecto
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-sm leading-relaxed font-['Poppins']">
              Accede a cientos de opciones verificadas y seguras, cerca del Tec de Monterrey,
              con fotos reales y descripciones detalladas.
            </p>
          </div>

          {/* ---------- TARJETA 2 ---------- */}
          {/* Evita estafas */}
          <div className="bg-white border-2 border-[#fdd76c] rounded-lg p-6 text-left">
            {/* Icono ilustrativo (escudo con check) */}
            <svg
              className="w-12 h-12 mb-4 text-white stroke-yellow-400 stroke-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>

            {/* Título de la tarjeta */}
            <h3 className="text-xl font-medium text-[#042a5c] mb-3 font-['Poppins']">
              Evita estafas
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-sm leading-relaxed font-['Poppins']">
              Accede a habitaciones verificadas y seguras, sin riesgo de fraudes o engaños.
            </p>
          </div>

          {/* ---------- TARJETA 3 ---------- */}
          {/* Ahorra tiempo y estrés */}
          <div className="bg-white border-2 border-[#fdd76c] rounded-lg p-6 text-left">
            {/* Icono ilustrativo (reloj) */}
            <svg
              className="w-12 h-12 mb-4 text-white stroke-yellow-400 stroke-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>

            {/* Título de la tarjeta */}
            <h3 className="text-xl font-medium text-[#042a5c] mb-3 font-['Poppins']">
              Ahorra tiempo y estrés
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-sm leading-relaxed font-['Poppins']">
              Filtra y selecciona las mejores opciones que se adapten a tu presupuesto,
              ubicación ideal y otras preferencias para encontrar tu lugar ideal rápidamente.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
