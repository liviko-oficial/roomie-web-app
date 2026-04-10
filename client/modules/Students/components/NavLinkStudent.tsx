"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLinkStudent = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md font-medium transition-colors duration-300
        ${isActive ? "bg-yellow-100 text-black" : "text-gray-700 hover:bg-yellow-50"}`}
    >
      {children}
    </Link>
  );
};

export default NavLinkStudent;

