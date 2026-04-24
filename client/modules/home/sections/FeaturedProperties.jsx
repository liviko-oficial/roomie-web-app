"use client";
import React, { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import { propertySummary } from "../mappers/propertySummary";
import { propertyService } from "@/lib/api/propertyService";
import Link from "next/link";

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    propertyService
      .getAll()
      .then((res) => {
        const all = (res.data || []).map(propertySummary).filter(Boolean);
        setFeaturedProperties(all.filter((p) => p.isFeatured).slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-dark">
            Propiedades destacadas
          </h2>
          <p className="mt-4 text-lg text-brand-dark max-w-3xl mx-auto">
            Descubre las mejores opciones de alojamiento cerca del Tec de
            Monterrey, seleccionadas por su calidad y ubicación.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={() => {}}
              onCompareToggle={() => {}}
              isComparing={false}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/properties">
            <button className="px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition duration-300">
              Ver todas las propiedades
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
