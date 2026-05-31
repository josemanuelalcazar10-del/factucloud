import { useState, useRef, useCallback, useEffect } from "react";

// ════════════════════════════════════════
// SUPABASE CONFIG
// ════════════════════════════════════════
const SUPABASE_URL = "https://mlsvbmqpzgxlvghqsmpm.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ud7mbqoo43V-R37Fibfs0g_jwwBIYWD";

const sbFetch = async (table, method = "GET", body = null, id = null) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}${id ? `?id=eq.${id}` : ""}`;
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
  };
  if (method === "POST" || method === "PATCH") headers["Prefer"] = "return=minimal";
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Supabase error [${method} ${table}]:`, err);
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const dbGet = (table) => sbFetch(table);
const dbInsert = (table, row) => sbFetch(table, "POST", row);
const dbDelete = (table, id) => sbFetch(table, "DELETE", null, id);
const dbUpdate = (table, id, row) => sbFetch(`${table}?id=eq.${id}`, "PATCH", row);

// ════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════
const USUARIO = "josemanuel";
const CONTRASENA = "realmurcia10";

function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!user || !pass) { setError("Introduce usuario y contraseña"); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === USUARIO && pass === CONTRASENA) {
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div translate="no" style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff04 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Facturación Inteligente</div>
          <div style={{ fontSize: 36, fontWeight: 300 }}>
            <span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#7eb8f5" }}>Cloud</span>
          </div>
          <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", letterSpacing: 2, marginTop: 6 }}>v1.0 · IA Integrada</div>
        </div>
        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "36px 32px" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 28, textAlign: "center" }}>Acceso privado</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>Usuario</div>
            <input value={user} onChange={e => { setUser(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="josemanuel" style={{ width: "100%", background: "#05050e", border: "1px solid #1e1e2e", color: "#ccc", padding: "12px 16px", fontSize: 14, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>Contraseña</div>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••••••" style={{ width: "100%", background: "#05050e", border: "1px solid #1e1e2e", color: "#ccc", padding: "12px 16px", fontSize: 14, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
          </div>
          {error && <div style={{ padding: "10px 14px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 11, fontFamily: "monospace", borderRadius: 2, marginBottom: 16, textAlign: "center" }}>✕ {error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: loading ? "#1e1e2e" : "#f0a500", color: loading ? "#444" : "#08080f", border: "none", padding: "14px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>
            {loading ? "Verificando..." : "◈ Entrar"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#1e1e2e", fontFamily: "monospace", letterSpacing: 2 }}>Acceso restringido · Solo personal autorizado</div>
      </div>
    </div>
  );
}


const EMPRESA = { nombre: "FactuCloud", cif: "B28123456", direccion: "Calle Industria 45, 28001 Madrid", tel: "91 234 56 78", email: "josemanuelalcazar10@gmail.com", banco: "ES12 1234 5678 9012 3456 7890" };

const formatEUR = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);
const formatEURd = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

const OBRAS_INIT = [];
const CLIENTES_INIT = [];
const PROVEEDORES_INIT = [];
const FACTURAS_INIT = [];

const ESTADO_COL = { "En ejecución": "#f0a500", "Pendiente inicio": "#7eb8f5", "Finalizada": "#4caf7d", "Cobrada": "#4caf7d", "Pendiente": "#f0a500", "Pagada": "#4caf7d", "Emitida": "#7eb8f5", "Borrador": "#666", "Aceptado": "#4caf7d", "Enviado": "#7eb8f5", "Rechazado": "#e05252" };

const Badge = ({ label }) => <span style={{ fontSize: 10, padding: "4px 12px", borderRadius: 20, background: `${ESTADO_COL[label] || "#555"}18`, color: ESTADO_COL[label] || "#aaa", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", border: `1px solid ${ESTADO_COL[label] || "#555"}33`, whiteSpace: "nowrap" }}>{label}</span>;

const Bar = ({ v, color = "#f0a500" }) => <div style={{ height: 5, background: "#1a1a22", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${v}%`, background: v === 100 ? "#4caf7d" : color, borderRadius: 2, transition: "width .6s" }} /></div>;

const Card = ({ children, accent, onClick, selected }) => (
  <div onClick={onClick} style={{ background: selected ? "#12121e" : "#0c0c18", border: `1px solid ${selected ? "#f0a500" : "#1e1e2e"}`, borderTop: accent ? `2px solid ${accent}` : undefined, borderRadius: 3, padding: "22px 24px", cursor: onClick ? "pointer" : "default", transition: "all .2s" }}>
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
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Panel de control</div>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: "#f0f0ea", letterSpacing: 1 }}>{saludo}, <span style={{ color: "#f0a500" }}>José Manuel</span></h2>
        <div style={{ fontSize: 13, color: "#444", fontFamily: "monospace", marginTop: 6 }}>
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
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "22px 24px", borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>{l}</div>
            <div style={{ fontSize: 26, color: c, fontWeight: 300, marginBottom: 6 }}>{v}</div>
            <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>{s}</div>
          </div>
        ))}
      </div>

      {/* KPI del mes + Gráfica rápida */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 20 }}>

        {/* KPIs del mes */}
        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>KPI del mes — {mesActual}</div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Clientes activos", clientes.length, "#7eb8f5", clientes.length > 0 ? `+${clientes.length} registrados` : "Sin clientes aún"],
              ["Proveedores", proveedores.length, "#a78bfa", proveedores.length > 0 ? `${proveedores.length} registrados` : "Sin proveedores aún"],
              ["Proyectos", obras.length, "#f0a500", obras.filter(o=>o.estado==="En ejecución").length + " activos"],
              ["Facturas emitidas", facturas.filter(f=>f.tipo==="ingreso").length, "#4caf7d", "este período"],
            ].map(([l, v, c, s]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #141420" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{s}</div>
                </div>
                <div style={{ fontSize: 24, color: c, fontFamily: "monospace", fontWeight: 300 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfica rápida */}
        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>Ingresos últimos 6 meses</div>
            <button onClick={() => setTab("analitica")} style={{ background: "none", border: "none", color: "#444", fontSize: 10, cursor: "pointer", letterSpacing: 2, fontFamily: "monospace" }}>VER ANALÍTICA →</button>
          </div>
          {ingresos === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 140, color: "#333", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8, color: "#1e1e2e" }}>📊</div>
              Sin datos aún
              <div style={{ fontSize: 10, marginTop: 6, color: "#222" }}>Registra facturas para ver la gráfica</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 120, marginBottom: 10 }}>
                {meses6.map((mes, i) => (
                  <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {datosGrafica[i] > 0 && <div style={{ fontSize: 8, color: "#4caf7d", fontFamily: "monospace" }}>{formatEUR(datosGrafica[i]).replace("€","")}</div>}
                    <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                      <div style={{ width: "100%", height: `${(datosGrafica[i] / maxGrafica) * 100}%`, background: i === meses6.length - 1 ? "#4caf7d" : "#4caf7d44", borderRadius: "3px 3px 0 0", minHeight: datosGrafica[i] > 0 ? 6 : 2, transition: "height 0.5s" }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace" }}>{mes}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #141420" }}>
                <span style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>Total acumulado</span>
                <span style={{ fontSize: 14, color: "#4caf7d", fontFamily: "monospace", fontWeight: "bold" }}>{formatEUR(ingresos)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Últimas facturas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>Últimas facturas</div>
            <button onClick={() => setTab("contabilidad")} style={{ background: "none", border: "none", color: "#444", fontSize: 10, cursor: "pointer", letterSpacing: 2, fontFamily: "monospace" }}>VER TODO →</button>
          </div>
          {facturas.length === 0
            ? <div style={{ color: "#333", fontSize: 13, fontFamily: "monospace", padding: "20px 0", textAlign: "center" }}>Sin facturas registradas</div>
            : facturas.slice(0, 5).map(f => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #141420" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 2, fontFamily: "monospace" }}>{f.numero || f.numeroFactura}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{typeof f.cliente === "string" ? f.cliente.split(" ")[0] : f.cliente?.nombre}</div>
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

      <div style={{ marginTop: 16, background: "#0c0c18", border: "1px solid #f0a50022", borderRadius: 3, padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf7d", boxShadow: "0 0 10px #4caf7d", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>Agente IA monitorizando </span>
          <span style={{ fontSize: 12, color: "#f0a500", fontFamily: "monospace" }}>josemanuelalcazar10@gmail.com</span>
          <span style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}> — Procesará facturas automáticamente</span>
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
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— {obras.length} proyectos registrados</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo proyecto</button>
      </div>

      {nuevo && (
        <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo proyecto</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre del proyecto"], ["cliente", "Cliente"], ["direccion", "Dirección"], ["presupuesto", "Presupuesto (€)"], ["inicio", "Fecha inicio"], ["fin", "Fecha fin prevista"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {obras.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin proyectos — pulsa "+ Nuevo proyecto" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 360px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {obras.map(o => (
                <Card key={o.id} onClick={() => setSel(sel === o.id ? null : o.id)} selected={sel === o.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, color: "#d4d0c8", marginBottom: 4 }}>{o.nombre}</div>
                      <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{o.cliente}</div>
                    </div>
                    <Badge label={o.estado} />
                  </div>
                  <Bar v={o.progreso} color={o.color} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
                    {[["Presupuesto", formatEUR(o.presupuesto)], ["Certificado", formatEUR(o.certificado)], ["Avance", `${o.progreso}%`]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#aaa" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {obra && (
              <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Detalle</div>
                <h3 style={{ margin: "0 0 4px", fontWeight: 300, fontSize: 20, color: "#f0f0ea" }}>{obra.nombre}</h3>
                <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginBottom: 24 }}>{obra.direccion}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[["Cliente", obra.cliente], ["Estado", obra.estado], ["Inicio", obra.inicio], ["Fin previsto", obra.fin], ["Certificado", formatEUR(obra.certificado)], ["Incidencias", obra.incidencias]].map(([k, v]) => (
                    <div key={k} style={{ borderBottom: "1px solid #141420", paddingBottom: 10 }}>
                      <div style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 13, color: "#ccc" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
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
  const [form, setForm] = useState({ nombre: "", cif: "", contacto: "", email: "", tel: "", categoria: "", tipo: "Proveedor", condicionesPago: "30 días", numeroCuenta: "" });
  const prov = proveedores.find(p => p.id === sel);

  const guardar = () => {
    if (!form.nombre) return;
    setProveedores(prev => [...prev, { ...form, id: Date.now(), facturado: 0, pendiente: 0 }]);
    setNuevo(false); setForm({ nombre: "", cif: "", contacto: "", email: "", tel: "", categoria: "", tipo: "Proveedor", condicionesPago: "30 días", numeroCuenta: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— {proveedores.length} proveedores</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo proveedor</button>
      </div>

      {nuevo && (
        <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo proveedor</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre / Razón social"], ["cif", "CIF / NIF"], ["contacto", "Persona de contacto"], ["email", "Email"], ["tel", "Teléfono"], ["categoria", "Categoría (ej: Tecnología, Materiales...)"], ["numeroCuenta", "Número de cuenta (IBAN)"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Condiciones de pago</div>
              <select value={form.condicionesPago} onChange={e => setForm(p => ({ ...p, condicionesPago: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                {["Al contado", "7 días", "15 días", "30 días", "45 días", "60 días", "90 días"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {proveedores.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin proveedores — pulsa "+ Nuevo proveedor" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {proveedores.map(p => (
                <Card key={p.id} onClick={() => setSel(sel === p.id ? null : p.id)} selected={sel === p.id}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 16, marginBottom: 14 }}>{p.nombre[0]}</div>
                  <div style={{ fontSize: 15, color: "#d4d0c8", marginBottom: 4 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 14 }}>{p.cif} · {p.categoria || p.tipo}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Pagado", formatEUR(p.facturado)], ["Pendiente", formatEUR(p.pendiente)]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#aaa" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {prov && (
              <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 20, marginBottom: 16 }}>{prov.nombre[0]}</div>
                <div style={{ fontSize: 20, color: "#f0f0ea", fontWeight: 300, marginBottom: 4 }}>{prov.nombre}</div>
                <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginBottom: 24 }}>{prov.cif} · {prov.especialidad || prov.tipo}</div>
                <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                  {[["Contacto", prov.contacto], ["Email", prov.email], ["Teléfono", prov.tel], ["Categoría", prov.categoria], ["Condiciones pago", prov.condicionesPago], ["Número cuenta", prov.numeroCuenta], ["Total pagado", formatEUR(prov.facturado)], ["Pendiente pago", formatEUR(prov.pendiente)]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #141420", paddingBottom: 10 }}>
                      <span style={{ fontSize: 10, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase" }}>{k}</span>
                      <span style={{ fontSize: 13, color: "#aaa" }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
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
  const [form, setForm] = useState({ nombre: "", cif: "", contacto: "", email: "", tel: "", tipo: "Promotor" });
  const cl = clientes.find(c => c.id === sel);

  const guardar = () => {
    if (!form.nombre) return;
    setClientes(prev => [...prev, { ...form, id: Date.now(), facturado: 0, pendiente: 0 }]);
    setNuevo(false); setForm({ nombre: "", cif: "", contacto: "", email: "", tel: "", tipo: "Promotor" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— {clientes.length} clientes</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo cliente</button>
      </div>

      {nuevo && (
        <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo cliente</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre / Razón social"], ["cif", "CIF / NIF"], ["contacto", "Persona de contacto"], ["email", "Email"], ["tel", "Teléfono"], ["tipo", "Tipo (Promotor/Empresa)"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, letterSpacing: 2, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {clientes.length === 0 && !nuevo
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin clientes — pulsa "+ Nuevo cliente" para añadir</div>
        : <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "repeat(2,1fr)", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
              {clientes.map(c => (
                <Card key={c.id} onClick={() => setSel(sel === c.id ? null : c.id)} selected={sel === c.id}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 16, marginBottom: 14 }}>{c.nombre[0]}</div>
                  <div style={{ fontSize: 15, color: "#d4d0c8", marginBottom: 4 }}>{c.nombre}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 14 }}>{c.cif} · {c.tipo}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Facturado", formatEUR(c.facturado)], ["Pendiente", formatEUR(c.pendiente)]].map(([k, v]) => (
                      <div key={k}><div style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: "#aaa" }}>{v}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {cl && (
              <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 20, marginBottom: 16 }}>{cl.nombre[0]}</div>
                <div style={{ fontSize: 20, color: "#f0f0ea", fontWeight: 300, marginBottom: 4 }}>{cl.nombre}</div>
                <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginBottom: 24 }}>{cl.cif} · {cl.tipo}</div>
                <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                  {[["Contacto", cl.contacto], ["Email", cl.email], ["Teléfono", cl.tel], ["Total facturado", formatEUR(cl.facturado)], ["Pendiente cobro", formatEUR(cl.pendiente)]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #141420", paddingBottom: 10 }}>
                      <span style={{ fontSize: 10, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase" }}>{k}</span>
                      <span style={{ fontSize: 13, color: "#aaa" }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "10px 20px", fontSize: 10, letterSpacing: 3, fontFamily: "monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
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
Devuelve SOLO JSON válido sin texto adicional:
{
  "titulo": "título del presupuesto",
  "obra": "descripción de el proyecto",
  "fecha": "28/05/2026",
  "validez": "27/06/2026",
  "materiales": [
    {"descripcion": "nombre del material", "unidad": "ud/m²/ml/kg", "cantidad": 0, "precioUnit": 0, "total": 0}
  ],
  "subcontratas": [
    {"descripcion": "trabajo a subcontratar", "unidad": "ud/m²/ml/h", "cantidad": 0, "precioUnit": 0, "total": 0}
  ],
  "observaciones": "notas importantes sobre el presupuesto",
  "recomendaciones": ["recomendación 1", "recomendación 2"]
}
Usa precios de mercado españoles actuales. Sé detallado y profesional.`;

function Presupuestos() {
  const [input, setInput] = useState("");
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lista, setLista] = useState([]);
  const [tab, setTab] = useState("nuevo");

  const generar = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(""); setPresupuesto(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, system: PRESUPUESTO_PROMPT, messages: [{ role: "user", content: input }] })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setPresupuesto(parsed);
    } catch { setError("No se pudo generar el presupuesto. Añade tu API Key de Anthropic primero."); }
    setLoading(false);
  };

  const guardar = () => {
    if (!presupuesto) return;
    const totalMat = presupuesto.materiales.reduce((s, m) => s + m.total, 0);
    const totalSub = presupuesto.subcontratas.reduce((s, s2) => s + s2.total, 0);
    setLista(prev => [{ ...presupuesto, id: Date.now(), totalMat, totalSub, total: totalMat + totalSub, estado: "Borrador" }, ...prev]);
    setPresupuesto(null); setInput(""); setTab("lista");
  };

  const EJEMPLOS = [
    "Presupuesto para construir una piscina de 8x4 metros con solarium alrededor en adosado",
    "Reforma completa de cocina de 12m², cambio de suelo, azulejos, muebles y electrodomésticos",
    "Instalación de suelo radiante en vivienda de 120m² con caldera de gas",
    "Construcción de muro de contención de 20 metros lineales en parcela",
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e2e", marginBottom: 24 }}>
        {[["nuevo", "✦ Nuevo presupuesto IA"], ["lista", `≋ Mis presupuestos (${lista.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", color: tab === id ? "#f0a500" : "#444", padding: "12px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", borderBottom: tab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {tab === "nuevo" && (
        <div style={{ maxWidth: 780 }}>
          {!presupuesto ? (
            <>
              <div style={{ fontSize: 11, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Describe el proyecto o trabajo</div>
              <p style={{ color: "#444", fontSize: 13, fontFamily: "monospace", lineHeight: 1.9, marginBottom: 24 }}>La IA generará un presupuesto detallado de materiales y subcontratas con precios de mercado actuales.</p>

              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Necesito presupuesto para construir una nave industrial de 500m² con estructura metálica, cubierta de panel sándwich, solera de hormigón y puerta seccional..." style={{ width: "100%", minHeight: 120, background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "16px", fontSize: 14, fontFamily: "monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />

              {error && <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "monospace", borderRadius: 2 }}>✕ {error}</div>}

              <button onClick={generar} disabled={loading || !input.trim()} style={{ marginTop: 14, background: loading ? "#1e1e2e" : "#f0a500", color: loading ? "#444" : "#08080f", border: "none", padding: "14px 36px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>
                {loading ? "⟳ Generando presupuesto..." : "✦ Generar con IA"}
              </button>

              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#333", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Ejemplos</div>
                {EJEMPLOS.map((ej, i) => (
                  <button key={i} onClick={() => setInput(ej)} style={{ display: "block", width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 2, padding: "12px 18px", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#555", fontFamily: "monospace", lineHeight: 1.5, marginBottom: 8 }}>
                    <span style={{ color: "#f0a500" }}>→</span> {ej}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 10, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>— Presupuesto generado por IA</div>
              <h3 style={{ fontWeight: 300, fontSize: 22, color: "#f0f0ea", marginBottom: 4 }}>{presupuesto.titulo}</h3>
              <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 28 }}>{presupuesto.obra} · Válido hasta {presupuesto.validez}</div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#7eb8f5", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Materiales</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ borderBottom: "1px solid #1e1e2e" }}>{["Descripción", "Ud.", "Cantidad", "Precio/Ud.", "Total"].map((h, i) => <th key={h} style={{ padding: "10px 12px", fontSize: 9, letterSpacing: 3, color: "#7eb8f5", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal", textAlign: i === 0 ? "left" : "right" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {presupuesto.materiales.map((m, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #0e0e18" }}>
                        <td style={{ padding: "11px 12px", color: "#ccc" }}>{m.descripcion}</td>
                        <td style={{ padding: "11px 12px", color: "#444", fontFamily: "monospace", textAlign: "right" }}>{m.unidad}</td>
                        <td style={{ padding: "11px 12px", color: "#aaa", fontFamily: "monospace", textAlign: "right" }}>{m.cantidad}</td>
                        <td style={{ padding: "11px 12px", color: "#aaa", fontFamily: "monospace", textAlign: "right" }}>{formatEURd(m.precioUnit)}</td>
                        <td style={{ padding: "11px 12px", color: "#7eb8f5", fontFamily: "monospace", textAlign: "right", fontWeight: "bold" }}>{formatEURd(m.total)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: "1px solid #1e1e2e" }}>
                      <td colSpan={4} style={{ padding: "12px 12px", color: "#444", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 2 }}>Subtotal materiales</td>
                      <td style={{ padding: "12px 12px", color: "#7eb8f5", fontFamily: "monospace", fontWeight: "bold", fontSize: 16, textAlign: "right" }}>{formatEURd(presupuesto.materiales.reduce((s, m) => s + m.total, 0))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#a78bfa", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Subcontratas</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ borderBottom: "1px solid #1e1e2e" }}>{["Descripción", "Ud.", "Cantidad", "Precio/Ud.", "Total"].map((h, i) => <th key={h} style={{ padding: "10px 12px", fontSize: 9, letterSpacing: 3, color: "#a78bfa", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal", textAlign: i === 0 ? "left" : "right" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {presupuesto.subcontratas.map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #0e0e18" }}>
                        <td style={{ padding: "11px 12px", color: "#ccc" }}>{s.descripcion}</td>
                        <td style={{ padding: "11px 12px", color: "#444", fontFamily: "monospace", textAlign: "right" }}>{s.unidad}</td>
                        <td style={{ padding: "11px 12px", color: "#aaa", fontFamily: "monospace", textAlign: "right" }}>{s.cantidad}</td>
                        <td style={{ padding: "11px 12px", color: "#aaa", fontFamily: "monospace", textAlign: "right" }}>{formatEURd(s.precioUnit)}</td>
                        <td style={{ padding: "11px 12px", color: "#a78bfa", fontFamily: "monospace", textAlign: "right", fontWeight: "bold" }}>{formatEURd(s.total)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: "1px solid #1e1e2e" }}>
                      <td colSpan={4} style={{ padding: "12px 12px", color: "#444", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 2 }}>Subtotal subcontratas</td>
                      <td style={{ padding: "12px 12px", color: "#a78bfa", fontFamily: "monospace", fontWeight: "bold", fontSize: 16, textAlign: "right" }}>{formatEURd(presupuesto.subcontratas.reduce((s, s2) => s + s2.total, 0))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 2, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#f0a500", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>TOTAL PRESUPUESTO</span>
                <span style={{ fontSize: 28, color: "#f0a500" }}>{formatEURd(presupuesto.materiales.reduce((s, m) => s + m.total, 0) + presupuesto.subcontratas.reduce((s, s2) => s + s2.total, 0))}</span>
              </div>

              {presupuesto.recomendaciones?.length > 0 && (
                <div style={{ background: "#0c0c18", border: "1px solid #f0a50022", borderRadius: 2, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>✦ Recomendaciones IA</div>
                  {presupuesto.recomendaciones.map((r, i) => <div key={i} style={{ fontSize: 12, color: "#555", fontFamily: "monospace", lineHeight: 1.9 }}><span style={{ color: "#f0a500" }}>→</span> {r}</div>)}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "14px 36px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, flex: 1 }}>✓ Guardar presupuesto</button>
                <button onClick={() => { setPresupuesto(null); setInput(""); }} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "14px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", borderRadius: 2 }}>← Nuevo</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "lista" && (
        <div>
          {lista.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin presupuestos — genera uno con la IA</div>
            : lista.map(p => (
              <div key={p.id} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderLeft: "3px solid #f0a500", borderRadius: 2, padding: "20px 28px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, color: "#d4d0c8", marginBottom: 4 }}>{p.titulo}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{p.fecha} · Mat: {formatEUR(p.totalMat)} · Sub: {formatEUR(p.totalSub)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, color: "#f0a500", marginBottom: 6 }}>{formatEUR(p.total)}</div>
                  <Badge label={p.estado} />
                </div>
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

function Contabilidad({ facturas, setFacturas }) {
  const [subtab, setSubtab] = useState("lista");
  const [input, setInput] = useState("");
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalIngresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.total, 0);
  const totalGastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.total, 0);
  const ivaLiquidar = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + (f.iva || 0), 0) - facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + (f.iva || 0), 0);

  const generar = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(""); setFactura(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: FACTURA_PROMPT, messages: [{ role: "user", content: input }] }) });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setFactura(parsed);
    } catch { setError("No se pudo generar. Añade tu API Key de Anthropic primero."); }
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

  const base = factura ? factura.lineas.reduce((s, l) => s + l.importe, 0) : 0;
  const cuotaIVA = factura ? (base * factura.tipoIVA) / 100 : 0;
  const cuotaIRPF = factura ? (base * factura.tipoIRPF) / 100 : 0;
  const totalFac = base + cuotaIVA - cuotaIRPF;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 26 }}>
        {[["Ingresos", totalIngresos === 0 ? "Sin datos" : formatEUR(totalIngresos), "#4caf7d"], ["Gastos", totalGastos === 0 ? "Sin datos" : formatEUR(totalGastos), "#e05252"], ["IVA a liquidar", ivaLiquidar === 0 ? "Sin datos" : formatEUR(ivaLiquidar), "#7eb8f5"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 24, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e2e", marginBottom: 22 }}>
        {[["lista", "≋ Facturas"], ["generar", "✦ Generar con IA"], ["fiscal", "◉ Fiscal"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#444", padding: "12px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {subtab === "lista" && (
        facturas.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin facturas — usa "Generar con IA" o el Agente IA</div>
          : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid #1e1e2e" }}>{["Número", "Cliente", "Fecha", "Base", "IVA", "Total", "Estado"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 9, letterSpacing: 3, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal" }}>{h}</th>)}</tr></thead>
              <tbody>
                {facturas.map(f => (
                  <tr key={f.id} style={{ borderBottom: "1px solid #0e0e18" }}>
                    <td style={{ padding: "13px 14px", color: "#7eb8f5", fontFamily: "monospace", fontSize: 12 }}>{f.numero || f.numeroFactura}</td>
                    <td style={{ padding: "13px 14px", color: "#ccc" }}>{typeof f.cliente === "string" ? f.cliente : f.cliente?.nombre}</td>
                    <td style={{ padding: "13px 14px", color: "#444", fontFamily: "monospace" }}>{f.fecha}</td>
                    <td style={{ padding: "13px 14px", color: "#aaa", fontFamily: "monospace" }}>{formatEURd(f.base || 0)}</td>
                    <td style={{ padding: "13px 14px", color: "#7eb8f5", fontFamily: "monospace" }}>{formatEURd(f.iva || 0)}</td>
                    <td style={{ padding: "13px 14px", color: f.tipo === "ingreso" ? "#4caf7d" : "#e05252", fontFamily: "monospace", fontWeight: "bold" }}>{f.tipo === "ingreso" ? "+" : "-"}{formatEURd(f.total)}</td>
                    <td style={{ padding: "13px 14px" }}><Badge label={f.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
      )}

      {subtab === "generar" && !factura && (
        <div style={{ maxWidth: 680 }}>
          <p style={{ color: "#444", fontSize: 13, fontFamily: "monospace", lineHeight: 1.9, marginBottom: 20 }}>Describe lo que quieres facturar en lenguaje natural.</p>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Factura a Promotora García por certificación nº3 de obra vivienda unifamiliar, trabajos de albañilería por 28.000€..." style={{ width: "100%", minHeight: 110, background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "16px", fontSize: 14, fontFamily: "monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />
          {error && <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "monospace", borderRadius: 2 }}>✕ {error}</div>}
          <button onClick={generar} disabled={loading || !input.trim()} style={{ marginTop: 14, background: loading ? "#1e1e2e" : "#f0a500", color: loading ? "#444" : "#08080f", border: "none", padding: "14px 36px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>
            {loading ? "⟳ Generando..." : "✦ Generar factura"}
          </button>
        </div>
      )}

      {subtab === "generar" && factura && (
        <div style={{ maxWidth: 760 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e0d0", borderRadius: 3, padding: "40px 44px", marginBottom: 16, color: "#1a1a2e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #1a1a2e" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 400, marginBottom: 6 }}>{EMPRESA.nombre}</div>
                <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace", lineHeight: 1.9 }}><div>{EMPRESA.cif}</div><div>{EMPRESA.direccion}</div><div>{EMPRESA.email}</div></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, color: "#c9a84c", fontFamily: "monospace", marginBottom: 6 }}>{factura.numeroFactura}</div>
                <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace", lineHeight: 1.9 }}><div>Fecha: {factura.fecha}</div><div>Vence: {factura.fechaVencimiento}</div></div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Facturar a</div>
              <div style={{ fontSize: 16 }}>{factura.cliente?.nombre}</div>
              <div style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>{factura.obra}</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 13 }}>
              <thead><tr style={{ background: "#1a1a2e" }}>{["Descripción", "Ud.", "Cant.", "Precio", "Importe"].map((h, i) => <th key={h} style={{ padding: "10px 12px", fontSize: 9, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal", textAlign: i === 0 ? "left" : "right" }}>{h}</th>)}</tr></thead>
              <tbody>{factura.lineas.map((l, i) => <tr key={i} style={{ borderBottom: "1px solid #f0ebe0", background: i % 2 === 0 ? "#faf8f4" : "#fff" }}>
                <td style={{ padding: "11px 12px" }}>{l.descripcion}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", color: "#999", fontFamily: "monospace" }}>{l.unidad}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace" }}>{l.cantidad}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace" }}>{formatEURd(l.precioUnitario)}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURd(l.importe)}</td>
              </tr>)}</tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 260 }}>
                {[["Base imponible", formatEURd(base), "#333"], [`IVA (${factura.tipoIVA}%)`, formatEURd(cuotaIVA), "#1a6fbf"], [`IRPF (${factura.tipoIRPF}%)`, `- ${formatEURd(cuotaIRPF)}`, "#c0392b"]].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f0ebe0" }}>
                    <span style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>{k}</span>
                    <span style={{ fontSize: 13, color: c, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 8px", background: "#1a1a2e", marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 2 }}>TOTAL</span>
                  <span style={{ fontSize: 20, color: "#f0f0ea", fontFamily: "monospace" }}>{formatEURd(totalFac)}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={confirmar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "14px 36px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, flex: 1 }}>✓ Confirmar y registrar</button>
            <button onClick={() => setFactura(null)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "14px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", borderRadius: 2 }}>← Volver</button>
          </div>
        </div>
      )}

      {subtab === "fiscal" && (
        <div style={{ maxWidth: 600 }}>
          {[["IVA Repercutido (ventas)", facturas.filter(f=>f.tipo==="ingreso").reduce((s,f)=>s+(f.iva||0),0), "#4caf7d"],
            ["IVA Soportado (compras)", facturas.filter(f=>f.tipo==="gasto").reduce((s,f)=>s+(f.iva||0),0), "#e05252"],
            ["Resultado IVA — Modelo 303", ivaLiquidar, "#7eb8f5"],
            ["IRPF retenido total — Modelo 130", facturas.reduce((s,f)=>s+(f.irpf||0),0), "#f0a500"],
          ].map(([k, v, c]) => (
            <div key={k} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", padding: "18px 22px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#444", fontFamily: "monospace" }}>{k}</span>
              <span style={{ fontSize: 22, color: c, fontFamily: "monospace" }}>{formatEURd(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// AGENTE IA
// ════════════════════════════════════════
const AGENT_PROMPT = `Eres un agente contable autónomo para empresa de construcción española. Extrae datos de facturas y devuelve SOLO JSON válido:
{"proveedor":"","nif":"","fecha":"DD/MM/AAAA","numeroFactura":"","concepto":"","baseImponible":0,"tipoIVA":21,"cuotaIVA":0,"tipoIRPF":15,"cuotaIRPF":0,"total":0,"tipo":"gasto","confianza":95,"alertas":[]}
Si no es factura: {"error":"No es una factura"}`;

const CORREOS = [
  { id: "c1", de: "proveedores@cementosvallejo.es", asunto: "Factura F2026-089 Mayo", t: 2000, txt: "Cementos Vallejo S.L., CIF B28456123, factura F2026-089 del 28/05/2026. Suministro cemento Portland 500 sacos. Base: 4.200€. IVA 21%: 882€. Retención IRPF 15%: 630€. Total: 4.452€." },
  { id: "c2", de: "admin@gruasmadrid.com", asunto: "Fra. GM-2026-341 Grúa", t: 6000, txt: "Grúas Madrid S.A., CIF A79234561, factura GM-2026-341 del 27/05/2026. Alquiler grúa torre 30m, 15 días. Base: 8.500€. IVA 21%: 1.785€. IRPF 15%: 1.275€. Total: 9.010€." },
  { id: "c3", de: "facturas@electricidadsur.com", asunto: "Fra ES-2026-112", t: 11000, txt: "Electricidad del Sur S.L., CIF B91234567, factura ES-2026-112 del 26/05/2026. Instalación eléctrica nave industrial. Base: 12.800€. IVA 21%: 2.688€. IRPF 15%: 1.920€. Total: 13.568€." },
];

function Agente({ setFacturas }) {
  const [activo, setActivo] = useState(false);
  const [logs, setLogs] = useState([]);
  const [procesadas, setProcesadas] = useState(0);
  const [estado, setEstado] = useState("idle");
  const logsRef = useRef();
  const timers = useRef([]);
  const procesados = useRef(new Set());

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
      if (parsed.error) { log(`⚠️ No se detectó factura`, "warn"); return; }
      log(`✅ ${parsed.proveedor} — ${formatEURd(parsed.total)}`, "success");
      log(`   Base: ${formatEURd(parsed.baseImponible)} | IVA: ${formatEURd(parsed.cuotaIVA)} | IRPF: -${formatEURd(parsed.cuotaIRPF)}`, "detail");
      setFacturas(prev => [{ id: Date.now(), numero: parsed.numeroFactura || "AUTO", cliente: parsed.proveedor, obra: parsed.concepto, fecha: parsed.fecha, base: parsed.baseImponible, iva: parsed.cuotaIVA, irpf: parsed.cuotaIRPF, total: parsed.total, estado: "Pagada", tipo: "gasto", auto: true }, ...prev]);
      setProcesadas(n => n + 1);
      log(`💾 Registrada automáticamente en Contabilidad`, "success");
    } catch { log(`❌ Error — Añade tu API Key de Anthropic en el código`, "error"); }
    setEstado("idle");
  }, [log, setFacturas]);

  const iniciar = () => {
    setActivo(true); setLogs([]); procesados.current = new Set();
    log("🚀 Agente autónomo iniciado", "success");
    log(`📧 Monitorizando: josemanuelalcazar10@gmail.com`, "success");
    log("🤖 Claude IA · Supabase DB · Notificaciones", "success");
    log("⏰ Revisando correo cada 30 segundos...", "info");
    log("─".repeat(42), "div");
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

  const COL = { info: "#444", scan: "#7eb8f5", ai: "#f0a500", success: "#4caf7d", detail: "#333", warn: "#e07830", error: "#e05252", div: "#111" };

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>— Agente contable autónomo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div style={{ background: "#050510", border: "1px solid #0f0f1e", borderRadius: 3 }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #0f0f1e", display: "flex", alignItems: "center", gap: 8 }}>
            {["#e05252","#e0a020","#4caf7d"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
            <span style={{ marginLeft: 10, fontSize: 10, color: "#222", letterSpacing: 3 }}>TERMINAL — AGENTE LOG</span>
            {activo && <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf7d" }} /><span style={{ fontSize: 9, color: "#4caf7d", letterSpacing: 3 }}>LIVE</span></div>}
          </div>
          <div ref={logsRef} style={{ height: 400, overflowY: "auto", padding: "14px 18px" }}>
            {logs.length === 0
              ? <div style={{ color: "#1a1a2e", fontSize: 12, lineHeight: 2 }}>{"$ Agente en espera..."}<br />{"$ Pulsa INICIAR para comenzar"}<br /><br /><span style={{ color: "#111" }}>{"$ Correo configurado:"}</span><br /><span style={{ color: "#111" }}>{"$ josemanuelalcazar10@gmail.com"}</span></div>
              : logs.map(l => l.tipo === "div"
                ? <div key={l.id} style={{ color: "#111", fontSize: 11 }}>{l.msg}</div>
                : <div key={l.id} style={{ display: "flex", gap: 10, marginBottom: 3 }}>
                    <span style={{ color: "#1a1a2e", fontSize: 10, flexShrink: 0, marginTop: 2 }}>{l.h}</span>
                    <span style={{ color: COL[l.tipo], fontSize: 12, lineHeight: 1.6 }}>{l.msg}</span>
                  </div>
              )
            }
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Control</div>
            {!activo
              ? <button onClick={iniciar} style={{ width: "100%", background: "#4caf7d", color: "#08080f", border: "none", padding: "14px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>▶ INICIAR AGENTE</button>
              : <button onClick={detener} style={{ width: "100%", background: "rgba(224,82,82,0.15)", color: "#e05252", border: "1px solid rgba(224,82,82,0.3)", padding: "14px", cursor: "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", borderRadius: 2 }}>⛔ DETENER</button>
            }
          </div>

          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Correo monitorizado</div>
            <div style={{ fontSize: 11, color: "#f0a500", fontFamily: "monospace", wordBreak: "break-all" }}>josemanuelalcazar10@gmail.com</div>
            <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginTop: 6 }}>Facturas de proveedores</div>
          </div>

          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Estadísticas</div>
            {[["Procesadas", procesadas, "#4caf7d"], ["Estado", estado === "idle" ? "En espera" : "Procesando", estado === "procesando" ? "#f0a500" : "#444"], ["Tiempo ahorrado", `~${procesadas * 8} min`, "#7eb8f5"]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0e0e18" }}>
                <span style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>{k}</span>
                <span style={{ fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// APP RAÍZ
// ════════════════════════════════════════
export default function FactuCloudApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [obras, setObrasState] = useState(OBRAS_INIT);
  const [clientes, setClientesState] = useState(CLIENTES_INIT);
  const [proveedores, setProveedoresState] = useState(PROVEEDORES_INIT);
  const [facturas, setFacturasState] = useState(FACTURAS_INIT);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Cargar datos de Supabase al hacer login
  useEffect(() => {
    if (!loggedIn) return;
    const cargar = async () => {
      try {
        const [o, c, p, f] = await Promise.all([
          dbGet("obras"), dbGet("clientes"), dbGet("proveedores"), dbGet("facturas")
        ]);
        setObrasState(o || []);
        setClientesState(c || []);
        setProveedoresState(p || []);
        setFacturasState(f || []);
        setDbReady(true);
      } catch (e) {
        console.error("Error cargando datos:", e);
        setDbError(true);
        setDbReady(true);
      }
    };
    cargar();
  }, [loggedIn]);

  // Wrappers que sincronizan con Supabase
  const makesetter = (getState, setState, tabla) => (updater) => {
    setState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const nuevos = next.filter(n => !prev.find(p => p.id === n.id));
      const eliminados = prev.filter(p => !next.find(n => n.id === p.id));
      nuevos.forEach(n => {
        const row = { ...n, id: typeof n.id === "number" ? n.id : Number(n.id) };
        fetch(`${SUPABASE_URL}/rest/v1/${tabla}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=minimal" },
          body: JSON.stringify(row)
        }).catch(console.error);
      });
      eliminados.forEach(p => {
        fetch(`${SUPABASE_URL}/rest/v1/${tabla}?id=eq.${p.id}`, {
          method: "DELETE",
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        }).catch(console.error);
      });
      return next;
    });
  };

  const setObras = makesetter(() => obras, setObrasState, "obras");
  const setClientes = makesetter(() => clientes, setClientesState, "clientes");
  const setProveedores = makesetter(() => proveedores, setProveedoresState, "proveedores");
  const setFacturas = makesetter(() => facturas, setFacturasState, "facturas");

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

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  if (!dbReady) return (
    <div style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", marginBottom: 20 }}>Conectando base de datos...</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#f0a500", opacity: 0.3, animation: `pulse 1s ${i*0.2}s infinite` }} />)}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );

  return (
    <div translate="no" style={{ minHeight: "100vh", background: "#08080f", color: "#d4d0c8", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff04 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: "#05050e", borderRight: "1px solid #111120", zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #111120" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Facturación Inteligente</div>
          <div style={{ fontSize: 22, letterSpacing: 0, fontWeight: 300 }}>
            <span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#7eb8f5" }}>Cloud</span>
          </div>
          <div style={{ fontSize: 9, color: "#333", fontFamily: "monospace", letterSpacing: 2, marginTop: 4 }}>v1.0 · IA Integrada</div>
        </div>

        <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: tab === t.id ? "#f0a50010" : "none", border: "none", borderLeft: tab === t.id ? "2px solid #f0a500" : "2px solid transparent", color: tab === t.id ? "#f0a500" : "#ffffff", cursor: "pointer", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", borderRadius: "0 3px 3px 0", marginBottom: 2, textAlign: "left", transition: "all .15s" }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
              {t.id === "agente" && factAuto > 0 && <span style={{ marginLeft: "auto", background: "#f0a500", color: "#08080f", fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: "bold" }}>{factAuto}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid #111120" }}>
          <div style={{ background: dbError ? "#e0525210" : "#4caf7d10", border: `1px solid ${dbError ? "#e0525222" : "#4caf7d22"}`, borderRadius: 3, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: dbError ? "#e05252" : "#4caf7d", boxShadow: `0 0 8px ${dbError ? "#e05252" : "#4caf7d"}`, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 10, color: dbError ? "#e05252" : "#4caf7d", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>{dbError ? "BD Sin conectar" : "BD Conectada"}</div>
              <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginTop: 2 }}>{dbError ? "Datos en memoria" : "Supabase activo"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ marginLeft: 220, padding: "36px 40px", position: "relative", zIndex: 1, minHeight: "100vh" }}>
        {tab === "dashboard" && <Dashboard obras={obras} facturas={facturas} proveedores={proveedores} clientes={clientes} setTab={setTab} />}
        {tab === "analitica" && <Analitica facturas={facturas} obras={obras} />}
        {tab === "tesoreria" && <Tesoreria facturas={facturas} />}
        {tab === "informes" && <Informes facturas={facturas} obras={obras} proveedores={proveedores} clientes={clientes} />}
        {tab === "obras" && <Obras obras={obras} setObras={setObras} />}
        {tab === "proveedores" && <Proveedores proveedores={proveedores} setProveedores={setProveedores} />}
        {tab === "clientes" && <Clientes clientes={clientes} setClientes={setClientes} />}
        {tab === "nominas" && <Nominas />}
        {tab === "presupuestos" && <Presupuestos />}
        {tab === "contabilidad" && <Contabilidad facturas={facturas} setFacturas={setFacturas} />}
        {tab === "documentos" && <Documentos />}
        {tab === "agente" && <Agente setFacturas={setFacturas} />}
      </div>

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #050510; } ::-webkit-scrollbar-thumb { background: #111120; }`}</style>
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO NÓMINAS Y RRHH
// ════════════════════════════════════════
function Nominas() {
  const [empleados, setEmpleados] = useState([]);
  const [subtab, setSubtab] = useState("empleados");
  const [nuevo, setNuevo] = useState(false);
  const [form, setForm] = useState({ nombre: "", dni: "", categoria: "", contrato: "Indefinido", salarioBruto: "", fechaAlta: "", proyecto: "" });

  const CATEGORIAS = ["Oficial 1ª", "Oficial 2ª", "Oficial 3ª", "Peón especialista", "Peón ordinario", "Encargado", "Director de proyecto", "Administrativo"];
  const CONTRATOS = ["Indefinido", "Obra y servicio", "Temporal", "A tiempo parcial"];

  const calcularNomina = (emp) => {
    const bruto = parseFloat(emp.salarioBruto) || 0;
    const irpf = bruto * 0.15;
    const ssTrabajador = bruto * 0.0635;
    const ssEmpresa = bruto * 0.2360;
    const neto = bruto - irpf - ssTrabajador;
    const costeEmpresa = bruto + ssEmpresa;
    return { bruto, irpf, ssTrabajador, ssEmpresa, neto, costeEmpresa };
  };

  const guardarEmpleado = () => {
    if (!form.nombre) return;
    setEmpleados(prev => [...prev, { ...form, id: Date.now(), salarioBruto: parseFloat(form.salarioBruto) || 0 }]);
    setNuevo(false);
    setForm({ nombre: "", dni: "", categoria: "", contrato: "Indefinido", salarioBruto: "", fechaAlta: "", proyecto: "" });
  };

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

  const totalNominas = empleados.reduce((s, e) => s + calcularNomina(e).costeEmpresa, 0);
  const totalNeto = empleados.reduce((s, e) => s + calcularNomina(e).neto, 0);
  const totalSS = empleados.reduce((s, e) => s + calcularNomina(e).ssEmpresa, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— Nóminas y RRHH</div>
        {subtab === "empleados" && <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo empleado</button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["Coste total empresa", formatEURLocal(totalNominas), "#e05252"], ["Total neto empleados", formatEURLocal(totalNeto), "#4caf7d"], ["SS empresa", formatEURLocal(totalSS), "#7eb8f5"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 22, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e2e", marginBottom: 22 }}>
        {[["empleados", "👷 Empleados"], ["nominas", "💰 Nóminas"], ["modelo111", "📋 Modelo 111"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#444", padding: "12px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {subtab === "empleados" && (
        <div>
          {nuevo && (
            <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo empleado</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[["nombre", "Nombre completo"], ["dni", "DNI / NIE"], ["fechaAlta", "Fecha de alta"], ["salarioBruto", "Salario bruto mensual (€)"], ["proyecto", "Proyecto asignado"]].map(([k, label]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                    <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Categoría</div>
                  <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                    <option value="">Seleccionar...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tipo contrato</div>
                  <select value={form.contrato} onChange={e => setForm(p => ({ ...p, contrato: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                    {CONTRATOS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={guardarEmpleado} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
                <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
              </div>
            </div>
          )}

          {empleados.length === 0 && !nuevo
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin empleados — pulsa "+ Nuevo empleado"</div>
            : <div style={{ display: "grid", gap: 12 }}>
                {empleados.map(e => {
                  const n = calcularNomina(e);
                  return (
                    <div key={e.id} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 18 }}>{e.nombre[0]}</div>
                          <div>
                            <div style={{ fontSize: 15, color: "#d4d0c8", marginBottom: 3 }}>{e.nombre}</div>
                            <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{e.categoria} · {e.contrato} · {e.obra || "Sin proyecto asignado"}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 4 }}>Coste empresa</div>
                          <div style={{ fontSize: 20, color: "#e05252" }}>{formatEURLocal(n.costeEmpresa)}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #141420" }}>
                        {[["Bruto", formatEURLocal(n.bruto), "#aaa"], ["IRPF 15%", formatEURLocal(n.irpf), "#e05252"], ["SS trabajador", formatEURLocal(n.ssTrabajador), "#7eb8f5"], ["Neto a pagar", formatEURLocal(n.neto), "#4caf7d"]].map(([k, v, c]) => (
                          <div key={k}>
                            <div style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                            <div style={{ fontSize: 14, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}

      {subtab === "nominas" && (
        <div>
          {empleados.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Añade empleados primero</div>
            : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: "1px solid #1e1e2e" }}>{["Empleado", "Categoría", "Bruto", "IRPF", "SS Trab.", "SS Emp.", "Neto", "Coste empresa"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 9, letterSpacing: 3, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {empleados.map(e => {
                    const n = calcularNomina(e);
                    return (
                      <tr key={e.id} style={{ borderBottom: "1px solid #0e0e18" }}>
                        <td style={{ padding: "12px 14px", color: "#ccc" }}>{e.nombre}</td>
                        <td style={{ padding: "12px 14px", color: "#444", fontSize: 11 }}>{e.categoria}</td>
                        <td style={{ padding: "12px 14px", color: "#aaa", fontFamily: "monospace" }}>{formatEURLocal(n.bruto)}</td>
                        <td style={{ padding: "12px 14px", color: "#e05252", fontFamily: "monospace" }}>{formatEURLocal(n.irpf)}</td>
                        <td style={{ padding: "12px 14px", color: "#7eb8f5", fontFamily: "monospace" }}>{formatEURLocal(n.ssTrabajador)}</td>
                        <td style={{ padding: "12px 14px", color: "#a78bfa", fontFamily: "monospace" }}>{formatEURLocal(n.ssEmpresa)}</td>
                        <td style={{ padding: "12px 14px", color: "#4caf7d", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(n.neto)}</td>
                        <td style={{ padding: "12px 14px", color: "#e05252", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(n.costeEmpresa)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: "2px solid #1e1e2e", background: "#0a0a14" }}>
                    <td colSpan={2} style={{ padding: "14px", color: "#f0a500", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>TOTAL MENSUAL</td>
                    <td style={{ padding: "14px", color: "#aaa", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).bruto,0))}</td>
                    <td style={{ padding: "14px", color: "#e05252", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).irpf,0))}</td>
                    <td style={{ padding: "14px", color: "#7eb8f5", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).ssTrabajador,0))}</td>
                    <td style={{ padding: "14px", color: "#a78bfa", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).ssEmpresa,0))}</td>
                    <td style={{ padding: "14px", color: "#4caf7d", fontFamily: "monospace", fontWeight: "bold" }}>{formatEURLocal(totalNeto)}</td>
                    <td style={{ padding: "14px", color: "#e05252", fontFamily: "monospace", fontWeight: "bold", fontSize: 16 }}>{formatEURLocal(totalNominas)}</td>
                  </tr>
                </tbody>
              </table>
          }
        </div>
      )}

      {subtab === "modelo111" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>Modelo 111 — Retenciones IRPF trimestral</div>
          {[
            ["Nº perceptores", empleados.length, "#aaa"],
            ["Base retenciones (trimestre)", formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).bruto,0)*3), "#aaa"],
            ["Total retenciones IRPF (trimestre)", formatEURLocal(empleados.reduce((s,e)=>s+calcularNomina(e).irpf,0)*3), "#e05252"],
            ["SS empresa (trimestre)", formatEURLocal(totalSS*3), "#7eb8f5"],
          ].map(([k, v, c]) => (
            <div key={k} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", padding: "16px 22px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#444", fontFamily: "monospace" }}>{k}</span>
              <span style={{ fontSize: 20, color: c, fontFamily: "monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ background: "#0c0c18", border: "1px solid #f0a50033", borderRadius: 2, padding: "16px 22px", marginTop: 8 }}>
            <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>◈ Aviso</div>
            <p style={{ fontSize: 11, color: "#444", fontFamily: "monospace", lineHeight: 1.9, margin: 0 }}>Datos calculados con IRPF 15% y SS 23.60% empresa. Revisa con tu gestoría antes de presentar el modelo 111.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO DOCUMENTOS
// ════════════════════════════════════════
function Documentos() {
  const [docs, setDocs] = useState([]);
  const [nuevo, setNuevo] = useState(false);
  const [form, setForm] = useState({ nombre: "", tipo: "Contrato", proyecto: "", fecha: "", vencimiento: "", notas: "" });
  const [filtro, setFiltro] = useState("Todos");

  const TIPOS = ["Contrato", "Licencia", "Seguro", "Certificado", "Presupuesto", "Acta", "Plano", "Otro"];
  const TIPO_COL = { "Contrato": "#f0a500", "Licencia": "#7eb8f5", "Seguro": "#4caf7d", "Certificado": "#a78bfa", "Presupuesto": "#e0a020", "Acta": "#e05252", "Plano": "#4cbbaf", "Otro": "#555" };

  const guardar = () => {
    if (!form.nombre) return;
    setDocs(prev => [...prev, { ...form, id: Date.now(), subido: new Date().toLocaleDateString("es-ES") }]);
    setNuevo(false);
    setForm({ nombre: "", tipo: "Contrato", proyecto: "", fecha: "", vencimiento: "", notas: "" });
  };

  const docsFiltrados = filtro === "Todos" ? docs : docs.filter(d => d.tipo === filtro);

  const hoy = new Date();
  const proxVencer = docs.filter(d => {
    if (!d.vencimiento) return false;
    const [dia, mes, anio] = d.vencimiento.split("/");
    const fecha = new Date(anio, mes - 1, dia);
    const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— Gestión de documentos</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Nuevo documento</button>
      </div>

      {proxVencer.length > 0 && (
        <div style={{ background: "rgba(224,122,48,0.08)", border: "1px solid rgba(224,122,48,0.3)", borderLeft: "3px solid #e07830", borderRadius: 2, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#e07830", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>⚡ Próximos a vencer (30 días)</div>
          {proxVencer.map(d => <div key={d.id} style={{ fontSize: 12, color: "#e07830", fontFamily: "monospace" }}>→ {d.nombre} · Vence: {d.vencimiento}</div>)}
        </div>
      )}

      {nuevo && (
        <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo documento</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["nombre", "Nombre del documento"], ["obra", "Proyecto relacionado"], ["fecha", "Fecha del documento"], ["vencimiento", "Fecha vencimiento (opcional)"], ["notas", "Notas"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tipo</div>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["Todos", ...TIPOS].map(t => (
          <button key={t} onClick={() => setFiltro(t)} style={{ background: filtro === t ? "#f0a500" : "#0c0c18", color: filtro === t ? "#08080f" : "#444", border: "1px solid #1e1e2e", padding: "6px 16px", cursor: "pointer", fontSize: 10, letterSpacing: 2, fontFamily: "monospace", borderRadius: 20, textTransform: "uppercase" }}>{t}</button>
        ))}
      </div>

      {docsFiltrados.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin documentos — pulsa "+ Nuevo documento"</div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {docsFiltrados.map(d => (
              <div key={d.id} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderLeft: `3px solid ${TIPO_COL[d.tipo] || "#555"}`, borderRadius: 2, padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, color: "#d4d0c8", marginBottom: 4 }}>{d.nombre}</div>
                    <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{d.obra || "Sin proyecto"} · {d.fecha}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: `${TIPO_COL[d.tipo]}18`, color: TIPO_COL[d.tipo], letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", border: `1px solid ${TIPO_COL[d.tipo]}33`, whiteSpace: "nowrap" }}>{d.tipo}</span>
                </div>
                {d.vencimiento && <div style={{ fontSize: 11, color: "#e07830", fontFamily: "monospace" }}>⏰ Vence: {d.vencimiento}</div>}
                {d.notas && <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginTop: 6 }}>{d.notas}</div>}
                <div style={{ fontSize: 10, color: "#222", fontFamily: "monospace", marginTop: 8 }}>Subido: {d.subido}</div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO TESORERÍA
// ════════════════════════════════════════
function Tesoreria({ facturas }) {
  const [movimientos, setMovimientos] = useState([]);
  const [nuevo, setNuevo] = useState(false);
  const [subtab, setSubtab] = useState("resumen");
  const [form, setForm] = useState({ concepto: "", importe: "", tipo: "cobro", fecha: "", vencimiento: "", estado: "Pendiente", categoria: "Clientes" });

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

  const cobros = movimientos.filter(m => m.tipo === "cobro");
  const pagos = movimientos.filter(m => m.tipo === "pago");
  const totalCobros = cobros.reduce((s, m) => s + parseFloat(m.importe || 0), 0);
  const totalPagos = pagos.reduce((s, m) => s + parseFloat(m.importe || 0), 0);
  const saldoPrevisto = totalCobros - totalPagos;

  const cobrosFacturas = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + f.total, 0);
  const pagosFacturas = facturas.filter(f => f.tipo === "gasto" && f.estado !== "Pagada").reduce((s, f) => s + f.total, 0);

  const hoy = new Date();
  const en30 = movimientos.filter(m => {
    if (!m.vencimiento) return false;
    const [d, mo, a] = m.vencimiento.split("/");
    const fecha = new Date(a, mo - 1, d);
    const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  });

  const guardar = () => {
    if (!form.concepto || !form.importe) return;
    setMovimientos(prev => [...prev, { ...form, id: Date.now(), registrado: new Date().toLocaleDateString("es-ES") }]);
    setNuevo(false);
    setForm({ concepto: "", importe: "", tipo: "cobro", fecha: "", vencimiento: "", estado: "Pendiente", categoria: "Clientes" });
  };

  const CATEGORIAS_COBRO = ["Clientes", "Anticipos", "Subvenciones", "Otros ingresos"];
  const CATEGORIAS_PAGO = ["Proveedores", "Nóminas", "Alquileres", "Impuestos", "Seguros", "Suministros", "Otros gastos"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>— Tesorería</div>
        <button onClick={() => setNuevo(true)} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>+ Añadir movimiento</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Cobros previstos", formatEURLocal(totalCobros + cobrosFacturas), "#4caf7d"],
          ["Pagos previstos", formatEURLocal(totalPagos + pagosFacturas), "#e05252"],
          ["Saldo neto previsto", formatEURLocal(saldoPrevisto + cobrosFacturas - pagosFacturas), saldoPrevisto >= 0 ? "#4caf7d" : "#e05252"],
          ["Vencen en 30 días", en30.length, "#f0a500"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 22, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Alertas vencimientos */}
      {en30.length > 0 && (
        <div style={{ background: "rgba(224,122,48,0.08)", border: "1px solid rgba(224,122,48,0.3)", borderLeft: "3px solid #e07830", borderRadius: 2, padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#e07830", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>⚡ Vencen en los próximos 30 días</div>
          {en30.map(m => (
            <div key={m.id} style={{ fontSize: 12, color: "#e07830", fontFamily: "monospace", marginBottom: 4 }}>
              → {m.tipo === "cobro" ? "↑" : "↓"} {m.concepto} · {formatEURLocal(m.importe)} · Vence: {m.vencimiento}
            </div>
          ))}
        </div>
      )}

      {/* Formulario nuevo */}
      {nuevo && (
        <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>Nuevo movimiento de tesorería</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tipo</div>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value, categoria: e.target.value === "cobro" ? "Clientes" : "Proveedores" }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                <option value="cobro">Cobro (entrada)</option>
                <option value="pago">Pago (salida)</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Categoría</div>
              <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }}>
                {(form.tipo === "cobro" ? CATEGORIAS_COBRO : CATEGORIAS_PAGO).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {[["concepto", "Concepto"], ["importe", "Importe (€)"], ["fecha", "Fecha prevista"], ["vencimiento", "Fecha vencimiento"]].map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", borderRadius: 2, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={guardar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "12px 28px", cursor: "pointer", fontSize: 11, letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, textTransform: "uppercase" }}>✓ Guardar</button>
            <button onClick={() => setNuevo(false)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", borderRadius: 2, textTransform: "uppercase" }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Subtabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e2e", marginBottom: 20 }}>
        {[["resumen", "Resumen"], ["cobros", `↑ Cobros (${cobros.length})`], ["pagos", `↓ Pagos (${pagos.length})`], ["previsiones", "Previsión 90 días"]].map(([id, label]) => (
          <button key={id} onClick={() => setSubtab(id)} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#444", padding: "12px 22px", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {subtab === "resumen" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[["Cobros pendientes de facturas", cobrosFacturas, "#4caf7d", facturas.filter(f=>f.tipo==="ingreso"&&f.estado==="Pendiente").length + " facturas"],
            ["Pagos pendientes de facturas", pagosFacturas, "#e05252", facturas.filter(f=>f.tipo==="gasto"&&f.estado!=="Pagada").length + " facturas"],
            ["Cobros manuales registrados", totalCobros, "#4caf7d", cobros.length + " movimientos"],
            ["Pagos manuales registrados", totalPagos, "#e05252", pagos.length + " movimientos"],
          ].map(([l, v, c, s]) => (
            <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderLeft: `3px solid ${c}`, padding: "20px 24px", borderRadius: 2 }}>
              <div style={{ fontSize: 12, color: "#444", fontFamily: "monospace", marginBottom: 8 }}>{l}</div>
              <div style={{ fontSize: 24, color: c, marginBottom: 4 }}>{formatEURLocal(v)}</div>
              <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {(subtab === "cobros" || subtab === "pagos") && (
        <div>
          {(subtab === "cobros" ? cobros : pagos).length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "monospace", fontSize: 13, letterSpacing: 3 }}>Sin {subtab} registrados</div>
            : (subtab === "cobros" ? cobros : pagos).map(m => (
              <div key={m.id} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderLeft: `3px solid ${m.tipo === "cobro" ? "#4caf7d" : "#e05252"}`, padding: "16px 22px", marginBottom: 10, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#d4d0c8", marginBottom: 3 }}>{m.concepto}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{m.categoria} · Vence: {m.vencimiento || "Sin fecha"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, color: m.tipo === "cobro" ? "#4caf7d" : "#e05252", marginBottom: 4 }}>{m.tipo === "cobro" ? "+" : "-"}{formatEURLocal(m.importe)}</div>
                  <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{m.estado}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {subtab === "previsiones" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Previsión de liquidez — próximos 90 días</div>
          {["30 días", "60 días", "90 días"].map((periodo, idx) => {
            const dias = [30, 60, 90][idx];
            const cobrosP = movimientos.filter(m => {
              if (m.tipo !== "cobro" || !m.vencimiento) return false;
              const [d, mo, a] = m.vencimiento.split("/");
              const fecha = new Date(a, mo - 1, d);
              return (fecha - hoy) / (1000 * 60 * 60 * 24) <= dias;
            }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
            const pagosP = movimientos.filter(m => {
              if (m.tipo !== "pago" || !m.vencimiento) return false;
              const [d, mo, a] = m.vencimiento.split("/");
              const fecha = new Date(a, mo - 1, d);
              return (fecha - hoy) / (1000 * 60 * 60 * 24) <= dias;
            }).reduce((s, m) => s + parseFloat(m.importe || 0), 0);
            const saldo = cobrosP - pagosP;
            return (
              <div key={periodo} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", padding: "18px 24px", marginBottom: 10, borderRadius: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#ccc", marginBottom: 6 }}>En los próximos {periodo}</div>
                    <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>Cobros: {formatEURLocal(cobrosP)} · Pagos: {formatEURLocal(pagosP)}</div>
                  </div>
                  <div style={{ fontSize: 22, color: saldo >= 0 ? "#4caf7d" : "#e05252" }}>{formatEURLocal(saldo)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MÓDULO INFORMES IA
// ════════════════════════════════════════
const INFORME_PROMPT = `Eres un consultor financiero experto en pymes españolas. Analiza los datos de la empresa y genera un informe mensual ejecutivo completo.

Devuelve SOLO JSON válido sin texto adicional:
{
  "resumen": "párrafo ejecutivo de 3-4 líneas con el estado general del negocio",
  "puntosFuertes": ["punto 1", "punto 2", "punto 3"],
  "areasRiesgo": ["riesgo 1", "riesgo 2"],
  "recomendaciones": ["acción 1", "acción 2", "acción 3"],
  "alertasCriticas": ["alerta 1"],
  "tendencia": "positiva|estable|negativa",
  "puntuacion": 75
}

La puntuación es de 0 a 100 sobre la salud financiera del negocio.`;

function Informes({ facturas, obras, proveedores, clientes }) {
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historial, setHistorial] = useState([]);

  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

  const ingresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.total, 0);
  const gastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.total, 0);
  const pendienteCobro = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + f.total, 0);

  const generarInforme = async () => {
    setLoading(true); setError(""); setInforme(null);
    const contexto = `
      Empresa con ${clientes.length} clientes y ${proveedores.length} proveedores.
      Proyectos activos: ${obras.filter(o => o.estado === "En ejecución").length} de ${obras.length} totales.
      Facturación total: ${formatEURLocal(ingresos)}.
      Gastos totales: ${formatEURLocal(gastos)}.
      Margen bruto: ${formatEURLocal(ingresos - gastos)}.
      Pendiente de cobro: ${formatEURLocal(pendienteCobro)}.
      Facturas totales registradas: ${facturas.length}.
      Fecha del informe: ${new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}.
    `;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: INFORME_PROMPT,
          messages: [{ role: "user", content: `Genera el informe mensual con estos datos: ${contexto}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setInforme(parsed);
      setHistorial(prev => [{ ...parsed, fecha: new Date().toLocaleDateString("es-ES"), id: Date.now() }, ...prev.slice(0, 4)]);
    } catch {
      setError("No se pudo generar el informe. Añade tu API Key de Anthropic para activar esta función.");
    }
    setLoading(false);
  };

  const TENDENCIA_COLOR = { positiva: "#4caf7d", estable: "#f0a500", negativa: "#e05252" };
  const TENDENCIA_ICON = { positiva: "↑", estable: "→", negativa: "↓" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>— Informes automáticos con IA</div>
          <div style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>Claude analiza tu negocio y genera un informe ejecutivo completo</div>
        </div>
        <button onClick={generarInforme} disabled={loading} style={{ background: loading ? "#1e1e2e" : "#f0a500", color: loading ? "#444" : "#08080f", border: "none", padding: "12px 28px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>
          {loading ? "⟳ Generando..." : "✦ Generar informe"}
        </button>
      </div>

      {/* Resumen datos actuales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Ingresos", formatEURLocal(ingresos), "#4caf7d"],
          ["Gastos", formatEURLocal(gastos), "#e05252"],
          ["Margen", formatEURLocal(ingresos - gastos), ingresos >= gastos ? "#4caf7d" : "#e05252"],
          ["Pdte. cobro", formatEURLocal(pendienteCobro), "#f0a500"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "16px 20px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 20, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: "14px 20px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 12, fontFamily: "monospace", borderRadius: 2, marginBottom: 20 }}>✕ {error}</div>}

      {informe && (
        <div>
          {/* Puntuación y tendencia */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 16 }}>Salud financiera</div>
              <div style={{ fontSize: 64, color: informe.puntuacion >= 70 ? "#4caf7d" : informe.puntuacion >= 40 ? "#f0a500" : "#e05252", fontWeight: 300, lineHeight: 1 }}>{informe.puntuacion}</div>
              <div style={{ fontSize: 18, color: "#333", marginBottom: 16 }}>/100</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${TENDENCIA_COLOR[informe.tendencia]}15`, border: `1px solid ${TENDENCIA_COLOR[informe.tendencia]}33`, padding: "6px 16px", borderRadius: 20 }}>
                <span style={{ color: TENDENCIA_COLOR[informe.tendencia], fontSize: 16 }}>{TENDENCIA_ICON[informe.tendencia]}</span>
                <span style={{ fontSize: 11, color: TENDENCIA_COLOR[informe.tendencia], letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>{informe.tendencia}</span>
              </div>
            </div>

            <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
              <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>Resumen ejecutivo</div>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.9, margin: 0 }}>{informe.resumen}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ background: "#0c0c18", border: "1px solid #4caf7d33", borderTop: "2px solid #4caf7d", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 9, color: "#4caf7d", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>✓ Puntos fuertes</div>
              {informe.puntosFuertes?.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace", lineHeight: 1.8, paddingLeft: 12, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#4caf7d" }}>→</span>{p}</div>)}
            </div>

            <div style={{ background: "#0c0c18", border: "1px solid #e0525233", borderTop: "2px solid #e05252", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 9, color: "#e05252", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>⚠ Áreas de riesgo</div>
              {informe.areasRiesgo?.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace", lineHeight: 1.8, paddingLeft: 12, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#e05252" }}>→</span>{p}</div>)}
            </div>

            <div style={{ background: "#0c0c18", border: "1px solid #f0a50033", borderTop: "2px solid #f0a500", borderRadius: 3, padding: "20px" }}>
              <div style={{ fontSize: 9, color: "#f0a500", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>◈ Recomendaciones</div>
              {informe.recomendaciones?.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace", lineHeight: 1.8, paddingLeft: 12, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#f0a500" }}>→</span>{p}</div>)}
            </div>
          </div>

          {informe.alertasCriticas?.length > 0 && (
            <div style={{ background: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.3)", borderLeft: "3px solid #e05252", borderRadius: 2, padding: "16px 20px" }}>
              <div style={{ fontSize: 9, color: "#e05252", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>🚨 Alertas críticas</div>
              {informe.alertasCriticas.map((a, i) => <div key={i} style={{ fontSize: 12, color: "#e05252", fontFamily: "monospace", lineHeight: 1.8 }}>→ {a}</div>)}
            </div>
          )}
        </div>
      )}

      {!informe && !loading && !error && (
        <div style={{ background: "#0c0c18", border: "1px solid #f0a50022", borderRadius: 3, padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16, color: "#f0a500" }}>✦</div>
          <div style={{ fontSize: 14, color: "#444", fontFamily: "monospace", marginBottom: 8 }}>Pulsa "Generar informe" para que la IA analice tu negocio</div>
          <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>Claude revisará tus facturas, proyectos y clientes para darte un diagnóstico completo</div>
        </div>
      )}

      {historial.length > 1 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Historial de informes</div>
          {historial.slice(1).map(h => (
            <div key={h.id} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", padding: "14px 20px", marginBottom: 8, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>Informe {h.fecha}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18, color: h.puntuacion >= 70 ? "#4caf7d" : h.puntuacion >= 40 ? "#f0a500" : "#e05252" }}>{h.puntuacion}/100</span>
                <span style={{ fontSize: 11, color: TENDENCIA_COLOR[h.tendencia], fontFamily: "monospace" }}>{TENDENCIA_ICON[h.tendencia]} {h.tendencia}</span>
              </div>
            </div>
          ))}
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

  const datosIngresos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const datosGastos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const totalIngresos = datosIngresos.reduce((s, v) => s + v, 0);
  const totalGastos = datosGastos.reduce((s, v) => s + v, 0);
  const margen = totalIngresos - totalGastos;
  const margenPct = totalIngresos > 0 ? ((margen / totalIngresos) * 100).toFixed(1) : 0;
  const formatEURLocal = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

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
  const maxVal = Math.max(...datosIngresos, ...datosGastos, ...datosPrevistos, 1);
  const maxP = Math.max(...datosPrevistos, ...datosIngresos, 1);
  const mesPrevision = new Date().getMonth();

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>— Analítica y gráficas</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[
          ["Ingresos acum.", formatEURLocal(totalIngresos), "#4caf7d"],
          ["Gastos acum.", formatEURLocal(totalGastos), "#e05252"],
          ["Margen bruto", formatEURLocal(margen), margen >= 0 ? "#4caf7d" : "#e05252"],
          ["% Margen", `${margenPct}%`, "#f0a500"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "18px 22px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 22, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>Ingresos vs Gastos por mes</div>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 160 }}>
            {meses.slice(0, 7).map((mes, i) => (
              <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 130 }}>
                  <div style={{ flex: 1, height: `${(datosIngresos[i] / maxVal) * 100}%`, background: "#4caf7d", borderRadius: "2px 2px 0 0", minHeight: datosIngresos[i] > 0 ? 4 : 0 }} />
                  <div style={{ flex: 1, height: `${(datosGastos[i] / maxVal) * 100}%`, background: "#e05252", borderRadius: "2px 2px 0 0", minHeight: datosGastos[i] > 0 ? 4 : 0 }} />
                </div>
                <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace" }}>{mes}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
            {[["Ingresos", "#4caf7d"], ["Gastos", "#e05252"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>Estado de obras</div>
          {obras.length === 0
            ? <div style={{ color: "#333", fontSize: 12, fontFamily: "monospace", textAlign: "center", paddingTop: 40 }}>Sin proyectos registrados</div>
            : obras.map(o => (
              <div key={o.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#ccc" }}>{o.nombre.split(" ").slice(0, 2).join(" ")}</span>
                  <span style={{ fontSize: 11, color: o.color || "#f0a500", fontFamily: "monospace" }}>{o.progreso}%</span>
                </div>
                <div style={{ height: 6, background: "#1a1a22", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${o.progreso}%`, background: o.color || "#f0a500", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginTop: 4 }}>{formatEURLocal(o.presupuesto || 0)} · {o.estado}</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Previsión IA */}
      <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Previsión de obra — Calculada por IA</div>
            {explicacion && <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{explicacion}</div>}
          </div>
          <button onClick={generarPrevisionIA} disabled={loadingIA} style={{ background: loadingIA ? "#1e1e2e" : "#f0a500", color: loadingIA ? "#444" : "#08080f", border: "none", padding: "10px 22px", cursor: loadingIA ? "not-allowed" : "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, whiteSpace: "nowrap" }}>
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
                {val > 0 && <div style={{ fontSize: 7, color: "#444", fontFamily: "monospace" }}>{(val/1000).toFixed(0)}k</div>}
                <div style={{ width: "80%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                  <div style={{ width: "100%", height: `${(val / maxP) * 100}%`, background: isPast ? "#f0a500" : isNow ? "#f0c040" : "#f0a50033", borderRadius: "2px 2px 0 0", minHeight: val > 0 ? 4 : 0, border: !isPast && !isNow ? "1px dashed #f0a50055" : "none", transition: "height 0.5s" }} />
                </div>
                <div style={{ fontSize: 8, color: isNow ? "#f0a500" : "#333", fontFamily: "monospace", fontWeight: isNow ? "bold" : "normal" }}>{mes}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, background: "#f0a500", borderRadius: 2 }} /><span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>Ejecutado</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, background: "#f0c040", borderRadius: 2 }} /><span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>Mes actual</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, background: "#f0a50033", border: "1px dashed #f0a500", borderRadius: 2 }} /><span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>Previsto IA</span></div>
        </div>
      </div>

      {/* Fases de obra */}
      {fases.length > 0 && (
        <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "24px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 18 }}>Fases de obra según IA</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {fases.map((fase, i) => {
              const cols = ["#7eb8f5", "#f0a500", "#4caf7d", "#a78bfa"];
              return (
                <div key={i} style={{ background: "#05050e", border: `1px solid ${cols[i]}33`, borderTop: `2px solid ${cols[i]}`, padding: "16px 18px", borderRadius: 2 }}>
                  <div style={{ fontSize: 18, color: cols[i], fontFamily: "monospace", fontWeight: "bold", marginBottom: 6 }}>{fase.porcentaje}%</div>
                  <div style={{ fontSize: 12, color: "#ccc", marginBottom: 4 }}>{fase.nombre}</div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>{fase.meses}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!prevision && (
        <div style={{ background: "#0c0c18", border: "1px solid #f0a50022", borderRadius: 2, padding: "18px 22px" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>◈ Cómo funciona</div>
          <p style={{ fontSize: 12, color: "#444", fontFamily: "monospace", lineHeight: 1.9, margin: 0 }}>
            Pulsa "Calcular con IA" y Claude analizará tus obras activas, sus presupuestos y fechas para generar una curva de facturación mensual realista basada en las fases típicas de construcción (curva en S).
          </p>
        </div>
      )}
    </div>
  );
}
