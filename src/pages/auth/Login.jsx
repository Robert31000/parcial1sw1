import { useState } from 'react';
import { useNavigate } from 'react-router-dom';     
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { login } from '../../services/Services';

export default function Login() {
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate          = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(form);          // POST al backend
      localStorage.setItem('token', data.token);   // guarda el JWT
      navigate('/dashboard');                      // redirige
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}
    >
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Usuario"
        name="username"
        margin="normal"
        value={form.username}      
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        name="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Entrar
      </Button>
    </Box>
  );
}
