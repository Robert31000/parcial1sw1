import { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { register } from '../../services/Services';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    name: '',
    apellido: '',
    codigo: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert('Registro exitoso');
      console.log(res.data);
    } catch (err) {
      alert('Error al registrarse');
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>Registrarse</Typography>
      
      <TextField fullWidth label="Username" name="username" margin="normal" value={form.username} onChange={handleChange} />
      <TextField fullWidth label="Nombre" name="name" margin="normal" value={form.name} onChange={handleChange} />
      <TextField fullWidth label="Apellido" name="apellido" margin="normal" value={form.apellido} onChange={handleChange} />
      <TextField fullWidth label="Código" name="codigo" margin="normal" value={form.codigo} onChange={handleChange} />
      <TextField fullWidth label="Email" name="email" margin="normal" value={form.email} onChange={handleChange} />
      <TextField fullWidth label="Contraseña" type="password" name="password" margin="normal" value={form.password} onChange={handleChange} />
      
      <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Registrarse
      </Button>
    </Box>
  );
};

export default Register;
