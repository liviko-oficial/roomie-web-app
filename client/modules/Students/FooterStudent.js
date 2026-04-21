// Componente del pie de página
const Footer = () => {
  return (
    // Contenedor principal del footer con fondo azul oscuro y texto blanco
    <footer className="bg-[#042a5c] text-white py-10 px-4 font-['Poppins']">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Columna 1: Logo y descripción */}
        <div className="flex flex-col items-start text-left">
          <div className="flex flex-col items-center mb-3">
            {/* Logo principal */}
            <img src="/happy-roomie-full-white.svg" alt="Happy Roomie Logo" className="h-10 w-auto" />
            {/* Logo con título */}
          </div>
          {/* Descripción de la plataforma */}
          <p className="text-gray-300 text-sm leading-relaxed">
            La plataforma exclusiva para estudiantes del Tec de Monterrey que buscan el lugar perfecto para vivir y los
            compañeros ideales.
          </p>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div className="text-left">
          <h3 className="text-lg font-bold text-white mb-4">Enlaces rápidos</h3>
          <ul className="space-y-2">
            <li>
              <a href="/students" className="text-white hover:text-[#ffd662]">Inicio</a>
            </li>
            <li>
              <a href="/properties" className="text-white hover:text-[#ffd662]">Buscar propiedades</a>
            </li>
            <li>
              <a href="/terminos" className="text-white hover:text-[#ffd662]">Términos</a>
            </li>
            <li>
              <a href="/privacidad" className="text-white hover:text-[#ffd662]">Privacidad</a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información de contacto */}
        <div className="text-left">
          <h3 className="text-lg font-bold text-white mb-4">Contáctanos</h3>
          <div className="space-y-3">

            {/* Email */}
            <div className="flex items-center">
              <span className="mr-2 text-white">
                {/* Ícono de sobre */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <span className="text-white">happycontentro@gmail.com</span>
            </div>

            {/* Teléfono */}
            <div className="flex items-center">
              <span className="mr-2 text-white">
                {/* Ícono de teléfono */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </span>
              <span className="text-white">(33) 1304-4712</span>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-4 mt-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/happy.roomie.mx/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffd662]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24,4h-18c-1.105,0 -2,0.895 -2,2v18c0,1.105 0.895,2 2,2h10v-9h-3v-3h3v-1.611c0,-3.05 1.486,-4.389 4.021,-4.389c1.214,0 1.856,0.09 2.16,0.131v2.869h-1.729c-1.076,0 -1.452,0.568 -1.452,1.718v1.282h3.154l-0.428,3h-2.726v9h5c1.105,0 2,-0.895 2,-2v-18c0,-1.105 -0.896,-2 -2,-2z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/happy.roomie.mx/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffd662]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 30 30">
                  <path d="M 11.46875 5 C 7.917969 5 5 7.914063 5 11.46875 L 5 20.53125 C 5 24.082031 7.914063 27 11.46875 27 L 20.53125 27 C 24.082031 27 27 24.085938 27 20.53125 L 27 11.46875 C 27 7.917969 24.085938 5 20.53125 5 Z M 11.46875 7 L 20.53125 7 C 23.003906 7 25 8.996094 25 11.46875 L 25 20.53125 C 25 23.003906 23.003906 25 20.53125 25 L 11.46875 25 C 8.996094 25 7 23.003906 7 20.53125 L 7 11.46875 C 7 8.996094 8.996094 7 11.46875 7 Z M 21.90625 9.1875 C 21.402344 9.1875 21 9.589844 21 10.09375 C 21 10.597656 21.402344 11 21.90625 11 C 22.410156 11 22.8125 10.597656 22.8125 10.09375 C 22.8125 9.589844 22.410156 9.1875 21.90625 9.1875 Z M 16 10 C 12.699219 10 10 12.699219 10 16 C 10 19.300781 12.699219 22 16 22 C 19.300781 22 22 19.300781 22 16 C 22 12.699219 19.300781 10 16 10 Z M 16 12 C 18.222656 12 20 13.777344 20 16 C 20 18.222656 18.222656 20 16 20 C 13.777344 20 12 18.222656 12 16 C 12 13.777344 13.777344 12 16 12 Z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@happy.roomie.mx" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffd662]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-500 text-xs">
        © 2024 Happy Roomie. Todos los derechos reservados.
      </div>
    </footer>
  )
}

// Exporta el componente Footer para usarlo en otras partes de la aplicación
export default Footer
