require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de CORS más permisiva para depuración


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.use('/api/usuarios', require('./routes/usuario'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});