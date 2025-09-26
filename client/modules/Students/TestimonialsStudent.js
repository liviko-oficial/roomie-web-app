// Testimonials: Sección de testimonios de usuarios que muestra experiencias y valoraciones.
// Contiene un título, un grid con tarjetas de cada usuario y un botón de llamada a la acción.

const Testimonials = () => {
  // Array de testimonios
  const testimonials = [
    {
      id: 1,
      name: "Ana García",
      campus: "Campus Monterrey",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      text: "Gracias a Happy Roomie encontré un departamento a 4 minutos del campus y compañeros increíbles. ¡El proceso fue súper sencillo!",
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      campus: "Campus Ciudad de México",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      text: "Como foráneo, me preocupaba encontrar un lugar seguro y accesible. Happy Roomie me conectó con otros estudiantes del Tec y ahora compartimos un excelente lugar.",
    },
    {
      id: 3,
      name: "Daniela Torres",
      campus: "Campus Guadalajara",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      text: "La plataforma me permitió filtrar opciones según mi presupuesto y preferencias. Encontré roomies con intereses similares y ahora somos grandes amigos.",
    },
  ]

  return (
    // Sección principal con padding vertical y fondo amarillo
    <section className="py-16 bg-[#fdd76c]">
      {/* Contenedor centrado con ancho máximo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Título principal */}
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#042a5c] mb-12 font-['Poppins']">
          Lo que dicen nuestros usuarios
        </h2>

        {/* Grid de testimonios: 1 columna en móvil, 3 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            // Tarjeta de cada usuario
            <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-lg">

              {/* Avatar y datos del usuario */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"} // fallback si no hay avatar
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-[#042a5c] font-['Poppins']">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 font-['Poppins']">{testimonial.campus}</p>
                </div>
              </div>

              {/* Texto del testimonio */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 font-['Poppins']">
                "{testimonial.text}"
              </p>

              {/* Valoración: 5 estrellas fijas */}
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#ffd662] mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botón de llamada a la acción */}
        <div className="text-center">
          <button className="bg-[#042a5c] hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 font-['Poppins'] flex items-center mx-auto">
            Únete ahora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}

export default Testimonials
