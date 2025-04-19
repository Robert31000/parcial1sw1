import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido a la Plataforma de Generación de Código Frontend
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Crea interfaces increíbles desde mockups de forma colaborativa. Genera proyectos en Angular, edita, guarda y colabora en tiempo real.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to="/auth/login" variant="contained" color="primary">
          Iniciar Sesión
        </Button>
        <Button component={Link} to="/auth/register" variant="outlined" color="primary">
          Registrarse
        </Button>
      </Box>
    </Container>
  );
}
