"use client"

import { useState } from "react";
import Link from "next/link";
import NavLinkStudent from "./components/NavLinkStudent"
import { useRegistrationModal } from "../global_components/context_files/RegistrationModalContext";
import { useLoginModal } from "../global_components/context_files/LoginModalContext";

// NavbarStudent: Barra de navegación superior pensada para estudiantes
const NavbarStudent = ({ currentPage, onNavigate }) => {
  const { openModal: openRegistrationModal } = useRegistrationModal();
  const { openModal: openLoginModal } = useLoginModal();

  // Estado: control del menú móvil (hamburguesa)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Alternar apertura/cierre del menú móvil
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Abrir modal de registro y cerrar menú móvil
  const handleRegistrationClick = () => {
    const el = document.getElementById("signup");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120; // 100px de offset
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMenuOpen(false)
  }

  // Abrir modal de login y cerrar menú móvil
  const handleLoginClick = () => {
    console.log("Login button clicked") // Debug
    setIsMenuOpen(false)
  }

  // Acción placeholder para “Beneficios”
  const handleBenefitsClick = () => {
    const el = document.getElementById("WhyChooseUs");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60; // 100px de offset
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    console.log("Beneficios clicked")
    setIsMenuOpen(false)
  }

  // Acción al seleccionar opción en el modal de registro
  const handleRegistrationOption = (option) => {
    setIsRegistrationModalOpen(false)
    if (option === "estudiante") {
      // Navegar al dashboard de estudiante
      onNavigate("dashboard", null, null, null, true)
    } else if (option === "rentar") {
      // Navegar al registro de propietario
      onNavigate("propertyOwnerRegistration", null, null, "propertyOwner")
    }
  }

  return (
    // Contenedor principal del navbar: fijo en la parte superior con sombra
    <nav className="sticky top-0 z-50 bg-white shadow-md">

      {/* Contenedor del contenido con márgenes responsivos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Flex principal: logo a la izquierda, menú a la derecha */}
        <div className="flex justify-between h-16">

          {/* Sección izquierda: logo y título */}
          <div className="flex items-center">
            <Link
              className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              href="/"// Clic redirige al Home
            >
              {/* Logo gráfico */}
              <img className="h-16 w-auto" src="/liviko-logo.png" alt="Happy Roomie Logo" />
              {/* Texto/título en forma de imagen */}
            </Link>
          </div>

          {/* Sección derecha (solo visible en pantallas medianas o mayores) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Botón beneficios */}
            <button
              onClick={() => {
                const el = document.getElementById("WhyChooseUs");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY; // 100px de offset
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="px-3 py-2 text-[#042a5c] hover:text-[#fdd76c] rounded-md font-medium font-['Poppins'] transition-colors duration-300"
            >
              Beneficios
            </button>

            {/* Botón registro */}
            <button
              onClick={() => {
                const el = document.getElementById("signup");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80; // 100px de offset
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="px-3 py-2 text-[#042a5c] hover:text-[#fdd76c] rounded-md font-medium font-['Poppins'] transition-colors duration-300"
            >
              Registro
            </button>

            <Link
              href="/students/profile"
              className="px-3 py-2 text-[#042a5c] hover:text-[#fdd76c] rounded-md font-medium font-['Poppins'] transition-colors duration-300"
            >
              Mi perfil
            </Link>

            {/* Botón iniciar sesión */}
            <button
              onClick={openLoginModal}
              className="px-4 py-2 bg-[#fdd76c] text-[#042a5c] rounded-md font-medium hover:bg-yellow-500 transition duration-300 font-['Poppins']"
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Menú hamburguesa (solo en móvil) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-yellow-100"
            >
              {/* Ícono dinámico: X si está abierto, ≡ si está cerrado */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  // Ícono de cerrar (X)
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h16" />
                ) : (
                  // Ícono de menú hamburguesa
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable en versión móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">

            {/* Opción beneficios */}
            <button
               onClick={handleBenefitsClick}
              className="w-full text-left px-3 py-2 text-[#042a5c] hover:text-[#fdd76c] rounded-md font-medium font-['Poppins'] transition-colors duration-300"
            >
              Beneficios
            </button>

            {/* Opción registro */}
            <button
              onClick={handleRegistrationClick}
              className="w-full text-left px-3 py-2 text-[#042a5c] hover:text-[#fdd76c] rounded-md font-medium mt-2 font-['Poppins'] transition-colors duration-300"
            >
              Registro
            </button>

            {/* Opción iniciar sesión */}
            <button
              onClick={openLoginModal}
              className="w-full text-left px-4 py-2 bg-[#fdd76c] text-[#042a5c] rounded-md font-bold hover:bg-yellow-500 transition duration-300 mt-2 font-['Poppins']"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavbarStudent
