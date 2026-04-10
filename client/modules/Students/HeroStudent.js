// HeroStudent: Sección principal del home para estudiantes
// Presenta un encabezado llamativo, una descripción breve, botones de acción
// y una imagen ilustrativa al lado derecho en pantallas grandes.

const HeroStudent = () => {
  return (
    // Contenedor principal con fondo blanco y padding vertical
    <div className="bg-white py-16 md:py-24">

      {/* Contenedor central con ancho máximo y márgenes laterales responsivos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Grid: en móvil una columna, en desktop dos columnas (texto + imagen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Columna izquierda: texto, título, descripción y botones */}
          <div className="text-left">

            {/* Título principal con tipografía responsiva */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#042a5c] mb-4 font-['Poppins']">
              ¡ENCUENTRA TU CUARTO Y{" "}
              <span className="text-[#fdd76c]">TU ROOMIE IDEAL!</span>
            </h1>

            {/* Subtítulo / descripción */}
            <p className="text-lg md:text-base text-[#042a5c] mb-8 font-['Poppins']">
              Toda la información a un click de distancia :)
            </p>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Botón destacado para registro */}
              <button className="bg-[#fdd76c] hover:bg-[#fdd76c] text-[#042a5c] font-normal py-3 px-7 rounded-lg transition-colors duration-200 font-['Poppins']">
                Regístrate ahora
              </button>

              {/* Botón secundario para explorar más */}
              <button className="bg-white hover:bg-gray-50 text-[#042a5c] font-normal py-3 px-8 rounded-lg border-2 border-[#042a5c] transition-colors duration-200 font-['Poppins']">
                Conoce más
              </button>
            </div>
          </div>

          {/* Columna derecha: imagen ilustrativa (solo visible en desktop) */}
          <div className="hidden md:block">
            <img
              src="/modern-living-room.jpg"
              alt="Sala moderna con sofás grises y grandes ventanales"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroStudent
