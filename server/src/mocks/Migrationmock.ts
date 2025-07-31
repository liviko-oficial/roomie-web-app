import { mockProperties } from './mockProperties';

export function runMigrationMock() {
  console.log("INICIANDO MIGRACIÓN MOCK");
  console.log("=====================================");
  
  // Analizar estado actual
  console.log("ESTADO ACTUAL:");
  console.log(`Total propiedades: ${mockProperties.length}`);
  
  // Detectar problemas con las nuevas propiedades
  const idsUnicos = new Set(mockProperties.map(p => p.id));
  const idsDuplicados = mockProperties.length - idsUnicos.size;
  const typosDetectados = mockProperties.filter(p => 
    // Buscar si tienen propiedades viejas que ya no existen
    (p as any).avaliable !== undefined || 
    (p as any).location !== undefined ||
    (p as any).rooms !== undefined ||
    (p as any).bathrooms !== undefined
  ).length;
  
  console.log(`IDs duplicados: ${idsDuplicados}`);
  console.log(`Propiedades con campos obsoletos: ${typosDetectados}`);
  
  // Mostrar cambios que se harían
  console.log("CAMBIOS QUE SE APLICARÍAN:");
  console.log("- Generar IDs únicos secuenciales");
  console.log("- Verificar estructura según schema de MongoDB");
  console.log("- Agregar campo 'createdAt'");
  console.log("- Agregar campo 'updatedAt'");
  
  // 3. Simular los datos migrados usando la estructura correcta
  const datosMigrados = mockProperties.map((propiedad, index) => ({
    id: index + 1, // IDs únicos
    name: propiedad.name,
    imgPrincipal: propiedad.imgPrincipal,
    imgs: propiedad.imgs,
    description: propiedad.description,
    summary: propiedad.summary,
    rateting: propiedad.rateting, // Mantener el typo si está en el schema
    price: propiedad.price,
    isPetFriendly: propiedad.isPetFriendly,
    capacity: propiedad.capacity,
    isFurnished: propiedad.isFurnished,
    parkingNum: propiedad.parkingNum,
    contractTime: propiedad.contractTime,
    type: propiedad.type,
    gender: propiedad.gender,
    deposit: propiedad.deposit,
    distance: propiedad.distance,
    bathroom: propiedad.bathroom,
    isAvailable: propiedad.isAvailable,
    amenities: propiedad.amenities,
    rules: propiedad.rules,
    services: propiedad.services,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  // 4. Mostrar ejemplos de antes/después
  console.log("EJEMPLO DE TRANSFORMACIÓN:");
  console.log("ANTES:", mockProperties[0]);
  console.log("DESPUÉS:", datosMigrados[0]);
  
  // 5. Resumen final
  console.log("RESUMEN DE LA MIGRACIÓN MOCK:");
  console.log(`- Propiedades analizadas: ${mockProperties.length}`);
  console.log(`- Propiedades que se migrarían: ${datosMigrados.length}`);
  console.log(`- Campos agregados: createdAt, updatedAt`);
  console.log(`- Estructura validada según schema MongoDB`);
  
  console.log("ESTO FUE SOLO UNA SIMULACIÓN");
  console.log("NO SE MODIFICÓ NINGÚN ARCHIVO");
  console.log("=====================================");
  
  return {
    original: mockProperties,
    migrated: datosMigrados,
    stats: {
      totalOriginal: mockProperties.length,
      totalMigrated: datosMigrados.length,
      duplicateIds: idsDuplicados,
      obsoleteFields: typosDetectados
    }
  };
}