// este arhivo contiene las secciones extra de una propiedad, este archivo se usa en  app/(main)/properties/[id]/page.tsx para
// pasarlo como atributo a BaseLayout

export default function PropertyExtraSection({ property }) {
  const { essentialRequirements } = property;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-[#042A5C] mb-2">
        Requisitos para rentar la propiedad
      </h2>

      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {essentialRequirements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

