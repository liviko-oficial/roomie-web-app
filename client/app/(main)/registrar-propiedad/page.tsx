"use client";

import { useState, useMemo } from "react";
import { registerProperty } from "@/lib/api/propertyRegister.service";
import { useRouter } from "next/navigation";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-10 h-10 rounded-full bg-yellow-50 border border-brand-accent flex items-center justify-center">
    {children}
  </span>
);

const ChoiceGrid = ({ options, value, onChange, cols = 2 }: {
  options: { value: string; label: string; hint?: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) => {
  const gridCols = cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            value === opt.value
              ? "border-brand-accent bg-yellow-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon>{opt.icon}</Icon>
            <div>
              <div className="font-semibold text-brand-dark">{opt.label}</div>
              {opt.hint && <div className="text-xs text-gray-500 mt-0.5">{opt.hint}</div>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const YesNo = ({ value, onChange, yesLabel = "Sí", noLabel = "No" }: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}) => (
  <div className="flex gap-3 justify-center">
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-6 py-3 rounded-xl border font-medium transition ${
        value === true ? "border-brand-accent bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {yesLabel}
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-6 py-3 rounded-xl border font-medium transition ${
        value === false ? "border-brand-accent bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {noLabel}
    </button>
  </div>
);

const CheckboxList = ({ options, values, onToggle, getIcon }: {
  options: string[];
  values: string[];
  onToggle: (opt: string) => void;
  getIcon?: (opt: string) => string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {options.map((opt) => {
      const checked = values.includes(opt);
      const icon = getIcon ? getIcon(opt) : null;
      return (
        <label
          key={opt}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
            checked ? "border-brand-accent bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(opt)}
            className="accent-brand-accent w-4 h-4"
          />
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm text-brand-dark">{opt}</span>
        </label>
      );
    })}
  </div>
);

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const pct = total <= 1 ? 100 : Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Progreso</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-2 bg-brand-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const PhotoUpload = ({ label, description, multiple, value, onChange, maxPreview = 6, maxFiles }: {
  label?: string;
  description?: string;
  multiple?: boolean;
  value: File | File[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (files: any) => void;
  maxPreview?: number;
  maxFiles?: number;
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const files: File[] = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (value ? [value as File] : []);

  const hasFiles = files.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    e.target.value = "";
    if (multiple) {
      if (maxFiles != null) {
        onChange([...files, ...newFiles].slice(0, maxFiles));
      } else {
        onChange(newFiles);
      }
    } else {
      onChange(newFiles[0] || null);
    }
  };

  const removeAt = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = files.filter((_, i) => i !== idx);
    onChange(multiple ? next : (next[0] || null));
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    if (draggedIndex == null || draggedIndex === dropIdx) {
      setDraggedIndex(null);
      return;
    }
    const reordered = [...files];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIdx, 0, removed);
    onChange(reordered);
    setDraggedIndex(null);
  };

  const inputId = `photo-upload-${label ?? "default"}`;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-brand-dark">{label}</label>}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {maxFiles != null && multiple && (
        <p className="text-xs text-gray-500">Hasta {maxFiles} {maxFiles === 1 ? "foto" : "fotos"}</p>
      )}
      <label
        htmlFor={inputId}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer min-h-[140px] ${
          hasFiles ? "border-brand-dark/30 bg-brand-dark/5" : "border-gray-300 bg-gray-50/50 hover:border-brand-dark/40"
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
        />
        {!hasFiles ? (
          <>
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-dark/10 text-brand-dark mb-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </span>
            <span className="text-sm font-medium text-brand-dark">Arrastra fotos aquí o haz clic</span>
            <span className="text-xs text-gray-500 mt-0.5">JPG, PNG</span>
          </>
        ) : (
          <div className="w-full p-3">
            <div className="flex gap-3 flex-wrap items-start">
              <div className={`grid gap-2 flex-1 min-w-0 ${files.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
                {files.slice(0, maxPreview).map((f, idx) => (
                  <div
                    key={idx}
                    draggable={multiple && files.length > 1}
                    onDragStart={() => setDraggedIndex(idx)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(idx); }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                    className={`relative rounded-lg overflow-hidden bg-gray-100 aspect-video cursor-grab ${
                      draggedIndex === idx ? "opacity-50" : ""
                    } ${dragOverIndex === idx ? "ring-2 ring-brand-dark" : ""}`}
                  >
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                    <button
                      type="button"
                      onClick={(e) => removeAt(idx, e)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center text-sm font-bold"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              {multiple && (maxFiles == null || files.length < maxFiles) && (
                <span className="inline-flex items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 text-3xl text-gray-400 hover:border-brand-dark transition-colors flex-shrink-0">
                  +
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {files.length} {files.length === 1 ? "foto" : "fotos"} · Arrastra para ordenar · Haz clic para agregar
            </p>
          </div>
        )}
      </label>
    </div>
  );
};

export default function RegistrarPropiedad() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    propertyType: "",
    dentroDe: "",
    numRoomsToRent: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rooms: [] as any[],
    campus: "",
    numRooms: 0,
    registerBedroomDetails: null as boolean | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bedrooms: [] as any[],
    title: "",
    addressGeneral: "",
    calle: "",
    numero: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    description: "",
    price: 5000,
    servicesIncluded: null as boolean | null,
    includedServices: [] as string[],
    petFriendly: null as boolean | null,
    mascotasPermitidas: [] as string[],
    banosCompletos: 1,
    banosMedios: 0,
    parkingSpaces: 0,
    genderCompatible: "",
    amenidadesCasa: [] as string[],
    tieneCasaClub: false,
    amenidadesCasaClub: [] as string[],
    amenidadesCasaOtro: "",
    amenidadesCasaClubOtro: "",
    espaciosComunes: [] as string[],
    espaciosComunesOtro: "",
    securityType: "",
    photos: [] as File[],
    fotosHabitaciones: [] as File[],
    fotosAreasComunes: [] as File[],
    fotoCasaClub: null as File | null,
  });

  const SECURITY_CONDOMINIO = "Condominio privado con seguridad 24/7";
  const SECURITY_EDIFICIO = "Edificio con seguridad 24/7";
  const SECURITY_NA = "No aplica";

  const FURNITURE_OPTIONS = ["Escritorio", "Cama", "Silla", "Espejo de cuerpo completo", "Armario", "Lámpara de escritorio"];
  const BED_TYPE_OPTIONS = ["Individual", "Matrimonial", "Queen", "King", "Litera"];
  const CAMPUS_OPTIONS = ["Guadalajara", "Querétaro", "Santa Fe"];
  const INCLUDED_SERVICES = ["Luz", "Agua", "Gas", "Internet", "Limpieza", "Mantenimiento", "Agua potable", "Todos los servicios"];
  const ESPACIOS_COMUNES = ["Sala", "Comedor", "Cocina", "Terraza", "Patio", "Área de lavado", "Garage", "Bodega"];
  const AMENIDADES_CASA = ["Secadora", "Lavadora", "Estacionamiento techado", "Hamaca", "Alberca", "Asador", "Jardín", "Roof-Top"];
  const AMENIDADES_CASA_CLUB = ["Gym", "Pista para correr", "Actividades deportivas", "Alberca", "Asadores", "Áreas verdes"];
  const MASCOTAS_OPTIONS = ["Perros", "Gatos", "Reptiles", "Roedores"];
  const ESTADOS_MEXICO = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
    "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero",
    "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
    "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
    "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
  ];

  const getEspaciosComunesIcon = (opt: string) => {
    const icons: Record<string, string> = {
      "Sala": "🛋️", "Comedor": "🍽️", "Cocina": "🍳",
      "Terraza": "☀️", "Patio": "🌳", "Área de lavado": "🧺",
      "Garage": "🚗", "Bodega": "📦"
    };
    return icons[opt] || "";
  };

  const getAmenidadesCasaIcon = (opt: string) => {
    const icons: Record<string, string> = {
      "Secadora": "🌬️", "Lavadora": "🌀", "Estacionamiento techado": "🅿️",
      "Hamaca": "🛏️", "Alberca": "🏊", "Asador": "🔥",
      "Jardín": "🌺", "Roof-Top": "🏙️"
    };
    return icons[opt] || "";
  };

  const getAmenidadesCasaClubIcon = (opt: string) => {
    const icons: Record<string, string> = {
      "Gym": "💪", "Pista para correr": "🏃", "Actividades deportivas": "⚽",
      "Alberca": "🏊", "Asadores": "🔥", "Áreas verdes": "🌿"
    };
    return icons[opt] || "";
  };

  const getServiciosIcon = (opt: string) => {
    const icons: Record<string, string> = {
      "Luz": "💡", "Agua": "💧", "Gas": "🔥",
      "Internet": "🌐", "Limpieza": "🧹", "Mantenimiento": "🔧",
      "Agua potable": "🥤"
    };
    return icons[opt] || "";
  };

  const getFurnitureIcon = (opt: string): React.ReactNode => {
    const icons: Record<string, string> = {
      "Cama": "🛏️", "Silla": "🪑", "Espejo de cuerpo completo": "🪞",
      "Armario": "🚪", "Lámpara de escritorio": "💡"
    };
    return icons[opt] || "";
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("propertyType", data.propertyType);
      formData.append("campus", data.campus);
      formData.append("price", String(data.price));
      formData.append("description", data.description);
      formData.append("genderCompatible", data.genderCompatible);
      formData.append("petFriendly", String(data.petFriendly));
      formData.append("servicesIncluded", String(data.servicesIncluded));
      formData.append("securityType", data.securityType);
      formData.append("parkingSpaces", String(data.parkingSpaces));
      formData.append("banosCompletos", String(data.banosCompletos));
      formData.append("banosMedios", String(data.banosMedios));

      formData.append("addressGeneral", data.addressGeneral);
      formData.append("calle", data.calle);
      formData.append("numero", data.numero);
      formData.append("colonia", data.colonia);
      formData.append("ciudad", data.ciudad);
      formData.append("estado", data.estado);
      formData.append("codigoPostal", data.codigoPostal);

      formData.append("includedServices", JSON.stringify(data.includedServices));
      formData.append("mascotasPermitidas", JSON.stringify(data.mascotasPermitidas));
      formData.append("espaciosComunes", JSON.stringify(data.espaciosComunes));
      formData.append("amenidadesCasa", JSON.stringify(data.amenidadesCasa));
      formData.append("amenidadesCasaClub", JSON.stringify(data.amenidadesCasaClub));

      data.photos.forEach((file) => formData.append("photos", file));
      data.fotosHabitaciones.forEach((file) => formData.append("fotosHabitaciones", file));
      data.fotosAreasComunes.forEach((file) => formData.append("fotosAreasComunes", file));
      if (data.fotoCasaClub) formData.append("fotoCasaClub", data.fotoCasaClub);

      await registerProperty(formData);
      router.push("/dashboard/mis-propiedades");
    } catch {
      console.error("Error al registrar propiedad");
    } finally {
      setLoading(false);
    }
  };

  const steps = useMemo(() => {
    const base: { key: string; title: string; subtitle?: string; canContinue: boolean; render: () => React.ReactNode }[] = [];

    // Paso 1: Tipo de propiedad
    base.push({
      key: "propertyType",
      title: "¿Qué tipo de propiedad es?",
      canContinue: !!data.propertyType,
      render: () => (
        <ChoiceGrid
          value={data.propertyType}
          onChange={(v) => setData((d) => ({ ...d, propertyType: v, dentroDe: "", securityType: "" }))}
          cols={2}
          options={[
            { value: "Casa", label: "Casa", hint: "Completa, la rentaré toda.", icon: "🏠" },
            { value: "Departamento", label: "Departamento", hint: "Completo, lo rentaré todo.", icon: "🏢" },
            { value: "Cuarto", label: "Cuarto", hint: "Rentaré por habitación de casa/depa.", icon: "🛏️" },
            { value: "Loft", label: "Loft", hint: "Todo en el mismo espacio.", icon: "🏙️" },
          ]}
        />
      ),
    });

    // Paso 2: Dentro de (solo para Cuarto o Loft)
    if (data.propertyType === "Cuarto" || data.propertyType === "Loft") {
      base.push({
        key: "dentroDe",
        title: "¿Dentro de?",
        canContinue: !!data.dentroDe,
        render: () => (
          <ChoiceGrid
            value={data.dentroDe}
            onChange={(v) => setData((d) => ({ ...d, dentroDe: v, securityType: "" }))}
            cols={2}
            options={[
              { value: "Casa", label: "Casa", icon: "🏠" },
              { value: "Departamento", label: "Departamento", icon: "🏢" },
            ]}
          />
        ),
      });
    }

    // Paso 3: Campus
    base.push({
      key: "campus",
      title: "¿En qué campus?",
      canContinue: !!data.campus,
      render: () => (
        <ChoiceGrid
          value={data.campus}
          onChange={(v) => setData((d) => ({ ...d, campus: v }))}
          cols={3}
          options={CAMPUS_OPTIONS.map((campus) => ({
            value: campus,
            label: campus,
            icon: "📍",
          }))}
        />
      ),
    });

    // Paso 4: Titulo y zona
    base.push({
      key: "title",
      title: "Ponle un título",
      canContinue: data.title.trim().length >= 6 && data.addressGeneral.trim().length >= 3,
      render: () => (
        <div className="space-y-4">
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder='Ej. "Cuarto amueblado cerca del Tec"'
            value={data.title}
            onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          />
          <div className="rounded-xl border-2 border-brand-dark/10 p-4">
            <p className="text-sm font-bold text-brand-dark mb-1">Zona general</p>
            <p className="text-xs text-gray-500 mb-2">Nombre del condominio, o la zona</p>
            <input
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Ej. Porta Real, El Real, Sole, etc."
              value={data.addressGeneral}
              onChange={(e) => setData((d) => ({ ...d, addressGeneral: e.target.value }))}
            />
          </div>
        </div>
      ),
    });

    // Paso 5: Direccion
    base.push({
      key: "address",
      title: "Dirección",
      canContinue: data.calle.trim().length >= 3 && data.numero.trim().length >= 1 && data.colonia.trim().length >= 3 && data.ciudad.trim().length >= 3 && data.estado.trim().length >= 3 && data.codigoPostal.trim().length >= 5,
      render: () => (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 italic">(La dirección exacta no se mostrará hasta que lo autorice)</p>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Calle</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder="Nombre de la calle" value={data.calle} onChange={(e) => setData((d) => ({ ...d, calle: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Número</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder="Número de casa/departamento" value={data.numero} onChange={(e) => setData((d) => ({ ...d, numero: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Colonia</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder="Colonia" value={data.colonia} onChange={(e) => setData((d) => ({ ...d, colonia: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Ciudad</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder="Ciudad" value={data.ciudad} onChange={(e) => setData((d) => ({ ...d, ciudad: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Estado</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white" value={data.estado} onChange={(e) => setData((d) => ({ ...d, estado: e.target.value }))}>
                <option value="">Selecciona estado</option>
                {ESTADOS_MEXICO.map((est) => <option key={est} value={est}>{est}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Código Postal</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent" placeholder="Código postal" maxLength={5} value={data.codigoPostal} onChange={(e) => setData((d) => ({ ...d, codigoPostal: e.target.value.replace(/\D/g, "").slice(0, 5) }))} />
          </div>
        </div>
      ),
    });

    // Paso 6: Precio (solo para no-Cuarto)
    if (data.propertyType !== "Cuarto") {
      base.push({
        key: "price",
        title: "Precio mensual",
        canContinue: Number.isFinite(data.price) && data.price >= 1000,
        render: () => (
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="relative border-2 border-gray-300 rounded-xl px-3 py-3 bg-white" style={{ width: "200px" }}>
                  <span className="absolute left-3 text-lg font-bold text-brand-dark">$</span>
                  <input
                    type="text"
                    value={data.price > 0 ? data.price.toLocaleString("en-US") : ""}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0;
                      setData((d) => ({ ...d, price: num }));
                    }}
                    className="w-full text-center text-lg font-bold text-brand-dark bg-transparent border-0 outline-none pl-6"
                    placeholder="5,000"
                  />
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={30000}
              step={500}
              value={Math.min(data.price, 30000)}
              onChange={(e) => setData((d) => ({ ...d, price: parseInt(e.target.value, 10) }))}
              className="w-full accent-brand-accent"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$1,000</span>
              <span>$30,000</span>
            </div>
          </div>
        ),
      });
    }

    // Paso 7: Numero de habitaciones a rentar (solo Cuarto)
    if (data.propertyType === "Cuarto") {
      base.push({
        key: "numRoomsToRent",
        title: "¿Cuántas habitaciones deseas registrar?",
        canContinue: data.numRoomsToRent >= 1,
        render: () => (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5].map((v) => {
              const selected = data.numRoomsToRent === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    const rooms = Array.from({ length: v }, () => ({
                      hasFurniture: null as boolean | null,
                      furniture: [] as string[],
                      furnitureOtroInput: "",
                      bedType: "",
                      roomPhoto: [] as File[],
                      bathroomPhoto: [] as File[],
                      bathroomType: "",
                      bedroomType: "",
                      sharedWithCount: 2,
                      price: 5000,
                    }));
                    setData((d) => ({ ...d, numRoomsToRent: v, rooms }));
                  }}
                  className={`h-20 rounded-2xl border flex items-center justify-center text-3xl font-extrabold text-brand-dark transition ${
                    selected ? "border-brand-accent bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        ),
      });
    }

    // Paso 8: Servicios incluidos
    base.push({
      key: "servicesIncluded",
      title: "¿Incluye servicios?",
      canContinue: data.servicesIncluded !== null && (data.servicesIncluded === false || data.includedServices.length > 0),
      render: () => (
        <div className="space-y-4">
          <YesNo
            value={data.servicesIncluded}
            onChange={(v) => setData((d) => ({ ...d, servicesIncluded: v, includedServices: [] }))}
          />
          {data.servicesIncluded === true && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-brand-dark mb-3">¿Qué servicios incluye?</label>
              <CheckboxList
                options={INCLUDED_SERVICES.filter((s) => s !== "Todos los servicios")}
                values={data.includedServices}
                onToggle={(opt) =>
                  setData((d) => ({
                    ...d,
                    includedServices: d.includedServices.includes(opt)
                      ? d.includedServices.filter((x) => x !== opt)
                      : [...d.includedServices, opt],
                  }))
                }
                getIcon={getServiciosIcon}
              />
            </div>
          )}
        </div>
      ),
    });

    // Paso 9: Genero compatible
    base.push({
      key: "genderCompatible",
      title: "Género compatible",
      canContinue: !!data.genderCompatible,
      render: () => (
        <ChoiceGrid
          value={data.genderCompatible}
          onChange={(v) => setData((d) => ({ ...d, genderCompatible: v }))}
          cols={3}
          options={[
            { value: "Solo hombres", label: "Solo hombres", icon: "👨" },
            { value: "Solo mujeres", label: "Solo mujeres", icon: "👩" },
            { value: "Mixto", label: "Mixto", icon: "👥" },
          ]}
        />
      ),
    });

    // Paso 10: Pet friendly
    base.push({
      key: "petFriendly",
      title: "¿Es Pet Friendly?",
      canContinue: data.petFriendly !== null && (data.petFriendly === false || data.mascotasPermitidas.length > 0),
      render: () => (
        <div className="space-y-4">
          <YesNo
            value={data.petFriendly}
            onChange={(v) => setData((d) => ({ ...d, petFriendly: v, mascotasPermitidas: [] }))}
          />
          {data.petFriendly === true && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-brand-dark mb-3">¿Cuáles?</label>
              <CheckboxList
                options={MASCOTAS_OPTIONS}
                values={data.mascotasPermitidas}
                onToggle={(opt) =>
                  setData((d) => ({
                    ...d,
                    mascotasPermitidas: d.mascotasPermitidas.includes(opt)
                      ? d.mascotasPermitidas.filter((x) => x !== opt)
                      : [...d.mascotasPermitidas, opt],
                  }))
                }
                getIcon={(opt) => ({ "Perros": "🐕", "Gatos": "🐈", "Reptiles": "🦎", "Roedores": "🐹" }[opt] || "")}
              />
            </div>
          )}
        </div>
      ),
    });

    // Paso 11: Numero de habitaciones (Casa/Departamento)
    if (data.propertyType === "Casa" || data.propertyType === "Departamento") {
      base.push({
        key: "numRooms",
        title: "¿Cuántas habitaciones tiene? 🛏️",
        canContinue: data.numRooms >= 1,
        render: () => (
          <div className="flex items-center justify-center gap-3">
            <button type="button" className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 text-xl" onClick={() => setData((d) => ({ ...d, numRooms: Math.max(1, d.numRooms - 1) }))}>−</button>
            <div className="text-3xl font-bold text-brand-dark min-w-[60px] text-center">{data.numRooms}</div>
            <button type="button" className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 text-xl" onClick={() => setData((d) => ({ ...d, numRooms: Math.min(20, d.numRooms + 1) }))}>+</button>
          </div>
        ),
      });
    }

    // Paso 12: Banos (Casa/Departamento/Loft)
    if (data.propertyType === "Casa" || data.propertyType === "Departamento" || data.propertyType === "Loft") {
      base.push({
        key: "bathrooms",
        title: "Baños",
        canContinue: data.banosCompletos >= 1,
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-3">Baños completos 🚿</label>
              <div className="flex items-center justify-center gap-3">
                <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, banosCompletos: Math.max(1, d.banosCompletos - 1) }))}>−</button>
                <div className="text-xl font-bold text-brand-dark">{data.banosCompletos}</div>
                <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, banosCompletos: Math.min(10, d.banosCompletos + 1) }))}>+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-3">Baños medios 🚽</label>
              <div className="flex items-center justify-center gap-3">
                <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, banosMedios: Math.max(0, d.banosMedios - 1) }))}>−</button>
                <div className="text-xl font-bold text-brand-dark">{data.banosMedios}</div>
                <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, banosMedios: Math.min(10, d.banosMedios + 1) }))}>+</button>
              </div>
            </div>
          </div>
        ),
      });

      // Paso 13: Estacionamiento
      base.push({
        key: "parking",
        title: "Lugares de estacionamiento 🅿️",
        canContinue: true,
        render: () => (
          <div className="flex items-center justify-center gap-3">
            <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, parkingSpaces: Math.max(0, d.parkingSpaces - 1) }))}>−</button>
            <div className="text-xl font-bold text-brand-dark">{data.parkingSpaces}</div>
            <button type="button" className="w-10 h-10 rounded-full border border-gray-200 text-xl" onClick={() => setData((d) => ({ ...d, parkingSpaces: Math.min(10, d.parkingSpaces + 1) }))}>+</button>
          </div>
        ),
      });

      // Paso 14: Espacios comunes
      base.push({
        key: "espaciosComunes",
        title: data.propertyType === "Casa" ? "¿Qué espacios comunes tiene la casa?" : "¿Qué espacios comunes tiene el departamento?",
        canContinue: true,
        render: () => (
          <div className="space-y-4">
            <CheckboxList
              options={ESPACIOS_COMUNES}
              values={data.espaciosComunes}
              onToggle={(opt) => setData((d) => ({ ...d, espaciosComunes: d.espaciosComunes.includes(opt) ? d.espaciosComunes.filter((x) => x !== opt) : [...d.espaciosComunes, opt] }))}
              getIcon={getEspaciosComunesIcon}
            />
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Otro espacio común"
              value={data.espaciosComunesOtro}
              onChange={(e) => setData((d) => ({ ...d, espaciosComunesOtro: e.target.value }))}
            />
          </div>
        ),
      });
    }

    // Paso 15: Amenidades de la casa
    base.push({
      key: "amenitiesHouse",
      title: "Amenidades de la casa",
      canContinue: true,
      render: () => (
        <div className="space-y-4">
          <CheckboxList
            options={AMENIDADES_CASA}
            values={data.amenidadesCasa}
            onToggle={(opt) => setData((d) => ({ ...d, amenidadesCasa: d.amenidadesCasa.includes(opt) ? d.amenidadesCasa.filter((x) => x !== opt) : [...d.amenidadesCasa, opt] }))}
            getIcon={getAmenidadesCasaIcon}
          />
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Otra amenidad"
            value={data.amenidadesCasaOtro}
            onChange={(e) => setData((d) => ({ ...d, amenidadesCasaOtro: e.target.value }))}
          />
        </div>
      ),
    });

    // Paso 16: Amenidades del edificio/condominio
    base.push({
      key: "amenitiesCommon",
      title: "Amenidades del edificio / condominio",
      canContinue: true,
      render: () => (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-3">¿Tiene Casa Club?</label>
            <YesNo
              value={data.tieneCasaClub}
              onChange={(v) => setData((d) => ({ ...d, tieneCasaClub: v, amenidadesCasaClub: v ? d.amenidadesCasaClub : [] }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-3">Amenidades</label>
            <CheckboxList
              options={AMENIDADES_CASA_CLUB}
              values={data.amenidadesCasaClub}
              onToggle={(opt) => setData((d) => ({ ...d, amenidadesCasaClub: d.amenidadesCasaClub.includes(opt) ? d.amenidadesCasaClub.filter((x) => x !== opt) : [...d.amenidadesCasaClub, opt] }))}
              getIcon={getAmenidadesCasaClubIcon}
            />
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Otra amenidad"
              value={data.amenidadesCasaClubOtro}
              onChange={(e) => setData((d) => ({ ...d, amenidadesCasaClubOtro: e.target.value }))}
            />
          </div>
          <PhotoUpload
            label="Fotos de áreas comunes (opcional)"
            multiple
            value={data.fotosAreasComunes}
            onChange={(files) => setData((d) => ({ ...d, fotosAreasComunes: files }))}
          />
        </div>
      ),
    });

    // Paso 17: Seguridad
    base.push({
      key: "security",
      title: "Seguridad",
      canContinue: true,
      render: () => {
        const isCasa = data.propertyType === "Casa" || (data.propertyType === "Cuarto" && data.dentroDe === "Casa");
        const options = [];
        if (isCasa) options.push({ value: SECURITY_CONDOMINIO, label: SECURITY_CONDOMINIO, icon: "👮" });
        else options.push({ value: SECURITY_EDIFICIO, label: SECURITY_EDIFICIO, icon: "👮" });
        options.push({ value: SECURITY_NA, label: SECURITY_NA, icon: "➖" });
        return (
          <ChoiceGrid
            value={data.securityType}
            onChange={(v) => setData((d) => ({ ...d, securityType: v }))}
            options={options}
          />
        );
      },
    });

    // Paso 18: Fotos generales
    base.push({
      key: "photos",
      title: "Fotos generales de la propiedad",
      canContinue: true,
      render: () => (
        <PhotoUpload
          description="Sube fotos de la propiedad en general"
          multiple
          value={data.photos}
          onChange={(files) => setData((d) => ({ ...d, photos: files }))}
        />
      ),
    });

    // Paso 19: Descripcion
    base.push({
      key: "description",
      title: "Descripción corta",
      canContinue: data.description.trim().length >= 10,
      render: () => (
        <textarea
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          placeholder="Ej. Ideal para estudiantes, zona tranquila, cerca de transporte..."
          value={data.description}
          onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
        />
      ),
    });

    // Paso 20: Habitaciones individuales (Cuarto)
    if (data.propertyType === "Cuarto" && data.rooms.length > 0) {
      data.rooms.forEach((room, index) => {
        base.push({
          key: `room-${index}`,
          title: `Habitación ${index + 1} de ${data.rooms.length}`,
          canContinue: room.hasFurniture !== null && room.bathroomType !== "" && room.bedroomType !== "" && room.price >= 1000,
          render: () => (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">Precio mensual</label>
                <div className="flex items-center justify-center">
                  <div className="relative border-2 border-gray-300 rounded-xl px-3 py-3 bg-white" style={{ width: "200px" }}>
                    <span className="absolute left-3 text-lg font-bold text-brand-dark">$</span>
                    <input
                      type="text"
                      value={room.price > 0 ? room.price.toLocaleString("en-US") : ""}
                      onChange={(e) => {
                        const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0;
                        const newRooms = [...data.rooms];
                        newRooms[index] = { ...room, price: num };
                        setData((d) => ({ ...d, rooms: newRooms }));
                      }}
                      className="w-full text-center text-lg font-bold text-brand-dark bg-transparent border-0 outline-none pl-6"
                      placeholder="5,000"
                    />
                  </div>
                </div>
              </div>
              <PhotoUpload
                label="Fotos de la habitación"
                multiple
                maxFiles={3}
                value={room.roomPhoto || []}
                onChange={(files) => {
                  const newRooms = [...data.rooms];
                  newRooms[index] = { ...room, roomPhoto: files };
                  setData((d) => ({ ...d, rooms: newRooms }));
                }}
              />
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">¿Tiene muebles?</label>
                <YesNo
                  value={room.hasFurniture}
                  onChange={(v) => {
                    const newRooms = [...data.rooms];
                    newRooms[index] = { ...room, hasFurniture: v, furniture: v ? room.furniture : [] };
                    setData((d) => ({ ...d, rooms: newRooms }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">¿Es para una sola persona o compartida?</label>
                <ChoiceGrid
                  value={room.bedroomType}
                  onChange={(v) => {
                    const newRooms = [...data.rooms];
                    newRooms[index] = { ...room, bedroomType: v };
                    setData((d) => ({ ...d, rooms: newRooms }));
                  }}
                  options={[
                    { value: "Una sola persona", label: "Una sola persona", icon: "👤" },
                    { value: "Compartida", label: "Compartida", icon: "👥" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">Tipo de baño</label>
                <ChoiceGrid
                  value={room.bathroomType}
                  onChange={(v) => {
                    const newRooms = [...data.rooms];
                    newRooms[index] = { ...room, bathroomType: v };
                    setData((d) => ({ ...d, rooms: newRooms }));
                  }}
                  options={[
                    { value: "Propio", label: "Propio", icon: "🔒" },
                    { value: "Compartido", label: "Compartido", icon: "👥" },
                  ]}
                />
              </div>
            </div>
          ),
        });
      });
    }

    // Paso 21: Habitaciones individuales (Casa/Departamento)
    if ((data.propertyType === "Casa" || data.propertyType === "Departamento") && data.numRooms > 0) {
      base.push({
        key: "registerBedroomDetails",
        title: "¿Quieres registrar información específica de cada habitación?",
        canContinue: data.registerBedroomDetails !== null,
        render: () => (
          <YesNo
            value={data.registerBedroomDetails}
            onChange={(v) => {
              if (v) {
                const bedrooms = Array.from({ length: data.numRooms }, () => ({
                  hasFurniture: null as boolean | null,
                  furniture: [] as string[],
                  bedType: "",
                  roomPhoto: [] as File[],
                  bathroomPhoto: [] as File[],
                  bathroomType: "",
                  bedroomType: "",
                  sharedWithCount: 2,
                }));
                setData((d) => ({ ...d, registerBedroomDetails: v, bedrooms }));
              } else {
                setData((d) => ({ ...d, registerBedroomDetails: v, bedrooms: [] }));
              }
            }}
          />
        ),
      });

      if (data.registerBedroomDetails === true) {
        base.push({
          key: "fotosHabitaciones",
          title: "Fotos de habitaciones y baños",
          canContinue: true,
          render: () => (
            <PhotoUpload
              description="Sube fotos de las habitaciones y baños"
              multiple
              value={data.fotosHabitaciones}
              onChange={(files) => setData((d) => ({ ...d, fotosHabitaciones: files }))}
            />
          ),
        });
      }
    }

    return base;
  }, [data]);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-2xl font-bold text-brand-dark">Registrar mi propiedad</div>
            <div className="text-sm text-gray-600">Responde paso a paso. Rápido y sencillo.</div>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-200 text-brand-dark hover:border-gray-300"
          >
            Volver
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <ProgressBar current={step} total={steps.length} />

          <div className="mt-6">
            <div className="text-xl font-bold text-brand-dark mb-4">{current.title}</div>
            {current.subtitle && (
              <div className="text-sm text-gray-500 text-center mb-4">{current.subtitle}</div>
            )}
            {current.render()}
          </div>

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300"
              >
                ← Anterior
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={!current.canContinue || loading}
              onClick={() => {
                if (!current.canContinue) return;
                if (isLast) handleFinish();
                else setStep((s) => s + 1);
              }}
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                current.canContinue && !loading
                  ? "bg-brand-accent text-brand-dark hover:bg-yellow-400"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLast ? (loading ? "Registrando..." : "Finalizar") : "Siguiente →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
