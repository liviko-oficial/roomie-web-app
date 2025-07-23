import { Aside } from "@/modules/home/components/AsideHero";
import CampuesName from "@/modules/home/components/CampuesName";
import Controls from "@/modules/home/components/Controls";
import SeeMore from "@/modules/home/components/SeeMore";
import React from "react";

type Props = {
  className?: string;
};

function Hero({}: Props) {
  return (
    <header className="grid-cols-[1.5fr_1fr] lg:grid-cols-[1.5fr_2fr] h-[25dvh] lg:h-full px-2 grid grid-rows-1 items-center overflow-x-hidden relative">
      <main className="row-1 col-[1] lg:col-[2] flex justify-center items-center flex-col gap-y-1 px-1 md:px-[1rem] h-full lg:h-[50vh] lg:mx-2 relative">
        <CampuesName />
        <Controls />
      </main>
      <Aside />
      <SeeMore />
    </header>
  );
}

export default Hero;
