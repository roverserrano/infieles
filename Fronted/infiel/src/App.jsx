import { useState, useEffect } from 'react';

// --- ICONOS SVG ---
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#95a5a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3" fill="white"></circle>
  </svg>
);

function App() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

  // --- LÓGICA DE CONEXIÓN ---
  const cargarListaGeneral = async () => {
    setCargando(true);
    try {
      const response = await fetch('https://infieles.onrender.com/api/lista-general');
      const data = await response.json();
      setLista(data);
    } catch (error) {
      console.error("Error cargando general:", error);
    } finally {
      setCargando(false);
    }
  };

  const buscarPorNombre = async (termino) => {
    setCargando(true);
    try {
      const response = await fetch(`https://infieles.onrender.com/api/buscar-infiel?nombre=${termino}`);
      const data = await response.json();
      setLista(data);
    } catch (error) {
      console.error("Error buscando:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (busqueda.trim() === "") {
      cargarListaGeneral();
      return; 
    }
    const delayDebounceFn = setTimeout(() => {
      buscarPorNombre(busqueda);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // --- MANEJADORES DEL MODAL ---
  const abrirModal = (persona) => setPersonaSeleccionada(persona);
  const cerrarModal = () => setPersonaSeleccionada(null);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Desconocida";
    return new Date(fechaISO).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            <span style={{fontSize: '1.5rem'}}>🕵️</span> Base de Datos <span style={{color: '#e74c3c'}}></span>
          </h1>
          
          <div style={styles.searchContainer}>
            <div style={styles.searchIconWrapper}>
              <SearchIcon />
            </div>
            <input 
              type="text" 
              placeholder="Buscar Infiel (Ejemplo: Pepito Perez)" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={styles.input}
            />
          </div>
        </header>

        {/* LISTA DE CARDS */}
        <div style={styles.listContainer}>
          {lista.map((item) => (
            <div key={item._id} style={styles.card} onClick={() => abrirModal(item)}>
              
              <div style={styles.cardMain}>
                <div style={styles.avatar}>
                  {item.Nombre_infiel.charAt(0).toUpperCase()}
                </div>
                <div style={styles.info}>
                  <h3 style={styles.name}>{item.Nombre_infiel}</h3>
                  <div style={styles.locationWrapper}>
                    <PinIcon />
                    <span style={styles.city}>{item.Ciudad_origen.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.cardFooter}>
                <span style={styles.linkAction}>Ver Datos ➜</span>
              </div>

            </div>
          ))}

          {lista.length === 0 && !cargando && (
            <p style={{textAlign: 'center', color: '#95a5a6'}}>No se encontraron resultados.</p>
          )}
        </div>

        {/* --- NUEVO: DISCLAIMER / AVISO LEGAL --- */}
        <footer style={styles.disclaimer}>
          <p>⚠️ <strong>AVISO IMPORTANTE:</strong> No nos hacemos responsables si su nombre aparece en este listado. Nos deslindamos de cualquier responsabilidad sobre la información mostrada.</p>
          <p>Los datos se obtuvieron de fuentes públicas (archivos Excel).</p>
        </footer>

      </div>

      {/* --- MODAL DE DETALLE --- */}
      {personaSeleccionada && (
        <div style={styles.modalOverlay} onClick={cerrarModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={cerrarModal}>&times;</button>
            
            <div style={styles.modalHeader}>
              <div style={styles.modalAvatar}>{personaSeleccionada.Nombre_infiel.charAt(0).toUpperCase()}</div>
              <h2 style={{margin: '10px 0 5px 0', color: '#2c3e50'}}>{personaSeleccionada.Nombre_infiel}</h2>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.row}><strong style={styles.label}>Edad:</strong> {personaSeleccionada.Edad} años</div>
              <div style={styles.row}><strong style={styles.label}>Profesión:</strong> {personaSeleccionada.Profesion}</div>
              <div style={styles.row}><strong style={styles.label}>Ciudad:</strong> {personaSeleccionada.Ciudad_origen}</div>
              <div style={styles.row}><strong style={styles.label}>Registro:</strong> {formatearFecha(personaSeleccionada.Hora_registro)}</div>
              
              <div style={styles.explanationBox}>
                <p style={styles.explanationTitle}>📝 EXPLICACIÓN:</p>
                <p>"{personaSeleccionada.Explicacion_infidelidad}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// --- ESTILOS RESPONSIVOS ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  contentWrapper: {
    maxWidth: '600px',
    margin: '0 auto',
    paddingBottom: '40px', // Espacio extra para el footer
  },
  header: { marginBottom: '30px', textAlign: 'center' },
  title: {
    fontSize: '1.5rem', color: '#2c3e50', fontWeight: '700',
    marginBottom: '20px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px'
  },
  searchContainer: {
    position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderRadius: '50px', backgroundColor: 'white',
  },
  searchIconWrapper: {
    position: 'absolute', left: '20px', top: '50%',
    transform: 'translateY(-50%)', display: 'flex', alignItems: 'center',
  },
  input: {
    width: '100%', padding: '16px 20px 16px 50px', borderRadius: '50px',
    border: '1px solid #eee', fontSize: '16px', outline: 'none',
    boxSizing: 'border-box', color: '#555',
  },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer',
    transition: 'transform 0.1s ease', overflow: 'hidden', border: '1px solid #f0f0f0',
  },
  cardMain: { padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: {
    width: '50px', height: '50px', backgroundColor: '#2c3e50',
    color: 'white', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
    fontWeight: 'bold', flexShrink: 0,
  },
  info: { display: 'flex', flexDirection: 'column', gap: '4px' },
  name: { margin: 0, color: '#2c3e50', fontSize: '1.1rem', fontWeight: '700' },
  locationWrapper: { display: 'flex', alignItems: 'center', gap: '5px' },
  city: { color: '#95a5a6', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.5px' },
  divider: { height: '1px', backgroundColor: '#f9f9f9', width: '100%' },
  cardFooter: { padding: '12px 20px', textAlign: 'right', backgroundColor: '#fff' },
  linkAction: { color: '#3498db', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' },

  /* --- ESTILOS DEL DISCLAIMER (Nuevo) --- */
  disclaimer: {
    marginTop: '40px',
    padding: '20px',
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: '0.75rem',
    lineHeight: '1.5',
    borderTop: '1px solid #e0e0e0',
  },

  /* --- MODAL STYLES --- */
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white', width: '100%', maxWidth: '400px',
    borderRadius: '16px', padding: '30px', position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
  },
  closeButton: {
    position: 'absolute', top: '15px', right: '15px', background: 'none',
    border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999'
  },
  modalHeader: { textAlign: 'center', marginBottom: '20px' },
  modalAvatar: {
    width: '70px', height: '70px', backgroundColor: '#e74c3c', color: 'white',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '30px', fontWeight: 'bold', margin: '0 auto'
  },
  badge: {
    backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px',
    borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px'
  },
  modalBody: { fontSize: '14px', color: '#555' },
  row: { marginBottom: '8px', borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' },
  label: { color: '#2c3e50' },
  explanationBox: {
    marginTop: '20px', backgroundColor: '#fff8f8', padding: '15px',
    borderRadius: '8px', borderLeft: '3px solid #e74c3c', fontStyle: 'italic'
  },
  explanationTitle: {
    margin: '0 0 5px 0', fontSize: '10px', fontWeight: 'bold', color: '#e74c3c'
  }
};

export default App;