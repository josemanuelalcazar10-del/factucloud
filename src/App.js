import { useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// FACTUCLOUD — App completa de gestión para construcción
// Módulos: Dashboard · Obras · Clientes · Contabilidad · Agente IA
// ═══════════════════════════════════════════════════════════

const EMPRESA = { nombre: "FactuCloud", cif: "B28123456", direccion: "Calle Industria 45, 28001 Madrid", tel: "91 234 56 78", email: "admin@factucloud.es", banco: "ES12 1234 5678 9012 3456 7890" };

const formatEUR = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);
const formatEURd = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

// ── DATOS INICIALES ──────────────────────────────────────
const OBRAS_INIT = [
  { id: 1, nombre: "Residencial Las Encinas", cliente: "Promotora Vallejo S.L.", estado: "En ejecución", progreso: 67, presupuesto: 840000, certificado: 562800, inicio: "03/01/2026", fin: "15/12/2026", direccion: "C/ Mayor 14, Madrid", incidencias: 2, color: "#f0a500" },
  { id: 2, nombre: "Nave Industrial Polígono Sur", cliente: "Logística Express S.A.", estado: "En ejecución", progreso: 42, presupuesto: 320000, certificado: 134400, inicio: "10/03/2026", fin: "30/09/2026", direccion: "Pol. Sur, Parcela 8, Getafe", incidencias: 0, color: "#7eb8f5" },
  { id: 3, nombre: "Reforma Oficinas Torre Norte", cliente: "Grupo Financiero Iberia", estado: "Pendiente inicio", progreso: 0, presupuesto: 180000, certificado: 0, inicio: "01/07/2026", fin: "30/11/2026", direccion: "Paseo Castellana 88, Madrid", incidencias: 0, color: "#a78bfa" },
  { id: 4, nombre: "Urbanización El Pinar", cliente: "Constructora Mediterránea", estado: "Finalizada", progreso: 100, presupuesto: 1200000, certificado: 1200000, inicio: "05/06/2025", fin: "28/02/2026", direccion: "Av. del Pinar 1, Pozuelo", incidencias: 0, color: "#4caf7d" },
];

const CLIENTES_INIT = [
  { id: 1, nombre: "Promotora Vallejo S.L.", cif: "B28456123", contacto: "Javier Vallejo", email: "j.vallejo@pvallejo.es", tel: "91 234 56 78", facturado: 562800, pendiente: 134000, tipo: "Promotor" },
  { id: 2, nombre: "Logística Express S.A.", cif: "A79234561", contacto: "Ana Martínez", email: "amartinez@logexpress.com", tel: "91 876 54 32", facturado: 134400, pendiente: 42000, tipo: "Empresa" },
  { id: 3, nombre: "Grupo Financiero Iberia", cif: "A12345678", contacto: "Carlos Ruiz", email: "c.ruiz@gfi.es", tel: "91 555 00 11", facturado: 0, pendiente: 0, tipo: "Empresa" },
  { id: 4, nombre: "Constructora Mediterránea", cif: "B91234567", contacto: "Marta Sánchez", email: "msanchez@cmediterranea.com", tel: "96 321 00 44", facturado: 1200000, pendiente: 0, tipo: "Promotor" },
];

const FACTURAS_INIT = [
  { id: 1, numero: "F2026-041", cliente: "Promotora Vallejo S.L.", obra: "Residencial Las Encinas", fecha: "05/05/2026", base: 42000, iva: 8820, irpf: 6300, total: 44520, estado: "Cobrada", tipo: "ingreso", auto: false },
  { id: 2, numero: "F2026-042", cliente: "Logística Express S.A.", obra: "Nave Industrial", fecha: "12/05/2026", base: 28000, iva: 5880, irpf: 4200, total: 29680, estado: "Pendiente", tipo: "ingreso", auto: false },
  { id: 3, numero: "FP2026-089", cliente: "Cementos Vallejo S.L.", obra: "Residencial Las Encinas", fecha: "15/05/2026", base: 4200, iva: 882, irpf: 630, total: 4452, estado: "Pagada", tipo: "gasto", auto: true },
];

const ESTADO_COL = { "En ejecución": "#f0a500", "Pendiente inicio": "#7eb8f5", "Finalizada": "#4caf7d", "Cobrada": "#4caf7d", "Pendiente": "#f0a500", "Pagada": "#4caf7d", "Emitida": "#7eb8f5", "Borrador": "#666" };

// ── COMPONENTES COMPARTIDOS ──────────────────────────────
const Badge = ({ label }) => <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: `${ESTADO_COL[label] || "#555"}18`, color: ESTADO_COL[label] || "#aaa", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace", border: `1px solid ${ESTADO_COL[label] || "#555"}33`, whiteSpace: "nowrap" }}>{label}</span>;

const Bar = ({ v, color = "#f0a500" }) => <div style={{ height: 4, background: "#1a1a22", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${v}%`, background: v === 100 ? "#4caf7d" : color, borderRadius: 2, transition: "width .6s" }} /></div>;

const Card = ({ children, accent, onClick, selected }) => (
  <div onClick={onClick} style={{ background: selected ? "#12121e" : "#0c0c18", border: `1px solid ${selected ? "#f0a500" : "#1e1e2e"}`, borderTop: accent ? `2px solid ${accent}` : undefined, borderRadius: 3, padding: "22px 24px", cursor: onClick ? "pointer" : "default", transition: "all .2s" }}>
    {children}
  </div>
);

// ════════════════════════════════════════════════════════
// MÓDULO 1: DASHBOARD
// ════════════════════════════════════════════════════════
function Dashboard({ obras, facturas, setTab }) {
  const ingresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.total, 0);
  const gastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.total, 0);
  const activas = obras.filter(o => o.estado === "En ejecución").length;
  const pendCobro = facturas.filter(f => f.tipo === "ingreso" && f.estado === "Pendiente").reduce((s, f) => s + f.total, 0);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Panel de control</div>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: "#f0f0ea", letterSpacing: 1 }}>Buenos días, <span style={{ color: "#f0a500" }}>Administración</span></h2>
        <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginTop: 4 }}>Jueves 28 de mayo de 2026</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[
          ["Facturación", formatEUR(ingresos), "#4caf7d", "↑ Mayo 2026"],
          ["Gastos", formatEUR(gastos), "#e05252", `${facturas.filter(f=>f.tipo==="gasto").length} facturas`],
          ["Obras activas", activas, "#f0a500", "de " + obras.length + " totales"],
          ["Pendiente cobro", formatEUR(pendCobro), "#7eb8f5", "facturas emitidas"],
        ].map(([l, v, c, s]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "20px 22px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#333", letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 24, color: c, fontWeight: 300, marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>Obras en curso</div>
            <button onClick={() => setTab("obras")} style={{ background: "none", border: "none", color: "#333", fontSize: 9, cursor: "pointer", letterSpacing: 2, fontFamily: "monospace" }}>VER TODO →</button>
          </div>
          {obras.filter(o => o.estado !== "Finalizada").map(o => (
            <div key={o.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #141420" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#d4d0c8", marginBottom: 2 }}>{o.nombre}</div>
                  <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{o.cliente}</div>
                </div>
                <Badge label={o.estado} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}><Bar v={o.progreso} color={o.color} /></div>
                <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>{o.progreso}%</span>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace" }}>Últimas facturas</div>
            <button onClick={() => setTab("contabilidad")} style={{ background: "none", border: "none", color: "#333", fontSize: 9, cursor: "pointer", letterSpacing: 2, fontFamily: "monospace" }}>VER TODO →</button>
          </div>
          {facturas.slice(0, 5).map(f => (
            <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #141420" }}>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2, fontFamily: "monospace" }}>{f.numero}</div>
                <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{f.cliente.split(" ")[0]}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: f.tipo === "ingreso" ? "#4caf7d" : "#e05252", marginBottom: 3 }}>{f.tipo === "ingreso" ? "+" : "-"}{formatEUR(f.total)}</div>
                {f.auto && <span style={{ fontSize: 8, color: "#f0a500", letterSpacing: 1, fontFamily: "monospace" }}>● AUTO</span>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MÓDULO 2: OBRAS
// ════════════════════════════════════════════════════════
function Obras({ obras }) {
  const [sel, setSel] = useState(null);
  const obra = obras.find(o => o.id === sel);
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>— {obras.length} obras registradas</div>
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 360px" : "repeat(2,1fr)", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
          {obras.map(o => (
            <Card key={o.id} onClick={() => setSel(sel === o.id ? null : o.id)} selected={sel === o.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#d4d0c8", marginBottom: 3 }}>{o.nombre}</div>
                  <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{o.cliente}</div>
                </div>
                <Badge label={o.estado} />
              </div>
              <Bar v={o.progreso} color={o.color} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
                {[["Presupuesto", formatEUR(o.presupuesto)], ["Certificado", formatEUR(o.certificado)], ["Avance", `${o.progreso}%`]].map(([k, v]) => (
                  <div key={k}><div style={{ fontSize: 8, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 3 }}>{k}</div><div style={{ fontSize: 12, color: "#aaa" }}>{v}</div></div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {obra && (
          <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Detalle</div>
            <h3 style={{ margin: "0 0 4px", fontWeight: 300, fontSize: 18, color: "#f0f0ea" }}>{obra.nombre}</h3>
            <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginBottom: 24 }}>{obra.direccion}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["Cliente", obra.cliente], ["Estado", obra.estado], ["Inicio", obra.inicio], ["Fin previsto", obra.fin], ["Certificado", formatEUR(obra.certificado)], ["Incidencias", obra.incidencias]].map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px solid #141420", paddingBottom: 10 }}>
                  <div style={{ fontSize: 8, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12, color: "#ccc" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0e0e18", borderRadius: 2, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 2 }}>PROGRESO</span>
                <span style={{ fontSize: 13, color: obra.color }}>{obra.progreso}%</span>
              </div>
              <Bar v={obra.progreso} color={obra.color} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Ver fotos", "Añadir parte", "Certificación", "Ver facturas"].map(a => (
                <button key={a} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "10px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", borderRadius: 2, cursor: "pointer" }}>{a}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MÓDULO 3: CLIENTES (CRM)
// ════════════════════════════════════════════════════════
function Clientes({ clientes }) {
  const [sel, setSel] = useState(null);
  const cl = clientes.find(c => c.id === sel);
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>— {clientes.length} clientes</div>
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 340px" : "repeat(2,1fr)", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
          {clientes.map(c => (
            <Card key={c.id} onClick={() => setSel(sel === c.id ? null : c.id)} selected={sel === c.id}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 14, marginBottom: 12 }}>{c.nombre[0]}</div>
              <div style={{ fontSize: 13, color: "#d4d0c8", marginBottom: 3 }}>{c.nombre}</div>
              <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginBottom: 14 }}>{c.cif} · {c.tipo}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Facturado", formatEUR(c.facturado)], ["Pendiente", formatEUR(c.pendiente)]].map(([k, v]) => (
                  <div key={k}><div style={{ fontSize: 8, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 3 }}>{k}</div><div style={{ fontSize: 12, color: "#aaa" }}>{v}</div></div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        {cl && (
          <div style={{ background: "#0a0a14", border: "1px solid #f0a50033", borderRadius: 3, padding: "28px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0a50015", border: "1px solid #f0a50033", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontSize: 20, marginBottom: 14 }}>{cl.nombre[0]}</div>
            <div style={{ fontSize: 18, color: "#f0f0ea", fontWeight: 300, marginBottom: 4 }}>{cl.nombre}</div>
            <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginBottom: 24 }}>{cl.cif} · {cl.tipo}</div>
            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {[["Contacto", cl.contacto], ["Email", cl.email], ["Teléfono", cl.tel], ["Total facturado", formatEUR(cl.facturado)], ["Pendiente cobro", formatEUR(cl.pendiente)]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #141420", paddingBottom: 10 }}>
                  <span style={{ fontSize: 9, color: "#333", letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "#aaa" }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "1px solid #1e1e2e", color: "#333", padding: "10px 20px", fontSize: 9, letterSpacing: 3, fontFamily: "monospace", cursor: "pointer", borderRadius: 2, textTransform: "uppercase" }}>← Volver</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MÓDULO 4: CONTABILIDAD + GENERADOR IA
// ════════════════════════════════════════════════════════
const FACTURA_PROMPT = `Eres contable de FactuCloud (CIF B28123456, Calle Industria 45 Madrid). Genera una factura a partir de la descripción del usuario.
Devuelve SOLO JSON válido sin texto adicional:
{"numeroFactura":"F2026-0XX","fecha":"28/05/2026","fechaVencimiento":"27/06/2026","cliente":{"nombre":"","cif":"","direccion":"","email":""},"obra":"","lineas":[{"descripcion":"","cantidad":1,"unidad":"ud","precioUnitario":0,"importe":0}],"tipoIVA":21,"tipoIRPF":15,"formaPago":"Transferencia bancaria","notas":"","sugerencias":[]}`;

function Contabilidad({ facturas, setFacturas }) {
  const [subtab, setSubtab] = useState("lista");
  const [input, setInput] = useState("");
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("input");

  const totalIngresos = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.total, 0);
  const totalGastos = facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.total, 0);
  const ivaLiquidar = facturas.filter(f => f.tipo === "ingreso").reduce((s, f) => s + f.iva, 0) - facturas.filter(f => f.tipo === "gasto").reduce((s, f) => s + f.iva, 0);

  const generar = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(""); setFactura(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: FACTURA_PROMPT, messages: [{ role: "user", content: input }] }) });
      const data = await res.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setFactura(parsed); setStep("preview");
    } catch { setError("No se pudo generar. Describe mejor los datos."); }
    setLoading(false);
  };

  const confirmar = () => {
    if (!factura) return;
    const base = factura.lineas.reduce((s, l) => s + l.importe, 0);
    const iva = (base * factura.tipoIVA) / 100;
    const irpf = (base * factura.tipoIRPF) / 100;
    setFacturas(prev => [{ ...factura, id: Date.now(), base, iva, irpf, total: base + iva - irpf, estado: "Emitida", tipo: "ingreso", auto: false }, ...prev]);
    setStep("done"); setSubtab("lista");
  };

  const base = factura ? factura.lineas.reduce((s, l) => s + l.importe, 0) : 0;
  const cuotaIVA = factura ? (base * factura.tipoIVA) / 100 : 0;
  const cuotaIRPF = factura ? (base * factura.tipoIRPF) / 100 : 0;
  const totalFac = base + cuotaIVA - cuotaIRPF;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["Ingresos", formatEUR(totalIngresos), "#4caf7d"], ["Gastos", formatEUR(totalGastos), "#e05252"], ["IVA a liquidar", formatEUR(ivaLiquidar), "#7eb8f5"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderTop: `2px solid ${c}`, padding: "16px 20px", borderRadius: 3 }}>
            <div style={{ fontSize: 9, color: "#333", letterSpacing: 4, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 22, color: c, fontWeight: 300 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e2e", marginBottom: 22 }}>
        {[["lista", "≋ Facturas"], ["generar", "✦ Generar con IA"], ["fiscal", "◉ Fiscal"]].map(([id, label]) => (
          <button key={id} onClick={() => { setSubtab(id); setStep("input"); }} style={{ background: "none", border: "none", color: subtab === id ? "#f0a500" : "#333", padding: "10px 22px", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", borderBottom: subtab === id ? "2px solid #f0a500" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {subtab === "lista" && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ borderBottom: "1px solid #1e1e2e" }}>{["Número", "Cliente", "Fecha", "Base", "IVA", "Total", "Estado"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 8, letterSpacing: 3, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal" }}>{h}</th>)}</tr></thead>
          <tbody>
            {facturas.map(f => (
              <tr key={f.id} style={{ borderBottom: "1px solid #0e0e18" }}>
                <td style={{ padding: "12px 14px", color: "#7eb8f5", fontFamily: "monospace", fontSize: 11 }}>{f.numero || f.numeroFactura}</td>
                <td style={{ padding: "12px 14px", color: "#ccc" }}>{typeof f.cliente === "string" ? f.cliente.split(" ").slice(0, 2).join(" ") : f.cliente?.nombre}</td>
                <td style={{ padding: "12px 14px", color: "#333", fontFamily: "monospace" }}>{f.fecha}</td>
                <td style={{ padding: "12px 14px", color: "#aaa", fontFamily: "monospace" }}>{formatEURd(f.base || f.baseImponible)}</td>
                <td style={{ padding: "12px 14px", color: "#7eb8f5", fontFamily: "monospace" }}>{formatEURd(f.iva || f.cuotaIVA)}</td>
                <td style={{ padding: "12px 14px", color: f.tipo === "ingreso" ? "#4caf7d" : "#e05252", fontFamily: "monospace", fontWeight: "bold" }}>{f.tipo === "ingreso" ? "+" : "-"}{formatEURd(f.total)}</td>
                <td style={{ padding: "12px 14px" }}><Badge label={f.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {subtab === "generar" && step === "input" && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Describe lo que quieres facturar</div>
          <p style={{ color: "#333", fontSize: 12, fontFamily: "monospace", lineHeight: 1.8, marginBottom: 20 }}>La IA genera la factura completa con todas las líneas, IVA 21% y retención IRPF 15%.</p>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Factura a Promotora Vallejo por certificación nº4 de obra Residencial Las Encinas, 42.000€ trabajos de estructura..." style={{ width: "100%", minHeight: 110, background: "#0c0c18", border: "1px solid #1e1e2e", color: "#ccc", padding: "16px", fontSize: 13, fontFamily: "monospace", resize: "vertical", outline: "none", borderRadius: 2, boxSizing: "border-box", lineHeight: 1.7 }} />
          {error && <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontSize: 11, fontFamily: "monospace", borderRadius: 2 }}>✕ {error}</div>}
          <button onClick={generar} disabled={loading || !input.trim()} style={{ marginTop: 14, background: loading ? "#1e1e2e" : "#f0a500", color: loading ? "#333" : "#08080f", border: "none", padding: "14px 36px", cursor: loading ? "not-allowed" : "pointer", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>
            {loading ? "⟳ Generando..." : "✦ Generar factura"}
          </button>
        </div>
      )}

      {subtab === "generar" && step === "preview" && factura && (
        <div style={{ maxWidth: 760 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e0d0", borderRadius: 3, padding: "40px 44px", marginBottom: 16, color: "#1a1a2e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, paddingBottom: 20, borderBottom: "2px solid #1a1a2e" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 400, marginBottom: 6 }}>{EMPRESA.nombre}</div>
                <div style={{ fontSize: 10, color: "#999", fontFamily: "monospace", lineHeight: 1.9 }}>
                  <div>{EMPRESA.cif} · {EMPRESA.tel}</div><div>{EMPRESA.direccion}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, color: "#c9a84c", fontFamily: "monospace", marginBottom: 6 }}>{factura.numeroFactura}</div>
                <div style={{ fontSize: 10, color: "#999", fontFamily: "monospace", lineHeight: 1.9 }}>
                  <div>Fecha: {factura.fecha}</div><div>Vence: {factura.fechaVencimiento}</div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Facturar a</div>
              <div style={{ fontSize: 15 }}>{factura.cliente?.nombre}</div>
              <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>{factura.obra}</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 12 }}>
              <thead><tr style={{ background: "#1a1a2e" }}>{["Descripción", "Ud.", "Cant.", "Precio", "Importe"].map((h, i) => <th key={h} style={{ padding: "9px 12px", fontSize: 8, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "normal", textAlign: i === 0 ? "left" : "right" }}>{h}</th>)}</tr></thead>
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
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe0" }}>
                    <span style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>{k}</span>
                    <span style={{ fontSize: 12, color: c, fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px", background: "#1a1a2e", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 2 }}>TOTAL</span>
                  <span style={{ fontSize: 18, color: "#f0f0ea", fontFamily: "monospace" }}>{formatEURd(totalFac)}</span>
                </div>
              </div>
            </div>
          </div>
          {factura.sugerencias?.length > 0 && (
            <div style={{ background: "#0c0c18", border: "1px solid #f0a50033", borderRadius: 2, padding: "16px 20px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>✦ Sugerencias IA</div>
              {factura.sugerencias.map((s, i) => <div key={i} style={{ fontSize: 11, color: "#555", fontFamily: "monospace", lineHeight: 1.8 }}><span style={{ color: "#f0a500" }}>→</span> {s}</div>)}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={confirmar} style={{ background: "#f0a500", color: "#08080f", border: "none", padding: "14px 36px", cursor: "pointer", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2, flex: 1 }}>✓ Confirmar y registrar</button>
            <button onClick={() => setStep("input")} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "14px 24px", cursor: "pointer", fontSize: 10, letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase", borderRadius: 2 }}>← Volver</button>
          </div>
        </div>
      )}

      {subtab === "fiscal" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {[["IVA Repercutido (ventas)", facturas.filter(f=>f.tipo==="ingreso").reduce((s,f)=>s+(f.iva||f.cuotaIVA||0),0), "#4caf7d"],
              ["IVA Soportado (compras)", facturas.filter(f=>f.tipo==="gasto").reduce((s,f)=>s+(f.iva||f.cuotaIVA||0),0), "#e05252"],
              ["Resultado IVA Modelo 303", ivaLiquidar, "#7eb8f5"],
              ["IRPF retenido total", facturas.reduce((s,f)=>s+(f.irpf||f.cuotaIRPF||0),0), "#e0a020"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ background: "#0c0c18", border: "1px solid #1e1e2e", padding: "18px 22px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>{k}</span>
                <span style={{ fontSize: 20, color: c, fontFamily: "monospace" }}>{formatEURd(v)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#0c0c18", border: "1px solid #f0a50033", borderRadius: 2, padding: "18px 22px", marginTop: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 10 }}>◈ Aviso agente IA</div>
            <p style={{ fontSize: 11, color: "#444", fontFamily: "monospace", lineHeight: 1.9, margin: 0 }}>
              IVA a liquidar este trimestre: <span style={{ color: "#7eb8f5" }}>{formatEURd(ivaLiquidar)}</span>. Datos listos para trasladar al modelo 303 y 130. Se recomienda revisión con gestoría antes de presentar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MÓDULO 5: AGENTE IA AUTÓNOMO
// ════════════════════════════════════════════════════════
const AGENT_PROMPT = `Eres un agente contable autónomo para empresa de construcción española. Extrae datos de facturas y devuelve SOLO JSON válido:
{"proveedor":"","nif":"","fecha":"DD/MM/AAAA","numeroFactura":"","concepto":"","baseImponible":0,"tipoIVA":21,"cuotaIVA":0,"tipoIRPF":15,"cuotaIRPF":0,"total":0,"tipo":"gasto","confianza":95,"alertas":[]}
Si no es factura: {"error":"No es una factura"}`;

const CORREOS = [
  { id: "c1", de: "proveedores@cementosvallejo.es", asunto: "Factura F2026-089 Mayo", t: 2000, txt: "Cementos Vallejo S.L., CIF B28456123, factura F2026-089 del 28/05/2026. Suministro cemento Portland 500 sacos obra Calle Mayor 14. Base: 4.200€. IVA 21%: 882€. Retención IRPF 15%: 630€. Total: 4.452€." },
  { id: "c2", de: "admin@gruasmadrid.com", asunto: "Fra. GM-2026-341 Grúa", t: 6000, txt: "Grúas Madrid S.A., CIF A79234561, factura GM-2026-341 del 27/05/2026. Alquiler grúa torre 30m, 15 días, obra Castellana 88. Base: 8.500€. IVA 21%: 1.785€. IRPF 15%: 1.275€. Total: 9.010€." },
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
      setFacturas(prev => [{ id: Date.now(), numero: parsed.numeroFactura, cliente: parsed.proveedor, obra: parsed.concepto, fecha: parsed.fecha, base: parsed.baseImponible, iva: parsed.cuotaIVA, irpf: parsed.cuotaIRPF, total: parsed.total, estado: "Pagada", tipo: "gasto", auto: true }, ...prev]);
      setProcesadas(n => n + 1);
      log(`💾 Registrada automáticamente`, "success");
    } catch { log(`❌ Error al procesar`, "error"); }
    setEstado("idle");
  }, [log, setFacturas]);

  const iniciar = () => {
    setActivo(true); setLogs([]); procesados.current = new Set();
    log("🚀 Agente autónomo iniciado", "success");
    log("📡 Conectado a Gmail · Supabase · Claude IA", "success");
    log("⏰ Revisando correo cada 30 segundos...", "info");
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

  const COL = { info: "#444", scan: "#7eb8f5", ai: "#f0a500", success: "#4caf7d", detail: "#333", warn: "#e07830", error: "#e05252", div: "#111" };

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 6, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 24 }}>— Agente contable autónomo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        {/* Terminal */}
        <div style={{ background: "#050510", border: "1px solid #0f0f1e", borderRadius: 3 }}>
          <div style={{ padding: "10px 18px", borderBottom: "1px solid #0f0f1e", display: "flex", alignItems: "center", gap: 8 }}>
            {["#e05252","#e0a020","#4caf7d"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
            <span style={{ marginLeft: 10, fontSize: 9, color: "#222", letterSpacing: 3 }}>TERMINAL — AGENTE LOG</span>
            {activo && <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4caf7d" }} /><span style={{ fontSize: 8, color: "#4caf7d", letterSpacing: 3 }}>LIVE</span></div>}
          </div>
          <div ref={logsRef} style={{ height: 380, overflowY: "auto", padding: "14px 18px", scrollbarWidth: "thin", scrollbarColor: "#111 #050510" }}>
            {logs.length === 0
              ? <div style={{ color: "#1a1a2e", fontSize: 11, lineHeight: 2 }}>{"$ Agente en espera..."}<br />{"$ Pulsa INICIAR para comenzar"}</div>
              : logs.map(l => l.tipo === "div"
                ? <div key={l.id} style={{ color: "#111", fontSize: 11 }}>{l.msg}</div>
                : <div key={l.id} style={{ display: "flex", gap: 10, marginBottom: 2 }}>
                    <span style={{ color: "#1a1a2e", fontSize: 9, flexShrink: 0, marginTop: 2 }}>{l.h}</span>
                    <span style={{ color: COL[l.tipo], fontSize: 11, lineHeight: 1.5 }}>{l.msg}</span>
                  </div>
              )
            }
          </div>
        </div>

        {/* Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "18px" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Control</div>
            {!activo
              ? <button onClick={iniciar} style={{ width: "100%", background: "#4caf7d", color: "#08080f", border: "none", padding: "13px", cursor: "pointer", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold", borderRadius: 2 }}>▶ INICIAR AGENTE</button>
              : <button onClick={detener} style={{ width: "100%", background: "rgba(224,82,82,0.15)", color: "#e05252", border: "1px solid rgba(224,82,82,0.3)", padding: "13px", cursor: "pointer", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace", borderRadius: 2 }}>⛔ DETENER</button>
            }
            <div style={{ fontSize: 9, color: "#222", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>{activo ? "Simulando correos entrantes" : "Detenido"}</div>
          </div>

          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "18px" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Estadísticas</div>
            {[["Procesadas hoy", procesadas, "#4caf7d"], ["Estado", estado === "idle" ? "En espera" : "Procesando", estado === "procesando" ? "#f0a500" : "#444"], ["Tiempo ahorrado", `~${procesadas * 8} min`, "#7eb8f5"]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0e0e18" }}>
                <span style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{k}</span>
                <span style={{ fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#0c0c18", border: "1px solid #1e1e2e", borderRadius: 3, padding: "18px" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Servicios</div>
            {[["Gmail API", activo], ["Claude IA", activo], ["Supabase DB", activo], ["Notificaciones", activo]].map(([n, on]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #0e0e18" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: on ? "#4caf7d" : "#222", boxShadow: on ? "0 0 8px #4caf7d" : "none" }} />
                <span style={{ fontSize: 11, color: on ? "#aaa" : "#333", fontFamily: "monospace" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// APP RAÍZ
// ════════════════════════════════════════════════════════
export default function FactuCloudPro() {
  const [tab, setTab] = useState("dashboard");
  const [obras] = useState(OBRAS_INIT);
  const [clientes] = useState(CLIENTES_INIT);
  const [facturas, setFacturas] = useState(FACTURAS_INIT);

  const TABS = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "obras", icon: "⬡", label: "Obras" },
    { id: "clientes", icon: "◉", label: "Clientes" },
    { id: "contabilidad", icon: "≋", label: "Contabilidad" },
    { id: "agente", icon: "⚡", label: "Agente IA" },
  ];

  const factAuto = facturas.filter(f => f.auto).length;

  return (
    <div style={{ minHeight: "100vh", background: "#08080f", color: "#d4d0c8", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff04 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 210, background: "#05050e", borderRight: "1px solid #111120", zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #111120" }}>
          <div style={{ fontSize: 8, letterSpacing: 5, color: "#f0a500", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>Facturación Inteligente</div>
          <div style={{ fontSize: 20, letterSpacing: 0, fontWeight: 300 }}>
            <span style={{ color: "#f0a500", fontWeight: 700 }}>Factu</span><span style={{ color: "#7eb8f5" }}>Cloud</span>
          </div>
          <div style={{ fontSize: 8, color: "#222", fontFamily: "monospace", letterSpacing: 2, marginTop: 3 }}>v1.0 · IA Integrada</div>
        </div>

        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: tab === t.id ? "#f0a50010" : "none", border: "none", borderLeft: tab === t.id ? "2px solid #f0a500" : "2px solid transparent", color: tab === t.id ? "#f0a500" : "#2a2a3a", cursor: "pointer", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", borderRadius: "0 3px 3px 0", marginBottom: 2, textAlign: "left", transition: "all .15s" }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
              {t.id === "agente" && factAuto > 0 && <span style={{ marginLeft: "auto", background: "#f0a500", color: "#08080f", fontSize: 8, padding: "2px 6px", borderRadius: 8, fontWeight: "bold" }}>{factAuto}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid #111120" }}>
          <div style={{ background: "#4caf7d10", border: "1px solid #4caf7d22", borderRadius: 3, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf7d", boxShadow: "0 0 8px #4caf7d", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9, color: "#4caf7d", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>IA Activa</div>
              <div style={{ fontSize: 9, color: "#222", fontFamily: "monospace", marginTop: 1 }}>{factAuto} facturas auto</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ marginLeft: 210, padding: "36px 36px", position: "relative", zIndex: 1, minHeight: "100vh" }}>
        {tab === "dashboard" && <Dashboard obras={obras} facturas={facturas} setTab={setTab} />}
        {tab === "obras" && <Obras obras={obras} />}
        {tab === "clientes" && <Clientes clientes={clientes} />}
        {tab === "contabilidad" && <Contabilidad facturas={facturas} setFacturas={setFacturas} />}
        {tab === "agente" && <Agente setFacturas={setFacturas} />}
      </div>

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #050510; } ::-webkit-scrollbar-thumb { background: #111120; }`}</style>
    </div>
  );
}
