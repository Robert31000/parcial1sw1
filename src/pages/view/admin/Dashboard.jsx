import { useEffect, useState } from 'react';
//import { getUserRooms, joinRoom as apiJoinRoom } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Paper,
  Alert,
  Stack
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const Dashboard = () => {
  const [adminRooms, setAdminRooms] = useState([]);
  const [collaboratorRooms, setCollaboratorRooms] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No se ha encontrado el token. Por favor, inicia sesión.');
        return;
      }

      try {
        const { data } = await getUserRooms(token);
        setAdminRooms(data.adminRooms || []);
        setCollaboratorRooms(data.collaboratorRooms || []);
        setError(null);
      } catch {
        setError('Error obteniendo las salas. Por favor, inténtalo de nuevo.');
      }
    };

    fetchRooms();
  }, []);

  const joinRoom = async (roomCode) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No se ha encontrado el token. Por favor, inicia sesión.');
      return;
    }

    try {
      await apiJoinRoom(token, roomCode);
      navigate(`/room/${roomCode}`);
    } catch {
      setError('Error al unirse a la sala. Verifica el código y vuelve a intentarlo.');
    }
  };

  const handleCreateRoom = () => {
    navigate('/dashboard/create-room');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <MeetingRoomIcon />
        <Typography variant="h4">Diagramador de Clases Colaborativo</Typography>
      </Stack>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Dashboard de Salas</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction="row" spacing={2} mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateRoom}
            color="warning"
          >
            Crear Sala
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/join-room')}
            color="success"
          >
            Unirse a Sala
          </Button>
        </Stack>

        <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} sx={{ mb: 3 }}>
          <Tab label="Como Administrador 👾" />
          <Tab label="Como Colaborador 🤖" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Typography variant="h6" gutterBottom>Salas donde eres Admin</Typography>
            <Grid container spacing={2}>
              {adminRooms.length > 0 ? (
                adminRooms.map(room => (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography>{room.room_name}</Typography>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={() => joinRoom(room.room_code)}
                        startIcon={<LoginIcon />}
                      >
                        Unirse
                      </Button>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography>No eres admin de ninguna sala</Typography>
              )}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography variant="h6" gutterBottom>Salas donde eres Colaborador</Typography>
            <Grid container spacing={2}>
              {collaboratorRooms.length > 0 ? (
                collaboratorRooms.map(room => (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Paper sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                      <Typography>{room.room_name}</Typography>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={() => joinRoom(room.room_code)}
                        startIcon={<LoginIcon />}
                      >
                        Unirse
                      </Button>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography>No participas en ninguna sala como colaborador</Typography>
              )}
            </Grid>
          </>
        )}

        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 4 }}
        >
          Cerrar sesión
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
