import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { joinRoom } from '../../../services/Services';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No se ha encontrado el token. Por favor, inicia sesión.');
      return;
    }

    if (!roomCode) {
      setError('Por favor, ingresa un código de sala.');
      return;
    }

    try {
      const { data } = await joinRoom(token, roomCode);
      alert(`Te has unido a la sala: ${data.room_name}`);
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error('Error uniendo a la sala:', err);
      setError('Error al unirse a la sala. Verifica el código y vuelve a intentarlo.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Unirse a una Sala
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Código de Sala"
            variant="outlined"
            margin="normal"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Unirse a Sala
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JoinRoom;
