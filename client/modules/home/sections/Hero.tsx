import { Aside } from "@/modules/home/components/AsideHero";
import React from "react";

type Props = {
  className?: string;
};

function Hero({}: Props) {
  return (
    <header className="grid-cols-[1.5fr_1fr] lg:grid-cols-[1.5fr_2fr] h-[25dvh] lg:h-full px-2 grid grid-rows-1 items-center overflow-x-hidden">
      <main className="row-1 col-[1] lg:col-[2] bg-primary-400 flex justify-center items-center flex-col gap-y-2 px-1 md:px-[1rem] h-full lg:h-[50vh] lg:mx-2 relative"></main>
      <Aside />
    </header>
  );
}

export default Hero;
