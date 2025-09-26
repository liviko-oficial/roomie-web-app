// ExclusiveTec: Sección que destaca la exclusividad para estudiantes del Tec de Monterrey.
// Contiene un texto descriptivo y una imagen representativa de la comunidad estudiantil.

const ExclusiveTec = () => {
  return (
    // Contenedor principal con padding y centrado máximo
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Fondo azul oscuro con bordes redondeados y padding interno */}
      <div className="bg-[#042a5c] rounded-3xl p-8 md:p-12 lg:p-16">

        {/* Flex container: columna en móvil, fila en desktop */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

          {/* Contenido de texto */}
          <div className="text-white lg:w-1/2">
            {/* Título de la sección */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-['Poppins']">
              Exclusivo para la comunidad Tec
            </h2>

            {/* Descripción de la plataforma */}
            <p className="text-lg md:text-xl leading-relaxed font-['Poppins'] text-gray-200">
              Happy Roomie es una plataforma creada por y para estudiantes del Tec de Monterrey. Entendemos las
              necesidades específicas de nuestra comunidad y ofrecemos soluciones adaptadas a la vida estudiantil.
            </p>
          </div>

          {/* Imagen representativa */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
              <img
                src="/tec-students-studying.jpg"
                alt="Estudiantes del Tec estudiando juntos en biblioteca"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ExclusiveTec
