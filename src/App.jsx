import { useState, useEffect } from "react";

const EVENTO = {
  nombre: "Rumbo al Mundial Codigo 26",
  fecha: "3 de mayo de 2026",
  fechaObj: new Date(2026, 4, 3, 7, 0, 0),
  dist: "5K",
  ubicacion: "Ciclopista Rio Mayo, Cuernavaca, Morelos",
  hora: "7:00 AM",
  totalCorredores: "150 - 200 aprox.",
  estado: "finalizado",
  ruta: [
    { punto: "Salida", lugar: "Entrada principal Ciclopista Rio Mayo" },
    { punto: "Km 1", lugar: "Tramo norte - zona arbolada junto al rio" },
    { punto: "Km 2", lugar: "Curva del puente - punto de hidratacion" },
    { punto: "Km 3", lugar: "Tramo sur paralelo al Rio Mayo" },
    { punto: "Km 4", lugar: "Vuelta de retorno - zona de porras" },
    { punto: "Meta (5K)", lugar: "Entrada principal Ciclopista Rio Mayo - Llegada" },
  ],
  rutaInfo: "Distancia: 5 km\nSuperficie: 100% pavimentada (ciclopista)\nElevacion: ~25 m (terreno plano)\nHidratacion: Km 2 y Km 4\nCircuito cerrado, seguro y sin trafico vehicular",
};

const CORREDORES = [
  { id:1, nombre:"Carlos Mendoza Rivera", dorsal:101, cat:"Varonil", tiempo:"00:18:42", pos:1, posR:1, ritmo:"3:45", splits:["0:09:15","0:18:42"], kcal:380, frase:"Primer lugar varonil! Velocidad pura." },
  { id:2, nombre:"Diego Torres Vega", dorsal:108, cat:"Varonil", tiempo:"00:19:05", pos:2, posR:2, ritmo:"3:49", splits:["0:09:28","0:19:05"], kcal:375, frase:"Segundo lugar! Pisandole los talones al primero." },
  { id:3, nombre:"Roberto Hernandez Cruz", dorsal:115, cat:"Varonil", tiempo:"00:19:33", pos:3, posR:3, ritmo:"3:55", splits:["0:09:40","0:19:33"], kcal:370, frase:"Podio varonil! Experiencia y velocidad." },
  { id:4, nombre:"Andres Gutierrez Soto", dorsal:122, cat:"Varonil", tiempo:"00:20:15", pos:5, posR:4, ritmo:"4:03", splits:["0:10:00","0:20:15"], kcal:365, frase:"Top 5 general. Gran carrera!" },
  { id:5, nombre:"Fernando Aguilar Pena", dorsal:130, cat:"Varonil", tiempo:"00:21:48", pos:7, posR:5, ritmo:"4:22", splits:["0:10:50","0:21:48"], kcal:355, frase:"Solido! 5K con todo el corazon." },
  { id:6, nombre:"Javier Morales Luna", dorsal:135, cat:"Varonil", tiempo:"00:22:30", pos:9, posR:6, ritmo:"4:30", splits:["0:11:10","0:22:30"], kcal:350, frase:"Cada segundo cuenta. Lo diste todo!" },
  { id:7, nombre:"Miguel Angel Rojas", dorsal:142, cat:"Varonil", tiempo:"00:23:45", pos:11, posR:7, ritmo:"4:45", splits:["0:11:50","0:23:45"], kcal:345, frase:"5K completados. Eso es ser corredor!" },
  { id:8, nombre:"Raul Sanchez Ortega", dorsal:150, cat:"Varonil", tiempo:"00:24:10", pos:13, posR:8, ritmo:"4:50", splits:["0:12:00","0:24:10"], kcal:340, frase:"Rumbo al Mundial! Gran esfuerzo." },
  { id:9, nombre:"Maria Fernanda Lopez", dorsal:201, cat:"Femenil", tiempo:"00:19:58", pos:4, posR:1, ritmo:"3:60", splits:["0:09:55","0:19:58"], kcal:340, frase:"Campeona femenil! Dominaste la carrera." },
  { id:10, nombre:"Ana Sofia Ramirez", dorsal:208, cat:"Femenil", tiempo:"00:20:44", pos:6, posR:2, ritmo:"4:09", splits:["0:10:18","0:20:44"], kcal:335, frase:"Segunda femenil! Talento imparable." },
  { id:11, nombre:"Valentina Castro Ruiz", dorsal:215, cat:"Femenil", tiempo:"00:21:30", pos:8, posR:3, ritmo:"4:18", splits:["0:10:40","0:21:30"], kcal:330, frase:"Podio femenil! Fuerza y determinacion." },
  { id:12, nombre:"Gabriela Rios Navarro", dorsal:220, cat:"Femenil", tiempo:"00:22:15", pos:10, posR:4, ritmo:"4:27", splits:["0:11:05","0:22:15"], kcal:325, frase:"Top 10 general. Excelente carrera!" },
  { id:13, nombre:"Lucia Martinez Flores", dorsal:228, cat:"Femenil", tiempo:"00:23:20", pos:12, posR:5, ritmo:"4:40", splits:["0:11:35","0:23:20"], kcal:320, frase:"5K con garra. Sigue sumando!" },
  { id:14, nombre:"Patricia Delgado Mora", dorsal:235, cat:"Femenil", tiempo:"00:25:08", pos:14, posR:6, ritmo:"5:02", splits:["0:12:30","0:25:08"], kcal:310, frase:"Cada paso cuenta. Lo lograste!" },
  { id:15, nombre:"Camila Herrera Diaz", dorsal:240, cat:"Femenil", tiempo:"00:26:45", pos:15, posR:7, ritmo:"5:21", splits:["0:13:20","0:26:45"], kcal:305, frase:"Finisher! Tu primera carrera ya es historia." },
];

const CUPONES = [
  { id:1, titulo:"Cupon #1 - Top 10", desc:"Recompensa exclusiva para finalistas Top 10. Detalles proximamente.", icono:"🎁", color:"#FF4D6A" },
  { id:2, titulo:"Cupon #2 - Top 10", desc:"Descuento especial en tienda deportiva. Detalles proximamente.", icono:"👟", color:"#F5A623" },
  { id:3, titulo:"Cupon #3 - Top 10", desc:"Beneficio exclusivo de patrocinador. Detalles proximamente.", icono:"🏋️", color:"#00D4FF" },
  { id:4, titulo:"Cupon #4 - Top 10", desc:"Recompensa por tu desempeno. Detalles proximamente.", icono:"🎯", color:"#10B981" },
  { id:5, titulo:"Cupon #5 - Top 10", desc:"Premio especial para los mejores. Detalles proximamente.", icono:"⭐", color:"#8B5CF6" },
];

const C = { bg:"#0A0D1B", card:"#111528", cardL:"#181D35", accent:"#FF4D6A", gold:"#F5A623", cyan:"#00D4FF", green:"#10B981", muted:"#6B7194", border:"rgba(255,255,255,0.06)", purple:"#8B5CF6" };

let regUsers = [];
let nextDorsal = 301;

function Countdown({ target }) {
  const [l, setL] = useState({ d:0, h:0, m:0, s:0, past:false });
  useEffect(() => {
    const calc = () => {
      const d = target - new Date();
      if (d <= 0) return setL({ d:0, h:0, m:0, s:0, past:true });
      setL({ d:Math.floor(d/864e5), h:Math.floor((d%864e5)/36e5), m:Math.floor((d%36e5)/6e4), s:Math.floor((d%6e4)/1e3), past:false });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [target]);
  if (l.past) return <div style={{ fontSize:14, color:C.green, fontWeight:700, textAlign:"center" }}>EVENTO FINALIZADO - Resultados disponibles</div>;
  return (
    <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
      {[{ v:l.d, u:"DIAS" }, { v:l.h, u:"HRS" }, { v:l.m, u:"MIN" }, { v:l.s, u:"SEG" }].map(x => (
        <div key={x.u} style={{ background:C.card, borderRadius:12, padding:"10px 14px", textAlign:"center", border:"0.5px solid " + C.border, minWidth:56 }}>
          <div style={{ fontSize:26, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:C.cyan }}>{String(x.v || 0).padStart(2, "0")}</div>
          <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginTop:2 }}>{x.u}</div>
        </div>
      ))}
    </div>
  );
}

function MiniChart({ splits }) {
  if (!splits || splits.length < 2) return null;
  const toS = t => { const p = t.split(":").map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); };
  const s = splits.map(toS);
  const d = s.map((x, i) => i === 0 ? x : x - s[i - 1]);
  const mx = Math.max(...d);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:50, justifyContent:"center" }}>
      {d.map((v, i) => (
        <div key={i} style={{ width:70, height:Math.max(14, (v / mx) * 45), borderRadius:"5px 5px 2px 2px", background:v === Math.min(...d) ? C.green : "linear-gradient(180deg," + C.accent + "," + C.accent + "88)" }} />
      ))}
    </div>
  );
}

export default function App() {
  const [scr, setScr] = useState("splash");
  const [user, setUser] = useState(null);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");
  const [ramaF, setRamaF] = useState("Todas");
  const [form, setForm] = useState({ nombre:"", apellidoP:"", apellidoM:"", correo:"", telefono:"", edad:"", genero:"", pass:"", pass2:"" });
  const [lf, setLf] = useState({ correo:"", pass:"" });
  const [err, setErr] = useState("");
  const [fade, setFade] = useState(false);

  const evtPast = EVENTO.estado === "finalizado";

  useEffect(() => {
    if (scr === "splash") {
      setTimeout(() => setFade(true), 100);
      setTimeout(() => { setScr("login"); setFade(false); }, 2200);
    }
  }, []);

  useEffect(() => {
    if (scr !== "splash") setTimeout(() => setFade(true), 50);
  }, [scr, tab]);

  const go = (s, d) => { setFade(false); setTimeout(() => { setScr(s); if (d) setSel(d); }, 150); };
  const goTab = (t) => { setFade(false); setTimeout(() => { setTab(t); setScr("app"); }, 100); };

  const doReg = () => {
    setErr("");
    if (!form.nombre.trim() || !form.apellidoP.trim() || !form.correo.trim() || !form.pass) return setErr("Completa los campos obligatorios");
    if (form.pass.length < 4) return setErr("La contrasena debe tener al menos 4 caracteres");
    if (form.pass !== form.pass2) return setErr("Las contrasenas no coinciden");
    if (regUsers.find(u => u.correo === form.correo.toLowerCase())) return setErr("Correo ya registrado");
    const d = nextDorsal++;
    const nombreCompleto = form.nombre.trim() + " " + form.apellidoP.trim() + (form.apellidoM.trim() ? " " + form.apellidoM.trim() : "");
    const u = { nombre:nombreCompleto, correo:form.correo.toLowerCase(), pass:form.pass, dorsal:d, telefono:form.telefono, edad:form.edad, genero:form.genero, fechaReg:new Date().toLocaleDateString("es-MX") };
    regUsers.push(u);
    setUser(u);
    go("welcome");
  };

  const doLogin = () => {
    setErr("");
    const f = regUsers.find(u => u.correo === lf.correo.toLowerCase() && u.pass === lf.pass);
    if (!f) return setErr("Correo o contrasena incorrectos");
    setUser(f);
    setTab("home");
    go("app");
  };

  const filtered = search.trim() ? CORREDORES.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.dorsal.toString().includes(search)) : CORREDORES;
  const leaderboard = CORREDORES.filter(c => ramaF === "Todas" || c.cat === ramaF).sort((a, b) => ramaF === "Todas" ? a.pos - b.pos : a.posR - b.posR);
  const ini = (n) => n.split(" ").map(x => x[0]).slice(0, 2).join("");
  const isTop10 = (c) => c.pos <= 10;

  const sty = { maxWidth:430, margin:"0 auto", minHeight:"100vh", background:C.bg, fontFamily:"'Outfit','SF Pro Display',system-ui,sans-serif", color:"#FFF", position:"relative", overflow:"hidden" };

  const W = (content) => (
    <div style={sty}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />
      <div style={{ opacity:fade ? 1 : 0, transform:fade ? "translateY(0)" : "translateY(12px)", transition:"all 0.35s ease" }}>{content}</div>
    </div>
  );

  // SPLASH
  if (scr === "splash") return W(
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh" }}>
      <div style={{ position:"absolute", top:"15%", right:"-10%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,77,106,0.15), transparent 70%)" }} />
      <div style={{ fontSize:14, fontWeight:700, color:C.accent, letterSpacing:4, marginBottom:16 }}>RUMBO AL MUNDIAL</div>
      <div style={{ fontSize:58, fontWeight:900, letterSpacing:-3 }}>CODIGO <span style={{ color:C.accent }}>26</span></div>
      <div style={{ width:60, height:3, background:C.accent, borderRadius:2, margin:"16px 0" }} />
      <div style={{ fontSize:13, color:C.muted }}>Meta 26 - Experiencia post-carrera</div>
      <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
    </div>
  );

  // LOGIN
  if (scr === "login") return W(
    <div style={{ padding:"60px 24px 40px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>META 26</div>
        <div style={{ fontSize:30, fontWeight:900, lineHeight:1.1 }}>Rumbo al Mundial<br /><span style={{ color:C.accent }}>Codigo 26</span></div>
        <p style={{ color:C.muted, marginTop:8, fontSize:12 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</p>
        <p style={{ color:C.muted, fontSize:13, marginTop:4 }}>Inicia sesion para acceder al evento</p>
      </div>
      <label style={lbl}>Correo electronico</label>
      <input style={inp} type="email" placeholder="tu@correo.com" value={lf.correo} onChange={e => setLf({ ...lf, correo:e.target.value })} />
      <label style={lbl}>Contrasena</label>
      <input style={inp} type="password" placeholder="Tu contrasena" value={lf.pass} onChange={e => setLf({ ...lf, pass:e.target.value })} />
      {err && <p style={{ color:C.accent, textAlign:"center", fontSize:13 }}>{err}</p>}
      <button style={btnP} onClick={doLogin}>Iniciar sesion</button>
      <div style={{ textAlign:"center", marginTop:24 }}>
        <span style={{ color:C.muted }}>No tienes cuenta? </span>
        <span style={{ color:C.accent, fontWeight:700, cursor:"pointer" }} onClick={() => { setErr(""); go("register"); }}>Registrate aqui</span>
      </div>
    </div>
  );

  // REGISTER
  if (scr === "register") return W(
    <div style={{ padding:"40px 24px 40px", maxHeight:"100vh", overflowY:"auto" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:26, fontWeight:900 }}>Registro de corredor</div>
        <p style={{ color:C.muted, marginTop:6, fontSize:13, lineHeight:1.5 }}>Completa tus datos para Rumbo al Mundial Codigo 26 en Ciclopista Rio Mayo, Cuernavaca, Morelos</p>
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:C.accent, letterSpacing:2, marginBottom:12 }}>DATOS PERSONALES</div>
      <label style={lbl}>Nombre(s) *</label>
      <input style={inp} placeholder="Ej: Juan Carlos" value={form.nombre} onChange={e => setForm({ ...form, nombre:e.target.value })} />
      <label style={lbl}>Apellido paterno *</label>
      <input style={inp} placeholder="Ej: Perez" value={form.apellidoP} onChange={e => setForm({ ...form, apellidoP:e.target.value })} />
      <label style={lbl}>Apellido materno</label>
      <input style={inp} placeholder="Opcional" value={form.apellidoM} onChange={e => setForm({ ...form, apellidoM:e.target.value })} />
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}>
          <label style={lbl}>Edad</label>
          <input style={inp} type="number" placeholder="25" value={form.edad} onChange={e => setForm({ ...form, edad:e.target.value })} />
        </div>
        <div style={{ flex:1 }}>
          <label style={lbl}>Genero *</label>
          <select style={{ ...inp, cursor:"pointer" }} value={form.genero} onChange={e => setForm({ ...form, genero:e.target.value })}>
            <option value="">Seleccionar</option>
            <option value="Varonil">Varonil</option>
            <option value="Femenil">Femenil</option>
          </select>
        </div>
      </div>
      <label style={lbl}>Telefono</label>
      <input style={inp} type="tel" placeholder="777 123 4567 (opcional)" value={form.telefono} onChange={e => setForm({ ...form, telefono:e.target.value })} />
      <div style={{ fontSize:12, fontWeight:700, color:C.cyan, letterSpacing:2, marginBottom:12, marginTop:8 }}>DATOS DE CUENTA</div>
      <label style={lbl}>Correo electronico *</label>
      <input style={inp} type="email" placeholder="tu@correo.com" value={form.correo} onChange={e => setForm({ ...form, correo:e.target.value })} />
      <label style={lbl}>Contrasena *</label>
      <input style={inp} type="password" placeholder="Minimo 4 caracteres" value={form.pass} onChange={e => setForm({ ...form, pass:e.target.value })} />
      <label style={lbl}>Confirmar contrasena *</label>
      <input style={inp} type="password" placeholder="Repite tu contrasena" value={form.pass2} onChange={e => setForm({ ...form, pass2:e.target.value })} />
      {err && <p style={{ color:C.accent, textAlign:"center", fontSize:13, marginBottom:8 }}>{err}</p>}
      <button style={btnP} onClick={doReg}>Registrarme y obtener mi dorsal</button>
      <div style={{ textAlign:"center", marginTop:20, paddingBottom:20 }}>
        <span style={{ color:C.muted }}>Ya tienes cuenta? </span>
        <span style={{ color:C.accent, fontWeight:700, cursor:"pointer" }} onClick={() => { setErr(""); go("login"); }}>Inicia sesion</span>
      </div>
    </div>
  );

  // WELCOME
  if (scr === "welcome") return W(
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:"100vh", padding:24, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <div style={{ fontSize:28, fontWeight:900, marginBottom:6 }}>Registro exitoso!</div>
      <p style={{ color:C.muted, marginBottom:28 }}>Bienvenido a Codigo 26, {user && user.nombre.split(" ")[0]}</p>
      <div style={{ background:"linear-gradient(135deg, rgba(255,77,106,0.1), rgba(255,77,106,0.03))", borderRadius:22, padding:"28px 24px", width:"100%", border:"1.5px solid rgba(255,77,106,0.2)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:10 }}>TU NUMERO DE CORREDOR</div>
        <div style={{ fontSize:68, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", letterSpacing:-3 }}>#{user && user.dorsal}</div>
        <p style={{ color:C.muted, fontSize:13, marginTop:10, lineHeight:1.5 }}>Dorsal asignado para Codigo 26 - 5K<br />Ciclopista Rio Mayo, Cuernavaca, Morelos</p>
      </div>
      <div style={{ background:C.card, borderRadius:14, padding:16, width:"100%", marginTop:16, border:"0.5px solid " + C.border }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2 }}>REGISTRADO COMO</div>
        <div style={{ fontSize:17, fontWeight:700, marginTop:4 }}>{user && user.nombre}</div>
        {user && user.genero && <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Categoria: {user.genero}</div>}
      </div>
      <button style={{ ...btnP, marginTop:28, width:"100%" }} onClick={() => { setTab("home"); go("app"); }}>Entrar a la app</button>
    </div>
  );

  // RESULT
  if (scr === "result" && sel) {
    var c = sel;
    return W(
      <div style={{ padding:"0 0 40px" }}>
        <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => go("app")}>&#8592;</span>
          <span style={{ fontWeight:700 }}>Tu resultado</span>
        </div>
        <div style={{ margin:"0 16px", background:"linear-gradient(135deg," + C.card + "," + C.cardL + ")", borderRadius:24, padding:24, border:"0.5px solid " + C.border, position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textAlign:"center", marginBottom:12 }}>CODIGO 26 - 5K - CICLOPISTA RIO MAYO</div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{ width:52, height:52, borderRadius:26, background:"linear-gradient(135deg," + C.accent + "," + C.gold + ")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, flexShrink:0 }}>{ini(c.nombre)}</div>
            <div>
              <div style={{ fontSize:19, fontWeight:800 }}>{c.nombre}</div>
              <div style={{ fontSize:13, color:C.muted }}>Dorsal #{c.dorsal} - {c.cat}</div>
            </div>
          </div>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginBottom:6 }}>TIEMPO OFICIAL</div>
            <div style={{ fontSize:52, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", letterSpacing:-2 }}>{c.tiempo}</div>
          </div>
          <div style={{ fontSize:15, color:C.gold, fontStyle:"italic", textAlign:"center", lineHeight:1.5 }}>{c.frase}</div>
          {isTop10(c) && <div style={{ marginTop:12, background:"rgba(245,166,35,0.1)", borderRadius:10, padding:"8px 14px", textAlign:"center", border:"1px solid rgba(245,166,35,0.2)" }}><span style={{ fontSize:12, fontWeight:700, color:C.gold }}>Top 10! Tienes recompensas disponibles</span></div>}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"16px 16px 0" }}>
          {[
            { l:"Pos. general", v:"#" + c.pos, s:"de ~175", color:C.cyan, ic:"🏅" },
            { l:"Pos. " + c.cat, v:"#" + c.posR, s:"Rama " + c.cat, color:C.green, ic:"📊" },
            { l:"Ritmo", v:c.ritmo, s:"min/km", color:C.accent, ic:"⚡" },
            { l:"Calorias", v:c.kcal, s:"Kcal", color:C.gold, ic:"🔥" },
          ].map(function(s, i) {
            return (
              <div key={i} style={{ background:C.card, borderRadius:16, padding:"16px 14px", border:"0.5px solid " + C.border }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:10, color:C.muted, letterSpacing:1.5, fontWeight:600 }}>{s.l.toUpperCase()}</span>
                  <span style={{ fontSize:16 }}>{s.ic}</span>
                </div>
                <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ margin:16, background:C.card, borderRadius:18, padding:"18px 16px", border:"0.5px solid " + C.border }}>
          <div style={{ fontSize:12, fontWeight:700, marginBottom:12 }}>Parciales</div>
          <MiniChart splits={c.splits} />
          <div style={{ display:"flex", justifyContent:"space-around", marginTop:8 }}>
            {c.splits.map(function(sp, i) { return <div key={i} style={{ textAlign:"center" }}><div style={{ fontSize:9, color:C.muted }}>Km {i === 0 ? "2.5" : "5"}</div><div style={{ fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{sp}</div></div>; })}
          </div>
        </div>
        <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
          <button style={btnP} onClick={() => go("medal")}>Ver mi medalla digital</button>
          <button style={btnS} onClick={() => go("cert")}>Descargar certificado</button>
          {isTop10(c) && <button style={{ ...btnS, borderColor:"rgba(245,166,35,0.3)", background:"rgba(245,166,35,0.05)" }} onClick={() => go("rewards")}>Ver mis recompensas (Top 10)</button>}
          <button style={btnS}>Compartir resultado</button>
        </div>
      </div>
    );
  }

  // MEDAL
  if (scr === "medal" && sel) {
    var c = sel;
    return W(
      <div style={{ padding:"16px 20px 40px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:"100%", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => go("result")}>&#8592;</span>
          <span style={{ fontWeight:700 }}>Tu medalla</span>
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:C.gold, letterSpacing:2, marginBottom:24 }}>MEDALLA DESBLOQUEADA!</div>
        <div style={{ position:"relative", marginBottom:8 }}>
          <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:240, height:240, borderRadius:120, background:"radial-gradient(circle, rgba(245,166,35,0.15), transparent 70%)" }} />
          <div style={{ width:210, height:210, borderRadius:105, background:"linear-gradient(145deg, #CD7F32, #D4A020, #F5D060)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(245,166,35,0.3)" }}>
            <div style={{ width:185, height:185, borderRadius:92, background:"linear-gradient(145deg, #D4A020, #E8C850)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,215,0,0.5)" }}>
              <div style={{ fontSize:9, fontWeight:800, color:"#5A3800", letterSpacing:2 }}>RUMBO AL MUNDIAL</div>
              <div style={{ fontSize:12, fontWeight:800, color:"#5A3800", letterSpacing:3, marginTop:2 }}>CODIGO 26</div>
              <div style={{ fontSize:34, fontWeight:900, color:"#3A2200", marginTop:4 }}>5K</div>
              <div style={{ width:40, height:2, background:"#8B6914", margin:"4px 0", borderRadius:1 }} />
              <div style={{ fontSize:10, fontWeight:800, color:"#5A3800", letterSpacing:4 }}>FINISHER</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4, marginTop:-8, marginBottom:24 }}>
          <div style={{ width:32, height:46, background:C.accent, borderRadius:"0 0 4px 4px", transform:"skewX(-8deg)" }} />
          <div style={{ width:32, height:46, background:"#E8304A", borderRadius:"0 0 4px 4px", transform:"skewX(8deg)" }} />
        </div>
        <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{c.nombre}</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Dorsal #{c.dorsal} - {c.cat}</div>
        <div style={{ display:"flex", gap:16, background:C.card, borderRadius:16, padding:16, width:"100%", justifyContent:"center", marginBottom:16 }}>
          {[{ l:"TIEMPO", v:c.tiempo }, { l:"POS. GENERAL", v:"#" + c.pos }, { l:"POS. " + c.cat.toUpperCase(), v:"#" + c.posR }].map(function(s) { return <div key={s.l} style={{ textAlign:"center" }}><div style={{ fontSize:9, color:C.muted, letterSpacing:1.5, marginBottom:4 }}>{s.l}</div><div style={{ fontSize:16, fontWeight:800, color:C.cyan, fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div></div>; })}
        </div>
        <div style={{ background:"rgba(245,166,35,0.08)", borderRadius:14, padding:16, width:"100%", border:"1px solid rgba(245,166,35,0.15)", marginBottom:20 }}>
          <p style={{ color:C.gold, fontStyle:"italic", textAlign:"center", lineHeight:1.5, margin:0 }}>{c.frase}</p>
        </div>
        <button style={{ ...btnP, width:"100%" }}>Descargar medalla</button>
        <button style={{ ...btnS, width:"100%", marginTop:10 }}>Compartir medalla</button>
      </div>
    );
  }

  // CERTIFICATE
  if (scr === "cert" && sel) {
    var c = sel;
    return W(
      <div style={{ padding:"16px 20px 40px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => go("result")}>&#8592;</span>
          <span style={{ fontWeight:700 }}>Certificado</span>
        </div>
        <div style={{ background:"#FFFFF8", borderRadius:16, padding:28, textAlign:"center", position:"relative", overflow:"hidden", marginBottom:20 }}>
          <div style={{ position:"absolute", top:10, left:10, width:28, height:28, borderTop:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderTopLeftRadius:4 }} />
          <div style={{ position:"absolute", top:10, right:10, width:28, height:28, borderTop:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderTopRightRadius:4 }} />
          <div style={{ position:"absolute", bottom:10, left:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderBottomLeftRadius:4 }} />
          <div style={{ position:"absolute", bottom:10, right:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderBottomRightRadius:4 }} />
          <div style={{ fontSize:12, fontWeight:800, color:"#D4A020", letterSpacing:4, marginTop:10 }}>CERTIFICADO OFICIAL</div>
          <div style={{ width:80, height:1.5, background:"#D4A020", margin:"14px auto" }} />
          <div style={{ fontSize:9, fontWeight:700, color:"#8A8078", letterSpacing:3, marginBottom:6 }}>OTORGADO A</div>
          <div style={{ fontSize:24, fontWeight:900, color:"#1A1208", lineHeight:1.3 }}>{c.nombre}</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#5A4A30", marginTop:8 }}>Dorsal #{c.dorsal}</div>
          <div style={{ width:50, height:1, background:"#E0D8C8", margin:"12px auto" }} />
          <div style={{ fontSize:9, fontWeight:700, color:"#8A8078", letterSpacing:3, marginBottom:6 }}>POR COMPLETAR EXITOSAMENTE</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#3A2E1E", lineHeight:1.4 }}>Rumbo al Mundial<br />Codigo 26 - 5K</div>
          <div style={{ fontSize:12, color:"#8A8078", marginTop:6 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
          <div style={{ display:"flex", justifyContent:"center", gap:24, margin:"16px 0" }}>
            {[{ l:"TIEMPO", v:c.tiempo }, { l:"POS. GENERAL", v:"#" + c.pos }, { l:"POS. " + c.cat.toUpperCase(), v:"#" + c.posR }].map(function(s) { return <div key={s.l}><div style={{ fontSize:8, fontWeight:700, color:"#8A8078", letterSpacing:2, marginBottom:3 }}>{s.l}</div><div style={{ fontSize:20, fontWeight:900, color:"#1A1208", fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div></div>; })}
          </div>
          <div style={{ width:80, height:1, background:"#D4A020", margin:"12px auto" }} />
          <div style={{ fontSize:11, color:"#8A8078" }}>Cuernavaca, Morelos - 3 de mayo de 2026</div>
          <div style={{ margin:"16px auto 0", width:160, borderTop:"1px solid #3A2E1E", paddingTop:6 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#3A2E1E" }}>Comite Organizador</div>
            <div style={{ fontSize:9, color:"#8A8078", marginTop:2 }}>Rumbo al Mundial Codigo 26</div>
          </div>
          <div style={{ fontSize:9, color:"#B0A898", marginTop:12 }}>Folio: COD26-5K-{String(c.dorsal).padStart(4, "0")}</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#D4D0C8", marginTop:8 }}>CODIGO <span style={{ color:"#E8C8A8" }}>26</span></div>
        </div>
        <button style={btnP}>Descargar certificado</button>
        <button style={{ ...btnS, marginTop:10 }}>Compartir certificado</button>
      </div>
    );
  }

  // REWARDS
  if (scr === "rewards") {
    var c = sel;
    return W(
      <div style={{ padding:"16px 20px 40px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => { if (c) go("result"); else go("app"); }}>&#8592;</span>
          <span style={{ fontWeight:700 }}>Recompensas Top 10</span>
        </div>
        <div style={{ background:"linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.03))", borderRadius:20, padding:22, textAlign:"center", marginBottom:20, border:"1px solid rgba(245,166,35,0.2)" }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
          <div style={{ fontSize:20, fontWeight:900 }}>{c ? "Felicidades, " + c.nombre.split(" ")[0] + "!" : "Recompensas Top 10"}</div>
          {c && <div style={{ fontSize:14, color:C.muted, marginTop:6 }}>Posicion <span style={{ color:C.gold, fontWeight:800 }}>#{c.pos}</span> general</div>}
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Descuentos y premios exclusivos para los 10 primeros lugares, adicionales a los premios presenciales</div>
        </div>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Tus cupones y descuentos</div>
        {CUPONES.map(function(cup) {
          return (
            <div key={cup.id} style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12, border:"0.5px solid " + C.border }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:50, height:50, borderRadius:14, background:cup.color + "18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, border:"1px solid " + cup.color + "30" }}>{cup.icono}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{cup.titulo}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.4 }}>{cup.desc}</div>
                  <div style={{ marginTop:8 }}>
                    <span style={{ background:"rgba(245,166,35,0.1)", color:C.gold, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, border:"1px solid rgba(245,166,35,0.2)" }}>Proximamente</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // MAP
  if (scr === "map") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => go("app")}>&#8592;</span>
        <span style={{ fontWeight:700 }}>Mapa de la ruta</span>
      </div>
      <div style={{ background:C.card, borderRadius:18, padding:20, border:"0.5px solid " + C.border, marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:4 }}>Rumbo al Mundial Codigo 26</div>
        <div style={{ fontSize:13, color:C.muted }}>5K - Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
      </div>
      <div style={{ position:"relative", paddingLeft:28 }}>
        {EVENTO.ruta.map(function(p, i) {
          var isF = i === 0, isL = i === EVENTO.ruta.length - 1;
          var color = isF ? C.green : isL ? C.accent : C.cyan;
          return (
            <div key={i} style={{ position:"relative", paddingBottom:i < EVENTO.ruta.length - 1 ? 24 : 0, paddingLeft:24 }}>
              {i < EVENTO.ruta.length - 1 && <div style={{ position:"absolute", left:8, top:20, width:2, height:"calc(100% - 8px)", background:"rgba(0,212,255,0.2)" }} />}
              <div style={{ position:"absolute", left:0, top:2, width:18, height:18, borderRadius:9, background:color, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid " + C.bg }}>
                {isF && <span style={{ fontSize:8 }}>&#9654;</span>}
                {isL && <span style={{ fontSize:8 }}>🏁</span>}
              </div>
              <div style={{ background:C.card, borderRadius:12, padding:"12px 14px", border:"0.5px solid " + C.border }}>
                <div style={{ fontSize:11, fontWeight:700, color:color, letterSpacing:1 }}>{p.punto}</div>
                <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{p.lugar}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background:"rgba(0,212,255,0.05)", borderRadius:14, padding:16, marginTop:20, border:"1px solid rgba(0,212,255,0.1)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.cyan, marginBottom:6 }}>Informacion de la ruta</div>
        <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, whiteSpace:"pre-line" }}>{EVENTO.rutaInfo}</div>
      </div>
    </div>
  );

  // EVENTS
  if (scr === "events") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:22, cursor:"pointer" }} onClick={() => go("app")}>&#8592;</span>
        <span style={{ fontWeight:700 }}>Mis carreras</span>
      </div>
      <div style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12, border:"1px solid rgba(16,185,129,0.2)", cursor:"pointer" }} onClick={() => go("app")}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:700, color:C.green, letterSpacing:2 }}>{evtPast ? "FINALIZADO" : "PROXIMO"}</span>
          <span style={{ background:"rgba(255,77,106,0.1)", padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:C.accent }}>5K</span>
        </div>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:4 }}>Rumbo al Mundial Codigo 26</div>
        <div style={{ fontSize:13, color:C.muted }}>3 mayo 2026 - Ciclopista Rio Mayo, Cuernavaca</div>
      </div>
      <div style={{ background:C.card, borderRadius:16, padding:22, textAlign:"center", border:"1px dashed " + C.border, marginTop:8 }}>
        <div style={{ fontSize:32, marginBottom:8, opacity:0.4 }}>🏃</div>
        <div style={{ fontSize:14, fontWeight:700, color:C.muted }}>Proximas carreras</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:6, lineHeight:1.5 }}>Aqui apareceran las nuevas carreras cuando se registren en Meta 26.</div>
      </div>
    </div>
  );

  // MAIN APP TABS
  if (scr === "app") return W(
    <div style={{ paddingBottom:90 }}>
      {tab === "home" && (
        <div style={{ padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:800 }}>Hola, {user && user.nombre.split(" ")[0]}</div>
              <div style={{ fontSize:13, color:C.muted }}>Bienvenido a Codigo 26</div>
            </div>
            <div style={{ background:"rgba(255,77,106,0.1)", borderRadius:12, padding:"8px 12px", textAlign:"center", border:"1px solid rgba(255,77,106,0.2)" }}>
              <div style={{ fontSize:8, fontWeight:700, color:C.accent, letterSpacing:2 }}>DORSAL</div>
              <div style={{ fontSize:20, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{user && user.dorsal}</div>
            </div>
          </div>
          <div style={{ background:"linear-gradient(135deg," + C.card + "," + C.cardL + ")", borderRadius:20, padding:22, marginBottom:16, border:"0.5px solid " + C.border }}>
            <div style={{ fontSize:10, fontWeight:700, color:evtPast ? C.green : C.gold, letterSpacing:2, marginBottom:8 }}>{evtPast ? "EVENTO FINALIZADO" : "PROXIMO EVENTO"}</div>
            <div style={{ fontSize:22, fontWeight:900, marginBottom:4, lineHeight:1.2 }}>Rumbo al Mundial</div>
            <div style={{ fontSize:22, fontWeight:900, color:C.accent, marginBottom:12 }}>Codigo 26</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
              <span style={{ fontSize:13, color:C.muted }}>📅 3 de mayo de 2026 - 7:00 AM</span>
              <span style={{ fontSize:13, color:C.muted }}>📍 Ciclopista Rio Mayo, Cuernavaca, Morelos</span>
              <span style={{ fontSize:13, color:C.muted }}>🏃 150 - 200 corredores aprox.</span>
              <span style={{ fontSize:13, color:C.muted }}>📏 5 kilometros</span>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ background:"rgba(255,77,106,0.1)", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700, color:C.accent, border:"1px solid rgba(255,77,106,0.2)" }}>5K</span>
              <span style={{ background:"rgba(0,212,255,0.08)", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700, color:C.cyan, border:"1px solid rgba(0,212,255,0.15)" }}>Varonil</span>
              <span style={{ background:"rgba(255,77,106,0.08)", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700, color:C.accent, border:"1px solid rgba(255,77,106,0.15)" }}>Femenil</span>
            </div>
          </div>
          <div style={{ marginBottom:16 }}><Countdown target={EVENTO.fechaObj} /></div>
          {evtPast ? <button style={btnP} onClick={() => goTab("search")}>Buscar mi resultado</button> : <button style={{ ...btnP, background:C.green }} onClick={() => go("map")}>Ver mapa de la ruta</button>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12 }}>
            <button style={{ ...btnS, margin:0 }} onClick={() => go("map")}>Mapa ruta</button>
            <button style={{ ...btnS, margin:0 }} onClick={() => goTab("leaderboard")}>Rankings</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
            <button style={{ ...btnS, margin:0 }} onClick={() => go("events")}>Mis carreras</button>
            <button style={{ ...btnS, margin:0, borderColor:"rgba(245,166,35,0.2)", background:"rgba(245,166,35,0.03)" }} onClick={() => { setSel(null); go("rewards"); }}>Recompensas</button>
          </div>
        </div>
      )}

      {tab === "search" && (
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:"4px 14px", marginBottom:12, border:"1px solid " + C.border }}>
            <span style={{ fontSize:18, marginRight:10 }}>🔍</span>
            <input style={{ ...inp, border:"none", background:"transparent", marginBottom:0, padding:"12px 0" }} placeholder="Nombre o dorsal..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{filtered.length} corredores</div>
          {filtered.map(function(c) {
            return (
              <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border, cursor:"pointer" }} onClick={() => { setSel(c); go("result"); }}>
                <div style={{ width:46, height:46, borderRadius:12, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:C.cyan, fontSize:13, flexShrink:0, marginRight:12 }}>{c.dorsal}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nombre}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{c.cat} - #{c.dorsal}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{c.ritmo} min/km</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "leaderboard" && (
        <div style={{ padding:16 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Ranking - Codigo 26 - Ciclopista Rio Mayo</div>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {["Todas", "Varonil", "Femenil"].map(function(r) {
              return <span key={r} onClick={() => setRamaF(r)} style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:ramaF === r ? C.accent : C.card, color:ramaF === r ? "#FFF" : C.muted, border:"1px solid " + (ramaF === r ? C.accent : C.border) }}>{r}</span>;
            })}
          </div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{leaderboard.length} corredores{ramaF !== "Todas" ? " - Rama " + ramaF : ""}</div>
          {leaderboard.length >= 3 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
              {leaderboard.slice(0, 3).map(function(c, i) {
                var cols = [C.gold, "#C0C0C0", "#CD7F32"];
                var emo = ["🥇", "🥈", "🥉"];
                var pl = ramaF === "Todas" ? "#" + c.pos + " Gral" : "#" + c.posR + " " + c.cat;
                return (
                  <div key={c.id} style={{ background:cols[i] + "18", borderRadius:16, padding:14, textAlign:"center", border:"1px solid " + cols[i] + "44", cursor:"pointer" }} onClick={() => { setSel(c); go("result"); }}>
                    <div style={{ fontSize:28, marginBottom:4 }}>{emo[i]}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:cols[i], marginBottom:4 }}>{pl}</div>
                    <div style={{ fontSize:12, fontWeight:600, marginBottom:6, lineHeight:1.3, minHeight:32 }}>{c.nombre.split(" ").slice(0, 2).join(" ")}</div>
                    <div style={{ fontSize:14, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{c.cat}</div>
                  </div>
                );
              })}
            </div>
          )}
          {leaderboard.slice(3).map(function(c) {
            var ps = ramaF === "Todas" ? c.pos : c.posR;
            return (
              <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border, cursor:"pointer" }} onClick={() => { setSel(c); go("result"); }}>
                <div style={{ width:46, height:46, borderRadius:12, background:"rgba(255,77,106,0.08)", border:"1px solid rgba(255,77,106,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, flexShrink:0, marginRight:12 }}>#{ps}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nombre}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{c.cat}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{c.ritmo} min/km</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "profile" && (
        <div style={{ padding:20 }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ width:80, height:80, borderRadius:40, background:"linear-gradient(135deg," + C.accent + "," + C.gold + ")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, margin:"0 auto 12px" }}>{user ? ini(user.nombre) : "?"}</div>
            <div style={{ fontSize:22, fontWeight:800 }}>{user && user.nombre}</div>
            <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>{user && user.correo}</div>
          </div>
          <div style={{ background:"rgba(255,77,106,0.08)", borderRadius:18, padding:24, textAlign:"center", marginBottom:16, border:"1px solid rgba(255,77,106,0.15)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>MI DORSAL - CODIGO 26</div>
            <div style={{ fontSize:52, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{user && user.dorsal}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>5K - Ciclopista Rio Mayo, Cuernavaca</div>
          </div>
          <div style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Datos de la cuenta</div>
            {[["Nombre", user && user.nombre], ["Correo", user && user.correo], ["Dorsal", "#" + (user && user.dorsal)], ["Genero", (user && user.genero) || "-"], ["Telefono", (user && user.telefono) || "-"], ["Evento", "Codigo 26 - 5K"], ["Ubicacion", "Ciclopista Rio Mayo, Cuernavaca"]].map(function(row) {
              return (
                <div key={row[0]} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"0.5px solid " + C.border }}>
                  <span style={{ fontSize:13, color:C.muted }}>{row[0]}</span>
                  <span style={{ fontSize:13, fontWeight:600, textAlign:"right", maxWidth:"55%" }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
          <button style={{ ...btnS, margin:0, marginBottom:12 }} onClick={() => go("events")}>Mis carreras registradas</button>
          <button style={{ width:"100%", padding:16, borderRadius:14, background:"rgba(255,77,106,0.04)", border:"1px solid rgba(255,77,106,0.2)", color:C.accent, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }} onClick={() => { setUser(null); go("login"); }}>Cerrar sesion</button>
        </div>
      )}

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.bg, borderTop:"0.5px solid " + C.border, display:"flex", justifyContent:"space-around", padding:"10px 0 24px", zIndex:100 }}>
        {[{ id:"home", e:"🏠", l:"Inicio" }, { id:"search", e:"🔍", l:"Buscar" }, { id:"leaderboard", e:"🏆", l:"Rankings" }, { id:"profile", e:"👤", l:"Perfil" }].map(function(t) {
          return (
            <div key={t.id} onClick={() => goTab(t.id)} style={{ textAlign:"center", cursor:"pointer", flex:1 }}>
              <div style={{ fontSize:22, opacity:tab === t.id ? 1 : 0.4 }}>{t.e}</div>
              <div style={{ fontSize:10, marginTop:4, fontWeight:600, color:tab === t.id ? C.accent : C.muted }}>{t.l}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return W(<div style={{ padding:40, textAlign:"center" }}><p>Cargando...</p></div>);
}

var lbl = { display:"block", fontSize:13, fontWeight:600, color:"#6B7194", marginBottom:8, marginLeft:4 };
var inp = { width:"100%", background:"rgba(255,255,255,0.05)", borderRadius:14, padding:16, fontSize:16, color:"#FFF", border:"1px solid rgba(255,255,255,0.08)", outline:"none", boxSizing:"border-box", marginBottom:18, fontFamily:"inherit" };
var btnP = { width:"100%", padding:18, borderRadius:14, background:"#FF4D6A", color:"#FFF", fontSize:16, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit" };
var btnS = { width:"100%", padding:16, borderRadius:14, background:"rgba(255,255,255,0.04)", color:"#FFF", fontSize:16, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", fontFamily:"inherit" };
