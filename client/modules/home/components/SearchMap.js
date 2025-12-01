import React from 'react';

const SearchMap = ({ properties }) => {
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden h-[calc(100vh-200px)]">
      <div className="relative w-full h-full">
        {/* Aquí iría la integración real con Google Maps o similar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-700">Mapa interactivo</h3>
          <p className="mt-2 text-gray-600">
            Aquí se mostraría un mapa con las {properties.length} propiedades encontradas.
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
            {properties.slice(0, 4).map(property => (
              <div key={property.id} className="bg-white p-3 rounded-md shadow-sm flex items-center">
                <div className="w-10 h-10 bg-[#FFDC30] rounded-full flex items-center justify-center text-black font-bold mr-3">
                  {property.id}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-black truncate">{property.title}</p>
                  <p className="text-xs text-gray-500 truncate">{property.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          {properties.length > 4 && (
            <p className="mt-4 text-sm text-gray-600">
              Y {properties.length - 4} propiedades más...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMap;
