const LandingHero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-white text-[#042a5c] overflow-hidden">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between z-10">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
            ¡RENTA TU PROPIEDAD DE MANERA <span className="text-[#fdd76c]">FÁCIL Y SEGURA!</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-6 md:mb-8">
            Conecta con estudiantes del Tec de Monterrey y <span className="font-bold">maximiza tus ingresos</span>
          </p>
          <a
            href="/registro-propiedad"
            className="inline-block bg-[#fdd76c] text-[#042a5c] py-3 px-8 rounded-lg text-lg md:text-xl font-medium hover:bg-[#fcd34d] transition-colors shadow-md"
          >
            Publica tu propiedad
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
          <div className="relative w-full max-w-md md:max-w-lg">
            <div className="absolute -top-4 -left-4 w-full h-full bg-[#fdd76c] rounded-xl"></div>
            <div className="relative z-10 w-full rounded-xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
              {/* Imagen con overlay amarillo */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Apartamento moderno"
                  className="w-full h-auto object-cover"
                  style={{ minHeight: "300px", maxHeight: "450px" }}
                />
                <div className="absolute inset-0 bg-[#fdd76c] opacity-10"></div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#042a5c] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg z-20 font-bold text-sm md:text-base">
              ¡Alta demanda!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero

