import React from "react";

const Controls = () => {
  return (
    <div className="w-full max-w-[350px] flex flex-col gap-2 justify-center">
      <a
        className="font-semibold rounded-3xl bg-primary-200 w-full text-center py-2 text-sm text-background md:text-2xl"
        href="#"
      >
        Buscar
      </a>
      <button className="text-[10px] md:text-base rounded-sm self-start px-2 max-w-[300px] bg-primary-400/20 p-2 capitalize">
        cambiar campus
      </button>
    </div>
  );
};

export default Controls;
