import ChangeCapus from "@/modules/home/components/ChangeCapus";
import React from "react";

const Controls = () => {
  return (
    <div className="w-fit flex flex-col gap-2 justify-center">
      <a
        className="p-1 font-semibold rounded-3xl bg-primary-200 w-[min(50vw,350px)] text-center lg:py-2 text-sm text-background md:text-2xl"
        href="#"
      >
        Buscar
      </a>
      <ChangeCapus />
    </div>
  );
};

export default Controls;
