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
  Hora_registro: Date,
  Nombre_infiel: String,
  Ciudad_origen: String,
  Edad: String,
  Profesion: String,
  Explicacion_infidelidad: String
});

// Asegúrate de que el tercer parámetro 'infieles' coincide con tu colección en Atlas
const Infiel = mongoose.model('Infiel', InfielSchema, 'infieles');

// --- ENDPOINTS ---

// Un solo endpoint inteligente para listar y buscar
app.get('/api/infieles', async (req, res) => {
  try {
    const { busqueda } = req.query;
    let query = {};

    if (busqueda) {
      // Búsqueda insensible a mayúsculas/minúsculas
      query = { 
        Nombre_infiel: { $regex: busqueda, $options: 'i' } 
      };
      console.log(`🔎 Buscando: "${busqueda}"`);
    } else {
      console.log("📂 Cargando lista general");
    }

    const data = await Infiel.find(query)
      .sort({ Hora_registro: -1 }) // Los más recientes primero
      .limit(30); // Límite de seguridad

    res.json(data);

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});