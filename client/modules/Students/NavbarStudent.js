"use client";
import { useState } from "react";
import Link from "next/link";
import { useRegistrationModal } from "../global_components/context_files/RegistrationModalContext";
import { useLoginModal } from "../global_components/context_files/LoginModalContext";
import { useAuthContext } from "../global_components/context_files/AuthContext";
import ConfirmDialog from "../global_components/components/ConfirmDialog";

const NavbarStudent = () => {
  const { openModal: openRegistrationModal } = useRegistrationModal();
  const { openModal: openLoginModal } = useLoginModal();
  const { userType, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogoutConfirm = () => {
    setConfirmLogout(false);
    logout();
  };

  const scrollTo = (id, offset = 60) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
        <Link href="/" className="flex items-center gap-0.5">
          <img src="/happy-roomie-lateral-navy.svg" alt="Happy Roomie Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scrollTo("WhyChooseUs")}
            className="px-4 py-2 rounded-md font-semibold text-brand-dark hover:bg-yellow-100 transition"
          >
            Beneficios
          </button>
          <button
            onClick={() => scrollTo("signup", 80)}
            className="px-4 py-2 rounded-md font-semibold text-brand-dark hover:bg-yellow-100 transition"
          >
            Registro
          </button>

          {userType ? (
            <>
              <Link href="/perfil" className="px-4 py-2 rounded-md font-semibold text-brand-dark hover:bg-gray-100 transition">
                Mi Perfil
              </Link>
              <button onClick={() => setConfirmLogout(true)} className="text-sm text-gray-500 hover:text-red-500 px-4 py-2 transition">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Iniciar sesión
              </button>
              <button
                onClick={openRegistrationModal}
                className="border-2 border-brand-accent text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-yellow-100 transition"
              >
                Registrarse
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ease-out ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-75 ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ease-out ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-500 ease-in-out ${
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-4 py-4 space-y-2">
          <button
            onClick={() => scrollTo("WhyChooseUs")}
            className="block w-full text-left px-4 py-2 rounded-md font-semibold text-brand-dark hover:bg-yellow-100 transition"
          >
            Beneficios
          </button>
          <button
            onClick={() => scrollTo("signup", 80)}
            className="block w-full text-left px-4 py-2 rounded-md font-semibold text-brand-dark hover:bg-yellow-100 transition"
          >
            Registro
          </button>

          {userType ? (
            <>
              <Link href="/perfil" className="block w-full text-center text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition">
                Mi Perfil
              </Link>
              <button onClick={() => setConfirmLogout(true)} className="block w-full text-center text-sm text-gray-500 hover:text-red-500 transition py-1">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { openLoginModal(); setIsMenuOpen(false); }}
                className="block w-full text-center text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { openRegistrationModal(); setIsMenuOpen(false); }}
                className="block w-full text-center border-2 border-brand-accent text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-yellow-100 transition"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirmLogout}
        title="¿Cerrar sesión?"
        message="Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmLabel="Cerrar sesión"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmLogout(false)}
      />
    </nav>
  );
};

export default NavbarStudent;
