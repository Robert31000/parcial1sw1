import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { exportDiagramToXMI } from '../utils/exportDiagramToXMI';

const ExportButton = ({ diagram }) => {
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    exportDiagramToXMI(diagram);
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExport}
      >
        Exportar a XMI
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Diagrama exportado como XMI correctamente.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportButton;
