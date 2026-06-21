import { useState, useCallback } from 'react';

const regionesChile = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana de Santiago", "O'Higgins", "Maule", "Ñuble",
  "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
];

const App = () => {
  // Navegación: 'auth', 'inicio', 'generador', 'comprador', 'acopio', 'estadisticas'
  const [vistaActual, setVistaActual] = useState('auth');
  
  // Estados de Autenticación
  const [modoAuth, setModoAuth] = useState('registro'); // 'registro' o 'login'
  const [rolRegistro, setRolRegistro] = useState('generador'); // 'generador' o 'comprador'
  const [errorAuth, setErrorAuth] = useState('');

  // Estados Operativos
  const [compraRealizada, setCompraRealizada] = useState(false);
  const [contadorRetiros, setContadorRetiros] = useState(0);
  const [volumenMovidoHistorico, setVolumenMovidoHistorico] = useState(0);
  const [inventario, setInventario] = useState({
    "Chips / Ramas": 200,
    "Corteza": 150
  });
  const [mitigacionCO2, setMitigacionCO2] = useState(-0.32);

  // --- MANEJADORES DE EVENTOS ---

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorAuth('');

    if (modoAuth === 'registro') {
      const region = e.target.region.value;
      if (!region) {
        setErrorAuth('Por favor, selecciona una región válida en el menú desplegable.');
        return;
      }
      alert(`¡Registro exitoso como ${rolRegistro.toUpperCase()}!`);
      setVistaActual(rolRegistro); // Redirige directo a su panel
    } else {
      // Login simulado (acepta cualquier cosa)
      alert('¡Inicio de sesión exitoso! Bienvenido de vuelta.');
      setVistaActual('inicio'); // Redirige al hub central
    }
  };

  const handlePublicar = useCallback((e) => {
    e.preventDefault();
    const form = e.target;
    const tipo = form.tipoResiduo.value;
    const volumen = Number(form.volumen.value);
    
    if (!volumen || volumen <= 0) {
      alert("Por favor, ingrese un volumen válido mayor a 0.");
      return;
    }

    setInventario(prev => ({ ...prev, [tipo]: prev[tipo] + volumen }));
    setVolumenMovidoHistorico(prev => prev + volumen);
    setContadorRetiros(prev => prev + 1);
    setMitigacionCO2(prev => prev - (volumen * 0.0015)); 
    
    alert(`✅ Oferta registrada en acopio: ${volumen} m³ de ${tipo}`);
    form.reset();
    setVistaActual('inicio');
  }, []);

  const handleComprar = useCallback((e) => {
    e.preventDefault();
    if (compraRealizada) {
      alert("Solo puedes realizar una solicitud de compra por sesión en esta demo.");
      return;
    }

    const form = e.target;
    const tipo = form.catalogo.value;
    const volumenRequerido = Number(form.volumenCompra.value);

    if (!volumenRequerido || volumenRequerido <= 0) {
      alert("Por favor, ingrese un volumen de compra válido.");
      return;
    }
    if (inventario[tipo] < volumenRequerido) {
      alert(`❌ Stock insuficiente. Solo hay ${inventario[tipo]} m³ de ${tipo} disponibles.`);
      return;
    }

    setInventario(prev => ({ ...prev, [tipo]: prev[tipo] - volumenRequerido }));
    setVolumenMovidoHistorico(prev => prev + volumenRequerido);
    setMitigacionCO2(prev => prev - (volumenRequerido * 0.0005));
    
    setCompraRealizada(true);
    alert(`✅ ¡Orden confirmada! Despachando ${volumenRequerido} m³ de ${tipo}.`);
    setVistaActual('acopio');
  }, [inventario, compraRealizada]);

  const inventarioTotalActual = inventario["Chips / Ramas"] + inventario["Corteza"];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-sm selection:bg-blue-200 flex flex-col items-center relative">
      
      {/* BOTÓN FLOTANTE ESTADÍSTICAS (Oculto en Auth) */}
      {vistaActual !== 'auth' && (
        <div className="absolute top-6 right-8 z-50">
          <button 
            onClick={() => setVistaActual('estadisticas')}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-full shadow-sm transition-all hover:shadow-md"
          >
            <span className="text-base">📦</span>
            <span>Retiros:</span>
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-mono">{contadorRetiros}</span>
          </button>
        </div>
      )}

      {/* ENCABEZADO GLOBAL (Oculto en Auth) */}
      {vistaActual !== 'auth' && (
        <header className="mb-10 text-center w-full max-w-4xl cursor-pointer mt-12 md:mt-0" onClick={() => setVistaActual('inicio')}>
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight hover:text-blue-700 transition">BioForesta Energía</h1>
          <p className="text-blue-600 font-medium mt-2 text-lg">Plataforma Logística, Ambiental y Energética</p>
        </header>
      )}

      <div className="w-full max-w-4xl flex justify-center">

        {/* =========================================================
            VISTA 0: PANTALLA DE AUTENTICACIÓN (LOGIN / REGISTRO)
        ========================================================= */}
        {vistaActual === 'auth' && (
          <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-200 animate-fade-in my-auto">
            
            <div className="text-center mb-8">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                🌱
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800">Bienvenido a BioForesta</h1>
              <p className="text-slate-500 mt-1">Conectando la biomasa de Chile</p>
            </div>

            <div className="flex justify-end mb-6">
              <button 
                type="button"
                onClick={() => {
                  setModoAuth(modoAuth === 'registro' ? 'login' : 'registro');
                  setErrorAuth('');
                }}
                className="text-sm font-bold text-orange-600 hover:text-orange-700 underline transition-colors"
              >
                {modoAuth === 'registro' ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}
              </button>
            </div>

            {/* SELECTOR DE ROL (Solo visible en Registro) */}
            {modoAuth === 'registro' && (
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setRolRegistro('generador')}
                  className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${rolRegistro === 'generador' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="text-lg">⚙️</span> Soy Generador
                </button>
                <button
                  type="button"
                  onClick={() => setRolRegistro('comprador')}
                  className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${rolRegistro === 'comprador' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="text-lg">🛍️</span> Soy Comprador
                </button>
              </div>
            )}

            {errorAuth && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm font-medium text-center">
                {errorAuth}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* CAMPOS DE LOGIN */}
              {modoAuth === 'login' && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Usuario o Correo</label>
                    <input type="text" required placeholder="Ej: pablo@empresa.cl" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-0 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Contraseña</label>
                    <input type="password" required placeholder="••••••••" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-0 focus:border-blue-500 outline-none transition" />
                  </div>
                </>
              )}

              {/* CAMPOS DE REGISTRO */}
              {modoAuth === 'registro' && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nombre y apellido del solicitante <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Ej: Juan Pérez" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">RUT o ID</label>
                      <input type="text" placeholder="Opcional" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Teléfono</label>
                      <input type="tel" placeholder="Opcional" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {rolRegistro === 'generador' ? 'Región de retiro' : 'Región de entrega'} <span className="text-red-500">*</span>
                    </label>
                    <select name="region" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition text-slate-700">
                      <option value="">Selecciona una región</option>
                      {regionesChile.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-slate-600 font-medium mb-1">Dirección (Calle y N°) <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="Ej: Av. Principal 123" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Comuna</label>
                      <input type="text" placeholder="Opcional" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Empresa</label>
                    <input type="text" placeholder={rolRegistro === 'generador' ? 'Ej: Minera Escondida' : 'Ej: Cencosud'} className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors mt-6 text-lg">
                {modoAuth === 'registro' ? 'Continuar' : 'Ingresar'}
              </button>

              {modoAuth === 'registro' && (
                <p className="text-center text-xs text-slate-400 mt-4">
                  Al continuar aceptas nuestros <a href="#" className="text-blue-500 hover:underline">Términos y Condiciones</a>
                </p>
              )}
            </form>
          </div>
        )}

        {/* --- VISTA 1: HUB CENTRAL (INICIO) --- */}
        {vistaActual === 'inicio' && (
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-700 mb-8">Selecciona tu módulo operativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
              <button onClick={() => setVistaActual('generador')} className="group flex flex-col items-center justify-center bg-white p-10 rounded-3xl shadow-md border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all">
                <div className="bg-green-100 p-4 rounded-full text-5xl mb-4 group-hover:scale-110 transition-transform">🌲</div>
                <h3 className="text-xl font-bold text-slate-800">Panel Generador</h3>
              </button>
              <button onClick={() => setVistaActual(compraRealizada ? 'acopio' : 'comprador')} className="group flex flex-col items-center justify-center bg-white p-10 rounded-3xl shadow-md border-2 border-transparent hover:border-teal-500 hover:shadow-xl transition-all">
                <div className="bg-teal-100 p-4 rounded-full text-5xl mb-4 group-hover:scale-110 transition-transform">🏭</div>
                <h3 className="text-xl font-bold text-slate-800">Panel Comprador</h3>
              </button>
            </div>
          </div>
        )}

        {/* --- VISTA 2: PANEL GENERADOR --- */}
        {vistaActual === 'generador' && (
          <div className="max-w-md mx-auto w-full animate-fade-in">
            <button onClick={() => setVistaActual('inicio')} className="text-blue-600 font-bold mb-4 flex items-center gap-1 hover:underline">← Volver</button>
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-green-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-100 p-3 rounded-xl text-2xl">🌲</div>
                <h2 className="text-2xl font-bold text-slate-800">Generador</h2>
              </div>
              <form className="space-y-6" onSubmit={handlePublicar}>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Tipo de biomasa</label>
                  <select name="tipoResiduo" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-green-500 outline-none">
                    <option value="Chips / Ramas">Chips / Ramas</option>
                    <option value="Corteza">Corteza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Volumen a retirar (m³)</label>
                  <input name="volumen" type="number" min="1" placeholder="Ej: 20" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-green-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md mt-6 text-lg">Solicitar Retiro</button>
              </form>
            </div>
          </div>
        )}

        {/* --- VISTA 3: PANEL COMPRADOR --- */}
        {vistaActual === 'comprador' && (
          <div className="max-w-md mx-auto w-full animate-fade-in">
            <button onClick={() => setVistaActual('inicio')} className="text-blue-600 font-bold mb-4 flex items-center gap-1 hover:underline">← Volver</button>
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-teal-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-teal-100 p-3 rounded-xl text-2xl">🏭</div>
                <h2 className="text-2xl font-bold text-slate-800">Comprador</h2>
              </div>
              <form className="space-y-6" onSubmit={handleComprar}>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Catálogo de Material</label>
                  <select name="catalogo" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-teal-500 outline-none">
                    <option value="Corteza">🪵 Corteza (Para Pellet)</option>
                    <option value="Chips / Ramas">🍂 Chips / Ramas (Biomasa Ind.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Volumen de compra (m³)</label>
                  <input name="volumenCompra" type="number" min="1" placeholder="Ej: 30" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-teal-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-md mt-6 text-lg">Generar Orden de Compra</button>
              </form>
            </div>
          </div>
        )}

        {/* --- VISTA 4 & 5 (Se mantienen igual, acortadas por espacio) --- */}
        {(vistaActual === 'acopio' || vistaActual === 'estadisticas') && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <button onClick={() => setVistaActual('inicio')} className="text-slate-500 font-bold mb-4 flex items-center gap-1 hover:text-slate-800">← Volver</button>
            <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border-t-8 border-slate-500 text-slate-100">
              <h2 className="text-2xl font-bold text-white mb-6">
                {vistaActual === 'acopio' ? 'Estado del Centro de Acopio' : 'Panel Histórico Global'}
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-700 p-6 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-2">{vistaActual === 'acopio' ? 'Volumen Disponible' : 'Total Volumen Movido'}</p>
                  <p className="font-extrabold text-4xl text-green-400">{vistaActual === 'acopio' ? inventarioTotalActual : volumenMovidoHistorico} <span className="text-lg">m³</span></p>
                </div>
                <div className="bg-slate-700 p-6 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-2">Mitigación Lograda</p>
                  <p className="font-extrabold text-4xl text-teal-400">{mitigacionCO2.toFixed(3)} <span className="text-lg">t CO₂e</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;