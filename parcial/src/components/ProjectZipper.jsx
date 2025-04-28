// src/components/ProjectZipper.jsx
import React, { useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ProjectZipper() {
  const inputRef = useRef(null);

  // 1) Modo Chrome/Edge/Brave
  const pickAndDownload = async () => {
    const zip = new JSZip();

    if (window.showDirectoryPicker) {
      // Abre selector nativo de carpetas
      const dirHandle = await window.showDirectoryPicker();
      await addDirToZip(zip, dirHandle, '');
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'mi-proyecto.zip');
    } else {
      // Fallback: disparamos input para que el usuario escoja la carpeta manualmente
      inputRef.current.click();
    }
  };

  // 2) Fallback para Firefox (y todos los demás)
  const onFilesSelected = async e => {
    const zip = new JSZip();
    const { files } = e.target;
    for (const file of files) {
      // webkitRelativePath conserva la ruta interna
      zip.file(file.webkitRelativePath, file);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'mi-proyecto.zip');
    e.target.value = null; // limpia selección
  };

  return (
    <div>
      <button
        onClick={pickAndDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Descargar proyecto como ZIP
      </button>

      {/* input oculto para fallback */}
      <input
        ref={inputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        style={{ display: 'none' }}
        onChange={onFilesSelected}
      />
    </div>
  );
}

/**
 * Recorre recursivamente el DirectoryHandle y añade cada archivo al zip.
 */
async function addDirToZip(zipFolder, dirHandle, path) {
  for await (const [name, handle] of dirHandle.entries()) {
    const fullPath = path ? `${path}/${name}` : name;
    if (handle.kind === 'file') {
      const file = await handle.getFile();
      zipFolder.file(fullPath, await file.arrayBuffer());
    } else if (handle.kind === 'directory') {
      const sub = zipFolder.folder(name);
      await addDirToZip(sub, handle, fullPath);
    }
  }
}
