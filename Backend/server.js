const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES ---
app.use(cors()); // Permite peticiones desde cualquier origen (útil para desarrollo)
app.use(express.json());

// --- MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB Atlas'))
  .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// --- MODELO ---
const InfielSchema = new mongoose.Schema({
  Hora_registro: { type: Date, default: Date.now },
  Nombre_infiel: String,
  Ciudad_origen: String,
  Sexo: String,
  Edad: String,
  Profesion: String,
  Explicacion_infidelidad: String
});

// Asegúrate de que el tercer parámetro 'infieles' coincide con tu colección en Atlas
const Infiel = mongoose.model('Infiel', InfielSchema, 'infieles');

// --- ENDPOINTS ---

// Un solo endpoint inteligente para listar (random) y buscar
app.get('/api/infieles', async (req, res) => {
  try {
    const { busqueda } = req.query;
    
    // Iniciamos un "Pipeline" de agregación (una serie de pasos)
    const pipeline = [];

    if (busqueda) {
      // PASO 1: Si hay búsqueda, primero filtramos
      console.log(`🔎 Buscando: "${busqueda}"`);
      pipeline.push({
        $match: { 
          Nombre_infiel: { $regex: busqueda, $options: 'i' } 
        }
      });
    } else {
      console.log("🎲 Cargando registros aleatorios");
    }

    // PASO 2: Seleccionar datos aleatorios
    // Esto reemplaza al .sort() y al .limit()
    pipeline.push({ 
      $sample: { size: 30 } 
    });

    // Ejecutamos la agregación
    const data = await Infiel.aggregate(pipeline);

    res.json(data);

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 2. POST: Insertar nuevo registro (NUEVO CÓDIGO)
app.post('/api/infieles', async (req, res) => {
  try {
    console.log("📥 Recibiendo solicitud para guardar nuevo registro...");
    const { 
      Hora_registro, 
      Nombre_infiel, 
      Ciudad_origen, 
      Sexo, 
      Edad, 
      Profesion, 
      Explicacion_infidelidad 
    } = req.body;

    if (!Nombre_infiel) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    // Creamos la nueva instancia del modelo
    const nuevoRegistro = new Infiel({
      Hora_registro: Hora_registro || new Date(),
      Nombre_infiel,
      Ciudad_origen,
      Sexo,
      Edad,
      Profesion,
      Explicacion_infidelidad
    });

    const resultado = await nuevoRegistro.save();
    
    console.log("✅ Registro guardado con éxito:", resultado._id);
    
    res.status(201).json(resultado);

  } catch (error) {
    console.error("❌ Error al guardar:", error);
    res.status(500).json({ error: "No se pudo guardar el registro" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en https://infieles.onrender.com`);
});