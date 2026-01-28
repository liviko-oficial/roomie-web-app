import React from "react";
import Link from "next/link";

const PropertyCard = ({
  property,
  onViewDetails,
  onCompareToggle,
  isComparing,
}) => {
  const {
    id,
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
  } = property;

  const displayFeatures = features.filter(
    (feature) => feature === "Amueblada" || feature === "Servicios incluidos"
  );

  const bathroomFeatureForRoom = features.includes("Baño privado")
    ? "Baño propio"
    : features.includes("Baño compartido")
    ? "Baño compartido"
    : null;

  const formatPrice = (value) =>
    typeof value === "number" ? value.toLocaleString("es-MX") : value;

  const capitalizeFirstWord = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return (
      words[0][0].toUpperCase() +
      words[0].slice(1).toLowerCase() +
      " " +
      words.slice(1).join(" ").toLowerCase()
    );
  };

  return (
    <div className="bg-white font-sans rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />

        {isVerified && (
          <div className="absolute top-2 left-2 bg-brand-accent text-brand-dark text-xs font-bold px-2 py-1 rounded-md">
            Disponible
          </div>
        )}

        {petFriendly && (
          <div className="absolute top-2 right-2 bg-brand-dark  text-white text-xs font-bold px-2 py-1 rounded-md">
            Pet Friendly
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-white text-brand-dark text-xs font-bold px-2 py-1 rounded-md">
          {type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-brand-dark truncate">
            {title}
          </h3>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-[#ffd662]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-brand-dark">
              {rating}
            </span>
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-600">{location}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {displayFeatures.map((feature, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-brand-dark text-xs px-2 py-1 rounded"
            >
              {capitalizeFirstWord(feature)}
            </span>
          ))}
          {type === "Cuarto" && bathroomFeatureForRoom && (
            <span className="inline-block bg-gray-100 text-brand-dark text-xs px-2 py-1 rounded">
              {capitalizeFirstWord(bathroomFeatureForRoom)}
            </span>
          )}
          {(type === "Casa" || type === "Departamento") && bathrooms && (
            <span className="inline-block bg-gray-100 text-brand-dark text-xs px-2 py-1 rounded">
              {bathrooms === 1 ? "1 baño" : `${bathrooms} baños`}
            </span>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-brand-dark">
              ${formatPrice(price)}
            </span>
            <span className="text-sm text-gray-600"> /mes</span>
          </div>
          <div className="flex space-x-2">
            <Link
               href={`/properties/${property.id}`}
              onClick={() => onViewDetails(property)}
              className="px-3 py-1 bg-brand-accent text-brand-dark rounded font-medium hover:bg-yellow-400 transition duration-300"
            >
              Ver detalles
            </Link>
            {
              isComparing != null &&
              <button
              onClick={() => onCompareToggle(property)}
              className={`px-3 py-1 rounded font-medium transition duration-300 ${
                isComparing
                ? "bg-black text-white"
                : "bg-white text-brand-dark border border-black hover:bg-gray-100"
                }`}
                >
              Comparar
            </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
