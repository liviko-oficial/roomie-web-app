import Link from "next/link";

const NavLink = ({ href, children, active = false }) => {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded-md transition font-semibold ${
        active ? "bg-brand-accent" : "hover:bg-brand-accent/30 text-black"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
