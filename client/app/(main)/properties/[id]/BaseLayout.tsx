// este componente fue hecho a base de el componente original de la pagina de detalles de una propiedad adaptado para 
// que funcione con el ruteo de next y para que se le pueda poner información extra de ser necesario

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { properties } from '@/modules/home/mock/properties';
import { propertySummary } from "@/modules/home/mappers/propertySummary";

export default function BaseLayaout({property, CaracteristicaExtra, SeccionesExtra})  {
  const router = useRouter();
  
  const {
    title,
    type,
    price,
    location,
    image,
    features,
    rating,
    isVerified,
    bathrooms,
    petFriendly,
    description,
    images,
    owner,
    includedServices,
    securityType

  } = property

  const [currentImage, setCurrentImage] = useState(0);

  // Si no hay imágenes adicionales, usar la imagen principal
  const allImages = images ? [image, ...images] : [image];

  // Características organizadas por categorías
  const amenities = features.filter(f =>
    !["Amueblada", "Baño privado", "Baño compartido", "Servicios incluidos", "Solo hombres", "Solo mujeres", "Mixto"].includes(f)
  );

  const isFurnished = features.includes("Amueblada");
  const hasServices = features.includes("Servicios incluidos");
  const bathroomType = features.includes("Baño privado") ? "Propio" : "Compartido";
  const genderType = features.find(f => ["Solo hombres", "Solo mujeres", "Mixto"].includes(f)) || "No especificado";

  // Formatear precios y cantidades con coma
  const formatPrice = (value) => {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('en-US');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Botón para regresar */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#042A5C] hover:text-gray-700 transition-colors cursor-pointer"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Volver
      </button>
      </div>

      {/* Galería de imágenes */}
      <div className="max-w-4xl mx-auto px-6">
        {(type === "Casa" || type === "Departamento") && allImages.length > 1 ? (
          <div className="relative w-full h-[420px] bg-gray-200 mt-6 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
            <button
              onClick={() => setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-[#FDD76C] transition z-10"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6 text-[#042A5C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img
              src={allImages[currentImage]}
              alt={title}
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={() => setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-[#FDD76C] transition z-10"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6 text-[#042A5C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            {/* Indicadores de imagen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                    idx === currentImage
                      ? 'bg-[#FDD76C] border-black'
                      : 'bg-black/40 border-black/70'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[420px] bg-gray-200 mt-6 rounded-2xl shadow-xl overflow-hidden">
            <img
              src={allImages[0]}
              alt={title}
              className="w-full h-full object-cover rounded-2xl"
            />
            {isVerified && (
              <div className="absolute top-4 left-4 bg-[#FDD76C] text-[#042A5C] text-sm font-bold px-3 py-1 rounded-md shadow">
                Disponible
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-[#042A5C]">{title}</h1>
          <div className="flex items-center bg-[#FDD76C] px-3 py-1 rounded-md">
            <svg className="w-5 h-5 text-[#042A5C]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 font-bold text-[#042A5C]">{rating}</span>
          </div>
        </div>

        <p className="mt-2 text-gray-600">{location}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-[#042A5C]">${formatPrice(price)}</span>
            <span className="text-gray-600"> /mes</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-[#042A5C] rounded-md">
            {type}
          </span>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#042A5C] mb-2">Descripción</h2>
          <p className="text-gray-600">
            {description || "Esta propiedad ofrece un espacio cómodo y bien ubicado, ideal para estudiantes del Tec de Monterrey. Cuenta con todas las comodidades necesarias para una estancia agradable y productiva durante tu etapa universitaria."}
          </p>
        </div>

        {/* Características principales */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
            <p className="text-[#042A5C] font-medium">{type}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Género</h3>
            <p className="text-[#042A5C] font-medium">{genderType}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Amueblado</h3>
            <p className="text-[#042A5C] font-medium">{isFurnished ? "Sí" : "No"}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">
              {type === "Cuarto" ? "Baño" : "Baños"}
            </h3>
            <p className="text-[#042A5C] font-medium">
              {type === "Cuarto" ? bathroomType : `${formatPrice(bathrooms || 1)}`}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Servicios incluidos</h3>
            <p className="text-[#042A5C] font-medium">{hasServices ? "Sí" : "No"}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Pet friendly</h3>
            <p className="text-[#042A5C] font-medium">{petFriendly ? "Sí" : "No"}</p>
          </div>
          {/* si hay caracteristicas extra que tiene la propiedad u otro tipo de entidad se pueden poner pasando el
              atributo de CaracteristicasExtra de la forma en como se hace en page de esta misma carpeta */}
          {CaracteristicaExtra}
          
        </div>

        {/* Servicios incluidos detallados */}
        {includedServices && includedServices.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#042A5C] mb-2">Servicios incluidos</h2>
            <ul className="flex flex-col gap-2">
              {includedServices.map(servicio => (
                <li key={servicio} className="flex items-center bg-white text-[#042A5C] px-3 py-2 rounded-md text-base font-medium shadow border border-gray-200">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {servicio}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Seguridad */}
        {securityType && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#042A5C] mb-2">Seguridad</h2>
            <div className="flex items-center bg-white text-[#042A5C] px-3 py-2 rounded-md text-base font-medium shadow border border-gray-200">
              <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0h4m-4 0H8" /></svg>
              {securityType}
            </div>
          </div>
        )}

        {/* Amenidades */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#042A5C] mb-2">Amenidades</h2>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-[#042A5C] text-sm px-3 py-1 rounded-md"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Areas comunes */}
        {property.comuneAreas && property.comuneAreas.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#042A5C] mb-2">Areas comunes</h2>
          <div className="flex flex-wrap gap-2">
            {property.comuneAreas.map((amenity, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-[#042A5C] text-sm px-3 py-1 rounded-md"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>)}
        {/* al igual que con las CaracteristicasExtra se puede pasar el atributo SeccionesExtra a este componente para tener más secciones, 
            el ejemplo de su uso está en el archivo page de esta misma carpeta*/}
        {SeccionesExtra}

        {/* Información del propietario */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-[#042A5C] mb-4">Información del propietario</h2>
          <div className="flex items-center">
            <img
              src={owner?.avatar || "https://via.placeholder.com/60x60?text=User"}
              alt="Propietario"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="font-bold text-[#042A5C]">{owner?.name || "Propietario"}</h3>
              <p className="text-gray-600">{owner?.contact || "Contacto disponible después de reservar"}</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 px-6 py-3 bg-[#FDD76C] text-[#042A5C] rounded-md font-bold hover:bg-yellow-400 transition duration-300">
            Contactar al propietario
          </button>
          <button className="flex-1 px-6 py-3 border-2 border-[#FDD76C] text-[#042A5C] rounded-md font-bold hover:bg-yellow-100 transition duration-300">
            Agendar visita
          </button>
        </div>
      </div>
    </div>
  );
};
