import React from 'react';

const HappyRoomieWebPage = ({ filters }) => {
  // Aquí iría la lógica para usar los filtros recibidos
  // Por ejemplo, si filters es { location: 'Monterrey', price: '5000' }
  // podrías mostrar un mensaje o cargar datos basados en esos filtros.
  console.log("Filtros recibidos en Happy Roomie Web Page:", filters);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-6 text-center">¡Bienvenido a Happy Roomie!</h1>
      <p className="text-xl text-center mb-8">
        Tu plataforma para encontrar el cuarto y roomie ideal.
      </p>
      {filters && Object.keys(filters).length > 0 && (
        <div className="bg-yellow-400 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tus filtros anteriores:</h2>
          <ul className="list-disc list-inside text-lg">
            {Object.entries(filters).map(([key, value]) => (
              <li key={key}>
                <span className="font-bold capitalize">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-lg text-center">
        ¡Explora las mejores opciones de vivienda cerca del Tec de Monterrey!
      </p>
      <button
        onClick={() => alert('Navegando a la búsqueda de propiedades...')}
        className="mt-8 bg-black text-white py-3 px-8 rounded-lg text-xl font-semibold hover:bg-gray-800 transition-colors shadow-md"
      >
        Buscar Propiedades
      </button>
    </div>
  );
};

export default HappyRoomieWebPage;