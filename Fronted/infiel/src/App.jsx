import { useState, useEffect } from 'react';

// --- ICONOS SVG (Sin cambios) ---
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const AlertIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);

function App() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [fechaActualizacion, setFechaActualizacion] = useState('');

  // ⚠️ URL API
  const API_URL = 'https://infieles.onrender.com/api/infieles'; 
  //const API_URL = 'http://localhost:5000/api/infieles'

  useEffect(() => {
    const controller = new AbortController();
    const obtenerDatos = async () => {
      setCargando(true);
      try {
        const url = busqueda ? `${API_URL}?busqueda=${busqueda}` : API_URL;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Error');
        const data = await response.json();
        setLista(data);
        setFechaActualizacion(new Date().toLocaleString());
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    const timeoutId = setTimeout(obtenerDatos, 400);
    return () => { clearTimeout(timeoutId); controller.abort(); };
  }, [busqueda]);


  // --- KEEP ALIVE: Evitar que Render se duerma ---
  useEffect(() => {
    // ⚠️ Asegúrate de usar la URL de producción aquí, no localhost
    const URL_PRODUCCION = 'https://infieles.onrender.com/api/infieles';

    const pingServer = () => {
      fetch(URL_PRODUCCION)
        .then(() => console.log('💓 Ping de mantenimiento enviado a Render'))
        .catch(err => console.error('Error en ping de mantenimiento:', err));
    };

    // 1. Hacer un ping inmediato al cargar la app
    pingServer();

    // 2. Configurar el intervalo cada 5 minutos (300,000 ms)
    // Render suspende servicios gratuitos tras 15 minutos de inactividad.
    const intervalId = setInterval(pingServer, 5 * 60 * 1000);

    // 3. Limpiar el intervalo si el usuario cierra la pestaña
    return () => clearInterval(intervalId);
  }, []);


  const getAvatarColor = (name) => {
    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];
    return colors[(name?.length || 0) % colors.length];
  };

  const formatearFecha = (fecha) => {
    if(!fecha) return 'Fecha desconocida';
    return new Date(fecha).toLocaleDateString('es-ES', { dateStyle: 'long' });
  };

  return (
    <div className="main-container">
      {/* --- ESTILOS HÍBRIDOS (CSS + RESPONSIVE) --- 
         Aquí ocurre la magia para adaptar tu diseño elegante a móviles.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        
        :root {
          --sidebar-bg: #0f172a;
          --bg-color: #f8fafc;
          --text-main: #334155;
          --text-muted: #94a3b8;
        }

        body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); }
        
        /* Layout Principal */
        .main-container { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

        /* --- SIDEBAR (Panel de Control) --- */
        .sidebar {
          width: 320px; background-color: var(--sidebar-bg); color: #e2e8f0;
          display: flex; flex-direction: column; padding: 40px 30px;
          flex-shrink: 0; z-index: 10; box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          overflow-y: auto;
        }
        
        .brand-container { margin-bottom: 40px; }
        .logo-icon { font-size: 3rem; margin-bottom: 10px; display: block; }
        .app-title { margin: 0; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .app-subtitle { margin: 0; font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }

        .search-section { flex: 1; }
        .search-label { font-size: 0.75rem; color: #64748b; font-weight: 700; margin-bottom: 15px; display: block; letter-spacing: 1px; }
        
        /* Input Mejorado */
        .input-wrapper { position: relative; margin-bottom: 20px; }
        .icon-position { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .search-input {
          width: 100%; padding: 16px 20px 16px 50px; border-radius: 12px;
          border: 1px solid #334155; background-color: #1e293b; color: white;
          font-size: 1rem; outline: none; transition: border 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }

        .status-badge { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #94a3b8; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .sidebar-footer { border-top: 1px solid #334155; padding-top: 20px; font-size: 0.75rem; color: #64748b; margin-top: 20px; }

        /* --- CONTENT AREA (Derecha) --- */
        .content-area { flex: 1; overflow-y: auto; padding: 40px 60px; position: relative; scroll-behavior: smooth; }
        
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
        .results-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0; }
        .result-count { background-color: #e2e8f0; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; color: #475569; }

        /* Grid System */
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }

        /* Cards */
        .card {
          background-color: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
          cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex; flex-direction: column;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        
        .card-header { padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .avatar { width: 48px; height: 48px; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; }
        .verified-badge { font-size: 0.6rem; font-weight: 800; color: #94a3b8; border: 1px solid #cbd5e1; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }
        
        .card-body { padding: 25px 20px; flex: 1; }
        .card-name { margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
        .card-role { margin: 0; font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .card-meta { margin-top: 15px; display: flex; align-items: center; gap: 5px; color: #94a3b8; font-size: 0.8rem; }
        
        .card-footer { padding: 15px 20px; border-top: 1px solid #f1f5f9; background-color: #fff; }
        .view-btn { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: transparent; color: #0f172a; font-weight: 600; cursor: pointer; font-size: 0.85rem; }

        /* Disclaimer Box (Énfasis solicitado) */
        .disclaimer-box {
          margin-top: 60px; padding: 20px; background-color: #fef2f2; 
          border: 1px solid #fee2e2; border-left: 5px solid #ef4444; border-radius: 8px;
          display: flex; align-items: flex-start; gap: 15px;
        }
        .disclaimer-text strong { color: #b91c1c; display: block; margin-bottom: 5px; font-size: 0.9rem; }
        .disclaimer-text p { margin: 0; font-size: 0.8rem; color: #7f1d1d; line-height: 1.4; }

        /* Modal */
        .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background-color: white; width: 900px; max-width: 100%; height: 500px; border-radius: 20px; display: flex; overflow: hidden; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
        .close-btn { position: absolute; top: 20px; right: 20px; background: transparent; border: none; cursor: pointer; color: #64748b; z-index: 5; }
        .modal-left { width: 35%; background-color: #f8fafc; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1px solid #e2e8f0; }
        .modal-right { width: 65%; padding: 50px 40px; overflow-y: auto; }
        
        .modal-avatar { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; }
        .modal-name { font-size: 1.5rem; font-weight: 800; text-align: center; margin: 0 0 10px 0; color: #0f172a; }
        .modal-tag { padding: 5px 15px; background-color: #e2e8f0; border-radius: 20px; font-size: 0.85rem; color: #475569; font-weight: 600; }
        
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .info-box span { display: block; }
        .info-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; margin-bottom: 5px; }
        .info-value { font-size: 1rem; font-weight: 600; color: #334155; }
        .explanation-container { background-color: #fffbeb; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; }

        /* --- RESPONSIVE MEDIA QUERIES (Móvil) --- */
        @media (max-width: 768px) {
          .main-container { flex-direction: column; height: 100vh; }
          
          /* Sidebar se convierte en Header */
          .sidebar { 
            width: 100%; height: auto; padding: 15px 20px; 
            flex-direction: column; gap: 10px; overflow: visible;
            box-sizing: border-box; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .brand-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; width: 100%; }
          .logo-icon { font-size: 1.5rem; margin: 0; display: inline-block; margin-right: 10px; }
          .app-title { font-size: 1.2rem; display: inline-block; }
          .app-subtitle { display: none; }
          
          .search-section { width: 100%; margin: 0; }
          .search-label { display: none; }
          .input-wrapper { margin-bottom: 0; }
          
          /* Input Legible en Móvil */
          .search-input { 
            padding: 12px 15px 12px 45px; 
            font-size: 16px; /* Evita zoom en iOS */
            height: 48px; /* Área táctil cómoda */
          }
          .icon-position { font-size: 1.2rem; }

          .status-badge, .sidebar-footer { display: none; } /* Ocultar info secundaria en el header */

          /* Contenido Principal */
          .content-area { padding: 20px 15px; padding-bottom: 80px; }
          .content-header { flex-direction: column; align-items: flex-start; gap: 10px; margin-bottom: 20px; }
          .results-title { font-size: 1.4rem; }
          
          .grid-container { grid-template-columns: 1fr; gap: 15px; } /* Una sola columna */
          
          /* Modal Responsivo */
          .modal { flex-direction: column; height: 90vh; overflow-y: auto; }
          .modal-left { width: 100%; padding: 30px 20px; border-right: none; border-bottom: 1px solid #e2e8f0; height: auto; flex-shrink: 0; box-sizing: border-box; }
          .modal-right { width: 100%; padding: 20px; box-sizing: border-box; height: auto; }
          .info-grid { grid-template-columns: 1fr 1fr; gap: 15px; } /* Info en 2 columnas */
          
          /* Disclaimer en móvil */
          .disclaimer-box { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>

      {/* --- SIDEBAR IZQUIERDO (Panel de Control) --- */}
      <aside className="sidebar">
        <div className="brand-container">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span className="logo-icon">🕵️‍♂️</span>
            <div>
               <h1 className="app-title">Base de Datos Infieles</h1>
               <p className="app-subtitle">Base de Datos Nacional - BOB</p>
            </div>
          </div>
        </div>

        <div className="search-section">
          <label className="search-label">BÚSQUEDA DE REGISTROS</label>
          <div className="input-wrapper">
            <div className="icon-position"><SearchIcon /></div>
            <input 
              type="text" 
              placeholder="Buscar nombre..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
              autoComplete="off"
            />
          </div>
          <div className="status-badge">
            <span className="dot" style={{backgroundColor: cargando ? '#fbbf24' : '#34d399'}}></span>
            {cargando ? 'Sincronizando base de datos...' : 'Sistema en línea'}
          </div>
        </div>

        <div className="sidebar-footer">
          <p style={{opacity: 0.6, margin: 0}}>Actualizado:</p>
          <p style={{color: '#fff', margin: '5px 0'}}>{fechaActualizacion}</p>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (Grid de Resultados) --- */}
      <main className="content-area">
        <header className="content-header">
          <h2 className="results-title">
            {busqueda ? `Resultados: "${busqueda}"` : 'Registros Recientes'}
          </h2>
          <span className="result-count">{lista.length} Datos por defecto</span>
        </header>

        <div className="grid-container">
          {lista.map((item) => (
            <div key={item._id} className="card" onClick={() => setPersonaSeleccionada(item)}>
              <div className="card-header">
                <div className="avatar" style={{backgroundColor: getAvatarColor(item.Nombre_infiel)}}>
                  {item.Nombre_infiel?.charAt(0).toUpperCase()}
                </div>
                 {/*<span className="verified-badge">VERIFICADO</span>*/}
              </div>
              
              <div className="card-body">
                <h3 className="card-name">{item.Nombre_infiel || 'Anónimo'}</h3>
                <p className="card-role">{item.Profesion || 'Sin profesión'}</p>
                
                <div className="card-meta">
                  <LocationIcon /> {item.Ciudad_origen || 'Desconocida'}
                </div>
              </div>

              <div className="card-footer">
                <button className="view-btn">Ver Detalles Completos</button>
              </div>
            </div>
          ))}

          {lista.length === 0 && !cargando && (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#94a3b8'}}>
              <div style={{fontSize: '3rem', opacity: 0.2}}>📭</div>
              <p>No se encontraron expedientes con ese nombre.</p>
            </div>
          )}
        </div>

        {/* --- DISCLAIMER DE ALTO IMPACTO --- */}
        <div className="disclaimer-box">
          <AlertIcon />
          <div className="disclaimer-text">
             <strong>⚠️ AVISO IMPORTANTE:</strong>
             <p>No nos hacemos responsables si su nombre aparece en este listado. Nos deslindamos de cualquier responsabilidad sobre la información mostrada.</p>
             <p style={{marginTop: '5px', fontStyle: 'italic', opacity: 0.8}}>Los datos se obtuvieron de fuentes públicas (archivos Excel).</p>
          </div>
        </div>
      </main>

      {/* --- MODAL "DOSSIER" (Responsive) --- */}
      {personaSeleccionada && (
        <div className="overlay" onClick={() => setPersonaSeleccionada(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPersonaSeleccionada(null)}>
              <CloseIcon />
            </button>
            
            <div className="modal-left">
              <div className="modal-avatar" style={{backgroundColor: getAvatarColor(personaSeleccionada.Nombre_infiel)}}>
                <UserIcon />
              </div>
              <h2 className="modal-name">{personaSeleccionada.Nombre_infiel}</h2>
              <span className="modal-tag">{personaSeleccionada.Profesion}</span>
            </div>

            <div className="modal-right">
              <h3 style={{fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>INFORMACIÓN DEL INFIEL</h3>
              
              <div className="info-grid">
                <div className="info-box">
                  <span className="info-label">EDAD</span>
                  <span className="info-value">{personaSeleccionada.Edad || 'N/A'} años</span>
                </div>
                <div className="info-box">
                  <span className="info-label">CIUDAD</span>
                  <span className="info-value">{personaSeleccionada.Ciudad_origen}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">FECHA REPORTE</span>
                  <span className="info-value">{formatearFecha(personaSeleccionada.Hora_registro)}</span>
                </div>
              </div>

              <div className="explanation-container">
                <span className="info-label" style={{color: '#c2410c'}}>DECLARACIÓN / EXPLICACIÓN</span>
                <p style={{margin: '10px 0 0 0', fontStyle: 'italic', color: '#78350f', lineHeight: '1.6'}}>
                  "{personaSeleccionada.Explicacion_infidelidad || 'No se proporcionaron detalles adicionales para este expediente.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;