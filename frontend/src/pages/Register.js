import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (registerData) => {
    try {
      const response = await fetch('http://localhost:5000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registro exitoso');
        navigate('/login');
      } else {
        setError(data.message || 'El registro falló');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setError(`Ocurrió un error durante el registro: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}

export default Register;