"use client";
import Image from "next/image";
import Link from "next/link";
import NavLink from "../components/NavLink";
import { useState } from "react";
import { useRegistrationModal } from "@/modules/global_components/context_files/RegistrationModalContext";
import { useLoginModal } from "@/modules/global_components/context_files/LoginModalContext";

const Navbar = () => {
  const { openModal: openRegistrationModal } = useRegistrationModal();
  const { openModal: openLoginModal } = useLoginModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5">
          <Image
            src="/liviko-logo.png"
            alt="Liviko Logo"
            width={120}
            height={120}
            className="object-contain aspect-video"
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {/* Nav Links */}
          <ul className="flex gap-2 items-center">
            <li>
              <NavLink href="/" active>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink href="/properties">Buscar propiedades</NavLink>
            </li>
            <li>
              <NavLink href="/dashboard">Mi Dashboard</NavLink>
            </li>
          </ul>

          <button
              onClick={openRegistrationModal}
            className="border-2 border-brand-accent text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-yellow-100 transition"
          >
            Registrarse
          </button>
        </div>

        {/* Menu Movil */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ease-out ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-75 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ease-out ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Menu para */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          <ul className="space-y-3">
            <li>
              <NavLink href="/" active>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink href="/propiedades">Buscar propiedades</NavLink>
            </li>
            <li>
              <NavLink href="/dashboard">Mi Dashboard</NavLink>
            </li>
          </ul>

          <button
              onClick={openRegistrationModal}
            className="block w-full text-center border-2 border-brand-accent text-brand-dark px-4 py-2 rounded-md font-bold hover:bg-yellow-100 transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
