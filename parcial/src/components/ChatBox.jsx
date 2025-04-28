// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';                // npm install jszip
import { jsPDF } from 'jspdf';
import ProjectZipper from './ProjectZipper';

const MODEL  = 'llama3-8b-8192';
const APIKEY = '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';

export default function ChatBox({ projectId }) {
  const [text, setText]     = useState('');
  const [messages, setMsg]  = useState([]);
  const endRef              = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    setMsg(m => [...m, { role:'user', content:text }]);
    const prompt = text; setText('');
    try {
      const { data } = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        { model: MODEL, messages:[{ role:'user', content:prompt }] },
        { headers:{ 'Content-Type':'application/json',
                    Authorization:`Bearer ${APIKEY}` } }
      );
      const answer = data.choices[0].message.content;
      setMsg(m => [...m, { role:'assistant', content:answer }]);
    } catch (err) {
      console.error('Groq error:', err);
      setMsg(m => [...m, { role:'assistant', content:'X Error con el servicio IA.' }]);
    }
  };

  // Descargar un simple .txt
  const handleSaveTxt = (content) => {
    const blob = new Blob([content], { type:'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href      = url;
    a.download  = 'codigo-angular.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Empaquetar TODO el chat (o sólo el código) en un ZIP y renombrar .rar
  const handleDownloadRar = async () => {
    const zip = new JSZip();

    // Por ejemplo, cada mensaje de asistente lo guardamos como archivo de código
    messages.forEach((m, idx) => {
      if (m.role === 'assistant') {
        zip.file(`project_${idx+1}.ts`, m.content);
      }
    });

    // También podría haber un único archivo:
    // zip.file('codigo-angular.ts', messages.filter(m=>m.role==='assistant').map(m=>m.content).join('\n\n'));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href      = url;
    a.download  = `codigo-angular.rar`;   // en realidad es un ZIP, pero con extensión .rar
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    let y = 40;
    doc.setFontSize(14).text(`Conversación – Proyecto #${projectId}`, 40, 30);
    messages.forEach(m => {
      const prefix = m.role==='user'?'Yo:':'Asistente:';
      const lines  = doc.splitTextToSize(`${prefix} ${m.content}`, 500);
      doc.text(lines, 40, y);
      y += lines.length * 18;
      if (y > 780) { doc.addPage(); y = 40; }
    });
    doc.save(`chat_proyecto_${projectId}.pdf`);
  };

  return (
    <div className="flex flex-col w-80 h-80 bg-white rounded-xl border shadow">
      <header className="bg-blue-600 text-white text-center py-2 rounded-t-xl">
        Chat Asistencia
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50 text-sm">
        {messages.map((m,i)=>(
          <div key={i} className="group relative">
            <p className={m.role==='user'?'text-blue-700':'text-green-700'}>
              <b>{m.role==='user'?'Yo':'Asistente'}:</b> {m.content}
            </p>
            {m.role==='assistant' && (
              <div className="absolute right-0 top-0 hidden group-hover:flex gap-2">
                <button onClick={()=>handleSaveTxt(m.content)}
                        className="text-xs text-blue-500 underline">
                  Guardar .txt
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <form onSubmit={handleSend} className="flex border-t">
        <textarea
          rows={1}
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Escribe y Enter…"
          className="flex-1 resize-none p-2 text-sm outline-none"
          onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); handleSend(); } }}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4">
          Enviar
        </button>
      </form>
      <div className="flex">
        <button onClick={handleDownloadRar}
                className="flex-1 p-2 bg-indigo-600 text-white text-center rounded-bl-xl">
          Descargar .rar
        </button>
        <button onClick={handleExportPDF}
                className="flex-1 p-2 bg-red-600 text-white text-center rounded-br-xl">
          Exportar PDF
        </button>

      </div>
    </div>
  );
}
