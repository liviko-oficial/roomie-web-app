import React from "react";
const Logo = () => (
  <div className="h-full aspect-square rounded-[9999px] bg-neutral-400"></div>
);
const Nav = () => {
  return (
    <nav className="flex px-4 py-2 justify-center lg:justify-start sticky top-0">
      <Logo />
    </nav>
  );
};

export default Nav;
