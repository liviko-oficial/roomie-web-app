import Link from "next/link";

const NavLink = ({ href, children, active = false, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-md transition-all duration-200 font-semibold
        ${
          active
            ? "bg-brand-accent text-brand-dark"
            : "text-brand-dark hover:bg-brand-accent"
        }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
