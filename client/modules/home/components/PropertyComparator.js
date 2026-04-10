import React from 'react';

const PropertyComparator = ({ propertiesToCompare, onBack }) => {
  if (propertiesToCompare.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-black mb-4">No hay propiedades para comparar</h2>
        <p className="text-gray-600 mb-8">Selecciona al menos una propiedad para ver la comparación.</p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-[#FFDC30] text-black rounded-md font-bold hover:bg-yellow-400 transition duration-300"
        >
          Volver al buscador
        </button>
      </div>
    );
  }

  // Función para capitalizar solo la primera letra de la primera palabra
  const capitalizeFirstWord = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length === 0) return '';
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + ' ' + words.slice(1).join(' ').toLowerCase();
  };

  // Formatea el precio para mostrar comas como separadores de miles
  const formatPrice = (value) => {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('en-US');
  };

  // Definir los factores clave para comparar
  const comparisonFactors = [
    { key: 'price', label: 'Precio Mensual', format: (prop) => `$${formatPrice(prop.price)}` },
    { key: 'type', label: 'Tipo de Vivienda' },
    { key: 'furnished', label: 'Amueblado', format: (prop) => prop.features.includes('Amueblada') ? 'Sí' : 'No' },
    { key: 'bathroom', label: 'Baño', format: (prop) => prop.type === 'Cuarto' ? (prop.features.includes('Baño privado') ? 'Propio' : 'Compartido') : `${formatPrice(prop.bathrooms || 0)} baños` },
    { key: 'services', label: 'Servicios Incluidos', format: (prop) => prop.features.includes('Servicios incluidos') ? 'Sí' : 'No' },
    { key: 'petFriendly', label: 'Pet Friendly', format: (prop) => prop.petFriendly ? 'Sí' : 'No' },
    { key: 'parking', label: 'Estacionamiento', format: (prop) => prop.parkingSpaces > 0 ? `${formatPrice(prop.parkingSpaces)} lugares` : 'No' },
    { key: 'gender', label: 'Género Compatible', format: (prop) => prop.features.find(f => ['Solo hombres', 'Solo mujeres', 'Mixto'].includes(f)) || 'No especificado' },
    { key: 'rating', label: 'Calificación', format: (prop) => `${prop.rating}/5` },
    { key: 'location', label: 'Descripción Breve' },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-black hover:text-gray-700 transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al buscador
        </button>

        <h1 className="text-3xl font-bold text-black mb-8 text-center">Comparador de Propiedades</h1>

        <div className="overflow-x-auto pb-4"> {/* Añadido padding-bottom para scrollbar */}
          <div className="flex space-x-6"> {/* Usamos flex para las columnas de propiedades */}
            <div className="flex-shrink-0 w-64"> {/* Columna para las características */}
              <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center text-lg font-bold text-black border-b border-gray-200">
                Características
              </div>
              {comparisonFactors.map((factor) => (
                <div key={factor.key} className="py-4 px-4 text-sm font-medium text-black border-b border-gray-200 bg-white">
                  {factor.label}
                </div>
              ))}
            </div>

            {propertiesToCompare.map((property) => (
              <div key={property.id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{property.title}</h3>
                    <p className="text-sm">{property.location}</p>
                  </div>
                </div>
                {comparisonFactors.map((factor) => (
                  <div key={`${property.id}-${factor.key}`} className="py-4 px-4 text-sm text-gray-700 border-b border-gray-200">
                    {factor.format 
                      ? factor.format(property) 
                      : property[factor.key] !== undefined && property[factor.key] !== null 
                        ? property[factor.key].toString() 
                        : 'N/A'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparator;

// DONE
