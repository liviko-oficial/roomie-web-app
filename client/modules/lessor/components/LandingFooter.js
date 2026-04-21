const LandingFooter = () => {
  return (
    <footer id="contacto" className="bg-[#042a5c] text-white py-12 md:py-16 border-t border-gray-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            {/* Logo */}
            <img
              src="/happy-roomie-full-white.svg"
              alt="Happy Roomie Logo"
              className="h-10 w-auto"
            />
            <p className="text-sm md:text-base mb-4">
              La plataforma líder para conectar arrendadores con estudiantes del Tec de Monterrey.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://www.facebook.com/happy.roomie.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fdd76c] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/happy.roomie.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fdd76c] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@happy.roomie.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fdd76c] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12.525 2.118a4.88 4.88 0 00-1.404.216 4.88 4.88 0 00-1.048.518 4.88 4.88 0 00-.79.718 4.88 4.88 0 00-.518 1.048 4.88 4.88 0 00-.216 1.404v.001c0 1.06.29 2.06.8 2.92l-.001.001a4.88 4.88 0 00.748.79 4.88 4.88 0 001.048.518 4.88 4.88 0 001.404.216h.001c1.06 0 2.06-.29 2.92-.8l.001-.001a4.88 4.88 0 00.79-.718 4.88 4.88 0 00.518-1.048 4.88 4.88 0 00.216-1.404v-.001c0-1.06-.29-2.06-.8-2.92l-.001-.001a4.88 4.88 0 00-.718-.79 4.88 4.88 0 00-1.048-.518 4.88 4.88 0 00-1.404-.216zM12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 2.118c-1.06 0-2.06.29-2.92.8l-.001.001a4.88 4.88 0 00-.79.718 4.88 4.88 0 00-.518 1.048 4.88 4.88 0 00-.216 1.404v.001c0 1.06.29 2.06.8 2.92l-.001.001a4.88 4.88 0 00.718.79 4.88 4.88 0 001.048.518 4.88 4.88 0 001.404.216h.001c1.06 0 2.06-.29 2.92-.8l.001-.001a4.88 4.88 0 00.79-.718 4.88 4.88 0 00.518-1.048 4.88 4.88 0 00.216-1.404v-.001c0-1.06-.29-2.06-.8-2.92l-.001-.001a4.88 4.88 0 00-.718-.79 4.88 4.88 0 00-1.048-.518 4.88 4.88 0 00-1.404-.216z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Arrendadores</h3>
            <ul className="space-y-2">
              <li>
                <a href="#como-funciona" className="hover:text-[#fdd76c] transition-colors">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="/registrar-propiedad" className="hover:text-[#fdd76c] transition-colors">
                  Publica tu propiedad
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-[#fdd76c] transition-colors">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-[#fdd76c] transition-colors">
                  Guía para arrendadores
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terminos" className="hover:text-[#fdd76c] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-[#fdd76c] transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li>soporte@happyroomie.mx</li>
              <li>+52 (81) 1234 5678</li>
              <li>Av. Eugenio Garza Sada 2501 Sur, Monterrey, N.L.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm md:text-base">© 2025 Happy Roomie. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm md:text-base">
            <a href="/terminos" className="hover:text-[#fdd76c] transition-colors">
              Términos y Condiciones
            </a>
            <a href="/privacidad" className="hover:text-[#fdd76c] transition-colors">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter

