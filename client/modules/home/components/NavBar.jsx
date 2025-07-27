import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/liviko-logo.png"
            alt="Liviko Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <NavLink href="/" active>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink href="/propiedades">Buscar propiedades</NavLink>
          </li>
          <li>
            <NavLink href="/contacto">Contacto</NavLink>
          </li>
          <li>
            <NavLink href="/perfil">Mi Perfil</NavLink>
          </li>
        </ul>

        {/* CTA */}
        <Link
          href="/registro"
          className="hidden md:inline-block border-2 border-brand-accent text-black px-4 py-2 rounded-md font-bold hover:bg-brand-accent/80 transition"
        >
          Registrarse
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
