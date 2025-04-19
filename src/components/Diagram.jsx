import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import * as go from 'gojs';
import PropTypes from 'prop-types';
import socket from '../sockets/socket';
import { exportDiagramToXMI } from './ExportGoJs';
import { importDiagramFromXML } from './Importxml';

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
/* ─────────────────────────────────────────────────────── */

const $ = go.GraphObject.make;
const drawerWidth = 300;

/** ⚙️  Componente principal */
const Diagram = forwardRef(({ roomCode }, ref) => {
  /* ----- refs y estados básicos ----- */
  const diagramRef = useRef(null);
  const diagramInstance = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [attribute, setAttribute] = useState('');
  const [attributeType, setAttributeType] = useState('int');
  const [methodName, setMethodName] = useState('');
  const [methodType, setMethodType] = useState('void');
  const [nodeName, setNodeName] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });

  /* ----- helpers visuales ----- */
  const showSnack = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  /* ----- lógica de exportar / importar ----- */
  const handleExportToXML = () => {
    if (diagramInstance.current) {
      exportDiagramToXMI(diagramInstance.current);
      showSnack('Diagrama exportado.');
    }
  };
  const handleImportXML = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (diagramInstance.current) importDiagramFromXML(target.result, diagramInstance.current);
      showSnack('XML importado.');
    };
    reader.readAsText(file);
  };

  /* ----- dejar sala ----- */
  const handleLeaveRoom = () => {
    socket.emit('leave_room', { roomCode, username: 'TuNombre' });
    window.location.href = '/dashboard';
  };

  /* ---------- Socket & GoJS setup  (recortado) ---------- */
  /*    …  (todo tu código de sockets y plantillas GoJS)   */
  /* ----------------------------------------------------- */

  /* ----- panel lateral (Drawer) ----- */
  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Panel de control</Typography>

      <Stack spacing={1}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddEntity}>
          Añadir entidad
        </Button>
        <Button startIcon={<DeleteIcon />} color="error" variant="contained" onClick={handleDeleteSelection}>
          Eliminar selección
        </Button>
        <Divider />

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportToXML}>
            Exportar XMI
          </Button>
          <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
            Importar
            <input hidden accept=".xml" type="file" onChange={handleImportXML} />
          </Button>
        </Stack>

        <Button startIcon={<LogoutIcon />} color="warning" onClick={handleLeaveRoom}>
          Salir de la sala
        </Button>
      </Stack>

      {/* Usuarios conectados */}
      <Paper sx={{ mt: 3, p: 1, maxHeight: 120, overflow: 'auto' }}>
        <Typography variant="subtitle1">Usuarios</Typography>
        <List dense>
          {connectedUsers.map((u, i) => (
            <ListItem key={i}><ListItemText primary={u.username} /></ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat */}
      <Paper sx={{ mt: 3, p: 1, height: 200, overflow: 'auto' }}>
        {chatMessages.map((m, i) => <Typography key={i}>{m}</Typography>)}
      </Paper>
      <TextField
        size="small"
        fullWidth
        placeholder="Escribe un mensaje…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        sx={{ mt: 1 }}
      />
      <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={sendMessage}>
        Enviar
      </Button>
    </Box>
  );

  /* ----- drawer para atributos/métodos (cuando hay nodo) ----- */
  const rightDrawer = selectedNode && (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{ width: drawerWidth, flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, p: 2 } }}>
      <Typography variant="h6">Clase seleccionada</Typography>

      <TextField
        label="Nombre"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        size="small"
        fullWidth sx={{ my: 1 }}
      />
      <Button fullWidth variant="contained" onClick={handleEditNodeName}>Guardar nombre</Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Atributos</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          size="small"
          label="Nombre"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        />
        <Select size="small" value={attributeType} onChange={(e) => setAttributeType(e.target.value)}>
          {['int', 'char', 'float'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </Stack>
      <Button fullWidth sx={{ mt: 1 }} variant="outlined" onClick={handleAddAttribute}>
        Añadir atributo
      </Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Métodos</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          size="small"
          label="Nombre"
          value={methodName}
          onChange={(e) => setMethodName(e.target.value)}
        />
        <Select size="small" value={methodType} onChange={(e) => setMethodType(e.target.value)}>
          {['void', 'int', 'char', 'float'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </Stack>
      <Button fullWidth sx={{ mt: 1 }} variant="outlined" onClick={handleAddMethod}>
        Añadir método
      </Button>

      <Divider sx={{ my: 2 }} />
      {/* Botones de relaciones (puedes apilar mejor si prefieres) */}
      <Stack spacing={1}>
        <Button variant="contained" onClick={handleEnableAssociation}>Asociación</Button>
        <Button variant="contained" color="info" onClick={handleEnableAssociationDirect}>Asoc. directa</Button>
        <Button variant="contained" color="error" onClick={handleEnableComposition}>Composición</Button>
        <Button variant="contained" color="warning" onClick={handleEnableAggregation}>Agregación</Button>
        <Button variant="contained" color="primary" onClick={handleEnableGeneralization}>Generalización</Button>
        <Button variant="contained" color="secondary" onClick={handleEnableRecursion}>Recursividad</Button>
        <Button variant="outlined" onClick={handleEnableDependency}>Dependencia</Button>
        <Button variant="outlined" onClick={handleEnableManyToMany}>Tabla intermedia</Button>
        <Button variant="text" onClick={enableGeneralLinking}>Restablecer enlaces</Button>
      </Stack>
    </Drawer>
  );

  /* ----- render principal ----- */
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sala: {roomCode}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer izquierdo (panel de control) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>

      {/* Área de diagramación */}
      <Box
        ref={diagramRef}
        sx={{ flexGrow: 1, bgcolor: 'background.default', mt: 8 }} // mt por AppBar
      />

      {/* Drawer derecho (solo con nodo seleccionado) */}
      {rightDrawer}

      {/* Snackbar global */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.sev} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
});

/* ----- PropTypes y exportación ----- */
Diagram.propTypes = { roomCode: PropTypes.string.isRequired };
Diagram.displayName = 'Diagram';
export default Diagram;
