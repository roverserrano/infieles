import { useState, useEffect } from 'react';


// --- ICONOS SVG ---
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const AlertIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const ArrowLeftIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>);
const ClockIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);

function App() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [fechaActualizacion, setFechaActualizacion] = useState('');
  
  const [vista, setVista] = useState('lista'); 

  // ESTADO NUEVO: Datos del formulario
  const [formData, setFormData] = useState({
    Nombre_infiel: '', Ciudad_origen: '', Sexo: '', Edad: '', Profesion: '', Explicacion_infidelidad: ''
  });
  const [enviando, setEnviando] = useState(false);

  // ⚠️ URL API
   const API_URL = 'https://infieles.onrender.com/api/infieles'; 
  //const API_URL = 'http://localhost:5000/api/infieles';

  // --- OBTENER DATOS (GET) ---
  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const url = busqueda ? `${API_URL}?busqueda=${busqueda}` : API_URL;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error');
      const data = await response.json();
      setLista(data);
      setFechaActualizacion(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  //Validacion del formulatio de new datos
  const handleSubmitVal = async (e) => {
    e.preventDefault();

    // --- VALIDACIÓN DE CAMPOS VACÍOS ---
    if (
      !formData.Nombre_infiel.trim() || 
      !formData.Ciudad_origen ||          
      !formData.Sexo ||                   
      !formData.Edad || 
      !formData.Profesion.trim() || 
      !formData.Explicacion_infidelidad.trim()
    ) {
      alert('⚠️ Por favor, completa TODOS los campos obligatorios antes de guardar.');
      return; 
    }

    setEnviando(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if(response.ok) {
        alert('✅ Registro guardado exitosamente');
        setFormData({ Nombre_infiel: '', Ciudad_origen: '', Sexo: '', Edad: '', Profesion: '', Explicacion_infidelidad: '' });
        setVista('lista'); 
        obtenerDatos(); 
      } else {
        alert('❌ Error al guardar el registro en el servidor');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    // Solo cargar datos si estamos en la vista de lista
    if(vista === 'lista') {
      const timeoutId = setTimeout(obtenerDatos, 400);
      return () => clearTimeout(timeoutId);
    }
  }, [busqueda, vista]);

  // --- MANEJO FORMULARIO ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if(response.ok) {
        alert('Registro guardado exitosamente');
        setFormData({ Nombre_infiel: '', Ciudad_origen: '', Sexo: '', Edad: '', Profesion: '', Explicacion_infidelidad: '' });
        setVista('lista');
        obtenerDatos(); 
      } else {
        alert('Error al guardar el registro');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const getAvatarColor = (name) => {
    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];
    return colors[(name?.length || 0) % colors.length];
  };

  const formatearFecha = (fecha) => {
    if(!fecha) return 'Fecha desconocida';
    return new Date(fecha).toLocaleDateString('es-ES', { dateStyle: 'long' });
  };

  // --- KEEP ALIVE (Mantenimiento de sesión) ---
  useEffect(() => {
    const URL_PRODUCCION = 'https://infieles.onrender.com/api/infieles';
    const pingServer = async () => {
      try { await fetch(URL_PRODUCCION); console.log('💓 Ping'); } 
      catch (error) { console.error("⚠️ Error ping", error); }
    };
    pingServer();
    const intervalId = setInterval(pingServer, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        
        :root { --sidebar-bg: #0f172a; --bg-color: #f8fafc; --text-main: #334155; --text-muted: #94a3b8; --accent: #6366f1; }
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); }
        .main-container { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

        /* --- SIDEBAR --- */
        .sidebar { width: 320px; background-color: var(--sidebar-bg); color: #e2e8f0; display: flex; flex-direction: column; padding: 40px 30px; flex-shrink: 0; z-index: 10; overflow-y: auto; }
        .brand-container { margin-bottom: 30px; }
        .logo-icon { font-size: 3rem; margin-bottom: 10px; display: block; }
        .app-title { margin: 0; font-size: 1.8rem; font-weight: 800; background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .app-subtitle { margin: 0; font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }

        /* Controles Sidebar */
        .search-section { flex: 1; display: flex; flex-direction: column; gap: 15px; }
        .search-label { font-size: 0.75rem; color: #64748b; font-weight: 700; margin-bottom: 10px; display: block; letter-spacing: 1px; }
        .input-wrapper { position: relative; }
        .icon-position { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .search-input { width: 100%; padding: 14px 20px 14px 45px; border-radius: 12px; border: 1px solid #334155; background-color: #1e293b; color: white; font-size: 0.95rem; outline: none; box-sizing: border-box; }
        .search-input:focus { border-color: var(--accent); }

        /* Botón Insertar */
        .action-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          background-color: var(--accent); color: white; border: none; padding: 14px;
          border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; 
          font-size: 1rem;
        }
        .action-btn:hover { background-color: #4f46e5; transform: translateY(-2px); }
        .action-btn.secondary { background-color: #1e293b; border: 1px solid #334155; }
        .action-btn.secondary:hover { background-color: #334155; }
        
        /* Footer Sidebar */
        .sidebar-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 5px; }
        .update-label { font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; }
        .update-time { color: #cbd5e1; font-weight: 500; font-family: monospace; font-size: 0.95rem; }
        .status-badge { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; background: rgba(16, 185, 129, 0.1); color: #34d399; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); width: fit-content; }
        .dot-status { width: 6px; height: 6px; border-radius: 50%; background-color: #34d399; box-shadow: 0 0 8px #34d399; }

        /* --- CONTENT AREA --- */
        .content-area { flex: 1; overflow-y: auto; padding: 40px 60px; position: relative; scroll-behavior: smooth; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .results-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0; }
        .result-count { background-color: #e2e8f0; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; color: #475569; }

        /* --- CARDS PRO --- */
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; padding-bottom: 40px; }
        
        .card { 
          background-color: white; border-radius: 20px; overflow: hidden; 
          border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.3s ease; 
          display: flex; flex-direction: column; position: relative;
        }
        .card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        
        .card-banner { height: 80px; width: 100%; opacity: 0.8; }
        .card-avatar-container { margin-top: -40px; margin-left: 20px; display: flex; }
        .avatar-pro { 
          width: 70px; height: 70px; border-radius: 20px; color: white; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 1.8rem; font-weight: 700; border: 4px solid white; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .card-body { padding: 15px 25px 25px 25px; flex: 1; }
        .card-name { margin: 10px 0 5px 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .card-role { margin: 0 0 15px 0; font-size: 0.8rem; color: #64748b; font-weight: 500; text-transform: uppercase; }
        
        .tags-container { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
        .tag { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .tag.location { background-color: #f1f5f9; color: #475569; }
        .tag.sex { background-color: #fff1f2; color: #e11d48; }
        .tag.sex.male { background-color: #eff6ff; color: #2563eb; }

        .card-footer-link {
          padding: 15px 25px; border-top: 1px solid #f8fafc; font-size: 0.85rem; font-weight: 600;
          color: var(--accent); display: flex; justify-content: flex-end; gap: 5px;
        }

        /* --- FORMULARIO STYLES (INTACTOS) --- */
        .form-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: #475569; }
        .form-input, .form-select, .form-textarea { padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 1rem; font-family: inherit; transition: 0.2s; width: 100%; box-sizing: border-box; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .form-textarea { resize: vertical; min-height: 100px; }
        .btn-submit { background-color: var(--accent); color: white; padding: 15px; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 1rem; width: 100%; margin-top: 10px; }
        .btn-submit:hover { background-color: #4f46e5; }
        .btn-submit:disabled { background-color: #94a3b8; cursor: not-allowed; }

        /* Otros */
        .disclaimer-box { margin-top: 60px; padding: 20px; background-color: #fef2f2; border: 1px solid #fee2e2; border-left: 5px solid #ef4444; border-radius: 8px; display: flex; gap: 15px; }
        
        /* --- ESTILOS DEL MODAL PRO --- */
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .overlay { 
          position: fixed; inset: 0; 
          background-color: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(8px); 
          z-index: 100; 
          display: flex; align-items: center; justify-content: center; 
          padding: 20px; 
        }

        .modal { 
          background: white; 
          width: 850px; max-width: 100%; 
          border-radius: 24px; 
          display: flex; 
          overflow: hidden; 
          position: relative; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
          animation: modalFadeIn 0.3s ease-out; 
        }

        .close-btn { 
          position: absolute; top: 20px; right: 20px; 
          background: rgba(255,255,255,0.8); 
          border: 1px solid #e2e8f0; border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; z-index: 10; 
          transition: all 0.2s;
        }
        .close-btn:hover { background: #f1f5f9; color: #0f172a; transform: rotate(90deg); }

        .modal-left { 
          width: 35%; 
          background: #f8fafc; 
          padding: 50px 30px; 
          display: flex; flex-direction: column; align-items: center; 
          border-right: 1px solid #f1f5f9; 
          text-align: center;
        }
        
        .modal-avatar-lg { 
          width: 120px; height: 120px; 
          border-radius: 30px; 
          display: flex; align-items: center; justify-content: center; 
          color: white; font-size: 2.5rem; 
          margin-bottom: 25px; 
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        .modal-right { width: 65%; padding: 50px; display: flex; flex-direction: column; justify-content: center; }

        .section-title { 
          font-size: 0.75rem; font-weight: 800; color: #94a3b8; 
          letter-spacing: 0.1em; text-transform: uppercase; 
          margin-bottom: 25px; display: block; 
        }

        .info-grid-pro { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }

        .data-group { display: flex; flex-direction: column; gap: 5px; }
        .data-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .data-value { font-size: 1.1rem; color: #1e293b; font-weight: 600; }

        .quote-box {
          background-color: #f8fafc;
          border-radius: 16px;
          padding: 30px;
          position: relative;
          border: 1px solid #e2e8f0;
        }
        .quote-icon {
          position: absolute; top: -12px; left: 20px;
          background: white; padding: 0 10px;
          color: #cbd5e1; font-size: 1.5rem;
        }
        .quote-text {
          font-size: 0.95rem; line-height: 1.6; color: #475569;
          font-style: italic; margin: 0;
        }

        @media (max-width: 768px) {
          .main-container { flex-direction: column; }
          .sidebar { width: 100%; height: auto; padding: 15px 20px; gap: 10px; box-sizing: border-box; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
          .brand-container { margin-bottom: 10px; display: flex; justify-content: space-between; width: 100%; }
          .search-section { width: 100%; }
          .search-label { display: none; }
          .input-wrapper { margin-bottom: 10px; }
          .action-btn { font-size: 0.9rem; padding: 10px; }
          
          .content-area { padding: 20px 15px; padding-bottom: 80px; }
          .grid-container, .form-grid { grid-template-columns: 1fr; }
          
          /* Modal Responsive */
          .modal { flex-direction: column; height: auto; max-height: 90vh; overflow-y: auto; }
          .modal-left { width: 100%; padding: 40px 20px; border-right: none; border-bottom: 1px solid #f1f5f9; box-sizing: border-box; }
          .modal-right { width: 100%; padding: 30px 20px; box-sizing: border-box; }
          .info-grid-pro { gap: 20px; }
        }
      `}</style>

      {/* --- SIDEBAR IZQUIERDO --- */}
      <aside className="sidebar">
        <div className="brand-container">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span className="logo-icon">🕵️‍♂️</span>
            <div>
               <h1 className="app-title">Base de Datos Infieles - BOB</h1>
               <p className="app-subtitle" style={{display: 'none'}}>Base de Datos Nacional</p>
            </div>
          </div>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="search-section">
          {vista === 'lista' ? (
            <>
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
              
              <button className="action-btn" onClick={() => setVista('formulario')}>
                <PlusIcon /> Insertar Nuevo Dato
              </button>

              <div className="status-badge">
                <span className="dot-status"></span>
                <span>Sistema en línea</span>
              </div>
            </>
          ) : (
            <button className="action-btn secondary" onClick={() => setVista('lista')}>
              <ArrowLeftIcon /> Volver a la Lista
            </button>
          )}
        </div>

        {/* Footer Sidebar (Hora y Status) */}
        <div className="sidebar-footer">
          <div className="update-label">
            <ClockIcon /> Actualización
          </div>
          <div className="update-time">
            {fechaActualizacion || '--:--'}
          </div>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <main className="content-area">
        
        {/* VISTA 1: LISTADO MEJORADO */}
        {vista === 'lista' && (
          <>
            <header className="content-header">
              <h2 className="results-title">
                {busqueda ? `Resultados: "${busqueda}"` : 'Registros Recientes'}
              </h2>
              <span className="result-count">{lista.length} Registros</span>
            </header>

            <div className="grid-container">
              {lista.map((item) => {
                // Lógica de color y renderizado
                const colorBase = getAvatarColor(item.Nombre_infiel);
                const isMale = item.Sexo === 'Masculino';
                
                return (
                  <div key={item._id} className="card" onClick={() => setPersonaSeleccionada(item)}>
                    
                    {/* Cabecera con degradado */}
                    <div className="card-banner" style={{background: `linear-gradient(135deg, ${colorBase}88, ${colorBase})`}}></div>

                    {/* Avatar Flotante */}
                    <div className="card-avatar-container">
                      <div className="avatar-pro" style={{backgroundColor: colorBase}}>
                        {item.Nombre_infiel?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Cuerpo */}
                    <div className="card-body">
                      <h3 className="card-name">{item.Nombre_infiel || 'Anónimo'}</h3>
                      <p className="card-role">{item.Profesion || 'Sin profesión'}</p>
                      
                      <div className="tags-container">
                        <div className="tag location"><LocationIcon /> {item.Ciudad_origen || 'Desconocida'}</div>
                        {item.Sexo && <div className={`tag sex ${isMale ? 'male' : ''}`}>{item.Sexo}</div>}
                        {item.Edad && <div className="tag" style={{border: '1px solid #e2e8f0', color: '#64748b'}}>{item.Edad} años</div>}
                      </div>
                    </div>
                    
                    {/* Footer Card */}
                    <div className="card-footer-link">
                      Ver Detalles <span>→</span>
                    </div>
                  </div>
                );
              })}
              
              {lista.length === 0 && !cargando && (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#94a3b8'}}>
                  <p>No se encontraron expedientes.</p>
                </div>
              )}
            </div>
            
            <div className="disclaimer-box">
              <AlertIcon />
              <div style={{fontSize: '0.8rem', color: '#7f1d1d'}}>
                 <strong>⚠️ AVISO IMPORTANTE:</strong>
                 <p style={{margin: 0}}>Los datos mostrados son de carácter público. No nos hacemos responsables de la información.</p>
              </div>
            </div>
          </>
        )}

        {/* VISTA 2: FORMULARIO DE REGISTRO (SIN TOCAR) */}
        {vista === 'formulario' && (
          <div className="form-container">
            <h2 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.8rem', color: '#1e293b'}}>Nuevo Registro</h2>
            <p style={{marginBottom: '30px', color: '#64748b'}}>Complete los datos para registrar un nuevo registro en la base de datos nacional.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input 
                    required 
                    name="Nombre_infiel" 
                    value={formData.Nombre_infiel} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="Ingrese nombre completo" 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Ciudad de Origen *</label>
                  <select 
                    required 
                    name="Ciudad_origen" 
                    value={formData.Ciudad_origen} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="La Paz">La Paz</option>
                    <option value="Oruro">Oruro</option>
                    <option value="Sucre">Sucre</option>
                    <option value="Potosi">Potosí</option>
                    <option value="Tarija">Tarija</option>
                    <option value="Beni">Beni</option>
                    <option value="Pando">Pando</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sexo *</label>
                  <select 
                    required 
                    name="Sexo" 
                    value={formData.Sexo} 
                    onChange={handleInputChange} 
                    className="form-select"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Edad *</label>
                  <input 
                    required 
                    name="Edad" 
                    value={formData.Edad} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="Ingrese la Edad" 
                    type="number" 
                    min="15" 
                    max="99"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Profesión / Ocupación *</label>
                  <input 
                    required 
                    name="Profesion" 
                    value={formData.Profesion} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="Ingrese la profesión" 
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Explicación / Detalle de Infidelidad *</label>
                  <textarea 
                    required 
                    name="Explicacion_infidelidad" 
                    value={formData.Explicacion_infidelidad} 
                    onChange={handleInputChange} 
                    className="form-textarea" 
                    placeholder="Describa brevemente lo sucedido..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar Registro'}
              </button>
              
              <div className="disclaimer-box" style={{marginTop: '20px'}}>
                <AlertIcon />
                  <div style={{fontSize: '0.8rem', color: '#7f1d1d'}}>
                    <strong>⚠️ AVISO IMPORTANTE:</strong>
                    <p style={{margin: 0}}>Le pedimos describir la Explicación / Detalle de la situación de infidelidad de forma clara y respetuosa. Evite insultos o comentarios denigrantes. La información será pública.</p>
              </div>
            </div>
            </form>
          </div>
        )}

      </main>

      {/* --- MODAL DETALLE PRO (CORREGIDO) --- */}
      {personaSeleccionada && (
        <div className="overlay" onClick={() => setPersonaSeleccionada(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            
            <button className="close-btn" onClick={() => setPersonaSeleccionada(null)}>
              <CloseIcon />
            </button>
            
            {/* LADO IZQUIERDO (PERFIL) */}
            <div className="modal-left">
              {/* Aquí estaba el error antes, faltaba el div del avatar */}
              <div className="modal-avatar-lg" style={{backgroundColor: getAvatarColor(personaSeleccionada.Nombre_infiel)}}>
                 {personaSeleccionada.Nombre_infiel?.charAt(0).toUpperCase()}
              </div>
            
              <h2 style={{fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px 0', color: '#0f172a', lineHeight: 1.2}}>
                {personaSeleccionada.Nombre_infiel}
              </h2>
              
              <span style={{
                padding: '6px 16px', background: 'white', border: '1px solid #e2e8f0', 
                borderRadius: '50px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600,
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                {personaSeleccionada.Profesion || 'Sin Profesión'}
              </span>
            </div>

            {/* LADO DERECHO (DATOS) */}
            <div className="modal-right">
              
              <span className="section-title">Datos Infiel</span>
              
              <div className="info-grid-pro">
                <div className="data-group">
                  <span className="data-label">Edad</span>
                  <span className="data-value">{personaSeleccionada.Edad ? `${personaSeleccionada.Edad} años` : 'N/A'}</span>
                </div>
                <div className="data-group">
                  <span className="data-label">Sexo</span>
                  <span className="data-value">{personaSeleccionada.Sexo || 'No especificado'}</span>
                </div>
                <div className="data-group">
                  <span className="data-label">Ubicación</span>
                  <span className="data-value">{personaSeleccionada.Ciudad_origen}</span>
                </div>
                <div className="data-group">
                  <span className="data-label">Registrado</span>
                  <span className="data-value">{formatearFecha(personaSeleccionada.Hora_registro)}</span>
                </div>
              </div>

              <span className="section-title">Detalle de los hechos</span>
              
              <div className="quote-box">
                <div className="quote-icon">❝</div>
                <p className="quote-text">
                  {personaSeleccionada.Explicacion_infidelidad 
                    ? personaSeleccionada.Explicacion_infidelidad 
                    : "No hay detalles registrados en el expediente para este caso."}
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