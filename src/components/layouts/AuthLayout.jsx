import { Outlet } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

export default function AuthLayout() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>Bienvenido</Typography>
        <Typography variant="body1">Por favor, inicia sesión o regístrate</Typography>
      </Box>
      {/* Aquí se renderiza Login o Register */}
      <Outlet />
    </Container>
  );
}
