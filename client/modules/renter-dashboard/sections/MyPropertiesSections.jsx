"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OwnerPropertyCard from "../components/OwnerPropertyCard";
import DeletePropertyModal from "../components/DeletePropertyModal";
import MyPropertiesHeader from "./MyPropertiesHeader";
import { myProperties as initial } from "../mock/properties";
import { CATEGORY_ORDER, groupByCategory, sortProperties } from "../utils/categorize";

const MyPropertiesSections = () => {
  const router = useRouter();
  const [properties, setProperties] = useState(initial);
  const [sortBy, setSortBy] = useState("date_desc");
  const [toDelete, setToDelete] = useState(null);

  const grouped = useMemo(
    () => groupByCategory(sortProperties(properties, sortBy)),
    [properties, sortBy]
  );

  const handleViewDetails = (p) => console.log("Ver detalles:", p);
  const handleEdit = (p) => console.log("Editar:", p);
  const handleRegister = () => router.push("/registrar-propiedad");

  const confirmDelete = () => {
    setProperties((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <>
      <MyPropertiesHeader total={properties.length} sortBy={sortBy} onSortChange={setSortBy} onRegister={handleRegister} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-brand-dark mb-2">No tienes propiedades registradas</h3>
            <p className="text-gray-600 mb-6">Comienza registrando tu primera propiedad</p>
            <button onClick={handleRegister} className="px-6 py-3 bg-brand-accent text-brand-dark rounded-md font-bold hover:bg-yellow-400 transition shadow-md">
              Registrar mi primera propiedad
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {CATEGORY_ORDER.map((category) => {
              const list = grouped[category] || [];
              if (list.length === 0) return null;
              return (
                <section key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-brand-dark">{category}</h2>
                    <span className="text-sm text-brand-dark bg-brand-accent/40 px-3 py-1 rounded-full font-semibold">
                      {list.length} {list.length === 1 ? "propiedad" : "propiedades"}
                    </span>
                  </div>
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-max">
                      {list.map((property) => (
                        <div key={property.id} className="flex-shrink-0 w-80">
                          <OwnerPropertyCard property={property} onViewDetails={handleViewDetails} onEdit={handleEdit} onDelete={setToDelete} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <DeletePropertyModal property={toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </>
  );
};

export default MyPropertiesSections;
