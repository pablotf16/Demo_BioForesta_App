import { useState, useCallback } from 'react';

const regionesChile = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana de Santiago", "O'Higgins", "Maule", "Ñuble",
  "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
];

const App = () => {
  // Navegación: 'auth', 'generador', 'comprador', 'estadisticas'
  const [vistaActual, setVistaActual] = useState('auth');
  
  // Estados de Autenticación
  const [modoAuth, setModoAuth] = useState('registro'); // 'registro' o 'login'
  const [rolUsuario, setRolUsuario] = useState('generador'); // 'generador' o 'comprador'
  const [errorAuth, setErrorAuth] = useState('');

  // Estados Operativos
  const [contadorRetiros, setContadorRetiros] = useState(0);
  const [volumenMovidoHistorico, setVolumenMovidoHistorico] = useState(0);
  const [inventario, setInventario] = useState({
    "Chips / Ramas": 200,
    "Corteza": 150
  });
  const [mitigacionCO2, setMitigacionCO2] = useState(-0.32);

  // Estado dinámico para el catálogo del comprador
  const [materialSeleccionado, setMaterialSeleccionado] = useState('Corteza');

  // --- MANEJADORES DE EVENTOS ---

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorAuth('');

    if (modoAuth === 'registro') {
      const region = e.target.region?.value;
      if (!region) {
        setErrorAuth('Por favor, selecciona una región válida en el menú desplegable.');
        return;
      }
      alert(`¡Registro exitoso! Ingresando a tu panel de ${rolUsuario.toUpperCase()}...`);
    } else {
      alert(`¡Inicio de sesión exitoso! Bienvenido de vuelta a tu panel de ${rolUsuario.toUpperCase()}.`);
    }
    
    // Al autenticar, lo mandamos directo a su panel exclusivo
    setVistaActual(rolUsuario);
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
    
    alert(`✅ ¡Éxito! Has publicado ${volumen} m³ de ${tipo}. Nuestro equipo gestionará el retiro pronto.`);
    form.reset();
    // Ya no cambiamos de vista, se queda aquí para poder seguir publicando
  }, []);

  const handleComprar = useCallback((e) => {
    e.preventDefault();
    const form = e.target;
    const tipo = materialSeleccionado;
    const volumenRequerido = Number(form.volumenCompra.value);

    if (!volumenRequerido || volumenRequerido <= 0) {
      alert("Por favor, ingrese un volumen de compra válido.");
      return;
    }
    
    if (inventario[tipo] < volumenRequerido) {
      alert(`❌ Stock insuficiente. Solo hay ${inventario[tipo]} m³ de ${tipo} disponibles en acopio.`);
      return;
    }

    setInventario(prev => ({ ...prev, [tipo]: prev[tipo] - volumenRequerido }));
    setVolumenMovidoHistorico(prev => prev + volumenRequerido);
    setMitigacionCO2(prev => prev - (volumenRequerido * 0.0005));
    
    alert(`✅ ¡Orden de Compra Confirmada! Se despacharán ${volumenRequerido} m³ de ${tipo} a tus instalaciones.`);
    form.reset();
    // Se queda en la vista del comprador para hacer más pedidos si quiere
  }, [inventario, materialSeleccionado]);

  // Maneja el botón de "Cerrar sesión"
  const handleLogout = () => {
    setVistaActual('auth');
    setModoAuth('login');
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-sm selection:bg-blue-200 flex flex-col items-center relative">
      
      {/* BOTÓN FLOTANTE ESTADÍSTICAS GLOBALES */}
      {vistaActual !== 'auth' && vistaActual !== 'estadisticas' && (
        <div className="absolute top-6 right-8 z-50 flex gap-4">
          <button 
            onClick={() => setVistaActual('estadisticas')}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-full shadow-sm transition-all hover:shadow-md"
            title="Ver Impacto Global de la Plataforma"
          >
            <span className="text-base">🌍</span>
            <span className="hidden md:inline">Impacto Global</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 font-bold px-4 py-2 rounded-full shadow-sm transition-all"
          >
            <span>🚪</span>
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      )}

      {/* ENCABEZADO GLOBAL (Oculto en Auth) */}
      {vistaActual !== 'auth' && (
        <header className="mb-10 text-center w-full max-w-4xl mt-12 md:mt-0">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">BioForesta Energía</h1>
          <p className="text-blue-600 font-medium mt-2 text-lg">
            {vistaActual === 'generador' ? 'Módulo Operativo de Generación' : 
             vistaActual === 'comprador' ? 'Módulo Operativo de Demanda' : 
             'Tablero de Impacto Público'}
          </p>
        </header>
      )}

      <div className="w-full max-w-4xl flex justify-center">

        {/* =========================================================
            VISTA 0: PANTALLA DE AUTENTICACIÓN (LOGIN / REGISTRO)
        ========================================================= */}
        {vistaActual === 'auth' && (
          <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-200 animate-fade-in my-auto">
            <div className="text-center mb-8">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">🌱</div>
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

            {/* SELECTOR DE ROL (Visible en Registro y Login) */}
            <div className="mb-2 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">Ingresar como:</div>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRolUsuario('generador')}
                className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${rolUsuario === 'generador' ? 'bg-white shadow-sm text-green-700 border-b-2 border-green-500' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <span className="text-lg">🌲</span> Generador
              </button>
              <button
                type="button"
                onClick={() => setRolUsuario('comprador')}
                className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${rolUsuario === 'comprador' ? 'bg-white shadow-sm text-teal-700 border-b-2 border-teal-500' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <span className="text-lg">🏭</span> Comprador
              </button>
            </div>

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
                    <input type="text" required placeholder="Ej: contacto@empresa.cl" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Contraseña</label>
                    <input type="password" required placeholder="••••••••" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none transition" />
                  </div>
                </>
              )}

              {/* CAMPOS DE REGISTRO */}
              {modoAuth === 'registro' && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nombre y apellido <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Ej: Juan Pérez" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {rolUsuario === 'generador' ? 'Región de retiro' : 'Región de entrega'} <span className="text-red-500">*</span>
                    </label>
                    <select name="region" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none text-slate-700">
                      <option value="">Selecciona una región</option>
                      {regionesChile.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Dirección <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="Ej: Av. Principal 123" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Empresa (Opcional)</label>
                    <input type="text" placeholder={rolUsuario === 'generador' ? 'Ej: Forestal Arauco' : 'Ej: Planta Pellet Sur'} className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-blue-500 outline-none" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors mt-6 text-lg">
                {modoAuth === 'registro' ? 'Crear Cuenta' : 'Ingresar a mi Panel'}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================
            VISTA 1: PANEL GENERADOR
        ========================================================= */}
        {vistaActual === 'generador' && (
          <div className="max-w-md mx-auto w-full animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-green-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-green-100 p-3 rounded-xl text-2xl">🌲</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Mi Panel</h2>
                  <p className="text-slate-500 text-sm">Registra nueva disponibilidad</p>
                </div>
              </div>
              <form className="space-y-6" onSubmit={handlePublicar}>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Tipo de biomasa</label>
                  <select name="tipoResiduo" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-green-500 outline-none text-slate-700 font-medium">
                    <option value="Chips / Ramas">Chips / Ramas</option>
                    <option value="Corteza">Corteza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Volumen a retirar (m³)</label>
                  <input name="volumen" type="number" min="1" placeholder="Ej: 20" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-green-500 outline-none text-slate-700 font-medium" />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md mt-6 text-lg transition-colors">
                  Solicitar Retiro Logístico
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            VISTA 2: PANEL COMPRADOR
        ========================================================= */}
        {vistaActual === 'comprador' && (
          <div className="max-w-md mx-auto w-full animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-teal-500">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-teal-100 p-3 rounded-xl text-2xl">🏭</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Mi Panel</h2>
                  <p className="text-slate-500 text-sm">Genera órdenes de compra</p>
                </div>
              </div>
              <form className="space-y-6" onSubmit={handleComprar}>
                <div>
                  <label className="block text-slate-600 font-medium mb-2">Catálogo de Material</label>
                  <select 
                    name="catalogo" 
                    value={materialSeleccionado}
                    onChange={(e) => setMaterialSeleccionado(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium"
                  >
                    <option value="Corteza">🪵 Corteza (Para Pellet)</option>
                    <option value="Chips / Ramas">🍂 Chips / Ramas (Biomasa Ind.)</option>
                  </select>
                </div>
                
                {/* INDICADOR DE STOCK EN TIEMPO REAL */}
                <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-teal-800 font-medium text-sm">Stock disponible en red:</span>
                  <span className="font-bold text-teal-700 bg-white px-3 py-1 rounded-lg border border-teal-200">
                    {inventario[materialSeleccionado]} m³
                  </span>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-2">Volumen a solicitar (m³)</label>
                  <input name="volumenCompra" type="number" min="1" placeholder="Ej: 30" className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:border-teal-500 outline-none text-slate-700 font-medium" />
                </div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-md mt-6 text-lg transition-colors">
                  Confirmar y Generar Orden
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            VISTA 3: PANEL ESTADÍSTICAS GLOBALES
        ========================================================= */}
        {vistaActual === 'estadisticas' && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <button onClick={() => setVistaActual(rolUsuario)} className="text-slate-500 font-bold mb-4 flex items-center gap-1 hover:text-slate-800">
              ← Volver a mi panel
            </button>
            <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border-t-8 border-orange-500 text-slate-100">
              <h2 className="text-2xl font-bold text-white mb-2">Impacto Global de la Red</h2>
              <p className="text-slate-400 mb-8">Métricas históricas y ambientales acumuladas por todos los usuarios.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-inner">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Volumen Histórico Movido</p>
                  <p className="font-extrabold text-4xl text-orange-400">{volumenMovidoHistorico} <span className="text-lg font-medium text-slate-400">m³</span></p>
                </div>
                <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-inner">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Toneladas CO₂e Mitigadas</p>
                  <p className="font-extrabold text-4xl text-emerald-400">{mitigacionCO2.toFixed(3)} <span className="text-lg font-medium text-slate-400">t</span></p>
                </div>
              </div>

              <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                <div className="flex justify-between items-center text-lg mb-3 border-b border-slate-600/50 pb-3">
                  <span className="text-slate-300">🚚 Total de retiros coordinados</span>
                  <span className="font-bold text-white bg-slate-800 px-4 py-1 rounded-lg">{contadorRetiros}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-300">🪵 Inventario total actual en centros</span>
                  <span className="font-bold text-white bg-slate-800 px-4 py-1 rounded-lg">{inventario["Chips / Ramas"] + inventario["Corteza"]} m³</span>
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