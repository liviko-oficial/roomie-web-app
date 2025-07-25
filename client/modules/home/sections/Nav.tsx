import Logo from "@/assets/Logo";
import React from "react";
const Nav = () => {
  return (
    <nav className="flex px-4 py-2 justify-center lg:justify-start sticky top-0">
      <div className="size-fit p-2 rounded-[99999px] bg-[hsl(0,0%,90%)]">
        <Logo className="size-12" />
      </div>
    </nav>
  );
};

export default Nav;
