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
      <button className="p-1  lg:px-2 text-[8px] md:text-base rounded-sm self-start lg:self-end max-w-[300px] bg-primary-400/20 capitalize">
        cambiar campus
      </button>
    </div>
  );
};

export default Controls;
