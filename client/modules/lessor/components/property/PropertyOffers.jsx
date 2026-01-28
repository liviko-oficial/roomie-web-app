import React, { useMemo, useState } from "react";
import { propertyOffers } from "./mock/propertyOffers";
import PropertyOffersSection from "./PropertyOffersSection";

const PropertyOffers = () => {
  const [filteredProperties] = useState(propertyOffers);

  const groups = useMemo(() => {
    return filteredProperties.reduce((acc, property) => {
      const key = property.status;
      (acc[key] ??= []).push(property);
      return acc;
    }, {});
  }, [filteredProperties]);

  const statusList = useMemo(() => Object.keys(groups), [groups]);

  return (
    <section className="p-12 bg-[#ffffff] text-[#042a5c]">
      {statusList.map((status) => (
        <PropertyOffersSection
          key={status}
          title={status}
          filteredProperties={groups[status]}
        />
      ))}
    </section>
  );
};

export default PropertyOffers;
