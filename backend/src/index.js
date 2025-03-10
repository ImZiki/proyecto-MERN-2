require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// Configuración CORS con origen específico para producción y desarrollo
const allowedOrigins = [
  'https://proyecto-mern-2.onrender.com',  // Dominio en producción
  'http://localhost:3000', // Dominio en desarrollo
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Permite solicitudes desde el dominio o desde localhost
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido por esta política.'));
    }
  },
}));

// Conectar a MongoDB Atlas
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
