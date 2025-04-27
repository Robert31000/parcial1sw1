import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    nombre: '',
    codigo: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registerUser(form);
      navigate('/auth/login'); // ✅ luego de registrar, lo lleva a login
    } catch (err) {
      console.error(err);
      setError('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Crear Cuenta</h2>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          placeholder="Código"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
