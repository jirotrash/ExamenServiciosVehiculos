// seed_servicios.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/dsm44/servicios';
const NUM_VEHICULOS = 5000;
const MAX_SERVICIOS_POR_VEH = 10;
const MAX_REVISIONES_POR_SERV = 5;

const MARCAS = [
  'Toyota',
  'Nissan',
  'Honda',
  'Ford',
  'Chevrolet',
  'Kia',
  'Hyundai',
  'Volkswagen',
  'Mazda',
  'Subaru',
  'Suzuki',
  'Mitsubishi',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Peugeot',
  'Renault',
  'Fiat',
  'Jeep',
  'Dodge',
  'RAM',
  'GMC',
  'Volvo',
  'Land Rover',
  'Porsche',
  'Lexus',
  'Acura',
  'Infiniti',
  'Mini',
  'SEAT',
  'Cupra',
  'Tesla',
  'BYD',
  'MG',
  'JAC'
];
const MODELOS = ['Sedan','Hatchback','Camioneta','Pickup','SUV','Coupe','Sport'];
const TIPOS_SERVICIO = [
  // Mantenimiento Preventivo
  'Cambio de Aceite',
  'Afinación Mayor',
  'Afinación Menor',
  'Cambio de Batería',
  'Cambio de Filtros (Aire/Cabina)',
  'Niveles de Fluidos',
  'Limpieza de Inyectores',

  // Frenos y Neumáticos
  'Frenos (Balatas/Discos)',
  'Rectificado de Discos',
  'Cambio de Líquido de Frenos',
  'Neumáticos / Llantas',
  'Alineación y Balanceo',
  'Rotación de Neumáticos',
  'Reparación de Ponchaduras',

  // Mecánica y Suspensión
  'Amortiguadores',
  'Suspensión General',
  'Diagnóstico por Escáner',
  'Revisión de Motor',
  'Cambio de Banda de Distribución',
  'Bomba de Agua',
  'Sistema de Enfriamiento / Radiador',
  'Embrague / Clutch',
  'Transmisión',
  'Sistema de Escape / Mofles',

  // Eléctrico y Confort
  'Aire Acondicionado',
  'Sistema Eléctrico',
  'Alternador y Marcha',
  'Luces y Faros',
  'Sensores',

  // Estética y Otros
  'Lavado de Motor',
  'Lavado y Engrasado',
  'Hojalatería y Pintura',
  'Pulido y Encerado',
  'Verificación Vehicular'
];
const RESULTADOS = ['Aprobado','Rechazado','Observado'];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const safePost = async (url, body, maxIntentos = 6, delayMs = 800) => {
  let intento = 0;
  while (intento < maxIntentos) {
    try {
      const res = await axios.post(url, body);
      return res;
    } catch (e) {
      intento++;
      console.warn(`POST error ${url} (intento ${intento}/${maxIntentos}): ${e.message}`);
      if (intento >= maxIntentos) {
        console.error('Fallo final en:', url, 'payload:', body);
        return null;
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
};

const makePlacas = () => {
  // genera placas alfanum 6-7 chars (ej: ABC1234)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const len = Math.random() < 0.5 ? 6 : 7;
  let s = '';
  for (let i = 0; i < len; i++) {
    s += (Math.random() < 0.5) ? letters.charAt(Math.floor(Math.random() * letters.length)) : nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return s;
};

const randomDate = (startYear = 2018, endYear = 2025) => {
  const start = new Date(`${startYear}-01-01T00:00:00Z`).getTime();
  const end = new Date(`${endYear}-12-31T23:59:59Z`).getTime();
  const d = new Date(randInt(start, end));
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const generarNombre = () => {
  const nombres = ['Juan','Carlos','Luis','Miguel','Jose','Jorge','Felipe','Hector','Marco','Ricardo','Pablo','Rafael'];
  const apellidos = ['Hernandez','Martinez','Gomez','Perez','Lopez','Garcia','Rodriguez','Sanchez','Ramirez','Cruz'];
  return {
    propietario: `${random(nombres)} ${random(apellidos)}`
  };
};

const crearVehiculo = async () => {
  const placa = makePlacas();
  const marca = random(MARCAS);
  const modelo = `${random(MODELOS)} ${randInt(1998, 2025)}`;
  const anio = randInt(2000, 2025);
  const propietario = generarNombre().propietario;
  const activo = Math.random() < 0.9; // la mayoría activos

  const payload = { placas: placa, marca, modelo, anio, propietario, activo };
  const res = await safePost(`${API_BASE}/vehiculos`, payload);
  return res ? res.data : null;
};

const crearServicio = async (id_vehiculo) => {
  const tipo = random(TIPOS_SERVICIO);
  const fecha = randomDate(2019, 2025);
  const costo = Number((Math.random() * 2000 + 50).toFixed(2)); // 50 - 2050
  const descripcion = Math.random() < 0.6 ? `${tipo} realizado correctamente` : undefined;
  const payload = { id_vehiculo, tipo, fecha, costo, descripcion };
  const res = await safePost(`${API_BASE}/servicios`, payload);
  return res ? res.data : null;
};

const crearRevision = async (id_servicio, baseFecha) => {
  // fecha de revision igual o posterior a la fecha del servicio
  const fecha = baseFecha || randomDate(2019, 2025);
  const inspectorNombres = ['Luis','Ana','María','Pedro','Sofía','Miguel','Carmen','Diego'];
  const inspector = `${random(inspectorNombres)} ${random(['Pérez','Gómez','López','Ramírez','Santos'])}`;
  const kilometraje = randInt(1000, 300000);
  const resultados = random(RESULTADOS);
  const observaciones = Math.random() < 0.5 ? `Observación: ${random(['Requiere seguimiento','Revisar filtros','Bueno'])}` : undefined;

  const payload = { id_servicio, fecha, inspector, kilometraje, resultados, observaciones };
  const res = await safePost(`${API_BASE}/revisiones`, payload);
  return res ? res.data : null;
};

const main = async () => {
  
  const vehiculosIds = [];

  // Crear vehiculos
  for (let i = 0; i < NUM_VEHICULOS; i++) {
    const v = await crearVehiculo();
      if (v && v.id_vehiculo) {
      vehiculosIds.push(v.id_vehiculo);
    } else {
      console.warn('Vehiculo NO creado en iteración', i);
    }
  }

  if (vehiculosIds.length === 0) {
    console.error('No se crearon vehículos. Abortando.');
    return;
  }

  // Para cada vehiculo crear servicios y revisiones
  for (const idVeh of vehiculosIds) {
    const serviciosCount = randInt(1, MAX_SERVICIOS_POR_VEH);
    for (let s = 0; s < serviciosCount; s++) {
      const serv = await crearServicio(idVeh);
      if (!serv || !serv.id_servicio) continue;

      const revCount = randInt(0, MAX_REVISIONES_POR_SERV);
      for (let r = 0; r < revCount; r++) {
        const rev = await crearRevision(serv.id_servicio, serv.fecha);
        if (rev && rev.id_revision) {
        }
      }
    }
  }

  
};

main().catch(err => {
  console.error('Error en seed:', err);
});