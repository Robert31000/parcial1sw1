import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { createRoom } from '../../../services/Services';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No se ha encontrado el token. Por favor, inicia sesión.');
      return;
    }

    if (!roomName) {
      setError('Por favor, ingresa un nombre para la sala.');
      return;
    }

    try {
      const { data } = await createRoom(token, roomName);
      navigate(`/room/${data.room_code}`);
    } catch (err) {
      console.error(err);
      setError('Error al crear la sala. Verifica tu conexión o intenta de nuevo.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Crear Sala
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de la sala"
            variant="outlined"
            margin="normal"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Crear Sala
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRoom;
