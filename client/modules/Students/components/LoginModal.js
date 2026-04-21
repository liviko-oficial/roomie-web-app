"use client"

import { useState } from "react"

// Componente LoginModal
// Props:
//   - isOpen: controla si el modal está visible o no
//   - onClose: función para cerrar el modal
const LoginModal = ({ isOpen, onClose }) => {
  // Estado para el correo ingresado
  const [email, setEmail] = useState("")
  // Estado para la contraseña ingresada
  const [password, setPassword] = useState("")
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false)

  console.log("LoginModal isOpen:", isOpen)

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí se implementaría la lógica de autenticación
    console.log("Login attempt:", { email, password })
    // onClose() // Descomentar si quieres cerrar modal al loguear
  }

  // Acción al hacer clic en "¿Olvidaste tu contraseña?"
  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
  }

  // Acción al hacer clic en "Regístrate ahora"
  const handleRegisterClick = () => {
    console.log("Register clicked")
    onClose()
  }

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null

  console.log("[v0] LoginModal rendering...")

  return (
    // Fondo oscuro semi-transparente (overlay del modal)
    <div className="fixed inset-0 bg-[#042a5c]/50 flex items-center justify-center z-[9999]">


      {/* Contenedor principal del modal */}
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 relative shadow-2xl">

        {/* Botón de cerrar (X en la esquina superior derecha) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        {/* Título del modal */}
        <h2 className="text-2xl font-bold text-[#042a5c] mb-6 font-['Poppins']">Iniciar sesión</h2>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo de correo académico */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2 font-['Poppins']">
              Correo académico
            </label>
            <input
              type="email"
              placeholder="Correo académico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring#fdd76c font-['Poppins']"
              required
            />
          </div>

          {/* Campo de contraseña con opción de mostrar/ocultar */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2 font-['Poppins']">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Alterna entre texto y password
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring#fdd76c font-['Poppins']"
                required
              />
              {/* Botón dentro del input para alternar visibilidad de contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  // Ícono de "ocultar contraseña" (ojo tachado)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  // Ícono de "mostrar contraseña" (ojo normal)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Link para recuperar contraseña */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#fdd76c] hover:text-yellow-600 text-sm font-['Poppins']"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón principal para enviar login */}
          <button
            type="submit"
            className="w-full bg-[#fdd76c] text-[#042a5c] py-3 rounded-md font-bold hover:bg-yellow-500 transition duration-300 font-['Poppins']"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Sección inferior: enlace para registrarse */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3 font-['Poppins']">¿No tienes cuenta?</p>
          <button
            onClick={handleRegisterClick}
            className="w-full border border-gray-300 text-[#042a5c] py-3 rounded-md font-medium hover:bg-gray-50 transition duration-300 font-['Poppins']"
          >
            Regístrate ahora
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
