// src/Pages/views/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
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
      const user = await loginUser(form);
      console.log('Usuario autenticado:', user);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas o error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center -mt-2">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-300"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?
          <a href="/auth/register" className="text-blue-600 hover:underline ml-1">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
