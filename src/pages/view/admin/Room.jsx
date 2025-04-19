import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../sockets/socket';
import Diagram from '../components/Diagram';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';

const Room = () => {
  const { roomCode } = useParams();
  const diagramRef = useRef(null);
  const [, setUsersInRoom] = useState([]); // sólo para recibir usuarios

  useEffect(() => {
    const username = localStorage.getItem('username');

    // Unirse a la sala
    socket.emit('join_room', roomCode, username);

    // Escuchar usuarios conectados
    socket.on('users_in_room', (users) => {
      setUsersInRoom(users);
    });

    // Escuchar cambios de otros usuarios
    socket.on('diagram_update', (data) => {
      if (diagramRef.current) {
        diagramRef.current.applyChangesFromSocket(data);
      }
    });

    return () => {
      socket.off('users_in_room');
      socket.off('diagram_update');
    };
  }, [roomCode]);

  // Enviar cambios a otros usuarios
  const handleDiagramChange = (changes) => {
    socket.emit('diagram_change', { roomCode, changes });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Sala: {roomCode}
        </Typography>

        <Box mt={2}>
          <Diagram
            roomCode={roomCode}
            ref={diagramRef}
            onDiagramChange={handleDiagramChange}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Room;
