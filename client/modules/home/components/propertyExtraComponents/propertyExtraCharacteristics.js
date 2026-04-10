
// este arhivo contiene las caracteristicas extra de una propiedad, este archivo se usa en  app/(main)/properties/[id]/page.tsx para
// pasarlo como atributo a BaseLayout
export default function PropertyExtraCharacteristics({property}) {
  const { parkingSpaces, propertyRequirements, securityDeposit,contractDuration } = property
  const extraCharacteristics = [ {nombre: "Estacionamiento", descripcion: parkingSpaces > 0 ? `${parkingSpaces} lugares` : "no" }, 
                                 {nombre: "Fianza", descripcion: `${propertyRequirements}` }, 
                                 {nombre: "Deposito de seguridad", descripcion: `${securityDeposit} meses` },
                                 {nombre: "Duración del contrato", descripcion: `${(contractDuration % 12) !=0 ?  `${contractDuration % 12} meses` : `${contractDuration / 12} año`}` }]
  return (
  <>
  {extraCharacteristics.map((item, index) => (
  
    <div key={index} className="bg-gray-50 p-3 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500">{item.nombre}</h3>
      <p className="text-[#042A5C] font-medium">{item.descripcion}</p>
    </div>
  
  ))}
  </>

  );
};
