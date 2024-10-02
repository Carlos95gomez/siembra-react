import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Siembra Actualizada Samaca</Link>
        <div className="navbar-nav">
          {!userRole ? (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-link text-light">
                <PersonCircle className="me-2" />
                {userName || 'Usuario'}
              </span>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;