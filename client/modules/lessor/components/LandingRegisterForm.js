"use client"
import { useState } from "react"

const LandingRegisterForm = ({ onLoginClick, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()
    console.log("Registrando arrendador:", { fullName, phone, email })
    setShowVerificationPopup(true)
    onRegisterSuccess()
  }

  const handleResendEmail = () => {
    console.log("Resending verification email to:", email)
  }

  const benefitsList = [
    "Conecta con estudiantes del Tec de Monterrey",
    "Maximiza tus ingresos",
    "Proceso de registro fácil y rápido",
    "Soporte dedicado 24/7",
    "Pagos seguros y puntuales",
  ]

  return (
    <section id="registro" className="py-12 md:py-20 bg-[#fdd76c] text-[#042a5c]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Comienza a arrendar hoy mismo</h2>

        <div className="flex flex-col md:flex-row items-stretch justify-between max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:w-1/2 w-full flex flex-col">
            <div className="p-6 md:p-16 flex-grow">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">¿Por qué rentar con Happy Roomie?</h3>
              <p className="text-base md:text-gray-600 mb-8">
                Únete a la comunidad de arrendadores que confían en Happy Roomie para maximizar sus ingresos con total
                seguridad.
              </p>
              <ul className="list-disc list-inside text-base md:text-lg space-y-2 mb-8">
                {benefitsList.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>

              <div className="relative w-full mt-8">
                <div className="absolute -top-4 -left-4 w-full h-full bg-[#fdd76c] rounded-xl"></div>
                <div className="relative z-10 w-full rounded-xl shadow-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      alt="Departamento moderno con tonos neutros"
                      className="w-full h-auto object-cover"
                      style={{ minHeight: "250px", maxHeight: "350px" }}
                    />
                    <div className="absolute inset-0 bg-[#fdd76c] opacity-10"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#042a5c] text-white px-4 py-2 rounded-lg shadow-lg z-20 font-bold text-sm">
                  ¡Alta demanda!
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full bg-white p-6 md:p-16 flex flex-col">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Regístrate como arrendador</h3>
            <p className="text-base md:text-gray-600 mb-4">
              Únete a la comunidad de arrendadores que confían en Happy Roomie para maximizar sus ingresos con total
              seguridad.
            </p>
            <p className="text-sm text-gray-500 mb-4"><span className="text-red-500">*</span> Campo obligatorio</p>

            <form onSubmit={handleRegister} className="space-y-4 md:space-y-6 flex-grow">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8112345678"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu_correo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#fdd76c] text-[#042a5c] py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-[#fcd34d] transition-colors shadow-md"
                >
                  Registrarme como arrendador
                </button>
              </div>
            </form>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-base md:text-lg mb-2 md:mb-4">¿Ya tienes cuenta?</p>
              <button
                onClick={onLoginClick}
                className="w-full py-2 md:py-3 rounded-lg text-base md:text-lg font-semibold border-2 border-[#fdd76c] bg-white text-[#042a5c] hover:bg-[#fdd76c] transition-colors shadow-md"
              >
                Iniciar sesión
              </button>
            </div>

            <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
              <p>
                Al registrarte, aceptas nuestros{" "}
                <a href="#" className="underline">
                  Términos y Condiciones
                </a>{" "}
                y{" "}
                <a href="#" className="underline">
                  Política de Privacidad
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-sm w-full text-center">
            <button
              onClick={() => setShowVerificationPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              X
            </button>
            <p className="text-lg font-semibold text-[#042a5c] mb-4">
              ¡Gracias por registrarte! Hemos enviado un correo de verificación.
            </p>
            <button
              onClick={handleResendEmail}
              className="bg-[#042a5c] text-white py-2 px-4 rounded-lg hover:bg-[#053666] transition-colors text-sm"
            >
              Reenviar correo
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default LandingRegisterForm

