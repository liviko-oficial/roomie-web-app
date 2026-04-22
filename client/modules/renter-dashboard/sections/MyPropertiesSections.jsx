"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OwnerPropertyCard from "../components/OwnerPropertyCard";
import DeletePropertyModal from "../components/DeletePropertyModal";
import MyPropertiesHeader from "./MyPropertiesHeader";
import { CATEGORY_ORDER, groupByCategory, sortProperties } from "../utils/categorize";
import { arrendadorService } from "@/lib/api/arrendadorService";

const mapApiProperty = (p) => ({
  id: p._id || p.id,
  title: p.titulo || "Sin título",
  type: p.tipoPropiedad || "Casa",
  price: p.informacionFinanciera?.precioMensual || 0,
  location: p.resumen || [p.direccion?.colonia, p.direccion?.ciudad].filter(Boolean).join(", ") || "Sin ubicación",
  image: p.imagenes?.principal || "https://placehold.co/800x600/1a365d/f6e05e?text=Propiedad",
  features: [
    p.caracteristicas?.amueblado && "Amueblada",
    p.servicios?.serviciosIncluidos && "Servicios incluidos",
  ].filter(Boolean),
  rating: p.calificacion || 0,
  isVerified: p.disponibilidad?.disponible ?? true,
  petFriendly: p.caracteristicas?.mascotasPermitidas || false,
  bathrooms: p.caracteristicas?.numeroBanos || 1,
  createdAt: p.fechaCreacion || p.createdAt || new Date().toISOString(),
});

const MyPropertiesSections = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date_desc");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    const arrendadorId = localStorage.getItem("arrendadorId");
    if (!arrendadorId) { setLoading(false); return; }
    arrendadorService.getMyProperties(arrendadorId)
      .then((res) => {
        const list = res.data?.propiedades || res.data || [];
        setProperties(Array.isArray(list) ? list.map(mapApiProperty) : []);
      })
      .catch((err) => console.error("Error cargando propiedades:", err))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(
    () => groupByCategory(sortProperties(properties, sortBy)),
    [properties, sortBy]
  );

  const handleViewDetails = (p) => router.push(`/properties/${p.id}`);
  const handleEdit = (p) => router.push(`/registrar-propiedad?edit=${p.id}`);
  const handleRegister = () => router.push("/registrar-propiedad");

  const confirmDelete = () => {
    setProperties((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <>
      <MyPropertiesHeader total={properties.length} sortBy={sortBy} onSortChange={setSortBy} onRegister={handleRegister} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        ) : properties.length === 0 ? (
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
