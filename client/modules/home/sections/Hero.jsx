import React from "react";

const Hero = () => {
  return (
    <div className="bg-[#ffd662] pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Busca tu espacio ideal cerca del Tec
            </h1>
            <p className="text-lg md:text-xl text-brand-dark mb-8">
              Conectamos estudiantes foráneos con las mejores opciones de
              vivienda y roomies compatibles cerca del campus.
            </p>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
              alt="Estudiantes felices"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
