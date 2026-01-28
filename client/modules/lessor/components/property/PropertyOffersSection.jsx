// PropertyOffersSection.jsx
import React from "react";
import PropertyCard from "../../../home/components/PropertyCard";

const PropertyOffersSection = ({ title, filteredProperties }) => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold">
          {title}
        </h2>
        <hr className=" border-[#042a5c] my-8" />

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {(filteredProperties ?? []).map((property) => (
            <div key={property.id} className="shrink-0 snap-start">
              <PropertyCard
                property={property}
                onViewDetails={() => {}}
                onCompareToggle={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyOffersSection;
