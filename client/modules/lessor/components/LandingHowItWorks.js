const LandingHowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Regístrate",
      description: "Crea tu cuenta de arrendador en menos de 5 minutos.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
        </svg>
      ),
    },
    {
      number: "02",
      title: "Publica tu propiedad",
      description: "Sube fotos, detalles y establece tu precio ideal.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      ),
    },
    {
      number: "03",
      title: "Recibe solicitudes",
      description: "Estudiantes verificados mostrarán interés en tu propiedad.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
        </svg>
      ),
    },
    {
      number: "04",
      title: "Selecciona a tus inquilinos",
      description: "Revisa perfiles y elige a los candidatos ideales.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
        </svg>
      ),
    },
    {
      number: "05",
      title: "Firma digital",
      description: "Contratos seguros y respaldados por nuestra plataforma.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      number: "06",
      title: "Recibe tus pagos",
      description: "Ingresos puntuales directamente a tu cuenta bancaria.",
      icon: (
        <svg
          className="w-16 h-16 text-[#fdd76c]"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ]

  return (
    <section id="como-funciona" className="py-12 md:py-20 bg-[#fdd76c] text-[#042a5c]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-[#fdd76c] mb-2">{step.number}</div>
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{step.title}</h3>
              <p className="text-base md:text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingHowItWorks

