import React, { useState } from 'react';

function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    rol: 'normal' // Establecemos 'normal' como valor por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="correo_electronico" className="form-label">Correo Electrónico</label>
        <input
          type="email"
          className="form-control"
          id="correo_electronico"
          name="correo_electronico"
          value={formData.correo_electronico}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="contrasena" className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          id="contrasena"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Registrarse</button>
    </form>
  );
}

export default RegisterForm;