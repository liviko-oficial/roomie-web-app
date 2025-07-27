import Link from "next/link";

const NavLink = ({ href, children, active = false, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-md transition-all duration-200 font-semibold ${
        active ? "bg-yellow-200 text-black" : "text-black hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
