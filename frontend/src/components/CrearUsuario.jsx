import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
  const valorInicial = {
    nombre: '',
    correo: '',
    password: ''
  };

  const [usuario, setUsuario] = useState(valorInicial);
  const [foto, setFoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const urlBack = "https://proyecto-mern-2-a9zx.onrender.com";

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const capturarFoto = (e) => {
    setFoto(e.target.files[0]);
  };

  const guardarDatos = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', usuario.nombre);
    formData.append('correo', usuario.correo);
    formData.append('password', usuario.password);
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await axios.post(`${urlBack}/api/usuarios`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUsuario({ ...valorInicial });
      setFoto(null);
      navigate('/'); // Redirigir a la pantalla de login
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <form onSubmit={guardarDatos}>
          <h2 className="text-center mb-3">Crear Usuario</h2>
          <div className="mb-3">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa el nombre del usuario"
              required
              name="nombre"
              value={usuario.nombre}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <label>Correo:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa el correo del usuario"
              required
              name="correo"
              value={usuario.correo}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <label>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa la contraseña del usuario"
              required
              name="password"
              value={usuario.password}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <label>Foto del usuario:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={capturarFoto}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-dark">Guardar</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CrearUsuario;