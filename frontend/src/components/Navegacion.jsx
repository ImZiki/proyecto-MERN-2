import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const Navegacion = () => {

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    navigate('/'); // Redirigir al login
  };

  return (
    <div>
      {/* Navbar de Bootstrap con logo y nombre */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            HOME
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">
                  Lista de Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/CrearUsuario">
                  Crear usuario
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Iniciar sesión
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}


export default Navegacion;