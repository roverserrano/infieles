// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB Atlas'))
  .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// 2. Modelo (usa la colección "infieles")
const IdeaSchema = new mongoose.Schema({
  Hora_registro: Date,
  Nombre_infiel: String,
  Ciudad_origen: String,
  Edad: String,
  Profesion: String,
  Explicacion_infidelidad: String
});

const Infiel = mongoose.model('Infiel', IdeaSchema, 'infieles');

/*
app.get('/api/lista', async (req, res) => {
  try {
    const { q } = req.query; // Leemos el parámetro ?q=nombre
    let query = {};

    // Si el usuario envió algo para buscar...
    if (q) {
      // PRO TIP: $regex con 'i' hace que no importen mayúsculas/minúsculas
      // Esto equivale a: WHERE Nombre_infiel LIKE '%q%'
      query = { 
        Nombre_infiel: { $regex: q, $options: 'i' } 
      };
    }

    console.log(`🔎 Buscando: ${q || 'Todo (últimos 10)'}`);

    const data = await Infiel.find(query)
      .sort({ Hora_registro: -1 })
      .limit(20); // Limitamos a 20 para no traer miles de registros en una búsqueda

    res.json(data);

  } catch (error) {
    console.error("❌ Error buscando datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
*/

/*
app.get('/api/lista-general', async (req, res) => {
  try {
    const data = await Infiel.find()
      .sort({ Hora_registro: -1 })
      .limit(10);
    
    console.log("📂 Enviando lista general (últimos 10)");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lista general" });
  }
});
*/


app.get('/api/buscar-infiel', async (req, res) => {
  try {
    const { nombre } = req.query; // Recibimos ?nombre=Denilson

    if (!nombre) {
      return res.status(400).json({ msg: "Falta el parámetro nombre" });
    }

    // Buscamos coincidencias (case insensitive)
    const data = await Infiel.find({
      Nombre_infiel: { $regex: nombre, $options: 'i' }
    }).limit(20); // Limitamos a 20 para no saturar

    console.log(`🔎 Buscando coincidencias para: "${nombre}"`);
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// 4. Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
