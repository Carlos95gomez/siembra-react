import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', 
        { correo_electronico: email, contrasena: password },
        { withCredentials: true }
      );
      const { token, rol, nombre } = response.data; // Asumimos que el backend devuelve el nombre

      // Guardar token, rol y nombre en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', rol);
      localStorage.setItem('userName', nombre); // Guardamos el nombre del usuario

      // Redirigir basado en el rol
      if (rol === 'admin') {
        navigate('/admin-dashboard');
      } else if (rol === 'normal') {
        navigate('/user-dashboard');
      } else {
        // En caso de que haya otros roles en el futuro
        navigate('/');
      }
    } catch (error) {
      console.error('Error de login:', error);
      if (error.response) {
        setError(error.response.data.message || 'Error en el inicio de sesión');
      } else if (error.request) {
        setError('No se recibió respuesta del servidor');
      } else {
        setError('Error en la solicitud');
      }
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input 
            type="email" 
            className="form-control"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;