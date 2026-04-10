// Ordena un arreglo de solicitudes por fecha o precio (de la propiedad)
export const sortRequests = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case "date_desc":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "date_asc":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "price_desc":
      return sorted.sort((a, b) => b.property.price - a.property.price);
    case "price_asc":
      return sorted.sort((a, b) => a.property.price - b.property.price);
    default:
      return sorted;
  }
};
