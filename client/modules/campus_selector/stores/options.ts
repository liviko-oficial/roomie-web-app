export type Options = Record<string, { img: string; name: string }>;
const options: Options = {
  ciudad_mexico: {
    img: "/img/campus/ciudad_mexico.webp",
    name: "Ciudad de México",
  },
  moterrey: {
    img: "/img/campus/monterrey.webp",
    name: "Tec Monterrey",
  },
  santa_fe: {
    img: "/img/campus/santa_fe.webp",
    name: "Santa Fe",
  },
  aguascalients: {
    img: "/img/campus/aguascalientes.webp",
    name: "Aguascalientes",
  },
};
export const getImageLinks = () => {
  const result = [];
  for (const id in options) {
    result.push(options[id]["img"]);
  }
  return result;
};
export const asArrayOptions = () => {
  const entries = Object.entries(options);
  const values = entries.map(([id, campus]) => ({ id, name: campus.name }));
  values.sort((a, b) => a.name.localeCompare(b.name));
  return values;
};
export default options;
