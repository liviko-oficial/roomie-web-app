import React from "react";
import YearText from "./YearText";
const Footer = () => {
  return (
    <footer className="bg-dark-gray text-white py-10 px-4 font-['Poppins']">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo y descripción */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/happy-roomie-full-white.svg"
            alt="Happy Roomie Logo"
            className="h-10 w-auto"
          />
          <p className="text-white text-sm leading-relaxed mb-4">
            Conectamos estudiantes foráneos del Tec de Monterrey con las mejores
            opciones de vivienda y roomies compatibles.
          </p>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.facebook.com/happy.roomie.mx/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-white hover:text-brand-accent text-2xl"></i>
            </a>
            <a
              href="https://www.instagram.com/happy.roomie.mx/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-white hover:text-brand-accent text-2xl"></i>
            </a>
            <a
              href="https://www.tiktok.com/@happy.roomie.mx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok text-white hover:text-brand-accent text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-brand-accent mb-4">
            Enlaces rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-brand-accent">
                Inicio
              </a>
            </li>
            <li>
              <a href="/properties" className="hover:text-brand-accent">
                Buscar propiedades
              </a>
            </li>
            <li>
              <a href="/registrar-propiedad" className="hover:text-brand-accent">
                Publicar propiedad
              </a>
            </li>
            <li>
              <a href="/students" className="hover:text-brand-accent">
                Encontrar roomie
              </a>
            </li>
          </ul>
        </div>

        {/* Campus */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-brand-accent mb-4">Campus</h3>
          <ul className="space-y-2">
            {[
              "Monterrey",
              "Ciudad de México",
              "Guadalajara",
              "Puebla",
              "Querétaro",
            ].map((campus, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-brand-accent">
                  {campus}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-brand-accent mb-4">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-2 text-brand-accent">
                <i className="fas fa-envelope"></i>
              </span>
              <span>contacto@happyroomie.mx</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-2 text-brand-accent">
                <i className="fas fa-phone-alt"></i>
              </span>
              <span>(81) 1234-5678</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <span className="mr-2 text-brand-accent">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <span>
                Av. Gral Ramón Corona No 2514, Colonia Nuevo México, 45201
                Zapopan, Jal.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Ultima linea */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-300 text-xs">
        © <YearText /> Happy Roomie. Todos los derechos reservados. |{" "}
        <a href="/terminos" className="hover:text-brand-accent">Términos</a> |{" "}
        <a href="/privacidad" className="hover:text-brand-accent">Privacidad</a>
      </div>
    </footer>
  );
};

export default Footer;
