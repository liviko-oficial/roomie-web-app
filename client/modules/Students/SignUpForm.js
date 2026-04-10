"use client"

// Importa el hook useState de React para manejar el estado del formulario
import { useState } from "react"

// Componente principal del formulario de registro
const SignUpForm = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    matricula: "",
    telefono: "",
    correoAcademico: "",
    contrasena: "",
    confirmarContrasena: "",
  })

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estado para almacenar errores de validación
  const [errors, setErrors] = useState({})

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Si ya había un error en ese campo, lo limpia al modificar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Validación y formateo especial para matrícula
    if (name === "matricula") {
      let formattedValue = value.toUpperCase() // Convertir a mayúsculas
      if (!formattedValue.startsWith("A") && formattedValue.length > 0) {
        // Asegurar que comience con "A" seguido de números
        formattedValue = "A" + formattedValue.replace(/[^0-9]/g, "")
      }
      if (formattedValue.length > 9) {
        // Limitar a máximo 9 caracteres
        formattedValue = formattedValue.slice(0, 9)
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    }
    // Validación y formateo especial para teléfono
    else if (name === "telefono") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10) // Solo números, máximo 10 dígitos
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      // Para otros campos, solo actualizar el valor
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault() // Evita que la página se recargue

    const newErrors = {}

    // Validar campos obligatorios
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "Nombre completo es obligatorio"
    }
    if (!formData.matricula.trim()) {
      newErrors.matricula = "Matrícula es obligatorio"
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Teléfono es obligatorio"
    }
    if (!formData.correoAcademico.trim()) {
      newErrors.correoAcademico = "Correo académico es obligatorio"
    }
    if (!formData.contrasena.trim()) {
      newErrors.contrasena = "Contraseña es obligatorio"
    }
    if (!formData.confirmarContrasena.trim()) {
      newErrors.confirmarContrasena = "Confirmar contraseña es obligatorio"
    }

    // Validar que las contraseñas coincidan
    if (formData.contrasena && formData.confirmarContrasena && formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden"
    }

    // Validar longitud exacta del teléfono
    if (formData.telefono && formData.telefono.length !== 10) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 dígitos"
    }

    // Validar correo académico del Tec
    if (formData.correoAcademico && !formData.correoAcademico.includes("@tec.mx")) {
      newErrors.correoAcademico = "Debe usar un correo académico del Tec (@tec.mx)"
    }

    // Si hay errores, actualiza el estado y detiene el envío
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Si no hay errores, mostrar datos en consola (aquí iría envío al servidor)
    console.log("Datos del formulario:", formData)
  }

  // Función para redirigir al login
  const handleLoginClick = () => {
    console.log("Redirigir a login")
  }

  return (
    // Contenedor principal centrado vertical y horizontalmente
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-['Poppins']">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* Lado izquierdo: información promocional */}
        <div className="flex-1 bg-[#fdd76c] p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-none">
          <div className="w-full lg:max-w-sm">
            <h1 className="text-xl lg:text-2xl font-bold text-[#042a5c] mb-4">Únete a nuestra comunidad</h1>
            <p className="text-[#042a5c] text-base mb-6 leading-relaxed">
              Crea tu perfil en menos de 2 minutos y comienza a explorar opciones de vivienda y compañeros ideales para
              tu etapa universitaria.
            </p>

            {/* Lista de beneficios */}
            <div className="space-y-3 mb-6">
              {/* Cada beneficio con ícono */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#042a5c] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-[#fdd76c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293..." clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#042a5c] text-sm font-medium">Acceso exclusivo para estudiantes Tec</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#042a5c] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-[#fdd76c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293..." clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#042a5c] text-sm font-medium">Comunidad verificada y segura</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#042a5c] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-[#fdd76c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293..." clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#042a5c] text-sm font-medium">Opciones adaptadas a tu presupuesto</span>
              </div>
            </div>

            {/* Imagen promocional */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/students-working-together.jpg"
                alt="Estudiantes trabajando juntos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Lado derecho: formulario de registro */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center order-2 lg:order-none">
          <div className="w-full lg:max-w-sm lg:mx-auto">
            <h2 className="text-xl font-bold text-[#042a5c] mb-6">Crea tu cuenta</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input nombre completo */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Nombre completo</label>
                <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} placeholder="Tu nombre completo" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent ${errors.nombreCompleto ? "border-red-500" : "border-gray-300"}`} required />
                {errors.nombreCompleto && <p className="text-red-500 text-sm mt-1">{errors.nombreCompleto}</p>}
              </div>

              {/* Input matrícula */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Matrícula</label>
                <input type="text" name="matricula" value={formData.matricula} onChange={handleInputChange} placeholder="A00000000" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent ${errors.matricula ? "border-red-500" : "border-gray-300"}`} required />
                {errors.matricula && <p className="text-red-500 text-sm mt-1">{errors.matricula}</p>}
              </div>

              {/* Input teléfono */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="10 dígitos" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent ${errors.telefono ? "border-red-500" : "border-gray-300"}`} required />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>

              {/* Input correo académico */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Correo académico</label>
                <input type="email" name="correoAcademico" value={formData.correoAcademico} onChange={handleInputChange} placeholder="correo@tec.mx" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent ${errors.correoAcademico ? "border-red-500" : "border-gray-300"}`} required />
                {errors.correoAcademico && <p className="text-red-500 text-sm mt-1">{errors.correoAcademico}</p>}
              </div>

              {/* Input contraseña con botón mostrar/ocultar */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Contraseña</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="contrasena" value={formData.contrasena} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent pr-10 ${errors.contrasena ? "border-red-500" : "border-gray-300"}`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#042a5c]">
                    {/* Ícono que cambia según si la contraseña está visible o no */}
                  </button>
                </div>
                {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
              </div>

              {/* Input confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-[#042a5c] mb-1">Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:border-transparent pr-10 ${errors.confirmarContrasena ? "border-red-500" : "border-gray-300"}`} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#042a5c]">
                    {/* Ícono que cambia según si la contraseña está visible o no */}
                  </button>
                </div>
                {errors.confirmarContrasena && <p className="text-red-500 text-sm mt-1">{errors.confirmarContrasena}</p>}
              </div>

              {/* Botón de crear cuenta */}
              <button type="submit" className="w-full bg-[#fdd76c] text-[#042a5c] font-medium py-3 px-4 rounded-lg hover:bg-[#e6c52b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:ring-offset-2">
                Crear cuenta
              </button>

              {/* Sección para redirigir a login */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">¿Ya tienes cuenta?</p>
                <button type="button" onClick={handleLoginClick} className="w-full border-2 border-[#fdd76c] text-[#042a5c] font-medium py-3 px-4 rounded-lg hover:bg-[#fdd76c] hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#fdd76c] focus:ring-offset-2">
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Exporta el componente para usarlo en otras partes de la app
export default SignUpForm
