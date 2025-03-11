const { Router } = require('express');
const multer = require('multer');
const path = require('path');
//const crypto = require('crypto'); // Módulo de Node.js para crear hashes
const usuarioCtrl = require('../controller/usuario.controller');


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../img')); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname); // Extraemos la extensión del archivo
    const nombre = req.body.nombre.replace(/\s+/g, ''); // Eliminar espacios del nombre
    const nombreFoto = `${nombre}${extension}`; // Generamos un nombre único
    req.body.nombreFoto = nombreFoto; // Asigna el nombre de la foto a req.body.nombreFoto
    callback(null, nombreFoto); // Usa el nombre de archivo generado
  }
});


const upload = multer({ storage });


const router = Router();


router.get('/', usuarioCtrl.getUsu);
router.post('/', upload.single('foto'), usuarioCtrl.createUsu); // Aplica el middleware de multer
router.get('/:id', usuarioCtrl.getUsuario);
router.put('/:id', upload.single('foto'), usuarioCtrl.updateUsu); // Aplica el middleware de multer
router.delete('/:id', usuarioCtrl.deleteUsu);
router.post('/login', usuarioCtrl.loginUsu);


module.exports = router;