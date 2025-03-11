const usuarioCtrl = {};
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const urlBack = "https://proyecto-mern-2-a9zx.onrender.com";

// Listar usuarios
usuarioCtrl.getUsu = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    const usuariosConFoto = usuarios.map(usuario => ({
      ...usuario._doc,
      foto: usuario.foto
        ? `${urlBack}/img/${usuario.foto}`
        : `${urlBack}/img/noFoto.png`, // Imagen por defecto si no hay foto
    }));
    res.json(usuariosConFoto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// Login
usuarioCtrl.loginUsu = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Crear un usuario
usuarioCtrl.createUsu = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'El nombre, correo y contraseña son obligatorios' });
    }

    const nombreFoto = req.body.nombreFoto || 'noFoto.png'; // Usa el nombre de la foto generado por multer

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: hashedPassword, // Guardar la contraseña hasheada
      foto: nombreFoto, // Asignamos el nombre único generado al campo foto
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado', usuario: usuarioGuardado });
  } catch (error) {
    console.error('Error al crear usuario:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Buscar un usuario
usuarioCtrl.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Borrar usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar la foto del servidor si existe
    if (usuario.foto && usuario.foto !== 'noFoto.png') {
      const filePath = path.join(__dirname, '../img', usuario.foto);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar la foto:', err);
          return res.status(500).json({ message: 'Error al eliminar la foto', error: err.message });
        }
      });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Update
usuarioCtrl.updateUsu = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const foto = req.file ? req.body.nombreFoto : undefined; // Captura la foto si existe

    if (!nombre || !correo) {
      return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
    }

    // Buscar el usuario actual para obtener la foto antigua
    const usuarioActual = await Usuario.findById(req.params.id);
    if (!usuarioActual) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar la foto antigua del servidor si existe y si se ha subido una nueva foto
    if (foto && usuarioActual.foto && usuarioActual.foto !== 'noFoto.png') {
      const filePath = path.join(__dirname, '../img', usuarioActual.foto);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar la foto antigua:', err);
          return res.status(500).json({ message: 'Error al eliminar la foto antigua', error: err.message });
        }
      });
    }

    // Hashear la nueva contraseña si se proporciona
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Encuentra y actualiza el usuario
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        correo,
        ...(foto && { foto }), // Solo actualiza la foto si se envía
        ...(password && { password: hashedPassword }) // Solo actualiza la contraseña si se envía
      },
      { new: true }
    );

    res.json({ message: 'Usuario actualizado', usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

module.exports = usuarioCtrl;