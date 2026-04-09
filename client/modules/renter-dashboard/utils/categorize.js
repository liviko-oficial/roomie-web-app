export const CATEGORY_ORDER = [
  "Casa completa",
  "Departamento completo",
  "Habitación dentro de una casa",
  "Habitación dentro de un departamento",
  "Loft",
];

export const getPropertyCategory = (property) => {
  const { type, title = "", location = "" } = property;
  const t = title.toLowerCase();
  const l = location.toLowerCase();

  if (type === "Loft" || t.includes("loft")) return "Loft";
  if (type === "Casa") return "Casa completa";
  if (type === "Cuarto" && (t.includes("departamento") || t.includes("depto") || l.includes("departamento")))
    return "Habitación dentro de un departamento";
  if (type === "Cuarto" && (t.includes("casa") || l.includes("casa")))
    return "Habitación dentro de una casa";
  if (type === "Departamento") return "Departamento completo";
  if (type === "Cuarto") return "Habitación dentro de una casa";
  return "Otros";
};

export const sortProperties = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case "date_desc":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "date_asc":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    default:
      return sorted;
  }
};

export const groupByCategory = (list) => {
  const groups = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, []]));
  list.forEach((p) => {
    const c = getPropertyCategory(p);
    if (groups[c]) groups[c].push(p);
  });
  return groups;
};
