"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-md transition-all duration-200 font-semibold
        ${
          isActive
            ? "bg-brand-accent text-brand-dark"
            : "text-brand-dark hover:bg-yellow-100 transition"
        }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
