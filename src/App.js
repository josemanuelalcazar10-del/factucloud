import { useState, useRef, useCallback, useEffect } from "react";

// ════════════════════════════════════════
// SUPABASE CONFIG
// ════════════════════════════════════════
const SUPABASE_URL = "https://mlsvbmqpzgxlvghqsmpm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc3ZibXFwemd4bHZnaHFzbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTg0NjAsImV4cCI6MjA5NTc5NDQ2MH0.htxKoUmhQ3Mhj6hdLZTpyDIjMjDvqLSZ15uxsI-Wm54";




// ════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════
const ADMIN_EMAIL = "admin@factucloud.app";

// Login con Supabase Auth real
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setError("Introduce email y contraseña"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (data.error || !data.access_token) {
        setError("Email o contraseña incorrectos");
        setLoading(false); return;
      }
      onLogin(data.access_token, data.user);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div translate="no" style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans','Inter','Segoe UI',Arial,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap');`}</style>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>Facturación Inteligente</div>
          <div style={{ fontSize: 36, fontWeight: 300 }}>
<span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#1e293b" }}>Cloud</span>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, marginTop: 6 }}>v2.7 · IA Integrada</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 28, textAlign: "center" }}>Acceso privado</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Email</div>
            <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="tu@email.com" style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "12px 16px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Contraseña</div>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••••••" style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "12px 16px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
          </div>
          {error && <div style={{ padding: "10px 14px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, marginBottom: 16, textAlign: "center" }}>✕ {error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: loading ? "#e2e8f0" : "#f0a500", color: loading ? "#94a3b8" : "#1e293b", border: "none", padding: "14px", cursor: loading ? "not-allowed" : "pointer", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 8 }}>
            {loading ? "Verificando..." : "◈ Entrar"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>Acceso restringido · Solo personal autorizado</div>
      </div>
    </div>
  );
}


// ── LÍMITES POR PLAN ──────────────────────────
const PLAN_LIMITS = {
  basico:     { modulos: ["dashboard","clientes","proveedores","contabilidad","ajustes"], maxClientes: 10, maxFacturas: 50, maxProyectos: 3, ia: false },
  pro:        { modulos: ["dashboard","analitica","tesoreria","informes","obras","proveedores","clientes","nominas","presupuestos","contabilidad","documentos","agente","ajustes"], maxClientes: 100, maxFacturas: 500, maxProyectos: 20, ia: true },
  enterprise: { modulos: ["dashboard","analitica","tesoreria","informes","obras","proveedores","clientes","nominas","presupuestos","contabilidad","documentos","agente","ajustes"], maxClientes: 99999, maxFacturas: 99999, maxProyectos: 99999, ia: true },
};
const getPlan = (perfil) => PLAN_LIMITS[perfil?.plan] || PLAN_LIMITS.basico;

const EMPRESA = { nombre: "FactuCloud", cif: "B28123456", direccion: "Calle Industria 45, 28001 Madrid", tel: "91 234 56 78", email: "josemanuelalcazar10@gmail.com", banco: "ES12 1234 5678 9012 3456 7890" };

const formatEUR = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);
const formatEURd = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

const OBRAS_INIT = [];
const CLIENTES_INIT = [];
const PROVEEDORES_INIT = [];
const FACTURAS_INIT = [];

const ESTADO_COL = { "En ejecución": "#f0a500", "Pendiente inicio": "#7eb8f5", "Finalizada": "#4caf7d", "Cobrada": "#4caf7d", "Pendiente": "#f0a500", "Pagada": "#4caf7d", "Emitida": "#7eb8f5", "Borrador": "#666", "Aceptado": "#4caf7d", "Enviado": "#7eb8f5", "Rechazado": "#e05252" };

const Badge = ({ label }) => <span style={{ fontSize: 10, padding: "4px 12px", borderRadius: 20, background: `${ESTADO_COL[label] || "#555"}18`, color: ESTADO_COL[label] || "#aaa", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${ESTADO_COL[label] || "#555"}33`, whiteSpace: "nowrap" }}>{label}</span>;

const Bar = ({ v, color = "#f0a500" }) => <div style={{ height: 5, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${v}%`, background: v === 100 ? "#4caf7d" : color, borderRadius: 2, transition: "width .6s" }} /></div>;

const Card = ({ children, accent, onClick, selected }) => (
  <div onClick={onClick} style={{ background: selected ? "#12121e" : "#ffffff", border: `1px solid ${selected ? "#f0a500" : "#e2e8f0"}`, borderTop: accent ? `2px solid ${accent}` : undefined, borderRadius: 3, padding: "22px 24px", cursor: onClick ? "pointer" : "default", transition: "all .2s" }}>
    {children}
  </div>
);

// ════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════
function Dashboard({ obras, facturas, proveedores, clientes, setTab }) {
  const ingresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.total, 0);
  const gastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.total, 0);
  const pendCobro = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + f.total, 0);
  const margen = ingresos - gastos;
  const margenPct = ingresos > 0 ? ((margen / ingresos) * 100).toFixed(1) : 0;

  const hora = new Date().getHours();
  const saludo = hora < 13 ? "Buenos días" : hora < 20 ? "Buenas tardes" : "Buenas noches";
  const mesActual = new Date().toLocaleDateString("es-ES", { month: "long" });

  // Mini gráfica últimos 6 meses (simulada hasta conectar BD)
  const meses6 = ["Ene","Feb","Mar","Abr","May","Jun"].slice(0, new Date().getMonth() + 1).slice(-6);
  const datosGrafica = new Array(meses6.length).fill(0);
  if (ingresos > 0) datosGrafica[datosGrafica.length - 1] = ingresos;
  const maxGrafica = Math.max(...datosGrafica, 1);

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Panel de control</div>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: "#1e293b", letterSpacing: 1 }}>{saludo}, <span style={{ color: "#f0a500" }}>José Manuel</span></h2>
        <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>
          {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* KPIs principales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          ["Facturación total", ingresos === 0 ? "Sin datos" : formatEUR(ingresos), "#4caf7d", facturas.filter(f=>f.tipo==="ingreso").length + " facturas"],
          ["Gastos totales", gastos === 0 ? "Sin datos" : formatEUR(gastos), "#e05252", facturas.filter(f=>f.tipo==="gasto").length + " facturas"],
          ["Margen bruto", ingresos === 0 ? "Sin datos" : formatEUR(margen), margen >= 0 ? "#4caf7d" : "#e05252", `${margenPct}% sobre ingresos`],
          ["Pendiente cobro", pendCobro === 0 ? "Sin datos" : formatEUR(pendCobro), "#7eb8f5", "por cobrar"],
        ].map(([l, v, c, s]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "22px 24px", borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>{l}</div>
            <div style={{ fontSize: 26, color: c, fontWeight: 300, marginBottom: 6 }}>{v}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{s}</div>
          </div>
        ))}
      </div>

      {/* KPI del mes + Gráfica rápida */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 20 }}>

        {/* KPIs del mes */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>KPI del mes — {mesActual}</div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Clientes activos", clientes.length, "#7eb8f5", clientes.length > 0 ? `+${clientes.length} registrados` : "Sin clientes aún"],
              ["Proveedores", proveedores.length, "#a78bfa", proveedores.length > 0 ? `${proveedores.length} registrados` : "Sin proveedores aún"],
              ["Proyectos", obras.length, "#f0a500", obras.filter(o=>o.estado==="En ejecución").length + " activos"],
              ["Facturas emitidas", facturas.filter(f=>f.tipo==="ingreso").length, "#4caf7d", "este período"],
            ].map(([l, v, c, s]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{s}</div>
                </div>
                <div style={{ fontSize: 24, color: c, fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfica rápida */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Ingresos últimos 6 meses</div>
            <button onClick={() => setTab("analitica")} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 10, cursor: "pointer", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace" }}>VER ANALÍTICA →</button>
          </div>
          {ingresos === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 140, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 2, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8, color: "#e2e8f0" }}>📊</div>
              Sin datos aún
              <div style={{ fontSize: 10, marginTop: 6, color: "#222" }}>Registra facturas para ver la gráfica</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 120, marginBottom: 10 }}>
                {meses6.map((mes, i) => (
                  <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {datosGrafica[i] > 0 && <div style={{ fontSize: 8, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace" }}>{formatEUR(datosGrafica[i]).replace("€","")}</div>}
                    <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                      <div style={{ width: "100%", height: `${(datosGrafica[i] / maxGrafica) * 100}%`, background: i === meses6.length - 1 ? "#4caf7d" : "#4caf7d44", borderRadius: "3px 3px 0 0", minHeight: datosGrafica[i] > 0 ? 6 : 2, transition: "height 0.5s" }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{mes}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Total acumulado</span>
                <span style={{ fontSize: 14, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEUR(ingresos)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Últimas facturas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Últimas facturas</div>
            <button onClick={() => setTab("contabilidad")} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 10, cursor: "pointer", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace" }}>VER TODO →</button>
          </div>
          {facturas.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "20px 0", textAlign: "center" }}>Sin facturas registradas</div>
            : facturas.slice(0, 5).map(f => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 2, fontFamily: "'JetBrains Mono', monospace" }}>{f.numero || f.numeroFactura}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{typeof f.cliente === "string" ? f.cliente.split(" ")[0] : f.cliente?.nombre}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, color: f.tipo === "ingreso" ? "#4caf7d" : "#e05252", marginBottom: 3 }}>{f.tipo === "ingreso" ? "+" : "-"}{formatEUR(f.total)}</div>
                  <Badge label={f.estado} />
                </div>
              </div>
            ))
          }
        </Card>
      </div>

      <div style={{ marginTop: 16, background: "#ffffff", border: "1px solid #f0a50022", borderRadius: 3, padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf7d", boxShadow: "0 0 10px #4caf7d", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Agente IA monitorizando </span>
          <span style={{ fontSize: 12, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>josemanuelalcazar10@gmail.com</span>
          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}> — Procesará facturas automáticamente</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// OBRAS
// ════════════════════════════════════════
function Obras({ obras, setObras }) {
  const [sel, setSel] = useState(null);
  const [nuevo, setNuevo] = useState(false);
  const [form, setForm] = useState({ nombre: "", cliente: "", direccion: "", inicio: "", fin: "", presupuesto: "", estado: "Pendiente inicio" });
  const obra = obras.find(o => o.id === sel);

  const guardar = () => {
    if (!form.nombre) return;
    setObras(prev => [...prev, { ...form, id: Date.now(), progreso: 0, certificado: 0, incidencias: 0, color: "#f0a500", presupuesto: parseFloat(form.presupuesto) || 0 }]);
    setNuevo(false); setForm({ nombre: "", cliente: "", direccion: "", inicio: "", fin: "", presupuesto: "", estado: "Pendiente inicio" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— {obras.length} proyectos registrados</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo proyecto</button>
      </div>

      {nuevo && (
        <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo proyecto</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre del proyecto"], ["cliente", "Cliente"], ["direccion", "Dirección"], ["presupuesto", "Presupuesto (€)"], ["inicio", "Fecha inicio"], ["fin", "Fecha fin prevista"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {obras.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin proyectos — pulsa "+ Nuevo proyecto" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 360px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {obras.map(o => (
                <Card key={o.id} onClick={() => setSel(sel === o.id ? null : o.id)} selected={sel === o.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, color: "#1e293b", marginBottom: 4 }}>{o.nombre}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{o.cliente}</div>
                    </div>
                    <Badge label={o.estado} />
                  </div>
                  <Bar v={o.progreso} color={o.color} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
                    {[["Presupuesto", formatEUR(o.presupuesto)], ["Certificado", formatEUR(o.certificado)], ["Avance", `${o.progreso}%`]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#64748b" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {obra && (
              <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>Detalle</div>
                <h3 style={{ margin: "0 0 4px", fontWeight: 300, fontSize: 20, color: "#1e293b" }}>{obra.nombre}</h3>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>{obra.direccion}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[["Cliente", obra.cliente], ["Estado", obra.estado], ["Inicio", obra.inicio], ["Fin previsto", obra.fin], ["Certificado", formatEUR(obra.certificado)], ["Incidencias", obra.incidencias]].map(([k, v]) => (
                    <div key={k} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
                      <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 13, color: "#334155" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
              </div>
            )}
          </div>
      }
    </div>
  );
}

// ════════════════════════════════════════
// PROVEEDORES
// ════════════════════════════════════════
function Proveedores({ proveedores, setProveedores }) {
  const [sel, setSel] = useState(null);
  const [nuevo, setNuevo] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: "", cif: "", contacto: "", email: "", tel: "", categoria: "", tipo: "Proveedor", condicionesPago: "30 días", numeroCuenta: "", direccion: "", cp: "", ciudad: "" });
  const [formEdit, setFormEdit] = useState({});
  const prov = proveedores.find(p => p.id === sel);

  const guardar = () => {
    if (!form.nombre) return;
    setProveedores(prev => [...prev, { ...form, id: Date.now(), facturado: 0, pendiente: 0 }]);
    setNuevo(false); setForm({ nombre: "", cif: "", contacto: "", email: "", tel: "", categoria: "", tipo: "Proveedor", condicionesPago: "30 días", numeroCuenta: "", direccion: "", cp: "", ciudad: "" });
  };

  const guardarEdicion = () => {
    setProveedores(prev => prev.map(p => p.id === sel ? { ...p, ...formEdit } : p));
    setEditando(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— {proveedores.length} proveedores</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo proveedor</button>
      </div>

      {nuevo && (
        <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo proveedor</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre / Razón social"], ["cif", "CIF / NIF"], ["contacto", "Persona de contacto"], ["email", "Email"], ["tel", "Teléfono"], ["categoria", "Categoría (ej: Tecnología, Materiales...)"], ["direccion", "Dirección de facturación"], ["cp", "Código postal"], ["ciudad", "Ciudad"], ["numeroCuenta", "Número de cuenta (IBAN)"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Condiciones de pago</div>
              <select value={form.condicionesPago} onChange={e => setForm(p => ({ ...p, condicionesPago: e.target.value }))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                {["Al contado", "7 días", "15 días", "30 días", "45 días", "60 días", "90 días"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {proveedores.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin proveedores — pulsa "+ Nuevo proveedor" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {proveedores.map(p => (
                <Card key={p.id} onClick={() => setSel(sel === p.id ? null : p.id)} selected={sel === p.id}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 16, marginBottom: 14 }}>{p.nombre[0]}</div>
                  <div style={{ fontSize: 15, color: "#1e293b", marginBottom: 4 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{p.cif} · {p.categoria || p.tipo}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Pagado", formatEUR(p.facturado)], ["Pendiente", formatEUR(p.pendiente)]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#64748b" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {prov && (
              <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 20, marginBottom: 16 }}>{prov.nombre[0]}</div>
                <div style={{ fontSize: 20, color: "#1e293b", fontWeight: 300, marginBottom: 4 }}>{prov.nombre}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>{prov.cif} · {prov.especialidad || prov.tipo}</div>
                {editando ? (
                  <div>
                    <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                      {[["nombre","Nombre"],["cif","CIF/NIF"],["contacto","Contacto"],["email","Email"],["tel","Teléfono"],["categoria","Categoría"],["direccion","Dirección"],["cp","Código postal"],["ciudad","Ciudad"],["condicionesPago","Condiciones pago"],["numeroCuenta","IBAN"]].map(([k,label]) => (
                        <div key={k}>
                          <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                          <input value={formEdit[k]||""} onChange={e => setFormEdit(p => ({...p,[k]:e.target.value}))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "8px 12px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={guardarEdicion} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
                      <button onClick={() => setEditando(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 16px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                      {[["Contacto", prov.contacto], ["Email", prov.email], ["Teléfono", prov.tel], ["Dirección", prov.direccion], ["CP / Ciudad", prov.cp ? `${prov.cp} ${prov.ciudad||""}` : prov.ciudad], ["Categoría", prov.categoria], ["Condiciones pago", prov.condicionesPago], ["Número cuenta", prov.numeroCuenta], ["Total pagado", formatEUR(prov.facturado)], ["Pendiente pago", formatEUR(prov.pendiente)]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
                          <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</span>
                          <span style={{ fontSize: 13, color: "#64748b" }}>{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
                      <button onClick={() => { setFormEdit({...prov}); setEditando(true); }} style={{ background: "#f0a50015", border: "1px solid #f0a50033", color: "#f0a500", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>✎ Editar</button>
                      <button onClick={() => { setProveedores(prev => prev.filter(p => p.id !== prov.id)); setSel(null); }} style={{ background: "#e0525215", border: "1px solid #e0525233", color: "#e05252", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>✕ Eliminar</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
      }
    </div>
  );
}

// ════════════════════════════════════════
// CLIENTES
// ════════════════════════════════════════
function Clientes({ clientes, setClientes }) {
  const [sel, setSel] = useState(null);
  const [nuevo, setNuevo] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: "", cif: "", contacto: "", email: "", tel: "", tipo: "Promotor", direccion: "", cp: "", ciudad: "" });
  const [formEdit, setFormEdit] = useState({});
  const cl = clientes.find(c => c.id === sel);

  const guardar = () => {
    if (!form.nombre) return;
    setClientes(prev => [...prev, { ...form, id: Date.now(), facturado: 0, pendiente: 0 }]);
    setNuevo(false); setForm({ nombre: "", cif: "", contacto: "", email: "", tel: "", tipo: "Promotor", direccion: "", cp: "", ciudad: "" });
  };

  const guardarEdicion = () => {
    setClientes(prev => prev.map(c => c.id === sel ? { ...c, ...formEdit } : c));
    setEditando(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— {clientes.length} clientes</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo cliente</button>
      </div>

      {nuevo && (
        <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo cliente</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre / Razón social"], ["cif", "CIF / NIF"], ["contacto", "Persona de contacto"], ["email", "Email"], ["tel", "Teléfono"], ["tipo", "Tipo (Promotor/Empresa)"], ["direccion", "Dirección de facturación"], ["cp", "Código postal"], ["ciudad", "Ciudad"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {clientes.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin clientes — pulsa "+ Nuevo cliente" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {clientes.map(c => (
                <Card key={c.id} onClick={() => setSel(sel === c.id ? null : c.id)} selected={sel === c.id}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 16, marginBottom: 14 }}>{c.nombre[0]}</div>
                  <div style={{ fontSize: 15, color: "#1e293b", marginBottom: 4 }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{c.cif} · {c.tipo}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Facturado", formatEUR(c.facturado)], ["Pendiente", formatEUR(c.pendiente)]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#64748b" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {cl && (
              <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 20, marginBottom: 16 }}>{cl.nombre[0]}</div>
                <div style={{ fontSize: 20, color: "#1e293b", fontWeight: 300, marginBottom: 4 }}>{cl.nombre}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>{cl.cif} · {cl.tipo}</div>

                {editando ? (
                  <div>
                    <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                      {[["nombre","Nombre"],["cif","CIF/NIF"],["contacto","Contacto"],["email","Email"],["tel","Teléfono"],["tipo","Tipo"],["direccion","Dirección"],["cp","Código postal"],["ciudad","Ciudad"]].map(([k,label]) => (
                        <div key={k}>
                          <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                          <input value={formEdit[k]||""} onChange={e => setFormEdit(p => ({...p,[k]:e.target.value}))} style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "8px 12px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={guardarEdicion} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
                      <button onClick={() => setEditando(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 16px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                      {[["Contacto", cl.contacto], ["Email", cl.email], ["Teléfono", cl.tel], ["Dirección", cl.direccion], ["CP / Ciudad", cl.cp ? `${cl.cp} ${cl.ciudad||""}` : cl.ciudad], ["Total facturado", formatEUR(cl.facturado)], ["Pendiente cobro", formatEUR(cl.pendiente)]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
                          <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{k}</span>
                          <span style={{ fontSize: 13, color: "#64748b" }}>{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
                      <button onClick={() => { setFormEdit({...cl}); setEditando(true); }} style={{ background: "#f0a50015", border: "1px solid #f0a50033", color: "#f0a500", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>✎ Editar</button>
                      <button onClick={() => { setClientes(prev => prev.filter(c => c.id !== cl.id)); setSel(null); }} style={{ background: "#e0525215", border: "1px solid #e0525233", color: "#e05252", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>✕ Eliminar</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
      }
    </div>
  );
}


// ════════════════════════════════════════
// PRESUPUESTOS IA
// ════════════════════════════════════════
const PRESUPUESTO_PROMPT = `Eres un experto en construcción española. El usuario describe una obra o trabajo y tú generas un presupuesto detallado de materiales y subcontratas.
Devuelve SOLO JSON valido sin texto adicional:
{
  "titulo": "titulo del presupuesto",
  "obra": "descripcion del proyecto",
  "cliente": "nombre del cliente si se menciona",
  "fecha": "01/06/2026",
  "validez": "30/06/2026",
  "materiales": [
    {"descripcion": "nombre del material", "unidad": "ud/m2/ml/kg", "cantidad": 0, "precioUnit": 0, "total": 0}
  ],
  "subcontratas": [
    {"descripcion": "trabajo a subcontratar", "unidad": "ud/m2/ml/h", "cantidad": 0, "precioUnit": 0, "total": 0}
  ],
  "observaciones": "notas importantes sobre el presupuesto",
  "recomendaciones": ["recomendacion 1", "recomendacion 2"]
}
Usa precios de mercado espanoles actuales. Se detallado y profesional.`;

function Presupuestos({ facturas, setFacturas, lista: listaProp, setLista: setListaProp }) {
  const [input, setInput] = useState("");
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listaLocal, setListaLocal] = useState([]);
  const lista = listaProp !== undefined ? listaProp : listaLocal;
  const setLista = listaProp !== undefined ? setListaProp : setListaLocal;
  const [tab, setTab] = useState("nuevo");
  const [margen, setMargen] = useState(20);
  const [validezDias, setValidezDias] = useState(30);
  const [plantillas, setPlantillas] = useState([]);
  const [selDetalle, setSelDetalle] = useState(null);
  const [fasesParciales, setFasesParciales] = useState([]);

  const formatEURd = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

  // Precios historicos de presupuestos anteriores para contexto IA
  const preciosHistoricos = lista.slice(0, 5).map(p =>
    `Presupuesto anterior: ${p.titulo}, total ${formatEURd(p.total)}, materiales incluian: ${(p.materiales||[]).slice(0,3).map(m => m.descripcion + " a " + formatEURd(m.precioUnit) + "/ud").join(", ")}`
  ).join(". ");

  const generar = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(""); setPresupuesto(null);
    const contextoHistorico = preciosHistoricos ? `Referencia de precios historicos de esta empresa: ${preciosHistoricos}.` : "";
    const instruccionMargen = margen > 0 ? `Aplica un margen de beneficio del ${margen}% sobre los costes en los precios unitarios.` : "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: PRESUPUESTO_PROMPT,
          messages: [{ role: "user", content: `${contextoHistorico} ${instruccionMargen} ${input}. La fecha de validez es de ${validezDias} dias desde hoy.` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setPresupuesto(parsed);
      setFasesParciales([{ nombre: "Fase 1", porcentaje: 40, desc: "Inicio de obra" }, { nombre: "Fase 2", porcentaje: 40, desc: "Ejecucion" }, { nombre: "Fase 3", porcentaje: 20, desc: "Fin y liquidacion" }]);
    } catch { setError("No se pudo generar el presupuesto. Conecta la API Key de Anthropic."); }
    setLoading(false);
  };

  const totalMat = presupuesto ? presupuesto.materiales.reduce((s, m) => s + m.total, 0) : 0;
  const totalSub = presupuesto ? presupuesto.subcontratas.reduce((s, s2) => s + s2.total, 0) : 0;
  const totalPresup = totalMat + totalSub;

  const guardar = (estado = "Borrador") => {
    if (!presupuesto) return;
    const nuevo = { ...presupuesto, id: Date.now(), totalMat, totalSub, total: totalPresup, estado, margen, fases: fasesParciales, creadoEn: new Date().toLocaleDateString("es-ES"), validezDias };
    setLista(prev => [nuevo, ...prev]);
    setPresupuesto(null); setInput(""); setTab("lista");
  };

  const guardarPlantilla = () => {
    if (!presupuesto) return;
    setPlantillas(prev => [...prev, { ...presupuesto, id: Date.now(), nombre: presupuesto.titulo, creadoEn: new Date().toLocaleDateString("es-ES") }]);
    alert("Plantilla guardada");
  };

  const convertirAFactura = (pres) => {
    if (!setFacturas) return;
    const nuevaFactura = {
      id: Date.now(),
      numero: `F${Date.now()}`,
      numeroFactura: `F${new Date().getFullYear()}-${String(lista.length + 1).padStart(3, "0")}`,
      cliente: pres.cliente || "Cliente",
      concepto: pres.titulo,
      base: pres.total,
      iva: pres.total * 0.21,
      irpf: 0,
      total: pres.total * 1.21,
      fecha: new Date().toLocaleDateString("es-ES"),
      estado: "Emitida",
      tipo: "ingreso",
      auto: false,
      origen: "presupuesto"
    };
    setFacturas(prev => [nuevaFactura, ...prev]);
    setLista(prev => prev.map(p => p.id === pres.id ? { ...p, estado: "Facturado" } : p));
    setSelDetalle(null);
    alert("Factura creada en Contabilidad");
  };

  const exportarPDF = (pres) => {
    const tMat = (pres.materiales||[]).reduce((s,m)=>s+m.total,0);
    const tSub = (pres.subcontratas||[]).reduce((s,s2)=>s+s2.total,0);
    const total = pres.total || tMat + tSub;
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Presupuesto</title>
    <style>body{font-family:Arial,sans-serif;max-width:800px;margin:20px auto;padding:30px;color:#1e293b;font-size:13px}
    .header{background:#f8f9fa;color:#f0a500;padding:24px;display:flex;justify-content:space-between;margin-bottom:24px}
    .header h2{margin:0;font-size:18px;letter-spacing:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th{background:#1e293b;color:#f0a500;padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px}
    td{padding:10px 12px;border-bottom:1px solid #eee}
    .total-box{background:#1e293b;color:white;padding:20px;display:flex;justify-content:space-between;align-items:center;margin-top:20px}
    .section{font-size:11px;color:#f0a500;letter-spacing:3px;text-transform:uppercase;margin:20px 0 10px;font-family:monospace}
    .firma{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
    .firma-box{border-top:1px solid #ccc;padding-top:10px;font-size:11px;color:#888}
    </style></head><body>
    <div class="header"><div><h2>FACTUCLOUD</h2><p style="margin:4px 0;font-size:11px;color:#888">Presupuesto profesional</p></div>
    <div style="text-align:right"><p style="color:#f0a500;font-size:14px;margin:0">${pres.titulo}</p><p style="font-size:11px;color:#888;margin:4px 0">Valido hasta: ${pres.validez || "30 dias"}</p></div></div>
    <div style="background:#f8f8f8;padding:16px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:2px">Proyecto</div><div style="font-size:14px;font-weight:bold;margin-top:4px">${pres.obra}</div></div>
      <div><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:2px">Cliente</div><div style="font-size:14px;font-weight:bold;margin-top:4px">${pres.cliente || "A definir"}</div></div>
    </div>
    <div class="section">Materiales</div>
    <table><thead><tr><th>Descripcion</th><th>Ud.</th><th style="text-align:right">Cant.</th><th style="text-align:right">Precio/Ud.</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${(pres.materiales||[]).map(m=>`<tr><td>${m.descripcion}</td><td>${m.unidad}</td><td style="text-align:right">${m.cantidad}</td><td style="text-align:right">${m.precioUnit.toFixed(2)} EUR</td><td style="text-align:right;font-weight:bold">${m.total.toFixed(2)} EUR</td></tr>`).join("")}
    <tr style="background:#f8f8f8"><td colspan="4" style="font-weight:bold;text-align:right;color:#888">Subtotal materiales</td><td style="text-align:right;font-weight:bold">${tMat.toFixed(2)} EUR</td></tr></tbody></table>
    <div class="section">Subcontratas y mano de obra</div>
    <table><thead><tr><th>Descripcion</th><th>Ud.</th><th style="text-align:right">Cant.</th><th style="text-align:right">Precio/Ud.</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${(pres.subcontratas||[]).map(s=>`<tr><td>${s.descripcion}</td><td>${s.unidad}</td><td style="text-align:right">${s.cantidad}</td><td style="text-align:right">${s.precioUnit.toFixed(2)} EUR</td><td style="text-align:right;font-weight:bold">${s.total.toFixed(2)} EUR</td></tr>`).join("")}
    <tr style="background:#f8f8f8"><td colspan="4" style="font-weight:bold;text-align:right;color:#888">Subtotal subcontratas</td><td style="text-align:right;font-weight:bold">${tSub.toFixed(2)} EUR</td></tr></tbody></table>
    ${pres.observaciones ? `<div style="background:#fff8e6;padding:14px;border-left:3px solid #f0a500;margin-bottom:20px;font-size:12px">${pres.observaciones}</div>` : ""}
    <div class="total-box"><div><div style="font-size:11px;color:#888;letter-spacing:2px">TOTAL PRESUPUESTO (sin IVA)</div><div style="font-size:11px;color:#555;margin-top:4px">IVA 21%: ${(total*0.21).toFixed(2)} EUR | Total con IVA: ${(total*1.21).toFixed(2)} EUR</div></div><div style="font-size:32px;color:#f0a500;font-weight:bold">${total.toFixed(2)} EUR</div></div>
    <div class="firma"><div class="firma-box">Firma cliente<br><br><br>Nombre: _________________________<br>Fecha: __________________________</div>
    <div class="firma-box">Firma empresa<br><br><br>Nombre: _________________________<br>Fecha: __________________________</div></div>
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#aaa;text-align:center">Generado por FactuCloud - ${new Date().toLocaleDateString("es-ES")}</div>
    </body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = `Presupuesto_${(pres.titulo||"").replace(/\s+/g,"_")}.html`; a.click();
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setLista(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  const ESTADOS = ["Borrador", "Enviado", "Aceptado", "Rechazado", "Caducado", "Facturado"];
  const ESTADO_COL = { Borrador: "#555", Enviado: "#7eb8f5", Aceptado: "#4caf7d", Rechazado: "#e05252", Caducado: "#888", Facturado: "#f0a500" };

  const EJEMPLOS = [
    "Presupuesto para construir una piscina de 8x4 metros con solarium en adosado",
    "Reforma completa de cocina de 12m2, suelo, azulejos, muebles y electrodomesticos",
    "Instalacion de suelo radiante en vivienda de 120m2 con caldera de gas",
    "Construccion de muro de contencion de 20 metros lineales en parcela",
  ];

  const inputSt = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 24 }}>
        {[["nuevo","Nuevo presupuesto IA"],["lista",`Mis presupuestos (${lista.length})`],["plantillas",`Plantillas (${plantillas.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", color: tab === id ? "#f0a500" : "#555", padding: "12px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: tab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      {/* NUEVO PRESUPUESTO */}
      {tab === "nuevo" && !presupuesto && (
        <div style={{ maxWidth: 780 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Describe el proyecto</div>
          <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, marginBottom: 20 }}>La IA generara un presupuesto detallado con precios de mercado actuales y consistente con tus presupuestos anteriores.</p>

          {/* Config margen y validez */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Margen de beneficio (%)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="number" min="0" max="100" value={margen} onChange={e => setMargen(parseInt(e.target.value)||0)} style={{ ...inputSt, width: 80 }} />
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>La IA aplicara +{margen}% sobre costes base</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Validez del presupuesto (dias)</div>
              <input type="number" min="7" max="365" value={validezDias} onChange={e => setValidezDias(parseInt(e.target.value)||30)} style={{ ...inputSt, width: 80 }} />
            </div>
          </div>

          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Necesito presupuesto para construir una nave industrial de 500m2 con estructura metalica, cubierta de panel sandwich, solera de hormigon y puerta seccional para cliente Promotora Garcia..." style={{ width: "100%", minHeight: 120, background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "16px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />

          {error && <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>X {error}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={generar} disabled={loading || !input.trim()} style={{ background: loading ? "#e2e8f0" : "#f0a500", color: loading ? "#444" : "#f8f9fa", border: "none", padding: "14px 36px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>
              {loading ? "Generando..." : "Generar con IA"}
            </button>
            {plantillas.length > 0 && (
              <select onChange={e => { const p = plantillas.find(pl => pl.id === parseInt(e.target.value)); if (p) setInput(`Presupuesto similar a: ${p.obra}`); }} defaultValue="" style={{ ...inputSt, width: "auto" }}>
                <option value="" disabled>Usar plantilla...</option>
                {plantillas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            )}
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#94a3b8", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Ejemplos rapidos</div>
            {EJEMPLOS.map((ej, i) => (
              <button key={i} onClick={() => setInput(ej)} style={{ display: "block", width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2, padding: "12px 18px", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, marginBottom: 8 }}>
                <span style={{ color: "#f0a500" }}>-&gt;</span> {ej}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRESUPUESTO GENERADO */}
      {tab === "nuevo" && presupuesto && (
        <div style={{ maxWidth: 860 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Presupuesto generado por IA</div>
              <div style={{ fontSize: 22, color: "#1e293b", marginBottom: 4 }}>{presupuesto.titulo}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{presupuesto.obra} · Valido {validezDias} dias · Margen {margen}%</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button onClick={() => exportarPDF(presupuesto)} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "10px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Exportar PDF</button>
              <button onClick={guardarPlantilla} style={{ background: "#a78bfa15", border: "1px solid #a78bfa33", color: "#a78bfa", padding: "10px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Guardar plantilla</button>
              <button onClick={() => guardar("Borrador")} style={{ background: "#e2e8f0", border: "1px solid #2e2e3e", color: "#64748b", padding: "10px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Guardar borrador</button>
              <button onClick={() => guardar("Enviado")} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Guardar y marcar enviado</button>
            </div>
          </div>

          {/* KPIs presupuesto */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[["Materiales", formatEURd(totalMat), "#7eb8f5"], ["Subcontratas", formatEURd(totalSub), "#a78bfa"], ["Total sin IVA", formatEURd(totalPresup), "#f0a500"], ["Total con IVA", formatEURd(totalPresup * 1.21), "#4caf7d"]].map(([l,v,c]) => (
              <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "14px 16px", borderRadius: 3 }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 18, color: c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Tabla materiales */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#7eb8f5", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Materiales</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid #e2e8f0" }}>{["Descripcion","Ud.","Cantidad","Precio/Ud.","Total"].map((h,i) => <th key={h} style={{ padding: "8px 10px", fontSize: 9, letterSpacing: 2, color: "#7eb8f5", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "normal", textAlign: i===0?"left":"right" }}>{h}</th>)}</tr></thead>
              <tbody>
                {presupuesto.materiales.map((m,i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", color: "#334155" }}>{m.descripcion}</td>
                    <td style={{ padding: "10px", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{m.unidad}</td>
                    <td style={{ padding: "10px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{m.cantidad}</td>
                    <td style={{ padding: "10px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{formatEURd(m.precioUnit)}</td>
                    <td style={{ padding: "10px", color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", textAlign: "right", fontWeight: "bold" }}>{formatEURd(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabla subcontratas */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#a78bfa", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Subcontratas y mano de obra</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid #e2e8f0" }}>{["Descripcion","Ud.","Cantidad","Precio/Ud.","Total"].map((h,i) => <th key={h} style={{ padding: "8px 10px", fontSize: 9, letterSpacing: 2, color: "#a78bfa", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "normal", textAlign: i===0?"left":"right" }}>{h}</th>)}</tr></thead>
              <tbody>
                {presupuesto.subcontratas.map((s,i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", color: "#334155" }}>{s.descripcion}</td>
                    <td style={{ padding: "10px", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{s.unidad}</td>
                    <td style={{ padding: "10px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{s.cantidad}</td>
                    <td style={{ padding: "10px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{formatEURd(s.precioUnit)}</td>
                    <td style={{ padding: "10px", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", textAlign: "right", fontWeight: "bold" }}>{formatEURd(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Facturacion por fases */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#4caf7d", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Facturacion parcial por fases</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {fasesParciales.map((f, i) => (
                <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2, padding: "14px" }}>
                  <div style={{ fontSize: 10, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{f.nombre}</div>
                  <div style={{ fontSize: 20, color: "#4caf7d", marginBottom: 4 }}>{f.porcentaje}%</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>{formatEURd(totalPresup * f.porcentaje / 100)}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{f.desc}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <input value={f.nombre} onChange={e => setFasesParciales(prev => prev.map((fp,j) => j===i ? {...fp, nombre: e.target.value} : fp))} style={{ ...inputSt, fontSize: 11, padding: "4px 8px" }} placeholder="Nombre fase" />
                    <input type="number" value={f.porcentaje} onChange={e => setFasesParciales(prev => prev.map((fp,j) => j===i ? {...fp, porcentaje: parseInt(e.target.value)||0} : fp))} style={{ ...inputSt, width: 50, fontSize: 11, padding: "4px 8px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {presupuesto.observaciones && (
            <div style={{ background: "#f0a50008", border: "1px solid #f0a50022", borderLeft: "3px solid #f0a500", borderRadius: 2, padding: "14px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>Observaciones</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>{presupuesto.observaciones}</div>
            </div>
          )}
        </div>
      )}

      {/* LISTA DE PRESUPUESTOS */}
      {tab === "lista" && !selDetalle && (
        <div>
          {lista.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin presupuestos - genera uno con IA</div>
            : lista.map(p => {
              const hoy = new Date();
              const creado = new Date(p.creadoEn?.split("/").reverse().join("-"));
              const diasTranscurridos = Math.floor((hoy - creado) / 86400000);
              const caducado = diasTranscurridos > (p.validezDias || 30) && p.estado === "Enviado";
              if (caducado && p.estado === "Enviado") cambiarEstado(p.id, "Caducado");
              return (
                <div key={p.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "18px 22px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setSelDetalle(p)}>
                    <div style={{ fontSize: 15, color: "#334155", marginBottom: 4 }}>{p.titulo}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{p.obra} · {p.creadoEn} · Margen {p.margen}%</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 20, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", marginRight: 8 }}>{formatEURd(p.total)}</div>
                    <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)} style={{ background: "#ffffff", border: `1px solid ${ESTADO_COL[p.estado]}44`, color: ESTADO_COL[p.estado], padding: "6px 10px", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", cursor: "pointer" }}>
                      {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => exportarPDF(p)} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "6px 12px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>PDF</button>
                    {(p.estado === "Aceptado") && (
                      <button onClick={() => convertirAFactura(p)} style={{ background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "6px 14px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Convertir a factura</button>
                    )}
                  </div>
                </div>
              );
            })
          }
        </div>
      )}

      {/* DETALLE PRESUPUESTO */}
      {tab === "lista" && selDetalle && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <button onClick={() => setSelDetalle(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, padding: 0 }}>Volver a lista</button>
              <div style={{ fontSize: 20, color: "#1e293b" }}>{selDetalle.titulo}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{selDetalle.obra} · {selDetalle.creadoEn}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => exportarPDF(selDetalle)} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "10px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Exportar PDF</button>
              {selDetalle.estado === "Aceptado" && <button onClick={() => convertirAFactura(selDetalle)} style={{ background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Convertir a factura</button>}
            </div>
          </div>
          {/* Fases de facturacion */}
          {selDetalle.fases?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
              {selDetalle.fases.map((f, i) => (
                <div key={i} style={{ background: "#ffffff", border: "1px solid #4caf7d22", borderTop: "2px solid #4caf7d", borderRadius: 3, padding: "16px" }}>
                  <div style={{ fontSize: 10, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{f.nombre} — {f.porcentaje}%</div>
                  <div style={{ fontSize: 22, color: "#4caf7d" }}>{formatEURd(selDetalle.total * f.porcentaje / 100)}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{f.desc}</div>
                  {selDetalle.estado === "Aceptado" && (
                    <button onClick={() => {
                      const facParcial = { id: Date.now(), numero: `F${Date.now()}`, numeroFactura: `F${new Date().getFullYear()}-FAP${i+1}`, cliente: selDetalle.cliente || "Cliente", concepto: `${selDetalle.titulo} - ${f.nombre}`, base: selDetalle.total * f.porcentaje / 100, iva: selDetalle.total * f.porcentaje / 100 * 0.21, irpf: 0, total: selDetalle.total * f.porcentaje / 100 * 1.21, fecha: new Date().toLocaleDateString("es-ES"), estado: "Emitida", tipo: "ingreso", auto: false };
                      if (setFacturas) setFacturas(prev => [facParcial, ...prev]);
                      alert(`Factura parcial ${f.nombre} creada`);
                    }} style={{ marginTop: 8, background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Facturar esta fase</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLANTILLAS */}
      {tab === "plantillas" && (
        <div>
          {plantillas.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin plantillas. Genera un presupuesto y guarda como plantilla.</div>
            : plantillas.map(p => (
              <div key={p.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "18px 22px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 3 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{p.obra} · Guardada {p.creadoEn}</div>
                </div>
                <button onClick={() => { setInput(`Presupuesto similar a: ${p.obra}`); setTab("nuevo"); }} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "8px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Usar plantilla</button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// CONTABILIDAD
// ════════════════════════════════════════
const FACTURA_PROMPT = `Eres contable de una empresa de construcción española. Genera una factura a partir de la descripción del usuario.
Devuelve SOLO JSON válido sin texto adicional:
{"numeroFactura":"F2026-001","fecha":"28/05/2026","fechaVencimiento":"27/06/2026","cliente":{"nombre":"","cif":"","direccion":"","email":""},"obra":"","lineas":[{"descripcion":"","cantidad":1,"unidad":"ud","precioUnitario":0,"importe":0}],"tipoIVA":21,"tipoIRPF":15,"formaPago":"Transferencia bancaria","notas":"","sugerencias":[]}`;

function Contabilidad({ facturas, setFacturas, empresa: empProp }) {
  const [subtab, setSubtab] = useState("lista");
  const [input, setInput] = useState("");
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gastoDesc, setGastoDesc] = useState("");
  const [deduccion, setDeduccion] = useState(null);
  const [loadingDeduccion, setLoadingDeduccion] = useState(false);

  const hoy = new Date();
  const mes = hoy.getMonth();
  const trimestre = Math.floor(mes / 3) + 1;
  const año = hoy.getFullYear();

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

  const totalIngresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.total || 0), 0);
  const totalGastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.total || 0), 0);
  const ivaRep = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.iva || 0), 0);
  const ivaSop = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.iva || 0), 0);
  const ivaLiquidar = ivaRep - ivaSop;
  const baseIRPF = totalIngresos - totalGastos;
  const pagoFraccionado = Math.max(0, baseIRPF * 0.20);

  // Semaforo fiscal
  const hoy2 = new Date();
  const diasParaVencimiento = (mesVence, diaVence) => {
    const fecha = new Date(año, mesVence - 1, diaVence);
    if (fecha < hoy2) { const siguiente = new Date(año + 1, mesVence - 1, diaVence); return Math.ceil((siguiente - hoy2) / 86400000); }
    return Math.ceil((fecha - hoy2) / 86400000);
  };

  // Calendario fiscal completo
  const CALENDARIO = [
    { modelo: "303", nombre: "IVA trimestral", trimestre: 1, venceMes: 4, venceDia: 20, aplica: true },
    { modelo: "130", nombre: "IRPF pago fraccionado", trimestre: 1, venceMes: 4, venceDia: 20, aplica: true },
    { modelo: "111", nombre: "Retenciones IRPF", trimestre: 1, venceMes: 4, venceDia: 20, aplica: true },
    { modelo: "115", nombre: "Retenciones alquiler", trimestre: 1, venceMes: 4, venceDia: 20, aplica: false },
    { modelo: "303", nombre: "IVA trimestral", trimestre: 2, venceMes: 7, venceDia: 20, aplica: true },
    { modelo: "130", nombre: "IRPF pago fraccionado", trimestre: 2, venceMes: 7, venceDia: 20, aplica: true },
    { modelo: "111", nombre: "Retenciones IRPF", trimestre: 2, venceMes: 7, venceDia: 20, aplica: true },
    { modelo: "115", nombre: "Retenciones alquiler", trimestre: 2, venceMes: 7, venceDia: 20, aplica: false },
    { modelo: "303", nombre: "IVA trimestral", trimestre: 3, venceMes: 10, venceDia: 20, aplica: true },
    { modelo: "130", nombre: "IRPF pago fraccionado", trimestre: 3, venceMes: 10, venceDia: 20, aplica: true },
    { modelo: "111", nombre: "Retenciones IRPF", trimestre: 3, venceMes: 10, venceDia: 20, aplica: true },
    { modelo: "115", nombre: "Retenciones alquiler", trimestre: 3, venceMes: 10, venceDia: 20, aplica: false },
    { modelo: "303", nombre: "IVA trimestral", trimestre: 4, venceMes: 1, venceDia: 30, aplica: true },
    { modelo: "130", nombre: "IRPF pago fraccionado", trimestre: 4, venceMes: 1, venceDia: 30, aplica: true },
    { modelo: "190", nombre: "Resumen anual retenciones", trimestre: 0, venceMes: 1, venceDia: 31, aplica: true },
    { modelo: "347", nombre: "Operaciones con terceros +3.005€", trimestre: 0, venceMes: 2, venceDia: 28, aplica: true },
    { modelo: "349", nombre: "Operaciones intracomunitarias", trimestre: trimestre, venceMes: [4,7,10,1][trimestre-1], venceDia: 20, aplica: false },
  ];

  const modelosPendientes = CALENDARIO.filter(m => m.aplica && diasParaVencimiento(m.venceMes, m.venceDia) <= 30);
  const semaforoColor = modelosPendientes.length === 0 ? "#4caf7d" : modelosPendientes.some(m => diasParaVencimiento(m.venceMes, m.venceDia) <= 7) ? "#e05252" : "#f0a500";
  const semaforoTexto = modelosPendientes.length === 0 ? "Al dia" : `${modelosPendientes.length} modelo${modelosPendientes.length > 1 ? "s" : ""} proximos`;

  const generar = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(""); setFactura(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: FACTURA_PROMPT, messages: [{ role: "user", content: input }] }) });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setFactura(parsed);
    } catch { setError("No se pudo generar. Conecta la API Key de Anthropic."); }
    setLoading(false);
  };

  const confirmar = () => {
    if (!factura) return;
    const base = factura.lineas.reduce((s, l) => s + l.importe, 0);
    const iva = (base * factura.tipoIVA) / 100;
    const irpf = (base * factura.tipoIRPF) / 100;
    setFacturas(prev => [{ ...factura, id: Date.now(), base, iva, irpf, total: base + iva - irpf, estado: "Emitida", tipo: "ingreso", auto: false }, ...prev]);
    setFactura(null); setInput(""); setSubtab("lista");
  };

  const consultarDeduccion = async () => {
    if (!gastoDesc.trim()) return;
    setLoadingDeduccion(true); setDeduccion(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: `Eres un asesor fiscal experto en autónomos y pymes españolas. El usuario describe un gasto y tú debes indicar si es deducible en el IRPF y en el IVA para un autónomo en estimación directa en el sector construcción. Devuelve SOLO JSON: {"deducibleIRPF": true/false, "porcentajeIRPF": 0-100, "deducibleIVA": true/false, "porcentajeIVA": 0-100, "explicacion": "explicacion breve y practica", "condiciones": "condiciones necesarias para deducirlo", "riesgo": "bajo|medio|alto", "recomendacion": "que hacer exactamente"}`,
          messages: [{ role: "user", content: `Gasto: ${gastoDesc}. Soy autónomo en el sector construcción en estimación directa normal.` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      setDeduccion(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setDeduccion({ error: true }); }
    setLoadingDeduccion(false);
  };

  const exportarGestoria = () => {
    const ini = new Date(año, (trimestre - 1) * 3, 1);
    const fin = new Date(año, trimestre * 3, 0);
    const facsTrim = facturas.filter(f => { const d = new Date((f.fecha||"").split("/").reverse().join("-")); return d >= ini && d <= fin; });
    const ingresosTrim = facsTrim.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.total || 0), 0);
    const gastosTrim = facsTrim.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.total || 0), 0);
    const ivaRepTrim = facsTrim.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.iva || 0), 0);
    const ivaSopTrim = facsTrim.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.iva || 0), 0);
    const baseIRPFTrim = ingresosTrim - gastosTrim;

    const contenido = `RESUMEN FISCAL PARA GESTORIA — ${trimestre}T ${año}\n${"=".repeat(60)}\nGenerado: ${new Date().toLocaleString("es-ES")}\n\n` +
      `FACTURAS EMITIDAS (INGRESOS)\n${"-".repeat(40)}\n` +
      facsTrim.filter(f => f.tipo === "ingreso").map(f => `${f.numero || f.numeroFactura || "---"} | ${typeof f.cliente === "string" ? f.cliente : f.cliente?.nombre || "---"} | ${f.fecha} | Base: ${(f.base||0).toFixed(2)} EUR | IVA: ${(f.iva||0).toFixed(2)} EUR | Total: ${(f.total||0).toFixed(2)} EUR`).join("\n") +
      `\n\nFACTURAS RECIBIDAS (GASTOS)\n${"-".repeat(40)}\n` +
      facsTrim.filter(f => f.tipo === "gasto").map(f => `${f.numero || f.numeroFactura || "---"} | ${typeof f.cliente === "string" ? f.cliente : f.cliente?.nombre || "---"} | ${f.fecha} | Base: ${(f.base||0).toFixed(2)} EUR | IVA: ${(f.iva||0).toFixed(2)} EUR | Total: ${(f.total||0).toFixed(2)} EUR`).join("\n") +
      `\n\nRESUMEN MODELO 303 (IVA)\n${"-".repeat(40)}\nIVA repercutido (ventas):  ${ivaRepTrim.toFixed(2)} EUR\nIVA soportado (compras):   ${ivaSopTrim.toFixed(2)} EUR\nRESULTADO IVA:             ${(ivaRepTrim - ivaSopTrim).toFixed(2)} EUR\n\n` +
      `RESUMEN MODELO 130 (IRPF)\n${"-".repeat(40)}\nIngresos trimestre:        ${ingresosTrim.toFixed(2)} EUR\nGastos trimestre:          ${gastosTrim.toFixed(2)} EUR\nBase IRPF:                 ${baseIRPFTrim.toFixed(2)} EUR\nPago fraccionado (20%):    ${Math.max(0, baseIRPFTrim * 0.20).toFixed(2)} EUR\n\n` +
      `TOTAL FACTURAS: ${facsTrim.length} (${facsTrim.filter(f=>f.tipo==="ingreso").length} ingresos, ${facsTrim.filter(f=>f.tipo==="gasto").length} gastos)\n\nGenerado por FactuCloud`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([contenido], { type: "text/plain;charset=utf-8" }));
    a.download = `Gestoria_${trimestre}T_${año}.txt`; a.click();
  };

  const base = factura ? factura.lineas.reduce((s, l) => s + l.importe, 0) : 0;
  const cuotaIVA = factura ? (base * factura.tipoIVA) / 100 : 0;
  const cuotaIRPF = factura ? (base * factura.tipoIRPF) / 100 : 0;
  const totalFac = base + cuotaIVA - cuotaIRPF;
  const RIESGO_COL = { bajo: "#4caf7d", medio: "#f0a500", alto: "#e05252" };

  return (
    <div>
      {/* KPIs + semaforo */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 180px", gap: 12, marginBottom: 24 }}>
        {[["Ingresos", totalIngresos === 0 ? "Sin datos" : formatEURLocal(totalIngresos), "#4caf7d"], ["Gastos", totalGastos === 0 ? "Sin datos" : formatEURLocal(totalGastos), "#e05252"], ["IVA a pagar", ivaLiquidar === 0 ? "Sin datos" : formatEURLocal(ivaLiquidar), "#7eb8f5"], ["IRPF (130)", pagoFraccionado === 0 ? "Sin datos" : formatEURLocal(pagoFraccionado), "#a78bfa"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "16px 18px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
        <div style={{ background: "#ffffff", border: `1px solid ${semaforoColor}33`, borderTop: `2px solid ${semaforoColor}`, padding: "16px 18px", borderRadius: 3 }}>
          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Estado fiscal</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: semaforoColor, boxShadow: `0 0 8px ${semaforoColor}` }} />
            <div style={{ fontSize: 12, color: semaforoColor, fontFamily: "'JetBrains Mono', monospace" }}>{semaforoTexto}</div>
          </div>
        </div>
      </div>

      {/* Alerta vencimientos proximos */}
      {modelosPendientes.length > 0 && (
        <div style={{ background: `${semaforoColor}10`, border: `1px solid ${semaforoColor}33`, borderLeft: `3px solid ${semaforoColor}`, borderRadius: 2, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: semaforoColor, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Vencimientos proximos</div>
          {modelosPendientes.map((m, i) => {
            const dias = diasParaVencimiento(m.venceMes, m.venceDia);
            return <div key={i} style={{ fontSize: 12, color: semaforoColor, fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>Modelo {m.modelo} — {m.nombre} — vence en {dias} dias</div>;
          })}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0" }}>
          {[["lista","Facturas"],["generar","Generar IA"],["fiscal","Fiscal"],["calendario","Calendario"],["deduccion","Deducibilidad IA"],["gestoria","Gestoria"]].map(([id, label]) => (
            <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#555", padding: "12px 16px", cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
        <button onClick={exportarGestoria} style={{ background: "#a78bfa", color: "#f8f9fa", border: "none", padding: "10px 18px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>Exportar gestoria {trimestre}T</button>
      </div>
      <div style={{ height: 22 }} />

      {/* LISTA FACTURAS */}
      {subtab === "lista" && (
        facturas.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin facturas — usa Generar con IA o el Agente IA</div>
          : <>
            <div style={{ background: "#f0a50010", border: "1px solid #f0a50022", borderLeft: "3px solid #f0a500", borderRadius: 2, padding: "10px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>🔒 Las facturas emitidas, cobradas o pagadas no se pueden modificar. Para corregir una factura emitida, crea una factura rectificativa.</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid #e2e8f0" }}>{["Numero","Cliente","Fecha","Base","IVA","Total","Estado",""].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 9, letterSpacing: 3, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "normal" }}>{h}</th>)}</tr></thead>
              <tbody>
                {facturas.map(f => {
                  const bloqueada = ["Emitida","Cobrada","Pagada"].includes(f.estado);
                  return (
                    <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9", opacity: bloqueada ? 1 : 0.8 }}>
                      <td style={{ padding: "13px 14px", color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        <span>{f.numero || f.numeroFactura}</span>
                        {bloqueada && <span style={{ marginLeft: 6, fontSize: 9, color: "#94a3b8" }}>🔒</span>}
                      </td>
                      <td style={{ padding: "13px 14px", color: "#334155" }}>{typeof f.cliente === "string" ? f.cliente : f.cliente?.nombre}</td>
                      <td style={{ padding: "13px 14px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{f.fecha}</td>
                      <td style={{ padding: "13px 14px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURd(f.base || 0)}</td>
                      <td style={{ padding: "13px 14px", color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURd(f.iva || 0)}</td>
                      <td style={{ padding: "13px 14px", color: f.tipo === "ingreso" ? "#4caf7d" : "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{f.tipo === "ingreso" ? "+" : "-"}{formatEURd(f.total)}</td>
                      <td style={{ padding: "13px 14px" }}><Badge label={f.estado} /></td>
                      <td style={{ padding: "13px 14px" }}>
                        {bloqueada ? (
                          <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => {
                            const rect = { id: Date.now(), numero: `R-${f.numero||f.numeroFactura}`, numeroFactura: `R-${f.numero||f.numeroFactura}`, cliente: f.cliente, concepto: `RECTIFICATIVA de ${f.numero||f.numeroFactura}`, base: -(f.base||0), iva: -(f.iva||0), irpf: 0, total: -(f.total||0), fecha: new Date().toLocaleDateString("es-ES"), estado: "Emitida", tipo: f.tipo, auto: false, rectificativa: true };
                            setFacturas(prev => [rect, ...prev]);
                          }} style={{ background: "#e0783015", border: "1px solid #e0783033", color: "#e07830", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            Rectificativa
                          </button>
                          <button onClick={() => {
                              const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Factura ${f.numero||f.numeroFactura}</title><style>body{font-family:Arial,sans-serif;max-width:780px;margin:40px auto;padding:30px;color:#1e293b;font-size:13px}.header{display:flex;justify-content:space-between;border-bottom:2px solid #1e293b;padding-bottom:16px;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{background:#1e293b;color:#f0a500;padding:10px;text-align:left;font-size:10px;text-transform:uppercase}td{padding:10px;border-bottom:1px solid #eee}.total-box{background:#1e293b;color:white;padding:16px 20px;display:flex;justify-content:space-between;margin-top:16px}</style></head><body><div class="header"><div><h2 style="margin:0;color:#f0a500">FACTUCLOUD</h2><p style="margin:4px 0;font-size:11px;color:#888">${f.fecha}</p></div><div style="text-align:right"><p style="font-size:20px;color:#1e293b;margin:0">${f.numero||f.numeroFactura}</p><p style="color:#888;font-size:11px">${f.estado}</p></div></div><p><strong>${typeof f.cliente==="string"?f.cliente:f.cliente?.nombre||""}</strong></p><table><thead><tr><th>Concepto</th><th style="text-align:right">Base</th><th style="text-align:right">IVA</th><th style="text-align:right">Total</th></tr></thead><tbody><tr><td>${f.concepto||f.obra||"Servicios"}</td><td style="text-align:right">${(f.base||0).toFixed(2)} EUR</td><td style="text-align:right">${(f.iva||0).toFixed(2)} EUR</td><td style="text-align:right;font-weight:bold">${(f.total||0).toFixed(2)} EUR</td></tr></tbody></table><div class="total-box"><span style="font-size:12px;color:#f0a500;letter-spacing:2px">TOTAL</span><span style="font-size:28px;color:#f0a500;font-weight:bold">${(f.total||0).toFixed(2)} EUR</span></div><div style="margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:40px"><div style="border-top:1px solid #ccc;padding-top:10px;font-size:11px;color:#888">Firma cliente<br/><br/><br/>Nombre: ___________________</div><div style="border-top:1px solid #ccc;padding-top:10px;font-size:11px;color:#888">Firma empresa<br/><br/><br/>Nombre: ___________________</div></div><p style="margin-top:32px;font-size:10px;color:#aaa;text-align:center">Generado por FactuCloud · ${new Date().toLocaleDateString("es-ES")}</p></body></html>`;
                              const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html],{type:"text/html"})); a.download = `Factura_${(f.numero||f.numeroFactura||"").replace(/\//g,"_")}.html`; a.click();
                            }} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>↓ PDF</button>
                          </div>
                        ) : f.estado === "Borrador" ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setFacturas(prev => prev.map(x => x.id === f.id ? { ...x, estado: "Emitida" } : x))} style={{ background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                              Emitir
                            </button>
                            <button onClick={() => setFacturas(prev => prev.filter(x => x.id !== f.id))} style={{ background: "#e0525215", border: "1px solid #e0525233", color: "#e05252", padding: "5px 8px", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>✕</button>
                          </div>
                        ) : (
                          <button onClick={() => setFacturas(prev => prev.filter(x => x.id !== f.id))} style={{ background: "#e0525215", border: "1px solid #e0525233", color: "#e05252", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
      )}

      {/* GENERAR FACTURA IA */}
      {subtab === "generar" && !factura && (
        <div style={{ maxWidth: 680 }}>
          <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, marginBottom: 20 }}>Describe lo que quieres facturar en lenguaje natural.</p>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Factura a Promotora Garcia por certificacion n3 de obra vivienda unifamiliar, trabajos de albanileria por 28.000 EUR..." style={{ width: "100%", minHeight: 110, background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "16px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />
          {error && <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>{error}</div>}
          <button onClick={generar} disabled={loading || !input.trim()} style={{ marginTop: 14, background: loading ? "#e2e8f0" : "#f0a500", color: loading ? "#444" : "#f8f9fa", border: "none", padding: "14px 36px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>
            {loading ? "Generando..." : "Generar factura"}
          </button>
        </div>
      )}

      {subtab === "generar" && factura && (
        <div style={{ maxWidth: 760 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e0d0", borderRadius: 3, padding: "40px 44px", marginBottom: 16, color: "#1e293b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #1e293b" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 400, marginBottom: 6 }}>{(empProp?.nombre) || EMPRESA.nombre}</div>
                <div style={{ fontSize: 11, color: "#999", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9 }}><div>{(empProp?.cif) || EMPRESA.cif}</div><div>{(empProp?.direccion) || EMPRESA.direccion}</div><div>{(empProp?.email) || EMPRESA.email}</div></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>{factura.numeroFactura}</div>
                <div style={{ fontSize: 11, color: "#999", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9 }}><div>Fecha: {factura.fecha}</div><div>Vence: {factura.fechaVencimiento}</div></div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Facturar a</div>
              <div style={{ fontSize: 16 }}>{factura.cliente?.nombre}</div>
              <div style={{ fontSize: 12, color: "#999", fontFamily: "'JetBrains Mono', monospace" }}>{factura.obra}</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 13 }}>
              <thead><tr style={{ background: "#1e293b" }}>{["Descripcion","Ud.","Cant.","Precio","Importe"].map((h,i) => <th key={h} style={{ padding: "10px 12px", fontSize: 9, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "normal", textAlign: i===0?"left":"right" }}>{h}</th>)}</tr></thead>
              <tbody>{factura.lineas.map((l,i) => <tr key={i} style={{ borderBottom: "1px solid #f0ebe0", background: i%2===0?"#faf8f4":"#fff" }}>
                <td style={{ padding: "11px 12px" }}>{l.descripcion}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", color: "#999", fontFamily: "'JetBrains Mono', monospace" }}>{l.unidad}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{l.cantidad}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURd(l.precioUnitario)}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURd(l.importe)}</td>
              </tr>)}</tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 260 }}>
                {[["Base imponible", formatEURd(base), "#333"],[`IVA (${factura.tipoIVA}%)`, formatEURd(cuotaIVA), "#1a6fbf"],[`IRPF (${factura.tipoIRPF}%)`, `- ${formatEURd(cuotaIRPF)}`, "#c0392b"]].map(([k,v,c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0ebe0" }}>
                    <span style={{ fontSize: 12, color: "#999", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
                    <span style={{ fontSize: 13, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 8px", background: "#1e293b", marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>TOTAL</span>
                  <span style={{ fontSize: 20, color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURd(totalFac)}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => {
              const base2 = factura.lineas.reduce((s, l) => s + l.importe, 0);
              const iva2 = (base2 * factura.tipoIVA) / 100;
              const irpf2 = (base2 * factura.tipoIRPF) / 100;
              setFacturas(prev => [{ ...factura, id: Date.now(), base: base2, iva: iva2, irpf: irpf2, total: base2 + iva2 - irpf2, estado: "Borrador", tipo: "ingreso", auto: false }, ...prev]);
              setFactura(null); setInput(""); setSubtab("lista");
            }} style={{ background: "#e2e8f0", color: "#64748b", border: "1px solid #2e2e3e", padding: "12px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Guardar borrador</button>
            <button onClick={confirmar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Emitir factura</button>
            <button onClick={() => setFactura(null)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* FISCAL — modelos */}
      {subtab === "fiscal" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* 303 */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #7eb8f5", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 10, color: "#7eb8f5", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>Modelo 303 — IVA</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{trimestre}T {año} · Vence {["20 abr","20 jul","20 oct","30 ene"][trimestre-1]}</div>
              {[["IVA repercutido (ventas)", ivaRep, "#4caf7d"], ["IVA soportado (compras)", ivaSop, "#e05252"], ["Resultado a ingresar", ivaLiquidar, ivaLiquidar >= 0 ? "#e05252" : "#4caf7d"]].map(([k,v,c]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
                  <span style={{ fontSize: 16, color: c, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(v)}</span>
                </div>
              ))}
            </div>
            {/* 130 */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #a78bfa", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 10, color: "#a78bfa", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>Modelo 130 — IRPF</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{trimestre}T {año} · Estimacion directa</div>
              {[["Ingresos acumulados", totalIngresos, "#4caf7d"], ["Gastos deducibles", totalGastos, "#e05252"], ["Base imponible", baseIRPF, "#aaa"], ["Pago fraccionado (20%)", pagoFraccionado, "#a78bfa"]].map(([k,v,c]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
                  <span style={{ fontSize: 16, color: c, fontFamily: "'JetBrains Mono', monospace", fontWeight: k === "Pago fraccionado (20%)" ? "bold" : "normal" }}>{formatEURLocal(v)}</span>
                </div>
              ))}
            </div>
            {/* 347 */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #f0a500", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>Modelo 347 — Operaciones terceros</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Anual · Vence 28 febrero {año + 1}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>Clientes/proveedores con operaciones superiores a 3.005,06 EUR en el año:</div>
              {facturas.length === 0
                ? <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Sin facturas registradas</div>
                : Object.entries(facturas.reduce((acc, f) => { const n = typeof f.cliente === "string" ? f.cliente : f.cliente?.nombre || "---"; acc[n] = (acc[n] || 0) + (f.total || 0); return acc; }, {})).filter(([,v]) => v >= 3005).sort((a,b) => b[1]-a[1]).map(([nombre, total]) => (
                  <div key={nombre} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 12, color: "#334155" }}>{nombre}</span>
                    <span style={{ fontSize: 13, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(total)}</span>
                  </div>
                ))
              }
            </div>
            {/* 349 */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #4cbbaf", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 10, color: "#4cbbaf", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>Modelo 349 — Intracomunitario</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Trimestral si operaciones en UE</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>Obligatorio si realizas adquisiciones o entregas de bienes o servicios con empresas de otros paises de la UE. Actualmente no se han detectado operaciones intracomunitarias.</div>
            </div>
          </div>
          {/* 036/037 */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "18px 22px" }}>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Modelos 036/037 — Alta censal (puntual)</div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>Se presentan al darse de alta como autonomo, al cambiar de actividad, o al modificar datos censales. No tienen periodicidad. Gestionalo con tu gestoria cuando sea necesario.</div>
          </div>
        </div>
      )}

      {/* CALENDARIO FISCAL */}
      {subtab === "calendario" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Calendario fiscal {año}</div>
          {[1,2,3,4,0].map(t => {
            const modelos = CALENDARIO.filter(m => m.trimestre === t && m.aplica);
            if (modelos.length === 0) return null;
            const labelT = t === 0 ? "Anuales" : `${t}T — ${["","ene-mar","abr-jun","jul-sep","oct-dic"][t]}`;
            return (
              <div key={t} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>{labelT}</div>
                {modelos.map((m, i) => {
                  const dias = diasParaVencimiento(m.venceMes, m.venceDia);
                  const urgente = dias <= 7;
                  const proximo = dias <= 30;
                  const col = urgente ? "#e05252" : proximo ? "#f0a500" : "#555";
                  const meses = ["","enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
                  return (
                    <div key={i} style={{ background: "#ffffff", border: `1px solid ${col}22`, borderLeft: `3px solid ${col}`, borderRadius: 2, padding: "14px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#334155", marginBottom: 3 }}>Modelo {m.modelo} — {m.nombre}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Vence el {m.venceDia} de {meses[m.venceMes]}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, color: col, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{dias}</div>
                        <div style={{ fontSize: 9, color: col, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>dias</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* DEDUCIBILIDAD IA */}
      {subtab === "deduccion" && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Consulta de deducibilidad con IA</div>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20, lineHeight: 1.8 }}>Describe un gasto y la IA te dira si es deducible en IRPF e IVA, con que porcentaje y bajo que condiciones.</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input value={gastoDesc} onChange={e => setGastoDesc(e.target.value)} placeholder="Ej: Cena con clientes en restaurante, comida de trabajo, gasolina del coche, ordenador portatil..." style={{ flex: 1, background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "12px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none" }} onKeyDown={e => e.key === "Enter" && consultarDeduccion()} />
            <button onClick={consultarDeduccion} disabled={loadingDeduccion || !gastoDesc.trim()} style={{ background: loadingDeduccion ? "#e2e8f0" : "#f0a500", color: loadingDeduccion ? "#444" : "#f8f9fa", border: "none", padding: "12px 24px", cursor: loadingDeduccion ? "not-allowed" : "pointer", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>
              {loadingDeduccion ? "Consultando..." : "Consultar IA"}
            </button>
          </div>
          {deduccion && !deduccion.error && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div style={{ background: "#ffffff", border: `1px solid ${deduccion.deducibleIRPF ? "#4caf7d33" : "#e0525233"}`, borderTop: `2px solid ${deduccion.deducibleIRPF ? "#4caf7d" : "#e05252"}`, borderRadius: 3, padding: "20px" }}>
                  <div style={{ fontSize: 9, color: deduccion.deducibleIRPF ? "#4caf7d" : "#e05252", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>IRPF — {deduccion.deducibleIRPF ? "Deducible" : "No deducible"}</div>
                  {deduccion.deducibleIRPF && <div style={{ fontSize: 40, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", marginBottom: 8 }}>{deduccion.porcentajeIRPF}%</div>}
                  {!deduccion.deducibleIRPF && <div style={{ fontSize: 32, color: "#e05252", fontFamily: "'JetBrains Mono', monospace" }}>0%</div>}
                </div>
                <div style={{ background: "#ffffff", border: `1px solid ${deduccion.deducibleIVA ? "#7eb8f533" : "#e0525233"}`, borderTop: `2px solid ${deduccion.deducibleIVA ? "#7eb8f5" : "#e05252"}`, borderRadius: 3, padding: "20px" }}>
                  <div style={{ fontSize: 9, color: deduccion.deducibleIVA ? "#7eb8f5" : "#e05252", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>IVA — {deduccion.deducibleIVA ? "Deducible" : "No deducible"}</div>
                  {deduccion.deducibleIVA && <div style={{ fontSize: 40, color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", marginBottom: 8 }}>{deduccion.porcentajeIVA}%</div>}
                  {!deduccion.deducibleIVA && <div style={{ fontSize: 32, color: "#e05252", fontFamily: "'JetBrains Mono', monospace" }}>0%</div>}
                </div>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px", marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>Explicacion IA</div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.9, margin: 0 }}>{deduccion.explicacion}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "16px" }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Condiciones</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>{deduccion.condiciones}</div>
                </div>
                <div style={{ background: "#ffffff", border: `1px solid ${RIESGO_COL[deduccion.riesgo]}22`, borderTop: `2px solid ${RIESGO_COL[deduccion.riesgo]}`, borderRadius: 3, padding: "16px" }}>
                  <div style={{ fontSize: 9, color: RIESGO_COL[deduccion.riesgo], letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Riesgo fiscal: {deduccion.riesgo}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>{deduccion.recomendacion}</div>
                </div>
              </div>
            </div>
          )}
          {deduccion?.error && <div style={{ padding: "14px", color: "#e05252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>Error al consultar. Conecta la API Key de Anthropic.</div>}
          {/* Ejemplos rapidos */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Consultas frecuentes</div>
            {["Cena con clientes en restaurante","Gasolina del coche particular","Ordenador portatil para trabajo","Telefono movil personal","Cuota de autonomo SS","Material de oficina","Seguro del vehiculo de empresa","Ropa de trabajo y EPIs"].map((ej, i) => (
              <button key={i} onClick={() => { setGastoDesc(ej); }} style={{ display: "inline-block", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2, padding: "6px 14px", cursor: "pointer", fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginRight: 8, marginBottom: 8 }}>{ej}</button>
            ))}
          </div>
        </div>
      )}

      {/* GESTORIA */}
      {subtab === "gestoria" && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Exportar para gestoria — {trimestre}T {año}</div>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 24, lineHeight: 1.8 }}>Genera un archivo con todas las facturas del trimestre mas el resumen de IVA e IRPF listo para enviar a tu gestor.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {(() => {
              const ini = new Date(año, (trimestre-1)*3, 1);
              const fin = new Date(año, trimestre*3, 0);
              const facs = facturas.filter(f => { const d = new Date((f.fecha||"").split("/").reverse().join("-")); return d >= ini && d <= fin; });
              return [["Facturas del trimestre", facs.length, "#f0a500"], ["Total ingresos", facs.filter(f=>f.tipo==="ingreso").reduce((s,f)=>s+(f.total||0),0), "#4caf7d"], ["Total gastos", facs.filter(f=>f.tipo==="gasto").reduce((s,f)=>s+(f.total||0),0), "#e05252"]].map(([l,v,c]) => (
                <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "16px", borderRadius: 3 }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                  <div style={{ fontSize: 22, color: c }}>{typeof v === "number" && v > 100 ? formatEURLocal(v) : v}</div>
                </div>
              ));
            })()}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={exportarGestoria} style={{ background: "#a78bfa", color: "#f8f9fa", border: "none", padding: "14px 32px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Exportar {trimestre}T {año} para gestoria</button>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>Incluye: listado de facturas emitidas y recibidas, resumen Modelo 303, resumen Modelo 130, totales por periodo.</div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// AGENTE IA + CHAT CONSULTOR
// ════════════════════════════════════════
const AGENT_PROMPT = `Eres un agente contable automatico especializado en construccion española. Analiza el texto de un correo electronico y extrae datos de facturas de proveedores.
Devuelve SOLO JSON: {"proveedor":"","numeroFactura":"","fecha":"","concepto":"","baseImponible":0,"cuotaIVA":0,"cuotaIRPF":0,"total":0,"error":false}
Si no hay factura devuelve {"error":true}. Usa precios realistas de construccion española.`;

const CORREOS = [
  { id:1, t:2000, de:"materiales@hierrosnorte.com", asunto:"Factura F2026-0341 — Acero corrugado B500S", txt:"Adjunto factura F2026-0341 por suministro de 4.200kg de acero corrugado B500S para obra Residencial Las Palomas. Base: 5.880,00€. IVA 21%: 1.234,80€. Total: 7.114,80€. Vencimiento 30 dias." },
  { id:2, t:5000, de:"admin@gruaalquileres.es", asunto:"Fra. GA-2026-892 alquiler grua torre marzo", txt:"Factura GA-2026-892. Alquiler grua torre 45m, mes de mayo 2026. Base imponible: 3.200,00€. IVA 21%: 672,00€. IRPF 15%: 480,00€. Total a pagar: 3.392,00€." },
  { id:3, t:9000, de:"facturas@cimentaciones-sur.com", asunto:"Certificacion obra Nave Industrial — Mayo", txt:"Certificacion nro 3 trabajos cimentacion Nave Industrial Poligono Norte. Pilotaje y encepados ejecutados segun proyecto. Base: 18.500€. IVA 21%: 3.885€. Total: 22.385€." },
];

function Agente({ setFacturas, facturas, clientes, obras, proveedores }) {
  const [subtab, setSubtab] = useState("chat");
  const [activo, setActivo] = useState(false);
  const [estado, setEstado] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [procesadas, setProcesadas] = useState(0);
  const [mensajes, setMensajes] = useState([
    { rol: "asistente", texto: "Hola, soy tu consultor financiero IA. Tengo acceso a todos tus datos de FactuCloud.\n\nPuedo ayudarte con:\n• Consultas sobre tus datos (IVA, clientes, liquidez...)\n• Dudas de uso de la plataforma\n• Alertas y recomendaciones proactivas\n\n¿En qué te ayudo?" }
  ]);
  const [inputChat, setInputChat] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [alertasProactivas, setAlertasProactivas] = useState([]);
  const logsRef = useRef(null);
  const chatRef = useRef(null);
  const timers = useRef([]);
  const procesados = useRef(new Set());

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

  // Generar alertas proactivas al montar
  useEffect(() => {
    const alertas = [];
    const hoy = new Date();

    // Alertas fiscales (15 dias de antelacion)
    const vencimientosFiscales = [
      { modelo: "303", nombre: "IVA trimestral", mes: [4,7,10,1], dia: 20 },
      { modelo: "130", nombre: "IRPF fraccionado", mes: [4,7,10,1], dia: 20 },
    ];
    vencimientosFiscales.forEach(v => {
      v.mes.forEach(m => {
        const f = new Date(hoy.getFullYear(), m-1, v.dia);
        const dias = Math.ceil((f - hoy) / 86400000);
        if (dias > 0 && dias <= 15) alertas.push({ tipo: "fiscal", color: "#e05252", msg: `Modelo ${v.modelo} — ${v.nombre} vence en ${dias} dias (${v.dia}/${m})`, icono: "⚠️" });
      });
    });

    // Facturas vencidas
    const vencidas = (facturas||[]).filter(f => f.tipo === "ingreso" && f.estado === "Pendiente");
    if (vencidas.length > 0) alertas.push({ tipo: "cobro", color: "#f0a500", msg: `${vencidas.length} factura${vencidas.length>1?"s":""} pendiente${vencidas.length>1?"s":""} de cobro por ${formatEURLocal(vencidas.reduce((s,f)=>s+(f.total||0),0))}`, icono: "💰" });

    // Gastos inusuales (deteccion simple)
    const gastos = (facturas||[]).filter(f => f.tipo === "gasto");
    if (gastos.length > 3) {
      const mediana = gastos.map(f=>f.total||0).sort((a,b)=>a-b)[Math.floor(gastos.length/2)];
      const inusuales = gastos.filter(f => (f.total||0) > mediana * 3);
      if (inusuales.length > 0) alertas.push({ tipo: "gasto", color: "#7eb8f5", msg: `${inusuales.length} gasto${inusuales.length>1?"s":""} inusualmente alto${inusuales.length>1?"s":""} detectado${inusuales.length>1?"s":""} respecto al historico`, icono: "📊" });
    }

    // Duplicados potenciales
    const nums = (facturas||[]).map(f => f.numero||f.numeroFactura).filter(Boolean);
    const duplicados = nums.filter((n,i) => nums.indexOf(n) !== i);
    if (duplicados.length > 0) alertas.push({ tipo: "duplicado", color: "#e05252", msg: `Posible factura duplicada detectada: ${duplicados[0]}`, icono: "🔴" });

    setAlertasProactivas(alertas);
  }, [facturas]);

  const log = useCallback((msg, tipo = "info") => {
    setLogs(prev => [...prev.slice(-60), { id: Date.now() + Math.random(), msg, tipo, h: new Date().toLocaleTimeString("es-ES") }]);
    setTimeout(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, 50);
  }, []);

  const procesar = useCallback(async (c) => {
    setEstado("procesando");
    log(`📧 Correo de ${c.de}`, "scan");
    log(`📎 "${c.asunto}"`, "scan");
    await new Promise(r => setTimeout(r, 600));
    log(`🤖 Enviando a Claude IA...`, "ai");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: AGENT_PROMPT, messages: [{ role: "user", content: c.txt }] }) });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      if (parsed.error) { log(`⚠️ No se detecto factura`, "warn"); setEstado("idle"); return; }

      // Deteccion de duplicados
      const yaExiste = (facturas||[]).find(f => (f.numero||f.numeroFactura) === parsed.numeroFactura);
      if (yaExiste) { log(`🔴 DUPLICADO detectado: ${parsed.numeroFactura} — no registrada`, "error"); setEstado("idle"); return; }

      log(`✅ ${parsed.proveedor} — ${formatEURLocal(parsed.total)}`, "success");
      log(`   Base: ${formatEURLocal(parsed.baseImponible)} | IVA: ${formatEURLocal(parsed.cuotaIVA)} | IRPF: -${formatEURLocal(parsed.cuotaIRPF)}`, "detail");
      setFacturas(prev => [{ id: Date.now(), numero: parsed.numeroFactura || "AUTO", cliente: parsed.proveedor, obra: parsed.concepto, fecha: parsed.fecha, base: parsed.baseImponible, iva: parsed.cuotaIVA, irpf: parsed.cuotaIRPF, total: parsed.total, estado: "Pagada", tipo: "gasto", auto: true }, ...prev]);
      setProcesadas(n => n + 1);
      log(`💾 Registrada en Contabilidad`, "success");
    } catch { log(`❌ Error — Conecta la API Key de Anthropic`, "error"); }
    setEstado("idle");
  }, [log, setFacturas, facturas]);

  const iniciar = () => {
    setActivo(true); setLogs([]); procesados.current = new Set();
    log("🚀 Agente autonomo iniciado", "success");
    log(`📧 Monitorizando: josemanuelalcazar10@gmail.com`, "success");
    log("🤖 Claude IA · Deteccion de duplicados · Alertas", "success");
    log("─".repeat(40), "div");
    CORREOS.forEach(c => {
      const t = setTimeout(() => {
        if (!procesados.current.has(c.id)) { procesados.current.add(c.id); procesar(c); }
      }, c.t);
      timers.current.push(t);
    });
  };

  const detener = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setActivo(false); setEstado("idle");
    log("⛔ Agente detenido", "warn");
  };

  // CHAT — consultor financiero
  const contextoEmpresa = () => {
    const ingresos = (facturas||[]).filter(f=>f.tipo==="ingreso").reduce((s,f)=>s+(f.total||0),0);
    const gastos = (facturas||[]).filter(f=>f.tipo==="gasto").reduce((s,f)=>s+(f.total||0),0);
    const ivaRep = (facturas||[]).filter(f=>f.tipo==="ingreso").reduce((s,f)=>s+(f.iva||0),0);
    const ivaSop = (facturas||[]).filter(f=>f.tipo==="gasto").reduce((s,f)=>s+(f.iva||0),0);
    const pendiente = (facturas||[]).filter(f=>f.tipo==="ingreso"&&f.estado==="Pendiente").reduce((s,f)=>s+(f.total||0),0);
    const hoy = new Date();
    const trimestre = Math.floor(hoy.getMonth()/3)+1;
    return `Datos reales de la empresa en FactuCloud:
- Ingresos totales: ${formatEURLocal(ingresos)} (${(facturas||[]).filter(f=>f.tipo==="ingreso").length} facturas)
- Gastos totales: ${formatEURLocal(gastos)} (${(facturas||[]).filter(f=>f.tipo==="gasto").length} facturas)
- Margen bruto: ${formatEURLocal(ingresos-gastos)} (${ingresos>0?((ingresos-gastos)/ingresos*100).toFixed(1):0}%)
- IVA a pagar modelo 303: ${formatEURLocal(ivaRep-ivaSop)}
- IRPF pago fraccionado 130: ${formatEURLocal(Math.max(0,(ingresos-gastos)*0.20))}
- Pendiente de cobro: ${formatEURLocal(pendiente)}
- Trimestre actual: ${trimestre}T ${hoy.getFullYear()}
- Clientes: ${(clientes||[]).length} registrados
- Proveedores: ${(proveedores||[]).length} registrados
- Proyectos activos: ${(obras||[]).filter(o=>o.estado==="En ejecución").length} de ${(obras||[]).length} totales
- Proyectos: ${(obras||[]).map(o=>`${o.nombre} (${o.estado}, ${o.presupuesto}€, ${o.progreso}%)`).join(", ")||"ninguno"}
- Clientes principales: ${(clientes||[]).slice(0,3).map(c=>c.nombre).join(", ")||"ninguno"}`;
  };

  const enviarChat = async () => {
    if (!inputChat.trim() || loadingChat) return;
    const pregunta = inputChat.trim();
    setInputChat("");
    const nuevosMensajes = [...mensajes, { rol: "usuario", texto: pregunta }];
    setMensajes(nuevosMensajes);
    setLoadingChat(true);
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);

    try {
      const historial = nuevosMensajes.slice(-8).map(m => ({ role: m.rol === "usuario" ? "user" : "assistant", content: m.texto }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `Eres el asistente financiero y consultor de FactuCloud, una plataforma de gestion empresarial para empresas constructoras españolas. Tienes acceso completo a los datos reales de la empresa.

${contextoEmpresa()}

Eres experto en:
1. CONSULTOR DE DATOS: Responde preguntas sobre los datos reales de la empresa (IVA, margen, liquidez, clientes, etc.)
2. ASISTENTE DE PLATAFORMA: Explica como usar FactuCloud (modulos: Dashboard, Analitica, Tesoreria, Informes IA, Proyectos, Proveedores, Clientes, Nominas, Presupuestos, Contabilidad, Documentos, Agente IA)
3. ASESOR PROACTIVO: Sugiere acciones basadas en los datos
4. EXPERTO FISCAL: IVA, IRPF, modelos 303/130/111/190/347, deducibilidad de gastos en España

Responde siempre en español, de forma directa y concisa. Cuando cites cifras usa los datos reales. Si el usuario pregunta como hacer algo en la app, explica el modulo y pasos exactos. Maximo 4-5 lineas por respuesta salvo que se pida detalle.`,
          messages: historial
        })
      });
      const data = await res.json();
      const respuesta = data.content?.map(i => i.text || "").join("") || "No pude procesar la consulta.";
      setMensajes(prev => [...prev, { rol: "asistente", texto: respuesta }]);
    } catch {
      setMensajes(prev => [...prev, { rol: "asistente", texto: "Error al conectar. Comprueba que la API Key de Anthropic esta configurada." }]);
    }
    setLoadingChat(false);
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);
  };

  const PREGUNTAS_RAPIDAS = [
    "¿Cuánto IVA debo este trimestre?",
    "¿Cuál es mi margen bruto actual?",
    "¿Tengo liquidez para 60 días?",
    "¿Cuánto me queda pendiente de cobro?",
    "¿Cómo añado un nuevo empleado?",
    "¿Qué gastos puedo deducir?",
    "¿Cuáles son mis clientes más rentables?",
    "¿Qué modelos fiscales tengo que presentar?",
  ];

  const COL = { info: "#444", scan: "#7eb8f5", ai: "#f0a500", success: "#4caf7d", detail: "#333", warn: "#e07830", error: "#e05252", div: "#111" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— Agente IA + Consultor</div>
      </div>

      {/* Alertas proactivas */}
      {alertasProactivas.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>Alertas del sistema</div>
          {alertasProactivas.map((a, i) => (
            <div key={i} style={{ background: `${a.color}10`, border: `1px solid ${a.color}33`, borderLeft: `3px solid ${a.color}`, borderRadius: 2, padding: "10px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>{a.icono}</span>
              <span style={{ fontSize: 12, color: a.color, fontFamily: "'JetBrains Mono', monospace" }}>{a.msg}</span>
              <button onClick={() => { setInputChat(`Ayúdame con esta alerta: ${a.msg}`); setSubtab("chat"); }} style={{ marginLeft: "auto", background: `${a.color}20`, border: `1px solid ${a.color}44`, color: a.color, padding: "4px 12px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Consultar</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 22 }}>
        {[["chat","Consultor financiero IA"],["agente","Agente autonomo"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#555", padding: "12px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      {/* CHAT CONSULTOR */}
      {subtab === "chat" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", height: 560 }}>
            {/* Mensajes */}
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "3px 3px 0 0", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
              {mensajes.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: m.rol === "usuario" ? "row-reverse" : "row" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.rol === "usuario" ? "#f0a50022" : "#4caf7d22", border: `1px solid ${m.rol === "usuario" ? "#f0a50044" : "#4caf7d44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                    {m.rol === "usuario" ? "U" : "✦"}
                  </div>
                  <div style={{ maxWidth: "78%", background: m.rol === "usuario" ? "#f0a50012" : "#ffffff", border: `1px solid ${m.rol === "usuario" ? "#f0a50022" : "#e2e8f0"}`, borderRadius: 3, padding: "12px 16px" }}>
                    <pre style={{ fontSize: 13, color: m.rol === "usuario" ? "#f0c060" : "#bbb", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{m.texto}</pre>
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#4caf7d22", border: "1px solid #4caf7d44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
                  <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf7d", opacity: 0.4, animation: `pulse 1s ${i*0.2}s infinite` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Input */}
            <div style={{ display: "flex", gap: 0 }}>
              <input value={inputChat} onChange={e => setInputChat(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviarChat()} placeholder="Pregunta sobre tus datos, la plataforma o situacion fiscal..." style={{ flex: 1, background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "none", color: "#334155", padding: "14px 18px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none", borderRadius: "0 0 0 3px" }} />
              <button onClick={enviarChat} disabled={loadingChat || !inputChat.trim()} style={{ background: loadingChat ? "#e2e8f0" : "#f0a500", color: loadingChat ? "#444" : "#f8f9fa", border: "none", padding: "14px 22px", cursor: loadingChat ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: "0 0 3px 0" }}>↑</button>
            </div>
          </div>

          {/* Panel lateral preguntas rapidas */}
          <div>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Preguntas rapidas</div>
            {PREGUNTAS_RAPIDAS.map((p, i) => (
              <button key={i} onClick={() => { setInputChat(p); }} style={{ display: "block", width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2, padding: "10px 12px", cursor: "pointer", textAlign: "left", fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, marginBottom: 8 }}>
                <span style={{ color: "#f0a500" }}>→</span> {p}
              </button>
            ))}
            <div style={{ marginTop: 16, background: "#ffffff", border: "1px solid #4caf7d22", borderRadius: 3, padding: "14px" }}>
              <div style={{ fontSize: 9, color: "#4caf7d", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Datos disponibles</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9 }}>
                ● {(facturas||[]).length} facturas<br/>
                ● {(clientes||[]).length} clientes<br/>
                ● {(proveedores||[]).length} proveedores<br/>
                ● {(obras||[]).length} proyectos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGENTE AUTONOMO */}
      {subtab === "agente" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          <div style={{ background: "#f8f9fa", border: "1px solid #f1f5f9", borderRadius: 3 }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              {["#e05252","#e0a020","#4caf7d"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
              <span style={{ marginLeft: 10, fontSize: 10, color: "#222", letterSpacing: 3 }}>TERMINAL — AGENTE LOG</span>
              {activo && <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf7d" }} /><span style={{ fontSize: 9, color: "#4caf7d", letterSpacing: 3 }}>LIVE</span></div>}
            </div>
            <div ref={logsRef} style={{ height: 400, overflowY: "auto", padding: "14px 18px" }}>
              {logs.length === 0
                ? <div style={{ color: "#1e293b", fontSize: 12, lineHeight: 2 }}>{"$ Agente en espera..."}<br/>{"$ Pulsa INICIAR para comenzar"}<br/><br/><span style={{ color: "#111" }}>{"$ Funciones:"}</span><br/><span style={{ color: "#111" }}>{"$ · Procesar facturas de correo"}</span><br/><span style={{ color: "#111" }}>{"$ · Detectar duplicados"}</span><br/><span style={{ color: "#111" }}>{"$ · Alertar gastos inusuales"}</span></div>
                : logs.map(l => l.tipo === "div"
                  ? <div key={l.id} style={{ color: "#111", fontSize: 11 }}>{l.msg}</div>
                  : <div key={l.id} style={{ display: "flex", gap: 10, marginBottom: 3 }}>
                      <span style={{ color: "#1e293b", fontSize: 10, flexShrink: 0, marginTop: 2 }}>{l.h}</span>
                      <span style={{ color: COL[l.tipo], fontSize: 12, lineHeight: 1.6 }}>{l.msg}</span>
                    </div>
                )
              }
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Control</div>
              {!activo
                ? <button onClick={iniciar} style={{ width: "100%", background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "14px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>INICIAR AGENTE</button>
                : <button onClick={detener} style={{ width: "100%", background: "rgba(224,82,82,0.15)", color: "#e05252", border: "1px solid rgba(224,82,82,0.3)", padding: "14px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>DETENER</button>
              }
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Capacidades</div>
              {[["Procesar facturas correo","#4caf7d"],["Deteccion de duplicados","#4caf7d"],["Alertas gastos inusuales","#4caf7d"],["Alertas fiscales 15 dias","#4caf7d"]].map(([k,c]) => (
                <div key={k} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Estadisticas</div>
              {[["Procesadas", procesadas, "#4caf7d"], ["Estado", estado === "idle" ? "En espera" : "Procesando", estado === "procesando" ? "#f0a500" : "#444"], ["Tiempo ahorrado", `~${procesadas * 8} min`, "#7eb8f5"]].map(([k,v,c]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
                  <span style={{ fontSize: 13, color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ════════════════════════════════════════
// APP RAÍZ
// ════════════════════════════════════════
export default function FactuCloudApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [obras, setObrasState] = useState(OBRAS_INIT);
  const [clientes, setClientesState] = useState(CLIENTES_INIT);
  const [proveedores, setProveedoresState] = useState(PROVEEDORES_INIT);
  const [facturas, setFacturasState] = useState(FACTURAS_INIT);
  const [empleados, setEmpleadosState] = useState([]);
  const [presupuestosList, setPresupuestosState] = useState([]);
  const [documentosList, setDocumentosState] = useState([]);
  const [movimientosList, setMovimientosState] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(() => {
    try { return localStorage.getItem("fc_onboarding") === "done"; } catch { return false; }
  });
  const [empresa, setEmpresa] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fc_empresa") || "null") || { nombre: "", cif: "", direccion: "", cp: "", ciudad: "", email: "", tel: "", iban: "", prefijoFactura: "F", nextNumero: 1, tipoIVA: 21 }; }
    catch { return { nombre: "", cif: "", direccion: "", cp: "", ciudad: "", email: "", tel: "", iban: "", prefijoFactura: "F", nextNumero: 1, tipoIVA: 21 }; }
  });

  // Cargar datos de Supabase al hacer login
  useEffect(() => {
    if (!loggedIn || !authToken) return;
    const cargar = async () => {
      try {
        const headers = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}` };
        const get = (tabla) => fetch(`${SUPABASE_URL}/rest/v1/${tabla}`, { headers }).then(r => r.json());
        const [o, c, p, f, n, pr, d, m] = await Promise.all([
          get("obras"), get("clientes"), get("proveedores"), get("facturas"),
          get("nominas"), get("presupuestos"), get("documentos"), get("movimientos")
        ]);
        setObrasState(Array.isArray(o) ? o : []);
        setClientesState(Array.isArray(c) ? c : []);
        setProveedoresState(Array.isArray(p) ? p : []);
        setFacturasState(Array.isArray(f) ? f : []);
        setEmpleadosState((Array.isArray(n) ? n : []).map(e => ({
          ...e,
          salarioBruto: e.salariobruto || e.salarioBruto || 0,
          fechaAlta: e.fechaalta || e.fechaAlta || "",
          historialSalarial: e.historialsalarial ? JSON.parse(e.historialsalarial) : (e.historialSalarial ? JSON.parse(e.historialSalarial) : [])
        })));
        setPresupuestosState((Array.isArray(pr) ? pr : []).map(p => ({
          ...p,
          totalMat: p.totalmat || p.totalMat || 0,
          totalSub: p.totalsub || p.totalSub || 0,
          validezDias: p.validezdias || p.validezDias || 30,
          creadoEn: p.creadoen || p.creadoEn || "",
          materiales: p.materiales ? JSON.parse(p.materiales) : [],
          subcontratas: p.subcontratas ? JSON.parse(p.subcontratas) : [],
          fases: p.fases ? JSON.parse(p.fases) : []
        })));
        setDocumentosState((Array.isArray(d) ? d : []).map(doc => ({
          ...doc,
          vinculoTipo: doc.vinculotipo || doc.vinculoTipo || "ninguno",
          versiones: doc.versiones ? JSON.parse(doc.versiones) : []
        })));
        setMovimientosState(Array.isArray(m) ? m : []);
        setDbReady(true);
      } catch (e) {
        console.error("Error cargando datos:", e);
        setDbError(true);
        setDbReady(true);
      }
    };
    cargar();
  }, [loggedIn, authToken]);

  // Wrappers que sincronizan con Supabase usando token del usuario
  const sbPost = (tabla, row) => {
    const token = authToken || SUPABASE_KEY;
    const r = { ...row, id: typeof row.id === "number" ? row.id : Number(row.id), user_id: authUser?.id };
    fetch(`${SUPABASE_URL}/rest/v1/${tabla}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Prefer": "return=minimal" },
      body: JSON.stringify(r)
    }).then(res => { if (!res.ok) res.text().then(t => console.error("Supabase POST error:", t)); })
    .catch(e => console.error("Supabase fetch error:", e));
  };

  const sbDelete = (tabla, id) => {
    const token = authToken || SUPABASE_KEY;
    fetch(`${SUPABASE_URL}/rest/v1/${tabla}?id=eq.${id}`, {
      method: "DELETE",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
    }).catch(e => console.error("Supabase delete error:", e));
  };

  const setObras = (updater) => {
    setObrasState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("obras", n));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("obras", p.id));
      return next;
    });
  };

  const setClientes = (updater) => {
    setClientesState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("clientes", n));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("clientes", p.id));
      return next;
    });
  };

  const setProveedores = (updater) => {
    setProveedoresState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("proveedores", n));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("proveedores", p.id));
      return next;
    });
  };

  const setFacturas = (updater) => {
    setFacturasState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("facturas", n));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("facturas", p.id));
      return next;
    });
  };

  const setEmpleados = (updater) => {
    setEmpleadosState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("nominas", {
        id: n.id, user_id: n.user_id,
        nombre: n.nombre, dni: n.dni, categoria: n.categoria,
        convenio: n.convenio, contrato: n.contrato,
        salariobruto: n.salarioBruto || n.salariobruto,
        fechaalta: n.fechaAlta || n.fechaalta,
        proyecto: n.proyecto, iban: n.iban,
        hijos: n.hijos, discapacidad: n.discapacidad, residente: n.residente,
        historialsalarial: JSON.stringify(n.historialSalarial || n.historialsalarial || [])
      }));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("nominas", p.id));
      return next;
    });
  };

  const setPresupuestos = (updater) => {
    setPresupuestosState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("presupuestos", {
        id: n.id, user_id: n.user_id,
        titulo: n.titulo, obra: n.obra, cliente: n.cliente,
        fecha: n.fecha, validez: n.validez,
        total: n.total,
        totalmat: n.totalMat || n.totalmat || 0,
        totalsub: n.totalSub || n.totalsub || 0,
        estado: n.estado,
        margen: n.margen,
        validezdias: n.validezDias || n.validezdias || 30,
        creadoen: n.creadoEn || n.creadoen || "",
        observaciones: n.observaciones || "",
        materiales: JSON.stringify(n.materiales || []),
        subcontratas: JSON.stringify(n.subcontratas || []),
        fases: JSON.stringify(n.fases || [])
      }));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("presupuestos", p.id));
      return next;
    });
  };

  const setDocumentos = (updater) => {
    setDocumentosState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("documentos", {
        id: n.id, user_id: n.user_id,
        nombre: n.nombre, tipo: n.tipo,
        vinculo: n.vinculo,
        vinculotipo: n.vinculoTipo || n.vinculotipo || "",
        fecha: n.fecha, vencimiento: n.vencimiento,
        notas: n.notas, contenido: n.contenido, subido: n.subido,
        versiones: JSON.stringify(n.versiones || [])
      }));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("documentos", p.id));
      return next;
    });
  };

  const setMovimientos = (updater) => {
    setMovimientosState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      next.filter(n => !prev.find(p => p.id === n.id)).forEach(n => sbPost("movimientos", n));
      prev.filter(p => !next.find(n => n.id === p.id)).forEach(p => sbDelete("movimientos", p.id));
      return next;
    });
  };

  const TABS = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "analitica", icon: "📊", label: "Analítica" },
    { id: "tesoreria", icon: "💳", label: "Tesorería" },
    { id: "informes", icon: "📋", label: "Informes IA" },
    { id: "obras", icon: "⬡", label: "Proyectos" },
    { id: "proveedores", icon: "◆", label: "Proveedores" },
    { id: "clientes", icon: "◉", label: "Clientes" },
    { id: "nominas", icon: "👷", label: "Nóminas" },
    { id: "presupuestos", icon: "✦", label: "Presupuestos" },
    { id: "contabilidad", icon: "≋", label: "Contabilidad" },
    { id: "documentos", icon: "📄", label: "Documentos" },
    { id: "agente", icon: "⚡", label: "Agente IA" },
  ];

  const factAuto = facturas.filter(f => f.auto).length;

  if (!loggedIn) return <Login onLogin={(token, user) => {
    setAuthToken(token);
    setAuthUser(user);
    setEsAdmin(user?.email === ADMIN_EMAIL);
    setLoggedIn(true);
  }} />;

  if (!dbReady) return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", marginBottom: 20 }}>Conectando base de datos...</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#f0a500", opacity: 0.3, animation: `pulse 1s ${i*0.2}s infinite` }} />)}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );

  // Onboarding primer login
  if (dbReady && !esAdmin && !onboardingDone) return (
    <div translate="no" style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
      <div style={{ maxWidth: 640, width: "100%", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>Bienvenido a</div>
          <div style={{ fontSize: 42, fontWeight: 300, marginBottom: 8 }}><span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#1e293b" }}>Cloud</span></div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>Tu plataforma de gestión empresarial con IA para el sector construcción</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
          {[
            ["⬡", "Proyectos", "Gestiona tus obras, presupuesto y avance en tiempo real"],
            ["≋", "Contabilidad", "Facturas, IVA, IRPF y calendario fiscal automático"],
            ["✦", "Presupuestos IA", "Genera presupuestos detallados con IA en segundos"],
            ["⚡", "Agente IA", "Procesa facturas automáticamente y consulta tus datos"],
            ["👷", "Nóminas", "Calcula nóminas con IRPF real según convenio de construcción"],
            ["📄", "Documentos", "Genera contratos y NDAs con IA listos para firmar"],
          ].map(([icon, titulo, desc]) => (
            <div key={titulo} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "20px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600, marginBottom: 4 }}>{titulo}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #f0a50033", borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#f0a500", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Primeros pasos recomendados</div>
          {[
            ["1", "Ve a Ajustes y completa los datos de tu empresa (CIF, dirección, IBAN)"],
            ["2", "Añade tus primeros clientes y proveedores"],
            ["3", "Crea tu primer proyecto en el módulo Proyectos"],
            ["4", "Genera tu primer presupuesto con IA describiendo la obra"],
          ].map(([num, texto]) => (
            <div key={num} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0a500", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{num}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, paddingTop: 2 }}>{texto}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setOnboardingDone(true); try { localStorage.setItem("fc_onboarding","done"); } catch {} }} style={{ width: "100%", background: "#f0a500", color: "#1e293b", border: "none", padding: "16px", cursor: "pointer", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", fontWeight: "bold", borderRadius: 8 }}>
          ◈ Empezar a usar FactuCloud
        </button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>Puedes volver a ver esta guía desde Ajustes</div>
      </div>
    </div>
  );

  // Panel de administrador
  if (esAdmin && dbReady) return <PanelAdmin authToken={authToken} onLogout={() => { setLoggedIn(false); setAuthToken(null); setAuthUser(null); setEsAdmin(false); }} />;

  return (
    <div translate="no" style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "'Plus Jakarta Sans', 'Inter', 'Segoe UI', Arial, sans-serif" }}>

      {/* Sidebar oscuro elegante */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: "#1e293b", borderRight: "1px solid #334155", zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>Facturación Inteligente</div>
          <div style={{ fontSize: 22, fontWeight: 300 }}>
            <span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#7eb8f5" }}>Cloud</span>
          </div>
          <div style={{ fontSize: 9, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, marginTop: 4 }}>v2.7 · IA Integrada</div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: tab === t.id ? "rgba(240,165,0,0.15)" : "transparent", border: "none", borderLeft: tab === t.id ? "3px solid #f0a500" : "3px solid transparent", color: tab === t.id ? "#f0a500" : "#94a3b8", cursor: "pointer", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderRadius: "0 8px 8px 0", marginBottom: 2, textAlign: "left", transition: "all .15s" }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
              {t.id === "agente" && factAuto > 0 && <span style={{ marginLeft: "auto", background: "#f0a500", color: "#1e293b", fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: "bold" }}>{factAuto}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid #334155" }}>
          <button onClick={() => setTab("ajustes")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: tab === "ajustes" ? "rgba(240,165,0,0.15)" : "transparent", border: "none", borderLeft: tab === "ajustes" ? "3px solid #f0a500" : "3px solid transparent", color: tab === "ajustes" ? "#f0a500" : "#64748b", cursor: "pointer", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderRadius: "0 8px 8px 0", textAlign: "left", marginBottom: 6 }}>
            <span>⚙</span>Ajustes
          </button>
          <button onClick={() => {
                setLoggedIn(false); setAuthToken(null); setAuthUser(null);
                setObrasState([]); setClientesState([]); setProveedoresState([]);
                setFacturasState([]); setEmpleadosState([]); setPresupuestosState([]);
                setDocumentosState([]); setMovimientosState([]); setDbReady(false);
              }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", textAlign: "left" }}>
            <span>↩</span>Cerrar sesión
          </button>
          {dbError && <div style={{ background: "#fee2e2", borderRadius: 6, padding: "8px 12px", marginTop: 8, fontSize: 10, color: "#ef4444" }}>⚠ BD sin conectar</div>}
        </div>
      </div>

      {/* Contenido principal claro */}
      <div style={{ marginLeft: 220, padding: "32px 40px", minHeight: "100vh", background: "#f8fafc" }}>
        {/* Chat de ayuda flotante */}
        <ChatAyuda tabActual={tab} />

        {tab === "dashboard" && <Dashboard obras={obras} facturas={facturas} proveedores={proveedores} clientes={clientes} setTab={setTab} />}
        {tab === "analitica" && <Analitica facturas={facturas} obras={obras} />}
        {tab === "tesoreria" && <Tesoreria facturas={facturas} movimientos={movimientosList} setMovimientos={setMovimientos} />}
        {tab === "informes" && <Informes facturas={facturas} obras={obras} proveedores={proveedores} clientes={clientes} />}
        {tab === "obras" && <Obras obras={obras} setObras={setObras} />}
        {tab === "proveedores" && <Proveedores proveedores={proveedores} setProveedores={setProveedores} />}
        {tab === "clientes" && <Clientes clientes={clientes} setClientes={setClientes} />}
        {tab === "nominas" && <Nominas empleados={empleados} setEmpleados={setEmpleados} />}
        {tab === "presupuestos" && <Presupuestos facturas={facturas} setFacturas={setFacturas} lista={presupuestosList} setLista={setPresupuestos} />}
        {tab === "contabilidad" && <Contabilidad facturas={facturas} setFacturas={setFacturas} empresa={empresa} />}
        {tab === "documentos" && <Documentos clientes={clientes} proveedores={proveedores} obras={obras} docs={documentosList} setDocs={setDocumentos} />}
        {tab === "agente" && <Agente setFacturas={setFacturas} facturas={facturas} clientes={clientes} obras={obras} proveedores={proveedores} />}
        {tab === "ajustes" && <Ajustes empresa={empresa} setEmpresa={emp => { setEmpresa(emp); try { localStorage.setItem("fc_empresa", JSON.stringify(emp)); } catch {} }} />}
      </div>

      <style>{`* { box-sizing: border-box; } body { font-family: 'Plus Jakarta Sans','Inter','Segoe UI',Arial,sans-serif; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f8fafc; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; } input,select,textarea { font-family: inherit; } @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap'); button { font-family: inherit; }`}</style>
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO AJUSTES
// ════════════════════════════════════════
function Ajustes({ empresa, setEmpresa }) {
  const [form, setForm] = useState({ ...empresa });
  const [guardado, setGuardado] = useState(false);
  const inp = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 };

  const guardar = () => {
    setEmpresa({ ...form });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 28 }}>— Ajustes de la plataforma</div>

      {/* Logo generado SVG */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="12" fill="#f8f9fa"/>
            <rect x="0" y="0" width="6" height="80" rx="3" fill="#f0a500"/>
            <text x="42" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="bold" fill="#1e293b">FC</text>
            <line x1="16" y1="42" x2="68" y2="42" stroke="#f0a500" strokeWidth="1.5" opacity="0.6"/>
            <text x="42" y="58" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#888" letterSpacing="3">FACTUCLOUD</text>
            <circle cx="64" cy="16" r="6" fill="#f0a500" opacity="0.15"/>
            <circle cx="64" cy="16" r="3" fill="#f0a500"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#334155", marginBottom: 6 }}>Logo de FactuCloud</div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>Este logo aparecerá en tus facturas, presupuestos e informes. Puedes personalizarlo con el nombre de tu empresa en los datos de abajo.</div>
        </div>
      </div>

      {/* Datos empresa */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #f0a500", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 20 }}>Datos de la empresa</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[["nombre","Nombre / Razón social"],["cif","CIF / NIF"],["email","Email de facturación"],["tel","Teléfono"],["direccion","Dirección"],["cp","Código postal"],["ciudad","Ciudad"],["iban","IBAN para cobros"]].map(([k,label]) => (
            <div key={k}>
              <div style={lbl}>{label}</div>
              <input value={form[k]||""} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} style={inp} placeholder={k === "nombre" ? "Tu empresa SL" : k === "cif" ? "B12345678" : ""} />
            </div>
          ))}
        </div>
      </div>

      {/* Configuración facturas */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: "2px solid #7eb8f5", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "#7eb8f5", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 20 }}>Configuración de facturas</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div>
            <div style={lbl}>Prefijo de factura</div>
            <input value={form.prefijoFactura||"F"} onChange={e => setForm(p => ({...p,prefijoFactura:e.target.value}))} style={inp} placeholder="F" />
            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>Ej: F → F2026-001</div>
          </div>
          <div>
            <div style={lbl}>Próximo número</div>
            <input type="number" value={form.nextNumero||1} onChange={e => setForm(p => ({...p,nextNumero:parseInt(e.target.value)||1}))} style={inp} />
            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>La siguiente factura será la nº {form.nextNumero||1}</div>
          </div>
          <div>
            <div style={lbl}>IVA por defecto (%)</div>
            <select value={form.tipoIVA||21} onChange={e => setForm(p => ({...p,tipoIVA:parseInt(e.target.value)}))} style={inp}>
              <option value={21}>21% — General</option>
              <option value={10}>10% — Reducido</option>
              <option value={4}>4% — Superreducido</option>
              <option value={0}>0% — Exento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview factura */}
      {form.nombre && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>Vista previa — Cabecera de factura</div>
          <div style={{ background: "#fff", padding: "20px 24px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <svg width="44" height="44" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" rx="12" fill="#f8f9fa"/>
                <rect x="0" y="0" width="6" height="80" rx="3" fill="#f0a500"/>
                <text x="42" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="bold" fill="#1e293b">FC</text>
                <line x1="16" y1="42" x2="68" y2="42" stroke="#f0a500" strokeWidth="1.5" opacity="0.6"/>
                <text x="42" y="58" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#888" letterSpacing="3">FACTUCLOUD</text>
              </svg>
              <div>
                <div style={{ fontSize: 16, color: "#1e293b", fontWeight: "bold" }}>{form.nombre}</div>
                <div style={{ fontSize: 11, color: "#999" }}>{form.cif} · {form.direccion}{form.cp ? `, ${form.cp}` : ""} {form.ciudad}</div>
                <div style={{ fontSize: 11, color: "#999" }}>{form.email} · {form.tel}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace" }}>{form.prefijoFactura||"F"}{new Date().getFullYear()}-{String(form.nextNumero||1).padStart(3,"0")}</div>
              <div style={{ fontSize: 11, color: "#999" }}>{new Date().toLocaleDateString("es-ES")}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "14px 36px", cursor: "pointer", fontSize: 11, letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar ajustes</button>
        <button onClick={() => { try { localStorage.removeItem("fc_onboarding"); } catch {} window.location.reload(); }} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "14px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", borderRadius: 2, textTransform: "uppercase" }}>Ver guía de inicio</button>
        {guardado && <div style={{ fontSize: 12, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace" }}>✓ Guardado correctamente</div>}
      </div>
    </div>
  );
}
function Nominas({ empleados: empleadosProp, setEmpleados: setEmpleadosProp }) {
  const [empleadosLocal, setEmpleadosLocal] = useState([]);
  const empleados = empleadosProp !== undefined ? empleadosProp : empleadosLocal;
  const setEmpleados = empleadosProp !== undefined ? setEmpleadosProp : setEmpleadosLocal;
  const [subtab, setSubtab] = useState("empleados");
  const [nuevo, setNuevo] = useState(false);
  const [mesNomina, setMesNomina] = useState(new Date().getMonth());
  const [form, setForm] = useState({
    nombre: "", dni: "", categoria: "", convenio: "Construcción y Obras Públicas", contrato: "Indefinido",
    salarioBruto: "", fechaAlta: "", proyecto: "", iban: "",
    hijos: 0, discapacidad: false, residente: true
  });

  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const CATEGORIAS = ["Oficial 1ª","Oficial 2ª","Oficial 3ª","Peón especialista","Peón ordinario","Encargado","Director de proyecto","Administrativo"];
  const CONTRATOS = ["Indefinido","Obra y servicio","Temporal","A tiempo parcial","Fijo discontinuo"];
  const CONVENIOS = ["Construcción y Obras Públicas","Metal","Madera","Comercio","General de empresa"];

  const calcularIRPF = (brutoAnual, hijos, discapacidad) => {
    let minPersonal = 5550 + (hijos >= 1 ? 2400 : 0) + (hijos >= 2 ? 2700 : 0) + (hijos >= 3 ? 4000 : 0);
    if (discapacidad) minPersonal += 3000;
    const base = Math.max(0, brutoAnual - minPersonal);
    let cuota = 0;
    if (base <= 12450) cuota = base * 0.19;
    else if (base <= 20200) cuota = 12450 * 0.19 + (base - 12450) * 0.24;
    else if (base <= 35200) cuota = 12450 * 0.19 + 7750 * 0.24 + (base - 20200) * 0.30;
    else if (base <= 60000) cuota = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + (base - 35200) * 0.37;
    else cuota = 12450 * 0.19 + 7750 * 0.24 + 15000 * 0.30 + 24800 * 0.37 + (base - 60000) * 0.45;
    return Math.max(0.02, cuota / brutoAnual);
  };

  const calcularNomina = (emp) => {
    const bruto = parseFloat(emp.salarioBruto) || 0;
    const tipoIRPF = calcularIRPF(bruto * 12, parseInt(emp.hijos || 0), emp.discapacidad);
    const irpf = bruto * tipoIRPF;
    const ssTrabajador = bruto * 0.0635;
    const ssEmpresa = bruto * 0.2360;
    const neto = bruto - irpf - ssTrabajador;
    const costeEmpresa = bruto + ssEmpresa;
    return { bruto, irpf, tipoIRPF, ssTrabajador, ssEmpresa, neto, costeEmpresa };
  };

  const guardarEmpleado = () => {
    if (!form.nombre) return;
    const emp = { ...form, id: Date.now(), salarioBruto: parseFloat(form.salarioBruto) || 0, historialSalarial: [{ fecha: form.fechaAlta || new Date().toLocaleDateString("es-ES"), salario: parseFloat(form.salarioBruto) || 0, motivo: "Alta" }] };
    setEmpleados(prev => [...prev, emp]);
    setNuevo(false);
    setForm({ nombre: "", dni: "", categoria: "", convenio: "Construcción y Obras Públicas", contrato: "Indefinido", salarioBruto: "", fechaAlta: "", proyecto: "", iban: "", hijos: 0, discapacidad: false, residente: true });
  };

  const exportarNominaPDF = (emp) => {
    const n = calcularNomina(emp);
    const mes = MESES[mesNomina];
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Nomina ${emp.nombre}</title>
    <style>body{font-family:Arial,sans-serif;max-width:780px;margin:20px auto;padding:30px;color:#1e293b;font-size:13px}
    .header{background:#f8f9fa;color:#f0a500;padding:20px;display:flex;justify-content:space-between;margin-bottom:20px}
    .header h2{margin:0;font-size:16px;letter-spacing:2px}
    .emp{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#f8f8f8;padding:16px;margin-bottom:16px}
    .emp div{font-size:11px}.emp strong{font-size:13px;color:#1e293b}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#f0f0f0;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#666}
    td{padding:10px 12px;border-bottom:1px solid #eee}
    .total{background:#f8f9fa;color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center}
    .total-val{font-size:28px;color:#f0a500;font-weight:bold}
    .footer{margin-top:30px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#aaa;display:flex;justify-content:space-between}
    </style></head><body>
    <div class="header"><div><h2>FACTUCLOUD</h2><p style="margin:4px 0;font-size:11px;color:#888">Nomina del trabajador</p></div>
    <div style="text-align:right"><p style="color:#f0a500;font-size:14px;margin:0">${mes} ${new Date().getFullYear()}</p></div></div>
    <div class="emp">
      <div><div style="color:#888;font-size:10px">TRABAJADOR</div><strong>${emp.nombre}</strong></div>
      <div><div style="color:#888;font-size:10px">DNI / NIE</div><strong>${emp.dni || "pendiente"}</strong></div>
      <div><div style="color:#888;font-size:10px">CATEGORIA</div><strong>${emp.categoria}</strong></div>
      <div><div style="color:#888;font-size:10px">CONTRATO</div><strong>${emp.contrato}</strong></div>
      <div><div style="color:#888;font-size:10px">ALTA</div><strong>${emp.fechaAlta || "pendiente"}</strong></div>
      <div><div style="color:#888;font-size:10px">IBAN</div><strong>${emp.iban || "pendiente"}</strong></div>
    </div>
    <table><thead><tr><th>Concepto</th><th style="text-align:right">Devengos</th><th style="text-align:right">Deducciones</th></tr></thead>
    <tbody>
      <tr><td>Salario base</td><td style="text-align:right">${n.bruto.toFixed(2)} EUR</td><td></td></tr>
      <tr><td>IRPF (${(n.tipoIRPF * 100).toFixed(1)}%)</td><td></td><td style="text-align:right;color:#c00">${n.irpf.toFixed(2)} EUR</td></tr>
      <tr><td>Seguridad Social trabajador (6.35%)</td><td></td><td style="text-align:right;color:#c00">${n.ssTrabajador.toFixed(2)} EUR</td></tr>
    </tbody></table>
    <div class="total"><div><div style="font-size:11px;color:#888;letter-spacing:2px">LIQUIDO A PERCIBIR</div>
    <div style="font-size:10px;color:#555;margin-top:4px">Transferencia a ${emp.iban || "IBAN pendiente"}</div></div>
    <div class="total-val">${n.neto.toFixed(2)} EUR</div></div>
    <div style="margin-top:16px;padding:12px;background:#f8f8f8;font-size:11px;color:#666;display:flex;justify-content:space-between">
      <span>Coste empresa: <strong>${n.costeEmpresa.toFixed(2)} EUR</strong></span>
      <span>SS empresa (23.60%): <strong>${n.ssEmpresa.toFixed(2)} EUR</strong></span>
    </div>
    <div class="footer"><span>Firma trabajador: ___________________</span><span>Firma empresa: ___________________</span>
    <span>Generado por FactuCloud - ${new Date().toLocaleDateString("es-ES")}</span></div>
    </body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = `Nomina_${emp.nombre.replace(/\s+/g,"_")}_${mes}_${new Date().getFullYear()}.html`; a.click();
  };

  const exportarGestoria = () => {
    if (empleados.length === 0) return;
    const mes = MESES[mesNomina];
    const resumen = `CUADRO DE COTIZACION - ${mes.toUpperCase()} ${new Date().getFullYear()}\n${"=".repeat(70)}\n\n` +
      empleados.map(e => {
        const n = calcularNomina(e);
        return `EMPLEADO: ${e.nombre}\nDNI: ${e.dni||"--"} | Categoria: ${e.categoria} | Contrato: ${e.contrato}\nIBAN: ${e.iban||"pendiente"} | Alta: ${e.fechaAlta||"--"} | Convenio: ${e.convenio||"--"}\n\nBASES:\n  Salario bruto mensual:  ${n.bruto.toFixed(2)} EUR\n\nDEDUCCIONES TRABAJADOR:\n  IRPF (${(n.tipoIRPF*100).toFixed(1)}%):          ${n.irpf.toFixed(2)} EUR\n  SS trabajador (6.35%): ${n.ssTrabajador.toFixed(2)} EUR\n  NETO A TRANSFERIR:     ${n.neto.toFixed(2)} EUR\n\nCOSTE EMPRESA:\n  SS empresa (23.60%):   ${n.ssEmpresa.toFixed(2)} EUR\n  COSTE TOTAL:           ${n.costeEmpresa.toFixed(2)} EUR\n\n${"-".repeat(50)}\n`;
      }).join("\n") +
      `\nRESUMEN TOTAL\n${"=".repeat(40)}\nEmpleados: ${empleados.length}\nTotal bruto: ${empleados.reduce((s,e)=>s+calcularNomina(e).bruto,0).toFixed(2)} EUR\nTotal IRPF: ${empleados.reduce((s,e)=>s+calcularNomina(e).irpf,0).toFixed(2)} EUR\nTotal SS trabajadores: ${empleados.reduce((s,e)=>s+calcularNomina(e).ssTrabajador,0).toFixed(2)} EUR\nTotal SS empresa: ${empleados.reduce((s,e)=>s+calcularNomina(e).ssEmpresa,0).toFixed(2)} EUR\nTotal neto a pagar: ${empleados.reduce((s,e)=>s+calcularNomina(e).neto,0).toFixed(2)} EUR\nCoste total empresa: ${empleados.reduce((s,e)=>s+calcularNomina(e).costeEmpresa,0).toFixed(2)} EUR\n\nGenerado por FactuCloud - ${new Date().toLocaleString("es-ES")}`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([resumen], { type: "text/plain;charset=utf-8" }));
    a.download = `Cuadro_Cotizacion_${mes}_${new Date().getFullYear()}.txt`; a.click();
  };

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);
  const totalNominas = empleados.reduce((s, e) => s + calcularNomina(e).costeEmpresa, 0);
  const totalNeto = empleados.reduce((s, e) => s + calcularNomina(e).neto, 0);
  const totalSS = empleados.reduce((s, e) => s + calcularNomina(e).ssEmpresa, 0);
  const inputStyle = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— Nominas y RRHH</div>
        <div style={{ display: "flex", gap: 8 }}>
          {empleados.length > 0 && <button onClick={exportarGestoria} style={{ background: "#e2e8f0", color: "#a78bfa", border: "1px solid #a78bfa33", padding: "10px 18px", cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>Exportar gestoria</button>}
          {subtab === "empleados" && <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo empleado</button>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[["Coste total empresa", formatEURLocal(totalNominas), "#e05252"], ["Total neto empleados", formatEURLocal(totalNeto), "#4caf7d"], ["SS empresa", formatEURLocal(totalSS), "#7eb8f5"], ["Empleados", empleados.length, "#f0a500"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "16px 18px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 22 }}>
        {[["empleados","Empleados"],["nominas","Nominas"],["cotizacion","Cotizacion SS"],["modelo111","Modelo 111"],["modelo190","Modelo 190"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#555", padding: "12px 18px", cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      {subtab === "empleados" && (
        <div>
          {nuevo && (
            <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo empleado — Ficha completa</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[["nombre","Nombre completo"],["dni","DNI / NIE"],["fechaAlta","Fecha de alta"],["salarioBruto","Salario bruto mensual"],["proyecto","Proyecto asignado"],["iban","IBAN para transferencia"]].map(([k, label]) => (
                  <div key={k}>
                    <div style={labelStyle}>{label}</div>
                    <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div><div style={labelStyle}>Categoria profesional</div>
                  <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} style={inputStyle}>
                    <option value="">Seleccionar...</option>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><div style={labelStyle}>Tipo de contrato</div>
                  <select value={form.contrato} onChange={e => setForm(p => ({ ...p, contrato: e.target.value }))} style={inputStyle}>
                    {CONTRATOS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><div style={labelStyle}>Convenio colectivo</div>
                  <select value={form.convenio} onChange={e => setForm(p => ({ ...p, convenio: e.target.value }))} style={inputStyle}>
                    {CONVENIOS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Situacion personal (para IRPF)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div><div style={labelStyle}>Numero de hijos</div>
                    <input type="number" min="0" value={form.hijos} onChange={e => setForm(p => ({ ...p, hijos: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
                    <input type="checkbox" checked={form.discapacidad} onChange={e => setForm(p => ({ ...p, discapacidad: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#f0a500" }} />
                    <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>Discapacidad reconocida</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
                    <input type="checkbox" checked={form.residente} onChange={e => setForm(p => ({ ...p, residente: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#f0a500" }} />
                    <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>Residente fiscal en España</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={guardarEmpleado} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Guardar empleado</button>
                <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
              </div>
            </div>
          )}
          {empleados.length === 0 && !nuevo
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin empleados - pulsa nuevo empleado</div>
            : <div style={{ display: "grid", gap: 12 }}>
                {empleados.map(e => {
                  const n = calcularNomina(e);
                  return (
                    <div key={e.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 18 }}>{e.nombre[0]}</div>
                          <div>
                            <div style={{ fontSize: 15, color: "#1e293b", marginBottom: 3 }}>{e.nombre}</div>
                            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{e.categoria} · {e.contrato} · {e.convenio}</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>Alta: {e.fechaAlta||"--"} · IBAN: {e.iban ? e.iban.slice(0,8)+"..." : "pendiente"} · {e.hijos > 0 ? e.hijos+" hijo/s" : "Sin hijos"}{e.discapacidad ? " · Discapacidad" : ""}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <button onClick={() => exportarNominaPDF(e)} style={{ background: "#4caf7d15", border: "1px solid #4caf7d33", color: "#4caf7d", padding: "6px 14px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Nomina PDF</button>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Coste empresa</div>
                            <div style={{ fontSize: 20, color: "#e05252" }}>{formatEURLocal(n.costeEmpresa)}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                        {[["Bruto", formatEURLocal(n.bruto), "#aaa"], ["IRPF "+((n.tipoIRPF*100).toFixed(1))+"%", formatEURLocal(n.irpf), "#e05252"], ["SS trabajador", formatEURLocal(n.ssTrabajador), "#7eb8f5"], ["SS empresa", formatEURLocal(n.ssEmpresa), "#a78bfa"], ["Neto a pagar", formatEURLocal(n.neto), "#4caf7d"]].map(([k, v, c]) => (
                          <div key={k}>
                            <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                            <div style={{ fontSize: 14, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {e.historialSalarial?.length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                          <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>Historial salarial</div>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {e.historialSalarial.map((h, i) => (
                              <div key={i} style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", background: "#ffffff", padding: "4px 10px", borderRadius: 2 }}>{h.fecha} · {formatEURLocal(h.salario)} · {h.motivo}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}

      {subtab === "nominas" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Nominas — {MESES[mesNomina]} {new Date().getFullYear()}</div>
            <select value={mesNomina} onChange={e => setMesNomina(parseInt(e.target.value))} style={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "8px 12px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none" }}>
              {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          {empleados.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Añade empleados primero</div>
            : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  {["Empleado","Bruto","IRPF","SS Trab.","SS Emp.","Neto","Coste emp.",""].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 9, letterSpacing: 2, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "normal" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {empleados.map(e => {
                    const n = calcularNomina(e);
                    return (
                      <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px", color: "#334155" }}>{e.nombre}</td>
                        <td style={{ padding: "12px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(n.bruto)}</td>
                        <td style={{ padding: "12px", color: "#e05252", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(n.irpf)}</td>
                        <td style={{ padding: "12px", color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(n.ssTrabajador)}</td>
                        <td style={{ padding: "12px", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(n.ssEmpresa)}</td>
                        <td style={{ padding: "12px", color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(n.neto)}</td>
                        <td style={{ padding: "12px", color: "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(n.costeEmpresa)}</td>
                        <td style={{ padding: "12px" }}><button onClick={() => exportarNominaPDF(e)} style={{ background: "#4caf7d15", border: "1px solid #4caf7d33", color: "#4caf7d", padding: "5px 10px", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>PDF</button></td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: "2px solid #e2e8f0", background: "#f0f4ff" }}>
                    <td style={{ padding: "14px 12px", color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>TOTAL</td>
                    <td style={{ padding: "14px 12px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).bruto,0))}</td>
                    <td style={{ padding: "14px 12px", color: "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).irpf,0))}</td>
                    <td style={{ padding: "14px 12px", color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).ssTrabajador,0))}</td>
                    <td style={{ padding: "14px 12px", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(totalSS)}</td>
                    <td style={{ padding: "14px 12px", color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", fontSize: 15 }}>{formatEURLocal(totalNeto)}</td>
                    <td style={{ padding: "14px 12px", color: "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", fontSize: 15 }}>{formatEURLocal(totalNominas)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
          }
        </div>
      )}

      {subtab === "cotizacion" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Cuadro de cotizacion — Datos para gestoria</div>
            <button onClick={exportarGestoria} style={{ background: "#a78bfa", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Exportar para gestoria</button>
          </div>
          {empleados.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Añade empleados primero</div>
            : empleados.map(e => {
              const n = calcularNomina(e);
              return (
                <div key={e.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px 24px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, color: "#334155", marginBottom: 3 }}>{e.nombre}</div>
                      <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>DNI: {e.dni||"--"} · Alta: {e.fechaAlta||"--"} · {e.contrato} · {e.convenio}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>IBAN: {e.iban || "Pendiente"}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[["Base cotizacion", formatEURLocal(n.bruto), "#aaa"],["IRPF ("+((n.tipoIRPF*100).toFixed(1))+"%)", formatEURLocal(n.irpf), "#e05252"],["SS trabajador (6.35%)", formatEURLocal(n.ssTrabajador), "#7eb8f5"],["Neto a transferir", formatEURLocal(n.neto), "#4caf7d"],["SS empresa (23.60%)", formatEURLocal(n.ssEmpresa), "#a78bfa"],["Coste total empresa", formatEURLocal(n.costeEmpresa), "#e05252"]].map(([k, v, c]) => (
                      <div key={k} style={{ background: "#ffffff", padding: "12px 16px", borderRadius: 2 }}>
                        <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>{k}</div>
                        <div style={{ fontSize: 16, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          }
        </div>
      )}

      {subtab === "modelo111" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Modelo 111 — Retenciones IRPF trimestral</div>
          {[["Num perceptores", empleados.length, "#aaa"],["Base retenciones (trimestre)", formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).bruto,0)*3), "#aaa"],["Total retenciones IRPF (trimestre)", formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).irpf,0)*3), "#e05252"],["SS empresa (trimestre)", formatEURLocal(totalSS*3), "#7eb8f5"]].map(([k, v, c]) => (
            <div key={k} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "16px 22px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
              <span style={{ fontSize: 20, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ background: "#ffffff", border: "1px solid #f0a50022", borderRadius: 2, padding: "14px 20px", marginTop: 8 }}>
            <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>Aviso</div>
            <p style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, margin: 0 }}>IRPF calculado por tramos segun situacion personal. Revisa con tu gestoria antes de presentar.</p>
          </div>
        </div>
      )}

      {subtab === "modelo190" && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Modelo 190 — Resumen anual de retenciones</div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Se presenta en enero del año siguiente. Contiene el resumen de todas las retenciones del ejercicio.</div>
          {empleados.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Añade empleados primero</div>
            : <>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 120px", borderBottom: "1px solid #e2e8f0" }}>
                  {["Perceptor / DNI","Bruto anual","IRPF anual","SS anual","Tipo IRPF"].map(h => <div key={h} style={{ padding: "10px 14px", fontSize: 9, color: "#94a3b8", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{h}</div>)}
                </div>
                {empleados.map((e, i) => {
                  const n = calcularNomina(e);
                  return (
                    <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 120px", borderBottom: i < empleados.length-1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ padding: "14px" }}>
                        <div style={{ fontSize: 12, color: "#334155" }}>{e.nombre}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{e.dni || "DNI pendiente"}</div>
                      </div>
                      <div style={{ padding: "14px", fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", display:"flex",alignItems:"center" }}>{formatEURLocal(n.bruto * 12)}</div>
                      <div style={{ padding: "14px", fontSize: 13, color: "#e05252", fontFamily: "'JetBrains Mono', monospace", display:"flex",alignItems:"center" }}>{formatEURLocal(n.irpf * 12)}</div>
                      <div style={{ padding: "14px", fontSize: 13, color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", display:"flex",alignItems:"center" }}>{formatEURLocal(n.ssTrabajador * 12)}</div>
                      <div style={{ padding: "14px", fontSize: 13, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", display:"flex",alignItems:"center" }}>{(n.tipoIRPF * 100).toFixed(1)}%</div>
                    </div>
                  );
                })}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 120px", background: "#f0f4ff", borderTop: "2px solid #e2e8f0" }}>
                  <div style={{ padding: "14px", fontSize: 10, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, display:"flex",alignItems:"center" }}>Total ejercicio</div>
                  <div style={{ padding: "14px", fontSize: 14, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", display:"flex",alignItems:"center" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).bruto*12,0))}</div>
                  <div style={{ padding: "14px", fontSize: 14, color: "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", display:"flex",alignItems:"center" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).irpf*12,0))}</div>
                  <div style={{ padding: "14px", fontSize: 14, color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", display:"flex",alignItems:"center" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).ssTrabajador*12,0))}</div>
                  <div style={{ padding: "14px" }}></div>
                </div>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #7eb8f522", borderRadius: 2, padding: "14px 20px" }}>
                <div style={{ fontSize: 9, color: "#7eb8f5", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>Presentacion</div>
                <p style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, margin: 0 }}>El Modelo 190 se presenta en enero (del 1 al 31) del año siguiente. Datos calculados con salarios actuales multiplicados por 12 meses.</p>
              </div>
            </>
          }
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO DOCUMENTOS
function Documentos({ clientes, proveedores, obras, docs: docsProp, setDocs: setDocsProp }) {
  const [docsLocal, setDocsLocal] = useState([]);
  const docs = docsProp !== undefined ? docsProp : docsLocal;
  const setDocs = docsProp !== undefined ? setDocsProp : setDocsLocal;
  const [tab, setTab] = useState("lista");
  const [nuevo, setNuevo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [alertaDias, setAlertaDias] = useState(30);
  const [docSel, setDocSel] = useState(null);
  const [form, setForm] = useState({ nombre: "", tipo: "Contrato", vinculo: "", vinculoTipo: "proyecto", fecha: "", vencimiento: "", notas: "", contenido: "" });
  const [inputIA, setInputIA] = useState("");
  const [docGenerado, setDocGenerado] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [tipoDoc, setTipoDoc] = useState("contrato_servicios");

  const TIPOS = ["Contrato", "Licencia", "Seguro", "Certificado", "Acta", "Plano", "NDA", "Reclamacion", "Otro"];
  const TIPO_COL = { Contrato: "#f0a500", Licencia: "#7eb8f5", Seguro: "#4caf7d", Certificado: "#a78bfa", Acta: "#e05252", Plano: "#4cbbaf", NDA: "#e0a020", Reclamacion: "#e05252", Otro: "#555" };

  const TIPOS_IA = [
    { id: "contrato_servicios", label: "Contrato de servicios", icon: "📄", desc: "Prestacion de servicios entre empresa y cliente" },
    { id: "contrato_compraventa", label: "Contrato de compraventa", icon: "🤝", desc: "Compraventa de bienes o materiales" },
    { id: "nda", label: "Acuerdo de confidencialidad (NDA)", icon: "🔒", desc: "Proteccion de informacion confidencial" },
    { id: "reclamacion_impago", label: "Carta de reclamacion de impago", icon: "⚠️", desc: "Reclamacion formal de facturas impagadas" },
    { id: "acta_reunion", label: "Acta de reunion", icon: "📋", desc: "Registro de acuerdos y decisiones de una reunion" },
    { id: "subcontrata", label: "Contrato de subcontrata", icon: "🏗", desc: "Contrato especifico para subcontratacion de obra" },
  ];

  const PROMPTS_DOC = {
    contrato_servicios: `Eres un abogado experto en derecho mercantil español especializado en construcción. Genera un contrato de prestacion de servicios profesional y completo. Usa la descripcion del usuario para personalizar el contrato. Incluye: partes contratantes, objeto del contrato, plazo, precio y forma de pago, obligaciones de cada parte, condiciones de rescision, confidencialidad, legislacion aplicable. Escribe el contrato directamente en texto formal juridico español, listo para imprimir y firmar. Incluye campos en blanco [NOMBRE], [CIF], [FECHA] donde sea necesario.`,
    contrato_compraventa: `Eres un abogado experto en derecho mercantil español. Genera un contrato de compraventa profesional. Incluye: identificacion de vendedor y comprador, descripcion detallada del bien, precio y condiciones de pago, entrega, garantias, reserva de dominio si aplica, legislacion aplicable. Escribe el contrato directamente en texto formal juridico español.`,
    nda: `Eres un abogado experto en propiedad intelectual y derecho mercantil español. Genera un acuerdo de confidencialidad (NDA) completo y equilibrado. Incluye: definicion de informacion confidencial, obligaciones de las partes, excepciones, duracion, consecuencias del incumplimiento, legislacion aplicable. Texto formal juridico español listo para firmar.`,
    reclamacion_impago: `Eres un abogado experto en derecho de cobros y reclamaciones en España. Genera una carta de reclamacion de impago formal y efectiva. Incluye: identificacion del acreedor y deudor, referencia a la factura impagada, importe reclamado, plazo para el pago, consecuencias del impago (intereses de demora segun Ley 3/2004), advertencia de acciones legales. Tono firme pero profesional.`,
    acta_reunion: `Eres un secretario profesional especializado en empresas constructoras. Genera un acta de reunion estructurada. Incluye: datos de la reunion (fecha, lugar, asistentes), orden del dia, desarrollo de cada punto, acuerdos adoptados, proximas acciones con responsables y plazos, fecha de proxima reunion. Formato profesional listo para distribuir.`,
    subcontrata: `Eres un abogado experto en construccion y subcontratacion en España, conocedor de la Ley 32/2006 de subcontratacion en construccion. Genera un contrato de subcontrata completo. Incluye: partes, obra objeto del contrato, trabajos subcontratados, precio y forma de pago por certificaciones, plazo, seguridad y salud, seguros obligatorios, retenciones de garantia, condiciones de rescision.`,
  };

  const hoy = new Date();

  const parseFecha = (str) => {
    if (!str) return null;
    if (str.includes("/")) { const [d,m,a] = str.split("/"); return new Date(a, m-1, d); }
    return new Date(str);
  };

  const proxVencer = docs.filter(d => {
    if (!d.vencimiento) return false;
    const f = parseFecha(d.vencimiento);
    if (!f) return false;
    const diff = (f - hoy) / 86400000;
    return diff >= 0 && diff <= alertaDias;
  });

  const docsFiltrados = docs.filter(d => {
    if (filtro !== "Todos" && d.tipo !== filtro) return false;
    if (busqueda && !d.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !(d.notas||"").toLowerCase().includes(busqueda.toLowerCase()) && !(d.contenido||"").toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const guardar = () => {
    if (!form.nombre) return;
    setDocs(prev => [...prev, { ...form, id: Date.now(), subido: new Date().toLocaleDateString("es-ES"), versiones: [{ version: 1, fecha: new Date().toLocaleDateString("es-ES"), nota: "Version inicial" }] }]);
    setNuevo(false);
    setForm({ nombre: "", tipo: "Contrato", vinculo: "", vinculoTipo: "proyecto", fecha: "", vencimiento: "", notas: "", contenido: "" });
  };

  const generarDocIA = async () => {
    if (!inputIA.trim()) return;
    setLoadingIA(true); setDocGenerado(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: PROMPTS_DOC[tipoDoc],
          messages: [{ role: "user", content: inputIA }]
        })
      });
      const data = await res.json();
      const texto = data.content?.map(i => i.text || "").join("") || "";
      setDocGenerado({ texto, tipo: tipoDoc, fecha: new Date().toLocaleDateString("es-ES") });
    } catch { setDocGenerado({ error: true }); }
    setLoadingIA(false);
  };

  const guardarDocIA = () => {
    if (!docGenerado?.texto) return;
    const tipoInfo = TIPOS_IA.find(t => t.id === tipoDoc);
    setDocs(prev => [...prev, { id: Date.now(), nombre: tipoInfo?.label + " — " + new Date().toLocaleDateString("es-ES"), tipo: tipoDoc === "nda" ? "NDA" : tipoDoc === "reclamacion_impago" ? "Reclamacion" : "Contrato", contenido: docGenerado.texto, subido: new Date().toLocaleDateString("es-ES"), fecha: new Date().toLocaleDateString("es-ES"), vencimiento: "", notas: "Generado por IA", vinculo: "", versiones: [{ version: 1, fecha: new Date().toLocaleDateString("es-ES"), nota: "Generado por IA" }] }]);
    setDocGenerado(null); setInputIA(""); setTab("lista");
  };

  const exportarDoc = (texto, nombre) => {
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${nombre}</title>
    <style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:40px;color:#1e293b;font-size:13px;line-height:1.9}
    h1{font-size:18px;text-align:center;border-bottom:2px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
    .aviso{background:#fff8e6;border-left:3px solid #f0a500;padding:12px 16px;margin-bottom:24px;font-size:11px;color:#666}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#aaa;text-align:center}
    pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:13px}
    </style></head><body>
    <div class="aviso">AVISO LEGAL: Este documento ha sido generado mediante inteligencia artificial con fines informativos. No constituye asesoramiento juridico profesional. Se recomienda revisar y adaptar su contenido con un abogado cualificado antes de su firma y uso formal.</div>
    <pre>${texto}</pre>
    <div class="footer">Generado por FactuCloud con IA · ${new Date().toLocaleDateString("es-ES")}</div>
    </body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = `${nombre.replace(/\s+/g,"_")}.html`; a.click();
  };

  const inputSt = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };
  const labelSt = { fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— Documentos</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Alertar con</span>
            <input type="number" value={alertaDias} onChange={e => setAlertaDias(parseInt(e.target.value)||30)} style={{ ...inputSt, width: 50, padding: "6px 10px", fontSize: 12 }} />
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>dias</span>
          </div>
          <button onClick={() => { setTab("lista"); setNuevo(true); }} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo</button>
        </div>
      </div>

      {proxVencer.length > 0 && (
        <div style={{ background: "#e0783010", border: "1px solid #e0783033", borderLeft: "3px solid #e07830", borderRadius: 2, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#e07830", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Proximos a vencer ({alertaDias} dias)</div>
          {proxVencer.map(d => {
            const f = parseFecha(d.vencimiento);
            const dias = f ? Math.ceil((f - hoy) / 86400000) : 0;
            return <div key={d.id} style={{ fontSize: 12, color: "#e07830", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>→ {d.nombre} · Vence: {d.vencimiento} ({dias} dias)</div>;
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 22 }}>
        {[["lista",`Documentos (${docs.length})`],["generar","Generar con IA"]].map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); setNuevo(false); }} style={{ background: "none", border: "none", color: tab === id ? "#f0a500" : "#555", padding: "12px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: tab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      {/* LISTA DOCUMENTOS */}
      {tab === "lista" && !docSel && (
        <div>
          {nuevo && (
            <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo documento</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div><div style={labelSt}>Nombre</div><input value={form.nombre} onChange={e => setForm(p=>({...p,nombre:e.target.value}))} style={inputSt} /></div>
                <div><div style={labelSt}>Tipo</div>
                  <select value={form.tipo} onChange={e => setForm(p=>({...p,tipo:e.target.value}))} style={inputSt}>
                    {TIPOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><div style={labelSt}>Vincular a</div>
                  <select value={form.vinculoTipo} onChange={e => setForm(p=>({...p,vinculoTipo:e.target.value,vinculo:""}))} style={inputSt}>
                    <option value="proyecto">Proyecto</option>
                    <option value="cliente">Cliente</option>
                    <option value="proveedor">Proveedor</option>
                    <option value="ninguno">Sin vinculo</option>
                  </select>
                </div>
                {form.vinculoTipo !== "ninguno" && (
                  <div><div style={labelSt}>{form.vinculoTipo === "proyecto" ? "Proyecto" : form.vinculoTipo === "cliente" ? "Cliente" : "Proveedor"}</div>
                    <input value={form.vinculo} onChange={e => setForm(p=>({...p,vinculo:e.target.value}))} style={inputSt} placeholder={`Nombre del ${form.vinculoTipo}`} />
                  </div>
                )}
                <div><div style={labelSt}>Fecha documento</div><input value={form.fecha} onChange={e => setForm(p=>({...p,fecha:e.target.value}))} style={inputSt} placeholder="dd/mm/aaaa" /></div>
                <div><div style={labelSt}>Vencimiento (opcional)</div><input value={form.vencimiento} onChange={e => setForm(p=>({...p,vencimiento:e.target.value}))} style={inputSt} placeholder="dd/mm/aaaa" /></div>
                <div style={{ gridColumn: "1/-1" }}><div style={labelSt}>Notas</div><input value={form.notas} onChange={e => setForm(p=>({...p,notas:e.target.value}))} style={inputSt} /></div>
                <div style={{ gridColumn: "1/-1" }}><div style={labelSt}>Contenido (texto del documento)</div><textarea value={form.contenido} onChange={e => setForm(p=>({...p,contenido:e.target.value}))} style={{ ...inputSt, minHeight: 80, resize: "vertical" }} placeholder="Pega aqui el contenido del documento para poder buscarlo..." /></div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Guardar</button>
                <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Buscador + filtros */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar en nombre, notas y contenido..." style={{ ...inputSt, maxWidth: 360 }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["Todos", ...TIPOS].map(t => (
              <button key={t} onClick={() => setFiltro(t)} style={{ background: filtro === t ? "#f0a500" : "#ffffff", color: filtro === t ? "#f8f9fa" : "#555", border: "1px solid #e2e8f0", padding: "5px 14px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 20, textTransform: "uppercase" }}>{t}</button>
            ))}
          </div>

          {docsFiltrados.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin documentos</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                {docsFiltrados.map(d => {
                  const fVence = parseFecha(d.vencimiento);
                  const diasVence = fVence ? Math.ceil((fVence - hoy) / 86400000) : null;
                  const urgente = diasVence !== null && diasVence <= alertaDias;
                  return (
                    <div key={d.id} onClick={() => setDocSel(d)} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${TIPO_COL[d.tipo] || "#555"}`, borderRadius: 2, padding: "18px 22px", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ fontSize: 14, color: "#334155" }}>{d.nombre}</div>
                        <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: `${TIPO_COL[d.tipo]||"#555"}18`, color: TIPO_COL[d.tipo]||"#555", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${TIPO_COL[d.tipo]||"#555"}33`, whiteSpace: "nowrap", marginLeft: 8 }}>{d.tipo}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                        {d.vinculo && <span>{d.vinculoTipo}: {d.vinculo} · </span>}
                        {d.fecha && <span>{d.fecha}</span>}
                      </div>
                      {d.vencimiento && <div style={{ fontSize: 11, color: urgente ? "#e07830" : "#555", fontFamily: "'JetBrains Mono', monospace" }}>{urgente ? "⚡" : "⏰"} Vence: {d.vencimiento}{diasVence !== null ? ` (${diasVence} dias)` : ""}</div>}
                      {d.notas && <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>{d.notas}</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>v{d.versiones?.length || 1} · {d.subido}</div>
                        {d.versiones?.length > 1 && <div style={{ fontSize: 9, color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace" }}>{d.versiones.length} versiones</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}

      {/* DETALLE DOCUMENTO */}
      {tab === "lista" && docSel && (
        <div>
          <button onClick={() => setDocSel(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16, padding: 0 }}>← Volver</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 22, color: "#334155", marginBottom: 4 }}>{docSel.nombre}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{docSel.tipo} · {docSel.vinculo ? `${docSel.vinculoTipo}: ${docSel.vinculo} · ` : ""}{docSel.fecha}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {docSel.contenido && <button onClick={() => exportarDoc(docSel.contenido, docSel.nombre)} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "8px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Exportar</button>}
              <button onClick={() => {
                const nota = window.prompt("Nota de la nueva version:");
                if (!nota) return;
                setDocs(prev => prev.map(d => d.id === docSel.id ? { ...d, versiones: [...(d.versiones||[]), { version: (d.versiones?.length||1)+1, fecha: new Date().toLocaleDateString("es-ES"), nota }] } : d));
                setDocSel(d => ({ ...d, versiones: [...(d.versiones||[]), { version: (d.versiones?.length||1)+1, fecha: new Date().toLocaleDateString("es-ES"), nota }] }));
              }} style={{ background: "#f0a50015", border: "1px solid #f0a50033", color: "#f0a500", padding: "8px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Nueva version</button>
            </div>
          </div>
          {docSel.contenido && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px", marginBottom: 16, maxHeight: 400, overflowY: "auto" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>Contenido</div>
              <pre style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>{docSel.contenido}</pre>
            </div>
          )}
          {/* Historial versiones */}
          {docSel.versiones?.length > 0 && (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>Historial de versiones</div>
              {[...docSel.versiones].reverse().map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9", alignItems: "center" }}>
                  <div style={{ background: "#f0a50015", border: "1px solid #f0a50033", borderRadius: 2, padding: "3px 10px", fontSize: 10, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>v{v.version}</div>
                  <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{v.fecha}</div>
                  <div style={{ fontSize: 12, color: "#334155" }}>{v.nota}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GENERAR CON IA */}
      {tab === "generar" && !docGenerado && (
        <div style={{ maxWidth: 820 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Generacion de documentos con IA</div>
          <div style={{ background: "#f0a50010", border: "1px solid #f0a50033", borderLeft: "3px solid #f0a500", borderRadius: 2, padding: "12px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>AVISO LEGAL: Los documentos generados son orientativos y no sustituyen el asesoramiento juridico profesional. Revisalos con un abogado antes de firmarlos o utilizarlos en contextos legales.</div>
          </div>

          {/* Selector tipo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
            {TIPOS_IA.map(t => (
              <div key={t.id} onClick={() => setTipoDoc(t.id)} style={{ background: tipoDoc === t.id ? "#f0a50015" : "#ffffff", border: `1px solid ${tipoDoc === t.id ? "#f0a500" : "#e2e8f0"}`, borderRadius: 3, padding: "14px", cursor: "pointer" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 11, color: tipoDoc === t.id ? "#f0a500" : "#ccc", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", marginBottom: 4, lineHeight: 1.4 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>Describe los detalles del documento</div>
          <textarea value={inputIA} onChange={e => setInputIA(e.target.value)} placeholder={tipoDoc === "contrato_servicios" ? "Ej: Contrato entre mi empresa Construcciones Garcia SL (CIF B12345678) y el cliente Promotora Norte SA para construccion de nave industrial en Zaragoza por 350.000 EUR, plazo 8 meses, pago por certificaciones mensuales..." : tipoDoc === "reclamacion_impago" ? "Ej: Reclamar factura n F2026-045 por importe de 28.500 EUR emitida el 15/03/2026 a Construcciones Lopez SL (CIF B87654321), con vencimiento 15/04/2026, sin respuesta ni pago..." : "Describe los detalles del documento..."} style={{ width: "100%", minHeight: 120, background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "16px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />

          <button onClick={generarDocIA} disabled={loadingIA || !inputIA.trim()} style={{ marginTop: 14, background: loadingIA ? "#e2e8f0" : "#f0a500", color: loadingIA ? "#444" : "#f8f9fa", border: "none", padding: "14px 36px", cursor: loadingIA ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>
            {loadingIA ? "Generando documento..." : "Generar con IA"}
          </button>
        </div>
      )}

      {/* DOCUMENTO GENERADO */}
      {tab === "generar" && docGenerado && !docGenerado.error && (
        <div style={{ maxWidth: 820 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Documento generado por IA</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{TIPOS_IA.find(t=>t.id===tipoDoc)?.label} · {docGenerado.fecha}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => exportarDoc(docGenerado.texto, TIPOS_IA.find(t=>t.id===tipoDoc)?.label || "Documento")} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "10px 16px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Exportar HTML/PDF</button>
              <button onClick={guardarDocIA} style={{ background: "#4caf7d", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Guardar en documentos</button>
              <button onClick={() => setDocGenerado(null)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 16px", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Nuevo</button>
            </div>
          </div>
          <div style={{ background: "#f0a50010", border: "1px solid #f0a50033", borderLeft: "3px solid #f0a500", borderRadius: 2, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>Revisa el documento antes de usarlo. Adapta los campos en blanco [NOMBRE], [FECHA] con los datos reales.</div>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "28px 32px", maxHeight: 560, overflowY: "auto" }}>
            <pre style={{ fontSize: 12, color: "#475569", fontFamily: "Georgia, serif", lineHeight: 2, margin: 0, whiteSpace: "pre-wrap" }}>{docGenerado.texto}</pre>
          </div>
        </div>
      )}

      {tab === "generar" && docGenerado?.error && (
        <div style={{ padding: "14px", color: "#e05252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>Error al generar. Conecta la API Key de Anthropic.</div>
      )}
    </div>
  );
}


// ════════════════════════════════════════
// MÓDULO TESORERÍA
// ════════════════════════════════════════
function Tesoreria({ facturas, movimientos: movimientosProp, setMovimientos: setMovimientosProp }) {
  const [movimientosLocal, setMovimientosLocal] = useState([]);
  const movimientos = movimientosProp !== undefined ? movimientosProp : movimientosLocal;
  const setMovimientos = movimientosProp !== undefined ? setMovimientosProp : setMovimientosLocal;
  const [nuevo, setNuevo] = useState(false);
  const [subtab, setSubtab] = useState("resumen");
  const [form, setForm] = useState({ concepto: "", importe: "", tipo: "cobro", fecha: "", vencimiento: "", estado: "Pendiente", categoria: "Clientes" });
  const [csvImportado, setCsvImportado] = useState([]);
  const [saldoMinimo, setSaldoMinimo] = useState(10000);
  const [editSaldoMin, setEditSaldoMin] = useState(false);
  const [saldoMinInput, setSaldoMinInput] = useState("10000");

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

  const cobros = movimientos.filter(m => m.tipo === "cobro");
  const pagos = movimientos.filter(m => m.tipo === "pago");
  const totalCobros = cobros.reduce((s, m) => s + parseFloat(m.importe || 0), 0);
  const totalPagos = pagos.reduce((s, m) => s + parseFloat(m.importe || 0), 0);
  const saldoPrevisto = totalCobros - totalPagos;

  const cobrosFacturas = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + (f.total || 0), 0);
  const pagosFacturas = facturas.filter(f => f.tipo === "gasto" && f.estado !== "Pagada").reduce((s, f) => s + (f.total || 0), 0);
  const saldoNeto = saldoPrevisto + cobrosFacturas - pagosFacturas;

  const hoy = new Date();

  const parseFecha = (str) => {
    if (!str) return null;
    if (str.includes("/")) { const [d, m, a] = str.split("/"); return new Date(a, m - 1, d); }
    return new Date(str);
  };

  const en30 = movimientos.filter(m => {
    const f = parseFecha(m.vencimiento);
    if (!f) return false;
    const diff = (f - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  });

  // Aging cobros desde facturas
  const facturasIngresoPendiente = facturas.filter(f => f.tipo === "ingreso" && f.estado !== "Cobrada");
  const aging = { "0-30": [], "31-60": [], "+60": [] };
  facturasIngresoPendiente.forEach(f => {
    const fecha = parseFecha(f.fecha);
    if (!fecha) return;
    const dias = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
    if (dias <= 30) aging["0-30"].push(f);
    else if (dias <= 60) aging["31-60"].push(f);
    else aging["+60"].push(f);
  });

  // Previsión 90 días por semanas
  const semanas = Array.from({ length: 13 }, (_, i) => {
    const inicio = new Date(hoy); inicio.setDate(hoy.getDate() + i * 7);
    const fin = new Date(inicio); fin.setDate(inicio.getDate() + 6);
    const cobrosSeguro = facturas.filter(f => {
      const fecha = parseFecha(f.fecha);
      return f.tipo === "ingreso" && fecha && fecha >= inicio && fecha <= fin;
    }).reduce((s, f) => s + (f.total || 0), 0);
    const cobrosMovs = movimientos.filter(m => {
      const fecha = parseFecha(m.vencimiento);
      return m.tipo === "cobro" && fecha && fecha >= inicio && fecha <= fin;
    }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
    const pagosMovs = movimientos.filter(m => {
      const fecha = parseFecha(m.vencimiento);
      return m.tipo === "pago" && fecha && fecha >= inicio && fecha <= fin;
    }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
    return { label: `S${i + 1}`, cobrosSeguro, cobrosEstimado: cobrosMovs, pagos: pagosMovs };
  });
  const maxSem = Math.max(...semanas.map(s => s.cobrosSeguro + s.cobrosEstimado + s.pagos), 1);

  const guardar = () => {
    if (!form.concepto || !form.importe) return;
    setMovimientos(prev => [...prev, { ...form, id: Date.now(), registrado: new Date().toLocaleDateString("es-ES") }]);
    setNuevo(false);
    setForm({ concepto: "", importe: "", tipo: "cobro", fecha: "", vencimiento: "", estado: "Pendiente", categoria: "Clientes" });
  };

  // Importar CSV bancario
  const importarCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(l => l.trim());
      const parsed = lines.slice(1).map((line, i) => {
        const cols = line.split(/[,;]/).map(c => c.replace(/"/g, "").trim());
        return { id: Date.now() + i, fecha: cols[0] || "", concepto: cols[1] || cols[2] || "Movimiento importado", importe: Math.abs(parseFloat(cols[3] || cols[2] || 0)), tipo: parseFloat(cols[3] || cols[2] || 0) >= 0 ? "cobro" : "pago", estado: "Importado", origen: "banco" };
      }).filter(m => m.importe > 0);
      setCsvImportado(parsed);
    };
    reader.readAsText(file);
  };

  const conciliarCSV = () => {
    if (csvImportado.length === 0) return;
    setMovimientos(prev => [...prev, ...csvImportado]);
    setCsvImportado([]);
  };

  const CATEGORIAS_COBRO = ["Clientes", "Anticipos", "Subvenciones", "Otros ingresos"];
  const CATEGORIAS_PAGO = ["Proveedores", "Nóminas", "Alquileres", "Impuestos", "Seguros", "Suministros", "Otros gastos"];
  const inputStyle = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— Tesorería</div>
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ background: "#e2e8f0", color: "#64748b", border: "1px solid #2e2e3e", padding: "10px 18px", cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>
            ↑ Importar CSV
            <input type="file" accept=".csv,.ofx" onChange={importarCSV} style={{ display: "none" }} />
          </label>
          <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Añadir movimiento</button>
        </div>
      </div>

      {/* Alerta saldo mínimo */}
      {saldoNeto < saldoMinimo && saldoMinimo > 0 && (
        <div style={{ background: "#e0525210", border: "1px solid #e0525244", borderLeft: "3px solid #e05252", borderRadius: 2, padding: "14px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#e05252", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>⚠ Alerta saldo mínimo</div>
          <div style={{ fontSize: 12, color: "#e05252", fontFamily: "'JetBrains Mono', monospace" }}>Saldo previsto {formatEURLocal(saldoNeto)} está por debajo del umbral configurado ({formatEURLocal(saldoMinimo)})</div>
        </div>
      )}

      {/* CSV importado pendiente de conciliar */}
      {csvImportado.length > 0 && (
        <div style={{ background: "#7eb8f510", border: "1px solid #7eb8f533", borderLeft: "3px solid #7eb8f5", borderRadius: 2, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#7eb8f5", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>◈ {csvImportado.length} movimientos importados pendientes de conciliar</div>
          <div style={{ maxHeight: 140, overflowY: "auto", marginBottom: 12 }}>
            {csvImportado.slice(0, 5).map((m, i) => (
              <div key={i} style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>
                {m.fecha} · {m.concepto.slice(0, 40)} · <span style={{ color: m.tipo === "cobro" ? "#4caf7d" : "#e05252" }}>{m.tipo === "cobro" ? "+" : "-"}{formatEURLocal(m.importe)}</span>
              </div>
            ))}
            {csvImportado.length > 5 && <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>...y {csvImportado.length - 5} más</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={conciliarCSV} style={{ background: "#7eb8f5", color: "#f8f9fa", border: "none", padding: "8px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Conciliar todos</button>
            <button onClick={() => setCsvImportado([])} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "8px 16px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Descartar</button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Cobros previstos", formatEURLocal(totalCobros + cobrosFacturas), "#4caf7d"],
          ["Pagos previstos", formatEURLocal(totalPagos + pagosFacturas), "#e05252"],
          ["Saldo neto", formatEURLocal(saldoNeto), saldoNeto >= saldoMinimo ? "#4caf7d" : "#e05252"],
          ["Vencen en 30 días", en30.length, "#f0a500"],
          ["Impagados", facturasIngresoPendiente.length, facturasIngresoPendiente.length > 0 ? "#e05252" : "#4caf7d"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "16px 18px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Alertas vencimientos */}
      {en30.length > 0 && (
        <div style={{ background: "rgba(224,120,48,0.08)", border: "1px solid rgba(224,120,48,0.3)", borderLeft: "3px solid #e07830", borderRadius: 2, padding: "14px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#e07830", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>⚡ Vencen en los próximos 30 días</div>
          {en30.map(m => (
            <div key={m.id} style={{ fontSize: 12, color: "#e07830", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
              → {m.tipo === "cobro" ? "↑" : "↓"} {m.concepto} · {formatEURLocal(m.importe)} · Vence: {m.vencimiento}
            </div>
          ))}
        </div>
      )}

      {/* Formulario nuevo */}
      {nuevo && (
        <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo movimiento de tesorería</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tipo</div>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value, categoria: e.target.value === "cobro" ? "Clientes" : "Proveedores" }))} style={inputStyle}>
                <option value="cobro">Cobro (entrada)</option>
                <option value="pago">Pago (salida)</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Categoría</div>
              <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} style={inputStyle}>
                {(form.tipo === "cobro" ? CATEGORIAS_COBRO : CATEGORIAS_PAGO).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {[["concepto", "Concepto"], ["importe", "Importe (€)"], ["fecha", "Fecha prevista"], ["vencimiento", "Fecha vencimiento"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Subtabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
        {[["resumen", "Resumen"], ["aging", "Aging cobros"], ["cobros", `↑ Cobros (${cobros.length})`], ["pagos", `↓ Pagos (${pagos.length})`], ["previsiones", "Previsión 90 días"], ["config", "⚙ Config"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#555", padding: "12px 18px", cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent", whiteSpace: "nowrap" }}>{label}</button>
        ))}
      </div>

      {subtab === "resumen" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["Cobros pendientes de facturas", cobrosFacturas, "#4caf7d", facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").length + " facturas"],
            ["Pagos pendientes de facturas", pagosFacturas, "#e05252", facturas.filter(f => f.tipo === "gasto" && f.estado !== "Pagada").length + " facturas"],
            ["Cobros manuales registrados", totalCobros, "#4caf7d", cobros.length + " movimientos"],
            ["Pagos manuales registrados", totalPagos, "#e05252", pagos.length + " movimientos"],
          ].map(([l, v, c, s]) => (
            <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${c}`, padding: "20px 24px", borderRadius: 2 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 24, color: c, marginBottom: 4 }}>{formatEURLocal(v)}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {subtab === "aging" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Aging de cobros — Facturas vencidas por antigüedad</div>
          {facturasIngresoPendiente.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin facturas pendientes de cobro ✓</div>
            : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[["0-30", "#4caf7d", "Reciente"], ["31-60", "#f0a500", "Atención"], ["+60", "#e05252", "Crítico"]].map(([rango, color, label]) => (
                  <div key={rango} style={{ background: "#ffffff", border: `1px solid ${color}33`, borderTop: `2px solid ${color}`, borderRadius: 3, padding: "20px" }}>
                    <div style={{ fontSize: 10, color: color, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{rango} días · {label}</div>
                    <div style={{ fontSize: 26, color: color, marginBottom: 8 }}>{formatEURLocal(aging[rango].reduce((s, f) => s + (f.total || 0), 0))}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{aging[rango].length} facturas</div>
                    {aging[rango].map(f => (
                      <div key={f.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: 11, color: "#334155" }}>{f.cliente || "Sin cliente"}</span>
                        <span style={{ fontSize: 11, color: color, fontFamily: "'JetBrains Mono', monospace" }}>{formatEURLocal(f.total)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {(subtab === "cobros" || subtab === "pagos") && (
        <div>
          {(subtab === "cobros" ? cobros : pagos).length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: 3 }}>Sin {subtab} registrados</div>
            : (subtab === "cobros" ? cobros : pagos).map(m => (
              <div key={m.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${m.tipo === "cobro" ? "#4caf7d" : "#e05252"}`, padding: "16px 22px", marginBottom: 10, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#1e293b", marginBottom: 3 }}>{m.concepto}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{m.categoria} · Vence: {m.vencimiento || "Sin fecha"} {m.origen === "banco" ? "· 🏦 Importado" : ""}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, color: m.tipo === "cobro" ? "#4caf7d" : "#e05252", marginBottom: 4 }}>{m.tipo === "cobro" ? "+" : "-"}{formatEURLocal(m.importe)}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{m.estado}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {subtab === "previsiones" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Previsión de liquidez — próximas 13 semanas</div>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 180, marginBottom: 12 }}>
            {semanas.map((s, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 150, gap: 1 }}>
                  <div style={{ width: "100%", height: `${((s.cobrosSeguro) / maxSem) * 100}%`, background: "#4caf7d", borderRadius: "2px 2px 0 0", minHeight: s.cobrosSeguro > 0 ? 3 : 0 }} title="Cobros seguros (facturas emitidas)" />
                  <div style={{ width: "100%", height: `${((s.cobrosEstimado) / maxSem) * 100}%`, background: "#4caf7d44", border: "1px dashed #4caf7d", borderRadius: "2px 2px 0 0", minHeight: s.cobrosEstimado > 0 ? 3 : 0 }} title="Cobros estimados" />
                  <div style={{ width: "100%", height: `${(s.pagos / maxSem) * 100}%`, background: "#e05252", borderRadius: "2px 2px 0 0", minHeight: s.pagos > 0 ? 3 : 0 }} title="Pagos" />
                </div>
                <div style={{ fontSize: 7, color: i % 2 === 0 ? "#666" : "#444", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            {[["Cobros seguros (factura emitida)", "#4caf7d"], ["Cobros estimados", "#4caf7d44"], ["Pagos", "#e05252"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: c, border: l.includes("estimados") ? "1px dashed #4caf7d" : "none", borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
              </div>
            ))}
          </div>
          {/* Tabla resumen por periodo */}
          {["30 días", "60 días", "90 días"].map((periodo, idx) => {
            const dias = [30, 60, 90][idx];
            const cobrosP = movimientos.filter(m => { const f = parseFecha(m.vencimiento); return m.tipo === "cobro" && f && (f - hoy) / 86400000 <= dias; }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
            const pagosP = movimientos.filter(m => { const f = parseFecha(m.vencimiento); return m.tipo === "pago" && f && (f - hoy) / 86400000 <= dias; }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
            const saldo = cobrosP - pagosP;
            return (
              <div key={periodo} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "16px 24px", marginBottom: 8, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>En los próximos {periodo}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Cobros: {formatEURLocal(cobrosP)} · Pagos: {formatEURLocal(pagosP)}</div>
                </div>
                <div style={{ fontSize: 22, color: saldo >= 0 ? "#4caf7d" : "#e05252" }}>{formatEURLocal(saldo)}</div>
              </div>
            );
          })}
        </div>
      )}

      {subtab === "config" && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Configuración de tesorería</div>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Saldo mínimo de caja (alerta)</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Recibirás una alerta si el saldo previsto baja de este importe.</div>
            {editSaldoMin ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input value={saldoMinInput} onChange={e => setSaldoMinInput(e.target.value)} style={{ ...inputStyle, width: 160 }} placeholder="Ej: 10000" />
                <button onClick={() => { setSaldoMinimo(parseFloat(saldoMinInput) || 0); setEditSaldoMin(false); }} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>Guardar</button>
                <button onClick={() => setEditSaldoMin(false)} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "10px 14px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>✕</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 28, color: "#f0a500" }}>{formatEURLocal(saldoMinimo)}</div>
                <button onClick={() => { setSaldoMinInput(String(saldoMinimo)); setEditSaldoMin(true); }} style={{ background: "none", border: "1px solid #e2e8f0", color: "#64748b", padding: "8px 16px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Editar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO INFORMES IA
// ════════════════════════════════════════

const TIPOS_INFORME = [
  { id: "mensual", label: "Informe mensual ejecutivo", icon: "📊", desc: "Resumen de ingresos, gastos, margen, cobros pendientes y alertas del mes" },
  { id: "trimestral", label: "Informe trimestral fiscal", icon: "📋", desc: "Preparación para el Modelo 303 (IVA) y 130 (IRPF) con los números listos" },
  { id: "anual", label: "Cierre anual", icon: "📁", desc: "Informe completo para llevar a la gestoría o presentar al banco" },
  { id: "rentabilidad", label: "Rentabilidad por proyecto", icon: "🏗", desc: "Análisis de margen y rentabilidad por obra o cliente" },
  { id: "financiacion", label: "Informe para financiación", icon: "🏦", desc: "Documento presentable si vas a pedir un préstamo o línea de crédito" },
];

const INFORME_PROMPTS = {
  mensual: `Eres un asesor financiero experto en construcción española. Genera un informe mensual ejecutivo completo con análisis narrativo detallado. Devuelve SOLO JSON:
{"titulo":"Informe Mensual Ejecutivo","resumen":"párrafo ejecutivo 4-5 líneas","analisisNarrativo":"análisis en texto de 5-6 líneas explicando tendencias, comparativas y causas de variaciones","puntosFuertes":["punto detallado 1","punto 2","punto 3"],"areasRiesgo":["riesgo 1","riesgo 2"],"recomendaciones":["acción concreta 1","acción 2","acción 3"],"alertasCriticas":[],"kpis":{"margenBruto":"X%","diasCobro":"X días","rotacionCartera":"X"},"tendencia":"positiva|estable|negativa","puntuacion":75}`,
  trimestral: `Eres un asesor fiscal experto en autónomos y pymes de construcción en España. Genera el informe trimestral fiscal con los datos para el 303 y 130. Devuelve SOLO JSON:
{"titulo":"Informe Trimestral Fiscal","resumen":"resumen fiscal del trimestre","analisisNarrativo":"análisis fiscal detallado con referencias a modelos 303 y 130","baseImponible":"X€","cuotaIVARepercutido":"X€","cuotaIVASoportado":"X€","resultadoIVA":"X€","baseIRPF":"X€","pagoFraccionado130":"X€","puntosFuertes":["cumplimiento fiscal","otros"],"areasRiesgo":["riesgo 1"],"recomendaciones":["acción 1","acción 2"],"alertasCriticas":[],"tendencia":"estable","puntuacion":80}`,
  anual: `Eres un asesor financiero para gestoría. Genera un informe de cierre anual completo. Devuelve SOLO JSON:
{"titulo":"Cierre Anual","resumen":"resumen ejecutivo anual","analisisNarrativo":"análisis anual completo comparando con ejercicio anterior, evolución y perspectivas","ingresosTotales":"X€","gastosTotales":"X€","resultadoNeto":"X€","patrimonioEstimado":"X€","puntosFuertes":["logro 1","logro 2"],"areasRiesgo":["riesgo 1"],"recomendaciones":["para gestoría 1","para gestoría 2","objetivo año próximo"],"alertasCriticas":[],"tendencia":"positiva","puntuacion":75}`,
  rentabilidad: `Eres un controller financiero experto en construcción. Analiza la rentabilidad por proyecto y cliente. Devuelve SOLO JSON:
{"titulo":"Análisis de Rentabilidad por Proyecto","resumen":"resumen de rentabilidad global","analisisNarrativo":"análisis narrativo de qué proyectos y clientes son más rentables y por qué","proyectos":[],"topClienteRentable":"nombre cliente","margenMedioProyectos":"X%","puntosFuertes":["proyecto rentable 1"],"areasRiesgo":["proyecto poco rentable"],"recomendaciones":["acción 1","acción 2"],"alertasCriticas":[],"tendencia":"positiva","puntuacion":70}`,
  financiacion: `Eres un asesor financiero preparando documentación para entidades bancarias. Genera un informe de situación financiera para solicitar financiación. Devuelve SOLO JSON:
{"titulo":"Informe de Situación Financiera para Financiación","resumen":"presentación ejecutiva del negocio para banco","analisisNarrativo":"análisis completo de solvencia, liquidez y capacidad de pago para presentar a entidad bancaria","facturacionAnual":"X€","margenNeto":"X%","endeudamiento":"bajo|medio|alto","capacidadPago":"X€/mes estimados","puntosFuertes":["solidez 1","solidez 2","solidez 3"],"areasRiesgo":["riesgo 1"],"recomendaciones":["documentos a aportar 1","documentos 2","mejoras previas"],"alertasCriticas":[],"tendencia":"positiva","puntuacion":75}`,
};

function Informes({ facturas, obras, proveedores, clientes }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("mensual");
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historial, setHistorial] = useState([]);
  const [programado, setProgramado] = useState(false);
  const [emailProgramado, setEmailProgramado] = useState("");
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

  const mesActualInf = new Date().getMonth();
  const trimestreNum = Math.floor(mesActualInf / 3) + 1;
  const trimestreLabel = `${trimestreNum}T ${new Date().getFullYear()}`;
  const trimestresNombres = { 1: "1er trimestre (ene–mar)", 2: "2º trimestre (abr–jun)", 3: "3er trimestre (jul–sep)", 4: "4º trimestre (oct–dic)" };
  const fechaPresentacion = { 1: "1–20 abril", 2: "1–20 julio", 3: "1–20 octubre", 4: "1–30 enero" };

  const ingresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.total || 0), 0);
  const gastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.total || 0), 0);
  const pendienteCobro = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + (f.total || 0), 0);
  const ivaRepercutido = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.iva || 0), 0);
  const ivaSoportado = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.iva || 0), 0);

  const generarInforme = async () => {
    setLoading(true); setError(""); setInforme(null);
    const contexto = `
      Empresa de construcción con ${clientes.length} clientes y ${proveedores.length} proveedores.
      Proyectos activos: ${obras.filter(o => o.estado === "En ejecución").length} de ${obras.length} totales.
      Proyectos: ${obras.map(o => `${o.nombre} (${o.estado}, presupuesto: ${o.presupuesto}€, progreso: ${o.progreso}%)`).join("; ")}.
      Facturación total ingresos: ${formatEURLocal(ingresos)}.
      Gastos totales: ${formatEURLocal(gastos)}.
      Margen bruto: ${formatEURLocal(ingresos - gastos)} (${ingresos > 0 ? ((ingresos - gastos) / ingresos * 100).toFixed(1) : 0}%).
      Pendiente de cobro: ${formatEURLocal(pendienteCobro)}.
      IVA repercutido: ${formatEURLocal(ivaRepercutido)}. IVA soportado: ${formatEURLocal(ivaSoportado)}. Resultado IVA: ${formatEURLocal(ivaRepercutido - ivaSoportado)}.
      Facturas totales registradas: ${facturas.length}.
      Clientes principales: ${clientes.slice(0, 3).map(c => c.nombre).join(", ") || "ninguno aún"}.
      Fecha: ${new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}.
    `;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: INFORME_PROMPTS[tipoSeleccionado],
          messages: [{ role: "user", content: `Genera el informe con estos datos reales de la empresa: ${contexto}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const informeCompleto = { ...parsed, tipo: tipoSeleccionado, fecha: new Date().toLocaleDateString("es-ES"), id: Date.now() };
      setInforme(informeCompleto);
      setHistorial(prev => [informeCompleto, ...prev.slice(0, 9)]);
    } catch {
      setError("No se pudo generar el informe. Conecta la API Key de Anthropic para activar esta función.");
    }
    setLoading(false);
  };

  const exportarHTML = () => {
    if (!informe) return;
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${informe.titulo}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:40px;color:#1e293b;background:#fff}
    h1{font-size:28px;color:#f8f9fa;border-bottom:3px solid #f0a500;padding-bottom:16px;margin-bottom:8px}
    h2{font-size:16px;color:#f0a500;text-transform:uppercase;letter-spacing:3px;margin-top:32px;font-family:monospace}
    .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:20px 0}
    .kpi{background:#f8f8f8;padding:16px;border-top:3px solid #f0a500}
    .kpi-val{font-size:22px;color:#f8f9fa;font-weight:bold}.kpi-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px}
    p{line-height:1.8;color:#333;font-size:14px}ul{line-height:2;color:#333;font-size:13px}
    .score{display:inline-block;font-size:48px;color:#f0a500;font-weight:bold}
    .footer{margin-top:48px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#aaa;font-family:monospace}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div><div style="font-size:11px;color:#888;letter-spacing:4px;text-transform:uppercase;font-family:monospace">FactuCloud · Informe generado por IA</div></div>
      <div style="font-size:12px;color:#888;font-family:monospace">${informe.fecha}</div>
    </div>
    <h1>${informe.titulo}</h1>
    <h2>Resumen ejecutivo</h2><p>${informe.resumen}</p>
    <h2>Análisis</h2><p>${informe.analisisNarrativo || ""}</p>
    <h2>Puntos fuertes</h2><ul>${(informe.puntosFuertes || []).map(p => `<li>${p}</li>`).join("")}</ul>
    <h2>Áreas de riesgo</h2><ul>${(informe.areasRiesgo || []).map(p => `<li>${p}</li>`).join("")}</ul>
    <h2>Recomendaciones</h2><ul>${(informe.recomendaciones || []).map(p => `<li>${p}</li>`).join("")}</ul>
    ${informe.alertasCriticas?.length > 0 ? `<h2 style="color:#e05252">⚠ Alertas críticas</h2><ul>${informe.alertasCriticas.map(a => `<li style="color:#e05252">${a}</li>`).join("")}</ul>` : ""}
    <div style="margin-top:32px;padding:20px;background:#f8f8f8;border-top:3px solid #f0a500">
      <div style="font-size:12px;color:#888;font-family:monospace;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Salud financiera</div>
      <span class="score">${informe.puntuacion}/100</span>
    </div>
    <div class="footer">Generado por FactuCloud con IA · ${new Date().toLocaleString("es-ES")}</div>
    </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${informe.titulo.replace(/\s+/g, "_")}_${informe.fecha.replace(/\//g, "-")}.html`;
    a.click();
  };

  const exportarWord = () => {
    if (!informe) return;
    const contenido = `${informe.titulo}\n${"=".repeat(60)}\nFecha: ${informe.fecha}\n\nRESUMEN EJECUTIVO\n${"-".repeat(40)}\n${informe.resumen}\n\nANÁLISIS\n${"-".repeat(40)}\n${informe.analisisNarrativo || ""}\n\nPUNTOS FUERTES\n${"-".repeat(40)}\n${(informe.puntosFuertes || []).map(p => `• ${p}`).join("\n")}\n\nÁREAS DE RIESGO\n${"-".repeat(40)}\n${(informe.areasRiesgo || []).map(p => `• ${p}`).join("\n")}\n\nRECOMENDACIONES\n${"-".repeat(40)}\n${(informe.recomendaciones || []).map(p => `• ${p}`).join("\n")}\n\nSALUD FINANCIERA: ${informe.puntuacion}/100\n\n---\nGenerado por FactuCloud con IA`;
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${informe.titulo.replace(/\s+/g, "_")}_${informe.fecha.replace(/\//g, "-")}.txt`;
    a.click();
  };

  const TENDENCIA_COLOR = { positiva: "#4caf7d", estable: "#f0a500", negativa: "#e05252" };
  const TENDENCIA_ICON = { positiva: "↑", estable: "→", negativa: "↓" };
  const btnStyle = { background: "none", border: "1px solid #e2e8f0", color: "#64748b", padding: "8px 16px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>— Informes IA</div>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>Claude analiza tu negocio y genera informes profesionales con análisis narrativo</div>
        </div>
        <button onClick={() => setMostrarConfig(!mostrarConfig)} style={btnStyle}>⚙ Programar</button>
      </div>

      {/* Config informe programado */}
      {mostrarConfig && (
        <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>Informe automático mensual</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input value={emailProgramado} onChange={e => setEmailProgramado(e.target.value)} placeholder="tu@email.com" style={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", width: 240 }} />
            <button onClick={() => { setProgramado(true); setMostrarConfig(false); }} style={{ background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>
              ✓ Activar (día 1 de cada mes)
            </button>
          </div>
          {programado && emailProgramado && (
            <div style={{ fontSize: 11, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace", marginTop: 10 }}>✓ Informe mensual programado para {emailProgramado} — se enviará el día 1 de cada mes</div>
          )}
          <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>* Requiere conectar API Key de Anthropic. El informe se generará y enviará automáticamente.</div>
        </div>
      )}

      {programado && emailProgramado && !mostrarConfig && (
        <div style={{ background: "#4caf7d10", border: "1px solid #4caf7d22", borderRadius: 2, padding: "10px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#4caf7d", fontFamily: "'JetBrains Mono', monospace" }}>✓ Informe automático activo → {emailProgramado} (día 1 de cada mes)</div>
          <button onClick={() => setProgramado(false)} style={{ ...btnStyle, fontSize: 9, padding: "4px 10px" }}>Desactivar</button>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Ingresos", formatEURLocal(ingresos), "#4caf7d"],
          ["Gastos", formatEURLocal(gastos), "#e05252"],
          ["Margen", formatEURLocal(ingresos - gastos), ingresos >= gastos ? "#4caf7d" : "#e05252"],
          ["Pdte. cobro", formatEURLocal(pendienteCobro), "#f0a500"],
          ["IVA resultado", formatEURLocal(ivaRepercutido - ivaSoportado), ivaRepercutido >= ivaSoportado ? "#e05252" : "#4caf7d"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "14px 16px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 18, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Selector de tipo de informe */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 24 }}>
        {TIPOS_INFORME.map(t => (
          <div key={t.id} onClick={() => setTipoSeleccionado(t.id)} style={{ background: tipoSeleccionado === t.id ? "#f0a50015" : "#ffffff", border: `1px solid ${tipoSeleccionado === t.id ? "#f0a500" : "#e2e8f0"}`, borderRadius: 3, padding: "16px 14px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontSize: 10, color: tipoSeleccionado === t.id ? "#f0a500" : "#ccc", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", marginBottom: 6, lineHeight: 1.4 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button onClick={generarInforme} disabled={loading} style={{ background: loading ? "#e2e8f0" : "#f0a500", color: loading ? "#444" : "#f8f9fa", border: "none", padding: "12px 32px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>
          {loading ? "⟳ Generando informe..." : `✦ Generar ${TIPOS_INFORME.find(t => t.id === tipoSeleccionado)?.label}`}
        </button>
      </div>

      {error && <div style={{ padding: "14px 20px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, marginBottom: 20 }}>✕ {error}</div>}

      {informe && (
        <div>
          {/* Cabecera informe */}
          <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>FactuCloud · Informe generado por IA</div>
                <div style={{ fontSize: 22, color: "#1e293b", marginBottom: 4 }}>{informe.titulo}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{informe.fecha}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={exportarHTML} style={{ background: "#7eb8f5", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>↓ Exportar PDF / HTML</button>
                  <button onClick={exportarWord} style={{ background: "#a78bfa", color: "#f8f9fa", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>↓ Exportar Word</button>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 6 }}>Salud financiera</div>
                <div style={{ fontSize: 52, color: informe.puntuacion >= 70 ? "#4caf7d" : informe.puntuacion >= 40 ? "#f0a500" : "#e05252", fontWeight: 300, lineHeight: 1 }}>{informe.puntuacion}</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>/100</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${TENDENCIA_COLOR[informe.tendencia]}15`, border: `1px solid ${TENDENCIA_COLOR[informe.tendencia]}33`, padding: "4px 12px", borderRadius: 20, marginTop: 8 }}>
                  <span style={{ color: TENDENCIA_COLOR[informe.tendencia] }}>{TENDENCIA_ICON[informe.tendencia]}</span>
                  <span style={{ fontSize: 10, color: TENDENCIA_COLOR[informe.tendencia], letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{informe.tendencia}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen y análisis narrativo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>Resumen ejecutivo</div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.9, margin: 0 }}>{informe.resumen}</p>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "22px" }}>
              <div style={{ fontSize: 9, color: "#7eb8f5", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>Análisis IA</div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.9, margin: 0 }}>{informe.analisisNarrativo || "—"}</p>
            </div>
          </div>

          {/* Puntos fuertes, riesgos, recomendaciones */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              ["✓ Puntos fuertes", informe.puntosFuertes, "#4caf7d"],
              ["⚠ Áreas de riesgo", informe.areasRiesgo, "#e05252"],
              ["◈ Recomendaciones", informe.recomendaciones, "#f0a500"],
            ].map(([titulo, items, color]) => (
              <div key={titulo} style={{ background: "#ffffff", border: `1px solid ${color}22`, borderTop: `2px solid ${color}`, borderRadius: 3, padding: "20px" }}>
                <div style={{ fontSize: 9, color: color, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 14 }}>{titulo}</div>
                {(items || []).map((p, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#475569", lineHeight: 1.8, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                    <span style={{ position: "absolute", left: 0, color: color }}>→</span>{p}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Datos fiscales si es trimestral */}
          {informe.tipo === "trimestral" && (
            <div style={{ background: "#ffffff", border: "1px solid #7eb8f533", borderTop: "2px solid #7eb8f5", borderRadius: 3, padding: "22px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: "#7eb8f5", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>Datos fiscales — Modelo 303 y 130</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", borderRadius: 2, padding: "4px 12px", fontSize: 10, color: "#7eb8f5", fontFamily: "'JetBrains Mono', monospace" }}>{trimestreLabel} · {trimestresNombres[trimestreNum]}</div>
                  <div style={{ background: "#f0a50015", border: "1px solid #f0a50033", borderRadius: 2, padding: "4px 12px", fontSize: 10, color: "#f0a500", fontFamily: "'JetBrains Mono', monospace" }}>Presentación: {fechaPresentacion[trimestreNum]}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[
                  ["Base imponible", informe.baseImponible],
                  ["IVA repercutido", informe.cuotaIVARepercutido],
                  ["IVA soportado", informe.cuotaIVASoportado],
                  ["Resultado IVA (303)", informe.resultadoIVA],
                  ["Base IRPF", informe.baseIRPF],
                  ["Pago fraccionado 130", informe.pagoFraccionado130],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: "#ffffff", padding: "14px", borderRadius: 2 }}>
                    <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 18, color: "#7eb8f5" }}>{v || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {informe.alertasCriticas?.length > 0 && (
            <div style={{ background: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.3)", borderLeft: "3px solid #e05252", borderRadius: 2, padding: "16px 20px" }}>
              <div style={{ fontSize: 9, color: "#e05252", letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>🚨 Alertas críticas</div>
              {informe.alertasCriticas.map((a, i) => <div key={i} style={{ fontSize: 12, color: "#e05252", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>→ {a}</div>)}
            </div>
          )}
        </div>
      )}

      {!informe && !loading && !error && (
        <div style={{ background: "#ffffff", border: "1px solid #f0a50022", borderRadius: 3, padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
          <div style={{ fontSize: 14, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>Selecciona el tipo de informe y pulsa Generar</div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>Claude analizará tus datos y generará un informe profesional con análisis narrativo, exportable a PDF y Word</div>
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#94a3b8", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>Historial de informes generados</div>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 160px", gap: 0, borderBottom: "1px solid #e2e8f0" }}>
              {["Informe", "Fecha", "Puntuación", "Tendencia", "Acciones"].map(h => (
                <div key={h} style={{ padding: "10px 16px", fontSize: 9, color: "#94a3b8", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {historial.map((h, i) => {
              const exportH = (inf) => {
                const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${inf.titulo}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:40px;color:#1e293b}h1{border-bottom:3px solid #f0a500;padding-bottom:12px}h2{color:#f0a500;font-family:monospace;letter-spacing:3px;font-size:13px;text-transform:uppercase}p,li{line-height:1.8;font-size:14px;color:#333}</style></head><body><div style="font-size:11px;color:#888;font-family:monospace;letter-spacing:3px;text-transform:uppercase">FactuCloud · Informe IA · ${inf.fecha}</div><h1>${inf.titulo}</h1><h2>Resumen</h2><p>${inf.resumen}</p><h2>Análisis</h2><p>${inf.analisisNarrativo || ""}</p><h2>Puntos fuertes</h2><ul>${(inf.puntosFuertes || []).map(p => `<li>${p}</li>`).join("")}</ul><h2>Áreas de riesgo</h2><ul>${(inf.areasRiesgo || []).map(p => `<li>${p}</li>`).join("")}</ul><h2>Recomendaciones</h2><ul>${(inf.recomendaciones || []).map(p => `<li>${p}</li>`).join("")}</ul><div style="margin-top:24px;padding:16px;background:#f8f8f8;border-top:3px solid #f0a500"><strong>Salud financiera: ${inf.puntuacion}/100</strong></div></body></html>`;
                const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
                a.download = `${inf.titulo.replace(/\s+/g, "_")}_${inf.fecha.replace(/\//g, "-")}.html`; a.click();
              };
              const exportW = (inf) => {
                const txt = `${inf.titulo}\n${"=".repeat(50)}\nFecha: ${inf.fecha}\n\nRESUMEN\n${inf.resumen}\n\nANÁLISIS\n${inf.analisisNarrativo || ""}\n\nPUNTOS FUERTES\n${(inf.puntosFuertes || []).map(p => `• ${p}`).join("\n")}\n\nRIESGOS\n${(inf.areasRiesgo || []).map(p => `• ${p}`).join("\n")}\n\nRECOMENDACIONES\n${(inf.recomendaciones || []).map(p => `• ${p}`).join("\n")}\n\nSalud financiera: ${inf.puntuacion}/100`;
                const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
                a.download = `${inf.titulo.replace(/\s+/g, "_")}_${inf.fecha.replace(/\//g, "-")}.txt`; a.click();
              };
              return (
                <div key={h.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 160px", gap: 0, borderBottom: i < historial.length - 1 ? "1px solid #e2e8f0" : "none", background: informe?.id === h.id ? "#f0a50008" : "transparent" }}>
                  <div style={{ padding: "14px 16px", cursor: "pointer" }} onClick={() => setInforme(h)}>
                    <div style={{ fontSize: 13, color: "#334155", marginBottom: 3 }}>{h.titulo}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{TIPOS_INFORME.find(t => t.id === h.tipo)?.icon} {TIPOS_INFORME.find(t => t.id === h.tipo)?.label}</div>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{h.fecha}</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 16, color: h.puntuacion >= 70 ? "#4caf7d" : h.puntuacion >= 40 ? "#f0a500" : "#e05252", fontWeight: "bold" }}>{h.puntuacion}<span style={{ fontSize: 10, color: "#94a3b8" }}>/100</span></span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: TENDENCIA_COLOR[h.tendencia] || "#888", fontFamily: "'JetBrains Mono', monospace" }}>{TENDENCIA_ICON[h.tendencia] || "→"} {h.tendencia}</span>
                  </div>
                  <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => setInforme(h)} style={{ background: "#f0a50015", border: "1px solid #f0a50033", color: "#f0a500", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Ver</button>
                    <button onClick={() => exportH(h)} style={{ background: "#7eb8f515", border: "1px solid #7eb8f533", color: "#7eb8f5", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>PDF</button>
                    <button onClick={() => exportW(h)} style={{ background: "#a78bfa15", border: "1px solid #a78bfa33", color: "#a78bfa", padding: "5px 10px", cursor: "pointer", fontSize: 9, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Word</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO ANALÍTICA Y GRÁFICAS
// ════════════════════════════════════════
const PREVISION_PROMPT = `Eres un experto en construcción española. El usuario te da datos de obras y necesitas calcular la previsión de facturación mensual para cada mes del año actual.

Devuelve SOLO un JSON válido sin texto adicional:
{
  "previsionMensual": [0,0,0,0,0,0,0,0,0,0,0,0],
  "explicacion": "breve explicación de la curva",
  "fases": [
    {"nombre": "Inicio de obra", "meses": "Ene-Feb", "porcentaje": 15},
    {"nombre": "Estructura", "meses": "Mar-May", "porcentaje": 35},
    {"nombre": "Cerramientos", "meses": "Jun-Ago", "porcentaje": 30},
    {"nombre": "Acabados", "meses": "Sep-Nov", "porcentaje": 20}
  ]
}

El array previsionMensual tiene 12 valores (Ene-Dic) con los importes previstos de facturación cada mes.
Basa el cálculo en las obras activas y sus presupuestos y fechas. Usa curva en S típica de construcción.`;

function Analitica({ facturas, obras }) {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [prevision, setPrevision] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [fases, setFases] = useState([]);
  const [explicacion, setExplicacion] = useState("");
  const [filtro, setFiltro] = useState("año");
  const [vistaGrafico, setVistaGrafico] = useState("mensual");

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

  const now = new Date();
  const mesActual = now.getMonth();
  const trimestreActual = Math.floor(mesActual / 3);

  const factFiltradas = facturas.filter(f => {
    if (!f.fecha) return false;
    const d = new Date(f.fecha);
    if (filtro === "mes") return d.getMonth() === mesActual && d.getFullYear() === now.getFullYear();
    if (filtro === "trimestre") return Math.floor(d.getMonth() / 3) === trimestreActual && d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear();
  });

  const datosIngresos = new Array(12).fill(0);
  const datosGastos = new Array(12).fill(0);
  facturas.forEach(f => {
    if (!f.fecha) return;
    const d = new Date(f.fecha);
    if (d.getFullYear() !== now.getFullYear()) return;
    const m = d.getMonth();
    if (f.tipo === "ingreso") datosIngresos[m] += f.total || 0;
    else datosGastos[m] += f.total || 0;
  });
  const datosBeneficio = datosIngresos.map((v, i) => v - datosGastos[i]);

  const totalIngresos = factFiltradas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.total || 0), 0);
  const totalGastos = factFiltradas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.total || 0), 0);
  const margen = totalIngresos - totalGastos;
  const margenPct = totalIngresos > 0 ? ((margen / totalIngresos) * 100).toFixed(1) : 0;

  // DSO — días de cobro medio
  const facturasIngreso = facturas.filter(f => f.tipo === "ingreso" && f.fecha);
  const dso = facturasIngreso.length > 0
    ? Math.round(facturasIngreso.filter(f => f.estado === "Cobrada").length > 0
      ? 28 : 45) : 0;

  // Top clientes
  const topClientes = Object.entries(
    facturas.filter(f => f.tipo === "ingreso").reduce((acc, f) => {
      acc[f.cliente] = (acc[f.cliente] || 0) + (f.total || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Top proveedores
  const topProveedores = Object.entries(
    facturas.filter(f => f.tipo === "gasto").reduce((acc, f) => {
      acc[f.cliente] = (acc[f.cliente] || 0) + (f.total || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Desglose por categoría
  const categorias = facturas.filter(f => f.tipo === "gasto").reduce((acc, f) => {
    const cat = f.concepto?.split(" ")[0] || "Otros";
    acc[cat] = (acc[cat] || 0) + (f.total || 0);
    return acc;
  }, {});

  // Semáforo tesorería
  const hayDatos = facturas.length > 0;
  const cajaEstimada = totalIngresos - totalGastos;
  const gastoPorDia = totalGastos / (mesActual + 1) / 30;
  const diasCaja = gastoPorDia > 0 ? Math.round(cajaEstimada / gastoPorDia) : 999;
  const semaforo = !hayDatos
    ? { color: "#94a3b8", texto: "Sin datos suficientes", dias: null }
    : diasCaja >= 90 ? { color: "#4caf7d", texto: "Tesorería sólida", dias: diasCaja }
    : diasCaja >= 30 ? { color: "#f0a500", texto: "Riesgo moderado", dias: diasCaja }
    : { color: "#e05252", texto: "Problema inminente", dias: diasCaja };

  const generarPrevisionIA = async () => {
    setLoadingIA(true);
    const obrasInfo = obras.length > 0
      ? obras.map(o => `Obra: ${o.nombre}, Presupuesto: ${o.presupuesto}€, Progreso: ${o.progreso}%, Inicio: ${o.inicio}, Fin: ${o.fin}, Estado: ${o.estado}`).join(". ")
      : "No hay proyectos registrados aún. Genera una previsión de ejemplo para una empresa de construcción mediana con 2-3 obras activas de entre 200.000€ y 800.000€.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: PREVISION_PROMPT,
          messages: [{ role: "user", content: `Calcula la previsión mensual de facturación para este año basándote en: ${obrasInfo}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setPrevision(parsed.previsionMensual);
      setFases(parsed.fases || []);
      setExplicacion(parsed.explicacion || "");
    } catch {
      const ejemplo = [0, 0, 35000, 68000, 95000, 120000, 145000, 130000, 110000, 85000, 60000, 32000];
      setPrevision(ejemplo);
      setExplicacion("Previsión de ejemplo — añade tu API Key para calcular con IA real");
    }
    setLoadingIA(false);
  };

  const datosPrevistos = prevision || new Array(12).fill(0);
  const maxVal = Math.max(...datosIngresos, ...datosGastos, 1);
  const maxP = Math.max(...datosPrevistos, ...datosIngresos, 1);
  const mesPrevision = new Date().getMonth();
  const maxTop = Math.max(...topClientes.map(c => c[1]), ...topProveedores.map(p => p[1]), 1);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— Analítica y gráficas</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["mes", "trimestre", "año"].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{ background: filtro === f ? "#f0a500" : "#ffffff", color: filtro === f ? "#f8f9fa" : "#888", border: "1px solid #e2e8f0", padding: "6px 14px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2 }}>
              {f === "mes" ? "Este mes" : f === "trimestre" ? "Trimestre" : "Este año"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Ingresos", formatEURLocal(totalIngresos), "#4caf7d"],
          ["Gastos", formatEURLocal(totalGastos), "#e05252"],
          ["Margen bruto", formatEURLocal(margen), margen >= 0 ? "#4caf7d" : "#e05252"],
          ["% Margen", `${margenPct}%`, "#f0a500"],
          ["DSO", `${dso} días`, dso < 30 ? "#4caf7d" : dso < 60 ? "#f0a500" : "#e05252"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "16px 18px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Gráfico ingresos vs gastos */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Ingresos vs Gastos vs Beneficio</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["mensual", "anual"].map(v => (
                <button key={v} onClick={() => setVistaGrafico(v)} style={{ background: vistaGrafico === v ? "#f0a500" : "transparent", color: vistaGrafico === v ? "#f8f9fa" : "#555", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", borderRadius: 2 }}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 160 }}>
            {meses.slice(0, vistaGrafico === "mensual" ? 7 : 12).map((mes, i) => (
              <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", display: "flex", gap: 1, alignItems: "flex-end", height: 130 }}>
                  <div style={{ flex: 1, height: `${(datosIngresos[i] / maxVal) * 100}%`, background: "#4caf7d", borderRadius: "2px 2px 0 0", minHeight: datosIngresos[i] > 0 ? 3 : 0 }} />
                  <div style={{ flex: 1, height: `${(datosGastos[i] / maxVal) * 100}%`, background: "#e05252", borderRadius: "2px 2px 0 0", minHeight: datosGastos[i] > 0 ? 3 : 0 }} />
                  <div style={{ flex: 1, height: `${(Math.abs(datosBeneficio[i]) / maxVal) * 100}%`, background: datosBeneficio[i] >= 0 ? "#7eb8f5" : "#f0a500", borderRadius: "2px 2px 0 0", minHeight: datosBeneficio[i] !== 0 ? 3 : 0 }} />
                </div>
                <div style={{ fontSize: 8, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>{mes}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {[["Ingresos", "#4caf7d"], ["Gastos", "#e05252"], ["Beneficio", "#7eb8f5"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semáforo tesorería */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Previsión de Tesorería IA</div>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${semaforo.color}22`, border: `3px solid ${semaforo.color}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hayDatos ? `0 0 20px ${semaforo.color}44` : "none" }}>
              <div style={{ fontSize: 28, color: semaforo.color }}>{!hayDatos ? "?" : semaforo.color === "#4caf7d" ? "✓" : semaforo.color === "#f0a500" ? "⚠" : "✕"}</div>
            </div>
            <div style={{ fontSize: 16, color: semaforo.color, fontWeight: "bold", marginBottom: 8 }}>{semaforo.texto}</div>
            {hayDatos ? (<>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Caja estimada para</div>
              <div style={{ fontSize: 32, color: semaforo.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{diasCaja > 365 ? "+365" : diasCaja} días</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                {semaforo.color === "#4caf7d" ? "✓ La caja aguanta más de 90 días" : semaforo.color === "#f0a500" ? "⚠ Riesgo en menos de 90 días" : "✕ Problema en menos de 30 días"}
              </div>
            </>) : (
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>Registra facturas para<br/>activar el semáforo</div>
            )}
          </div>
        </div>
      </div>

      {/* Top clientes y proveedores */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#4caf7d", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 18 }}>Top clientes por volumen</div>
          {topClientes.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", paddingTop: 20 }}>Sin datos aún</div>
            : topClientes.map(([nombre, total], i) => {
              const colores = ["#4caf7d", "#5bc88a", "#6dd497", "#7fe0a4", "#91ecb1"];
              return (
                <div key={nombre} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#1e293b" }}>{nombre || "Sin nombre"}</span>
                    <span style={{ fontSize: 11, color: colores[i] || "#4caf7d", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(total)}</span>
                  </div>
                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(total / maxTop) * 100}%`, background: `linear-gradient(90deg, ${colores[i] || "#4caf7d"}, ${colores[i] || "#4caf7d"}88)`, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })
          }
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#e05252", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 18 }}>Top proveedores por gasto</div>
          {topProveedores.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", paddingTop: 20 }}>Sin datos aún</div>
            : topProveedores.map(([nombre, total], i) => {
              const colores = ["#e05252", "#e86666", "#f07a7a", "#f58e8e", "#faa2a2"];
              return (
                <div key={nombre} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#1e293b" }}>{nombre || "Sin nombre"}</span>
                    <span style={{ fontSize: 11, color: colores[i] || "#e05252", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold" }}>{formatEURLocal(total)}</span>
                  </div>
                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(total / maxTop) * 100}%`, background: `linear-gradient(90deg, ${colores[i] || "#e05252"}, ${colores[i] || "#e05252"}88)`, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Desglose por categoría de gasto */}
      {Object.keys(categorias).length > 0 && (() => {
        const catEntries = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
        const totalCat = catEntries.reduce((s, [, v]) => s + v, 0);
        const coloresCat = ["#e05252", "#f0a500", "#7eb8f5", "#a78bfa", "#4caf7d", "#f06292", "#26c6da"];
        return (
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>Desglose por categoría de gasto</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
              {/* Gráfico tarta SVG */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {(() => {
                    let angle = -90;
                    return catEntries.map(([cat, val], i) => {
                      const pct = val / totalCat;
                      const deg = pct * 360;
                      const startAngle = angle * Math.PI / 180;
                      angle += deg;
                      const endAngle = angle * Math.PI / 180;
                      const x1 = 80 + 70 * Math.cos(startAngle);
                      const y1 = 80 + 70 * Math.sin(startAngle);
                      const x2 = 80 + 70 * Math.cos(endAngle);
                      const y2 = 80 + 70 * Math.sin(endAngle);
                      const largeArc = deg > 180 ? 1 : 0;
                      return (
                        <path key={cat} d={`M80,80 L${x1},${y1} A70,70 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={coloresCat[i % coloresCat.length]} opacity="0.85" />
                      );
                    });
                  })()}
                  <circle cx="80" cy="80" r="35" fill="#ffffff" />
                  <text x="80" y="76" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">GASTO</text>
                  <text x="80" y="90" textAnchor="middle" fill="#ccc" fontSize="10" fontFamily="monospace" fontWeight="bold">{formatEURLocal(totalCat)}</text>
                </svg>
              </div>
              {/* Leyenda */}
              <div>
                {catEntries.map(([cat, val], i) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: coloresCat[i % coloresCat.length], flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: "#334155" }}>{cat}</span>
                        <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{((val / totalCat) * 100).toFixed(0)}%</span>
                      </div>
                      <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${(val / totalCat) * 100}%`, background: coloresCat[i % coloresCat.length], borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Previsión IA */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Previsión de Tesorería IA — Curva de facturación</div>
            {explicacion && <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{explicacion}</div>}
          </div>
          <button onClick={generarPrevisionIA} disabled={loadingIA} style={{ background: loadingIA ? "#e2e8f0" : "#f0a500", color: loadingIA ? "#444" : "#f8f9fa", border: "none", padding: "10px 22px", cursor: loadingIA ? "not-allowed" : "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, whiteSpace: "nowrap" }}>
            {loadingIA ? "⟳ Calculando..." : "✦ Calcular con IA"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 140 }}>
          {meses.map((mes, i) => {
            const isPast = i < mesPrevision;
            const isNow = i === mesPrevision;
            const val = datosPrevistos[i];
            return (
              <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {val > 0 && <div style={{ fontSize: 7, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>{(val/1000).toFixed(0)}k</div>}
                <div style={{ width: "80%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                  <div style={{ width: "100%", height: `${(val / maxP) * 100}%`, background: isPast ? "#f0a500" : isNow ? "#f0c040" : "#f0a50033", borderRadius: "2px 2px 0 0", minHeight: val > 0 ? 4 : 0, border: !isPast && !isNow ? "1px dashed #f0a50055" : "none", transition: "height 0.5s" }} />
                </div>
                <div style={{ fontSize: 8, color: isNow ? "#f0a500" : "#555", fontFamily: "'JetBrains Mono', monospace", fontWeight: isNow ? "bold" : "normal" }}>{mes}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          {[["Ejecutado", "#f0a500"], ["Mes actual", "#f0c040"], ["Previsto IA", "#f0a50033"]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, background: c, border: l === "Previsto IA" ? "1px dashed #f0a500" : "none", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fases de obra */}
      {fases.length > 0 && (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 18 }}>Fases de obra según IA</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {fases.map((fase, i) => {
              const cols = ["#7eb8f5", "#f0a500", "#4caf7d", "#a78bfa"];
              return (
                <div key={i} style={{ background: "#ffffff", border: `1px solid ${cols[i]}33`, borderTop: `2px solid ${cols[i]}`, padding: "16px 18px", borderRadius: 2 }}>
                  <div style={{ fontSize: 18, color: cols[i], fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", marginBottom: 6 }}>{fase.porcentaje}%</div>
                  <div style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>{fase.nombre}</div>
                  <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{fase.meses}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!prevision && (
        <div style={{ background: "#ffffff", border: "1px solid #f0a50022", borderRadius: 2, padding: "18px 22px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>◈ Cómo funciona</div>
          <p style={{ fontSize: 12, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.9, margin: 0 }}>
            Pulsa "Calcular con IA" y Claude analizará tus obras activas, sus presupuestos y fechas para generar una curva de facturación mensual realista basada en las fases típicas de construcción (curva en S).
          </p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// PANEL DE ADMINISTRADOR
// ════════════════════════════════════════
function PanelAdmin({ authToken, onLogout }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("clientes");
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [formCliente, setFormCliente] = useState({ email: "", password: "", empresa: "", plan: "basico" });
  const [creando, setCreando] = useState(false);
  const [errorCrear, setErrorCrear] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/perfiles?rol=eq.cliente`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch { setClientes([]); }
    setLoading(false);
  };

  const crearCliente = async () => {
    if (!formCliente.email || !formCliente.password) { setErrorCrear("Email y contraseña son obligatorios"); return; }
    setCreando(true); setErrorCrear("");
    try {
      // Crear usuario en Supabase Auth
      const resAuth = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({ email: formCliente.email, password: formCliente.password, email_confirm: true })
      });
      const dataAuth = await resAuth.json();
      if (dataAuth.error) { setErrorCrear(dataAuth.error.message || "Error al crear usuario"); setCreando(false); return; }
      // Crear perfil
      await fetch(`${SUPABASE_URL}/rest/v1/perfiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}`, "Prefer": "return=minimal" },
        body: JSON.stringify({ id: dataAuth.id, email: formCliente.email, rol: "cliente", empresa: formCliente.empresa, plan: formCliente.plan, activo: true })
      });
      setFormCliente({ email: "", password: "", empresa: "", plan: "basico" });
      setNuevoCliente(false);
      cargarClientes();
    } catch { setErrorCrear("Error de conexión"); }
    setCreando(false);
  };

  const inp = { width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", color: "#334155", padding: "10px 14px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" };

  return (
    <div translate="no" style={{ minHeight: "100vh", background: "#f8f9fa", color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Header admin */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 22 }}>
            <span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#7eb8f5" }}>Cloud</span>
          </div>
          <div style={{ background: "#e0525022", border: "1px solid #e0525044", borderRadius: 20, padding: "3px 12px", fontSize: 10, color: "#e05252", letterSpacing: 2, textTransform: "uppercase" }}>Panel Admin</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>admin@factucloud.app</span>
          <button onClick={onLogout} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "8px 16px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            ["Total clientes", clientes.length, "#f0a500"],
            ["Activos", clientes.filter(c => c.activo).length, "#4caf7d"],
            ["Plan básico", clientes.filter(c => c.plan === "basico").length, "#7eb8f5"],
            ["Plan pro", clientes.filter(c => c.plan === "pro").length, "#a78bfa"],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
              <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 28, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e2e8f0", marginBottom: 24 }}>
          {[["clientes","Clientes"],["stats","Estadísticas"],["accesos","Accesos y planes"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", color: tab === id ? "#f0a500" : "#555", padding: "12px 20px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", borderBottom: tab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
          ))}
          <button onClick={() => setNuevoCliente(true)} style={{ marginLeft: "auto", background: "#f0a500", color: "#f8f9fa", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo cliente</button>
        </div>

        {/* Formulario nuevo cliente */}
        {nuevoCliente && (
          <div style={{ background: "#f0f4ff", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 4, textTransform: "uppercase", marginBottom: 18 }}>Crear nuevo cliente</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["email","Email de acceso"],["password","Contraseña inicial"],["empresa","Nombre de la empresa"]].map(([k,label]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                  <input type={k === "password" ? "password" : "text"} value={formCliente[k]} onChange={e => setFormCliente(p => ({...p,[k]:e.target.value}))} style={inp} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Plan</div>
                <select value={formCliente.plan} onChange={e => setFormCliente(p => ({...p,plan:e.target.value}))} style={inp}>
                  <option value="basico">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            {errorCrear && <div style={{ marginTop: 12, color: "#e05252", fontSize: 11 }}>{errorCrear}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={crearCliente} disabled={creando} style={{ background: creando ? "#e2e8f0" : "#f0a500", color: creando ? "#444" : "#f8f9fa", border: "none", padding: "12px 28px", cursor: creando ? "not-allowed" : "pointer", fontSize: 10, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>
                {creando ? "Creando..." : "✓ Crear cliente"}
              </button>
              <button onClick={() => { setNuevoCliente(false); setErrorCrear(""); }} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "12px 20px", cursor: "pointer", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Lista clientes */}
        {tab === "clientes" && (
          loading ? <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Cargando...</div>
          : clientes.length === 0
          ? <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", letterSpacing: 3 }}>Sin clientes registrados</div>
          : <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px 80px", borderBottom: "1px solid #e2e8f0" }}>
                {["Email","Empresa","Plan","Estado",""].map(h => <div key={h} style={{ padding: "10px 16px", fontSize: 9, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>{h}</div>)}
              </div>
              {clientes.map((c, i) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px 80px", borderBottom: i < clientes.length-1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                  <div style={{ padding: "14px 16px", fontSize: 13, color: "#334155" }}>{c.email}</div>
                  <div style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{c.empresa || "—"}</div>
                  <div style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: c.plan === "pro" ? "#a78bfa22" : "#7eb8f522", color: c.plan === "pro" ? "#a78bfa" : "#7eb8f5", border: `1px solid ${c.plan === "pro" ? "#a78bfa44" : "#7eb8f544"}`, textTransform: "uppercase", letterSpacing: 1 }}>{c.plan}</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 10, color: c.activo ? "#4caf7d" : "#e05252" }}>{c.activo ? "● Activo" : "● Inactivo"}</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <button onClick={() => {
                      fetch(`${SUPABASE_URL}/rest/v1/perfiles?id=eq.${c.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}`, "Prefer": "return=minimal" },
                        body: JSON.stringify({ activo: !c.activo })
                      }).then(() => cargarClientes());
                    }} style={{ background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", padding: "4px 10px", cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", borderRadius: 2 }}>
                      {c.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
        )}

        {tab === "stats" && (
          <div>
            {/* KPIs SaaS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
              {[
                ["MRR estimado", `${(clientes.filter(c=>c.activo&&c.plan==="basico").length*29 + clientes.filter(c=>c.activo&&c.plan==="pro").length*79 + clientes.filter(c=>c.activo&&c.plan==="enterprise").length*199).toFixed(0)} €/mes`, "#4caf7d"],
                ["ARR estimado", `${((clientes.filter(c=>c.activo&&c.plan==="basico").length*29 + clientes.filter(c=>c.activo&&c.plan==="pro").length*79 + clientes.filter(c=>c.activo&&c.plan==="enterprise").length*199)*12).toFixed(0)} €/año`, "#f0a500"],
                ["Churn", clientes.filter(c=>!c.activo).length > 0 ? `${((clientes.filter(c=>!c.activo).length/clientes.length)*100).toFixed(0)}%` : "0%", "#e05252"],
                ["LTV medio", clientes.length > 0 ? `${((clientes.filter(c=>c.activo&&c.plan==="basico").length*29 + clientes.filter(c=>c.activo&&c.plan==="pro").length*79)*12/Math.max(clientes.length,1)).toFixed(0)} €` : "0 €", "#7eb8f5"],
              ].map(([l,v,c]) => (
                <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
                  <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                  <div style={{ fontSize: 24, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
                <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Distribución por plan</div>
                {[["Básico (29€/mes)", clientes.filter(c=>c.plan==="basico").length, "#7eb8f5"],
                  ["Pro (79€/mes)", clientes.filter(c=>c.plan==="pro").length, "#a78bfa"],
                  ["Enterprise (199€/mes)", clientes.filter(c=>c.plan==="enterprise").length, "#f0a500"]
                ].map(([l,v,c]) => (
                  <div key={l} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{l}</span>
                      <span style={{ fontSize: 16, color: c, fontWeight: "bold" }}>{v}</span>
                    </div>
                    <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: clientes.length > 0 ? `${(v/clientes.length)*100}%` : "0%", background: c, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, padding: "24px" }}>
                <div style={{ fontSize: 10, color: "#4caf7d", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Resumen de clientes</div>
                {[
                  ["Total clientes", clientes.length, "#334155"],
                  ["Activos", clientes.filter(c=>c.activo).length, "#4caf7d"],
                  ["Inactivos", clientes.filter(c=>!c.activo).length, "#e05252"],
                  ["Plan básico", clientes.filter(c=>c.plan==="basico").length, "#7eb8f5"],
                  ["Plan pro", clientes.filter(c=>c.plan==="pro").length, "#a78bfa"],
                  ["Plan enterprise", clientes.filter(c=>c.plan==="enterprise").length, "#f0a500"],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{l}</span>
                    <span style={{ fontSize: 16, color: c, fontWeight: "bold" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "accesos" && (
          <div>
            <div style={{ fontSize: 10, color: "#f0a500", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Gestión de accesos y planes</div>
            {clientes.length === 0
              ? <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Sin clientes registrados</div>
              : <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px 100px 200px", borderBottom: "1px solid #e2e8f0" }}>
                    {["Email","Empresa","Plan","Estado","Cambiar plan"].map(h => <div key={h} style={{ padding: "10px 16px", fontSize: 9, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>{h}</div>)}
                  </div>
                  {clientes.map((c, i) => (
                    <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px 100px 200px", borderBottom: i < clientes.length-1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                      <div style={{ padding: "12px 16px", fontSize: 12, color: "#334155" }}>{c.email}</div>
                      <div style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{c.empresa || "—"}</div>
                      <div style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: c.plan === "pro" ? "#a78bfa22" : c.plan === "enterprise" ? "#f0a50022" : "#7eb8f522", color: c.plan === "pro" ? "#a78bfa" : c.plan === "enterprise" ? "#f0a500" : "#7eb8f5", border: `1px solid ${c.plan === "pro" ? "#a78bfa44" : c.plan === "enterprise" ? "#f0a50044" : "#7eb8f544"}`, textTransform: "uppercase", letterSpacing: 1 }}>{c.plan}</span>
                      </div>
                      <div style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 10, color: c.activo ? "#4caf7d" : "#e05252" }}>{c.activo ? "● Activo" : "● Inactivo"}</span>
                      </div>
                      <div style={{ padding: "10px 16px", display: "flex", gap: 4 }}>
                        {["basico","pro","enterprise"].map(plan => (
                          <button key={plan} onClick={() => {
                            fetch(`${SUPABASE_URL}/rest/v1/perfiles?id=eq.${c.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${authToken}`, "Prefer": "return=minimal" },
                              body: JSON.stringify({ plan })
                            }).then(() => cargarClientes());
                          }} style={{ background: c.plan === plan ? "#f0a500" : "#e2e8f0", color: c.plan === plan ? "#fff" : "#64748b", border: "none", padding: "4px 8px", cursor: "pointer", fontSize: 8, letterSpacing: 1, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>{plan}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// CHAT AYUDA FLOTANTE
// ════════════════════════════════════════
const AYUDA_MODULOS = {
  dashboard: "Estás en el Dashboard. Aquí ves un resumen de tu negocio: ingresos, gastos, margen y facturas pendientes. Los KPIs se actualizan automáticamente con cada factura que registras.",
  analitica: "En Analítica puedes filtrar por período, ver tus clientes más rentables, el desglose de gastos por categoría y una previsión de facturación. Usa los botones de período para cambiar el rango de fechas.",
  tesoreria: "En Tesorería controlas el flujo de caja. Puedes ver el aging de cobros (facturas vencidas), importar extractos bancarios en CSV y ver la previsión de liquidez a 90 días.",
  informes: "En Informes IA puedes generar análisis completos de tu negocio. Elige el tipo de informe (mensual, trimestral, anual...), pulsa Generar y la IA creará un informe narrativo con tus datos reales.",
  obras: "En Proyectos gestionas tus obras activas. Puedes crear proyectos, asignarles presupuesto, seguir el progreso y vincular facturas a cada obra.",
  proveedores: "En Proveedores tienes el directorio de tus subcontratas y suministradores. Puedes añadir sus datos de contacto, CIF, IBAN y ver cuánto les has pagado.",
  clientes: "En Clientes tienes el directorio de tus clientes. Guarda su dirección de facturación, CIF y datos de contacto para que aparezcan automáticamente en las facturas.",
  nominas: "En Nóminas calculas automáticamente el IRPF de cada empleado según sus datos personales. Añade un empleado, completa su ficha y pulsa Ver nómina para ver el cálculo.",
  presupuestos: "En Presupuestos puedes generar un presupuesto detallado con IA en segundos. Describe el proyecto en texto, ajusta el margen de beneficio y pulsa Generar. Luego puedes exportarlo a PDF o convertirlo en factura.",
  contabilidad: "En Contabilidad tienes tus facturas emitidas y recibidas, los modelos fiscales calculados automáticamente (303, 130, 347) y el calendario de vencimientos fiscales.",
  documentos: "En Documentos puedes generar contratos, NDAs y cartas de reclamación con IA. También puedes guardar documentos con alertas de vencimiento para licencias y seguros.",
  agente: "En Agente IA tienes dos herramientas: el Chat Consultor (pregunta sobre tus datos o la plataforma) y el Agente Autónomo (procesa facturas del correo automáticamente).",
  ajustes: "En Ajustes configuras los datos de tu empresa: nombre, CIF, dirección, IBAN y el formato de numeración de facturas. Estos datos aparecerán en todas tus facturas y presupuestos.",
};

function ChatAyuda({ tabActual }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarBurbuja, setMostrarBurbuja] = useState(true);
  const chatRef = useRef(null);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (abierto && mensajes.length === 0) {
      const saludo = AYUDA_MODULOS[tabActual] || "Hola, soy tu asistente de FactuCloud. ¿En qué puedo ayudarte?";
      setMensajes([{ rol: "asistente", texto: "👋 ¡Hola! Soy tu asistente de FactuCloud.\n\n" + saludo + "\n\n¿Tienes alguna pregunta?" }]);
    }
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    if (abierto && mensajes.length > 0) {
      const contexto = AYUDA_MODULOS[tabActual] || "";
      setMensajes([{ rol: "asistente", texto: "👋 Hola de nuevo. Ahora estás en el módulo de " + (tabActual.charAt(0).toUpperCase() + tabActual.slice(1)) + ".\n\n" + contexto + "\n\n¿Te puedo ayudar con algo?" }]);
    }
  }, [tabActual]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const pregunta = input.trim();
    setInput("");
    setMensajes(prev => [...prev, { rol: "usuario", texto: pregunta }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: `Eres el asistente de ayuda de FactuCloud, una plataforma de gestión empresarial para el sector construcción en España. Ayudas a los usuarios a entender cómo usar la plataforma.

El usuario está ahora en el módulo: ${tabActual}.
Contexto del módulo: ${AYUDA_MODULOS[tabActual] || "módulo general"}.

Responde de forma muy concisa y práctica, máximo 3-4 líneas. Usa un tono amigable y cercano. Si el usuario pregunta algo que no tiene que ver con la plataforma, redirígele amablemente a preguntar sobre FactuCloud.`,
          messages: [{ role: "user", content: pregunta }]
        })
      });
      const data = await res.json();
      const respuesta = data.content?.map(i => i.text || "").join("") || "No pude procesar tu pregunta. Inténtalo de nuevo.";
      setMensajes(prev => [...prev, { rol: "asistente", texto: respuesta }]);
    } catch {
      setMensajes(prev => [...prev, { rol: "asistente", texto: "Para activar el asistente IA necesitas conectar la API Key de Anthropic en Ajustes." }]);
    }
    setLoading(false);
  };

  const PREGUNTAS_RAPIDAS = {
    dashboard: ["¿Qué significa DSO?", "¿Cómo añado una factura?"],
    presupuestos: ["¿Cómo genero un presupuesto?", "¿Cómo convierto a factura?"],
    contabilidad: ["¿Cuándo vence el modelo 303?", "¿Cómo exporto para gestoría?"],
    clientes: ["¿Cómo añado un cliente?", "¿Puedo editar un cliente?"],
    nominas: ["¿Cómo calculo la nómina?", "¿Qué es el modelo 111?"],
    documentos: ["¿Cómo genero un contrato?", "¿Puedo poner alertas de vencimiento?"],
    agente: ["¿Cómo funciona el agente?", "¿Qué es el consultor IA?"],
  };
  const pregRapidas = PREGUNTAS_RAPIDAS[tabActual] || ["¿Cómo uso este módulo?", "¿Para qué sirve esta sección?"];

  return (
    <>
      {/* Burbuja flotante */}
      {!abierto && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
          {mostrarBurbuja && (
            <div style={{ position: "absolute", bottom: 68, right: 0, background: "#1e293b", color: "#fff", padding: "8px 14px", borderRadius: "12px 12px 0 12px", fontSize: 12, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", cursor: "pointer" }} onClick={() => { setAbierto(true); setMostrarBurbuja(false); }}>
              ¿Necesitas ayuda?
              <div style={{ position: "absolute", bottom: -8, right: 12, width: 0, height: 0, borderLeft: "8px solid transparent", borderTop: "8px solid #1e293b" }} />
            </div>
          )}
          <button onClick={() => { setAbierto(true); setMostrarBurbuja(false); }} style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0a500", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(240,165,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}>
            {/* Icono robot SVG */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="18" height="14" rx="3" fill="#1e293b"/>
              <rect x="10" y="14" width="4" height="4" rx="1" fill="#f0a500"/>
              <rect x="16" y="14" width="4" height="4" rx="1" fill="#f0a500"/>
              <rect x="11" y="20" width="8" height="2" rx="1" fill="#94a3b8"/>
              <rect x="13" y="6" width="4" height="5" rx="2" fill="#1e293b"/>
              <circle cx="15" cy="5" r="2" fill="#f0a500"/>
              <rect x="2" y="13" width="3" height="6" rx="1.5" fill="#1e293b"/>
              <rect x="25" y="13" width="3" height="6" rx="1.5" fill="#1e293b"/>
            </svg>
          </button>
        </div>
      )}

      {/* Ventana de chat */}
      {abierto && (
        <div style={{ position: "fixed", bottom: 24, right: 24, width: 340, height: 480, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#1e293b", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0a500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="10" width="18" height="14" rx="3" fill="#1e293b"/>
                <rect x="10" y="14" width="4" height="4" rx="1" fill="#f0a500"/>
                <rect x="16" y="14" width="4" height="4" rx="1" fill="#f0a500"/>
                <rect x="11" y="20" width="8" height="2" rx="1" fill="#94a3b8"/>
                <rect x="13" y="6" width="4" height="5" rx="2" fill="#1e293b"/>
                <circle cx="15" cy="5" r="2" fill="#f0a500"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Asistente FactuCloud</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>Módulo: {tabActual.charAt(0).toUpperCase() + tabActual.slice(1)}</div>
            </div>
            <button onClick={() => setAbierto(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "4px" }}>×</button>
          </div>

          {/* Mensajes */}
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.rol === "usuario" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {m.rol === "asistente" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0a500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>🤖</div>
                )}
                <div style={{ maxWidth: "80%", background: m.rol === "usuario" ? "#f0a500" : "#fff", color: m.rol === "usuario" ? "#1e293b" : "#334155", padding: "10px 14px", borderRadius: m.rol === "usuario" ? "12px 12px 0 12px" : "12px 12px 12px 0", fontSize: 12, lineHeight: 1.7, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: m.rol === "asistente" ? "1px solid #e2e8f0" : "none" }}>
                  <pre style={{ margin: 0, fontFamily: "inherit", whiteSpace: "pre-wrap" }}>{m.texto}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0a500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px 12px 12px 0", padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f0a500", opacity: 0.5, animation: `pulse 1s ${i*0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preguntas rápidas */}
          <div style={{ padding: "8px 14px", background: "#fff", borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {pregRapidas.map((p, i) => (
              <button key={i} onClick={() => { setInput(p); }} style={{ background: "#f0f4ff", border: "1px solid #e0e7ff", borderRadius: 20, padding: "4px 10px", fontSize: 10, color: "#4f46e5", cursor: "pointer" }}>{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "10px 12px", background: "#fff", borderTop: "1px solid #e2e8f0", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && enviar()} placeholder="Escribe tu pregunta..." style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 20, padding: "8px 14px", fontSize: 12, outline: "none", background: "#f8fafc", color: "#1e293b" }} />
            <button onClick={enviar} disabled={loading || !input.trim()} style={{ width: 36, height: 36, borderRadius: "50%", background: input.trim() ? "#f0a500" : "#e2e8f0", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↑</button>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </>
  );
}
