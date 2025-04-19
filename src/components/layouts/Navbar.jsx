import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo o título */}
        <Typography variant="h6" component="div">
          DiagramColab
        </Typography>

        {/* Enlaces de navegación */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
          <Button color="inherit" component={RouterLink} to="/register">
            Register
          </Button>
          <Button color="inherit" component={RouterLink} to="/create-room">
            Crear Sala
          </Button>
          <Button color="inherit" component={RouterLink} to="/join-room">
            Unirse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
