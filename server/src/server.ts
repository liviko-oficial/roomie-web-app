import express from 'express';
import { getAllProperties } from './mocks/Propeties';
import { runMigrationMock } from './mocks/Migrationmock';
const app = express();
const port = 5000;

app.get('/api/properties', (req, res) => {
  res.json(getAllProperties());
});

// ← Nueva ruta para la migración mock
app.get('/api/migration/mock', (req, res) => {
  const resultado = runMigrationMock();
  res.json({
    message: "Migración mock completada",
    ...resultado
  });
});

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});