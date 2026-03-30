import { useState, useEffect } from "react";
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

var EVENTO = {
  nombre: "Rumbo al Mundial Codigo 26",
  fecha: "3 de mayo de 2026",
  fechaObj: new Date(2026, 4, 3, 7, 0, 0),
  dist: "5K",
  ubicacion: "Ciclopista Rio Mayo, Cuernavaca, Morelos",
  hora: "7:00 AM",
  cupoMax: 200,
  estado: "finalizado",
  ruta: [
    { punto: "Salida", lugar: "City Market (Juan Pablo II) - Punto de reunion", km: "0.0" },
    { punto: "Tramo 1", lugar: "Sales por Av. Juan Pablo II hacia el sur", km: "0.3" },
    { punto: "Tramo 2", lugar: "Giras a la izquierda en Avenida Rio Mayo", km: "0.8" },
    { punto: "Tramo 3", lugar: "Giras a la derecha en Avenida Teopanzolco", km: "1.5" },
    { punto: "Tramo 4", lugar: "Glorieta, giras a la derecha en Calle Rio Tepozteco", km: "2.2" },
    { punto: "Tramo 5", lugar: "Continuas derecho hasta Avenida San Diego", km: "3.0" },
    { punto: "Tramo 6", lugar: "Pasas el Hospital San Diego (hidratacion)", km: "3.8" },
    { punto: "Tramo 7", lugar: "Giras a la derecha en Juan Pablo II", km: "4.3" },
    { punto: "Meta (5K)", lugar: "City Market (Juan Pablo II) - LLEGADA", km: "5.0" },
  ],
  rutaInfo: "Distancia: 5 km\nSuperficie: Calles pavimentadas\nElevacion: ~30 m\nHidratacion: Km 2.2 (glorieta) y Km 3.8 (Hospital San Diego)\nRuta cerrada con seguridad vial\nSalida y meta: City Market, Juan Pablo II",
};

var CORREDORES = [
  { id:"1", nombre:"Carlos Mendoza Rivera", dorsal:101, cat:"Varonil", tiempo:"00:18:42", pos:1, posR:1, ritmo:"3:45", splits:["0:09:15","0:18:42"], kcal:380, frase:"Primer lugar varonil! Velocidad pura." },
  { id:"2", nombre:"Diego Torres Vega", dorsal:108, cat:"Varonil", tiempo:"00:19:05", pos:2, posR:2, ritmo:"3:49", splits:["0:09:28","0:19:05"], kcal:375, frase:"Segundo lugar! Pisandole los talones." },
  { id:"3", nombre:"Roberto Hernandez Cruz", dorsal:115, cat:"Varonil", tiempo:"00:19:33", pos:3, posR:3, ritmo:"3:55", splits:["0:09:40","0:19:33"], kcal:370, frase:"Podio varonil! Experiencia y velocidad." },
  { id:"4", nombre:"Andres Gutierrez Soto", dorsal:122, cat:"Varonil", tiempo:"00:20:15", pos:5, posR:4, ritmo:"4:03", splits:["0:10:00","0:20:15"], kcal:365, frase:"Top 5 general. Gran carrera!" },
  { id:"5", nombre:"Fernando Aguilar Pena", dorsal:130, cat:"Varonil", tiempo:"00:21:48", pos:7, posR:5, ritmo:"4:22", splits:["0:10:50","0:21:48"], kcal:355, frase:"Solido! 5K con todo el corazon." },
  { id:"6", nombre:"Javier Morales Luna", dorsal:135, cat:"Varonil", tiempo:"00:22:30", pos:9, posR:6, ritmo:"4:30", splits:["0:11:10","0:22:30"], kcal:350, frase:"Cada segundo cuenta. Lo diste todo!" },
  { id:"7", nombre:"Miguel Angel Rojas", dorsal:142, cat:"Varonil", tiempo:"00:23:45", pos:11, posR:7, ritmo:"4:45", splits:["0:11:50","0:23:45"], kcal:345, frase:"5K completados. Eso es ser corredor!" },
  { id:"8", nombre:"Raul Sanchez Ortega", dorsal:150, cat:"Varonil", tiempo:"00:24:10", pos:13, posR:8, ritmo:"4:50", splits:["0:12:00","0:24:10"], kcal:340, frase:"Rumbo al Mundial! Gran esfuerzo." },
  { id:"9", nombre:"Maria Fernanda Lopez", dorsal:201, cat:"Femenil", tiempo:"00:19:58", pos:4, posR:1, ritmo:"3:60", splits:["0:09:55","0:19:58"], kcal:340, frase:"Campeona femenil! Dominaste la carrera." },
  { id:"10", nombre:"Ana Sofia Ramirez", dorsal:208, cat:"Femenil", tiempo:"00:20:44", pos:6, posR:2, ritmo:"4:09", splits:["0:10:18","0:20:44"], kcal:335, frase:"Segunda femenil! Talento imparable." },
  { id:"11", nombre:"Valentina Castro Ruiz", dorsal:215, cat:"Femenil", tiempo:"00:21:30", pos:8, posR:3, ritmo:"4:18", splits:["0:10:40","0:21:30"], kcal:330, frase:"Podio femenil! Fuerza y determinacion." },
  { id:"12", nombre:"Gabriela Rios Navarro", dorsal:220, cat:"Femenil", tiempo:"00:22:15", pos:10, posR:4, ritmo:"4:27", splits:["0:11:05","0:22:15"], kcal:325, frase:"Top 10 general. Excelente carrera!" },
  { id:"13", nombre:"Lucia Martinez Flores", dorsal:228, cat:"Femenil", tiempo:"00:23:20", pos:12, posR:5, ritmo:"4:40", splits:["0:11:35","0:23:20"], kcal:320, frase:"5K con garra. Sigue sumando!" },
  { id:"14", nombre:"Patricia Delgado Mora", dorsal:235, cat:"Femenil", tiempo:"00:25:08", pos:14, posR:6, ritmo:"5:02", splits:["0:12:30","0:25:08"], kcal:310, frase:"Cada paso cuenta. Lo lograste!" },
  { id:"15", nombre:"Camila Herrera Diaz", dorsal:240, cat:"Femenil", tiempo:"00:26:45", pos:15, posR:7, ritmo:"5:21", splits:["0:13:20","0:26:45"], kcal:305, frase:"Finisher! Tu primera carrera ya es historia." },
];

var CUPONES = [
  { id:1, titulo:"Cupon #1 - Top 10", desc:"Recompensa exclusiva para finalistas Top 10. Proximamente.", icono:"🎁", color:"#FF4D6A" },
  { id:2, titulo:"Cupon #2 - Top 10", desc:"Descuento en tienda deportiva. Proximamente.", icono:"👟", color:"#F5A623" },
  { id:3, titulo:"Cupon #3 - Top 10", desc:"Beneficio de patrocinador. Proximamente.", icono:"🏋️", color:"#00D4FF" },
  { id:4, titulo:"Cupon #4 - Top 10", desc:"Recompensa por tu desempeno. Proximamente.", icono:"🎯", color:"#10B981" },
  { id:5, titulo:"Cupon #5 - Top 10", desc:"Premio especial. Proximamente.", icono:"⭐", color:"#8B5CF6" },
];

var C = { bg:"#0A0D1B", card:"#111528", cardL:"#181D35", accent:"#FF4D6A", gold:"#F5A623", cyan:"#00D4FF", green:"#10B981", muted:"#6B7194", border:"rgba(255,255,255,0.06)", purple:"#8B5CF6" };

function Countdown(props) {
  var _s = useState({ d:0, h:0, m:0, s:0, past:false }), l = _s[0], setL = _s[1];
  useEffect(function() {
    function calc() { var d = props.target - new Date(); if (d <= 0) return setL({ d:0, h:0, m:0, s:0, past:true }); setL({ d:Math.floor(d/864e5), h:Math.floor((d%864e5)/36e5), m:Math.floor((d%36e5)/6e4), s:Math.floor((d%6e4)/1e3), past:false }); }
    calc(); var iv = setInterval(calc, 1000); return function() { clearInterval(iv); };
  }, [props.target]);
  if (l.past) return <div style={{ fontSize:14, color:C.green, fontWeight:700, textAlign:"center" }}>EVENTO FINALIZADO - Resultados disponibles</div>;
  return <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
    {[{ v:l.d, u:"DIAS" }, { v:l.h, u:"HRS" }, { v:l.m, u:"MIN" }, { v:l.s, u:"SEG" }].map(function(x) {
      return <div key={x.u} style={{ background:C.card, borderRadius:12, padding:"10px 14px", textAlign:"center", border:"0.5px solid " + C.border, minWidth:56 }}>
        <div style={{ fontSize:26, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:C.cyan }}>{String(x.v || 0).padStart(2, "0")}</div>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginTop:2 }}>{x.u}</div>
      </div>;
    })}
  </div>;
}

function MiniChart(props) {
  var splits = props.splits;
  if (!splits || splits.length < 2) return null;
  function toS(t) { var p = t.split(":").map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); }
  var s = splits.map(toS), d = s.map(function(x, i) { return i === 0 ? x : x - s[i - 1]; }), mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
  return <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:50, justifyContent:"center" }}>
    {d.map(function(v, i) { return <div key={i} style={{ width:70, height:Math.max(14, (v / mx) * 45), borderRadius:"5px 5px 2px 2px", background:v === mn ? C.green : "linear-gradient(180deg," + C.accent + "," + C.accent + "88)" }} />; })}
  </div>;
}

export default function App() {
  var _scr = useState("splash"), scr = _scr[0], setScr = _scr[1];
  var _user = useState(null), user = _user[0], setUser = _user[1];
  var _userData = useState(null), userData = _userData[0], setUserData = _userData[1];
  var _sel = useState(null), sel = _sel[0], setSel = _sel[1];
  var _tab = useState("home"), tab = _tab[0], setTab = _tab[1];
  var _search = useState(""), search = _search[0], setSearch = _search[1];
  var _ramaF = useState("Todas"), ramaF = _ramaF[0], setRamaF = _ramaF[1];
  var _form = useState({ nombre:"", apellidoP:"", apellidoM:"", correo:"", telefono:"", edad:"", genero:"", talla:"", contactoEmergencia:"", pass:"", pass2:"" }), form = _form[0], setForm = _form[1];
  var _lf = useState({ correo:"", pass:"" }), lf = _lf[0], setLf = _lf[1];
  var _err = useState(""), err = _err[0], setErr = _err[1];
  var _fade = useState(false), fade = _fade[0], setFade = _fade[1];
  var _loading = useState(true), loading = _loading[0], setLoading = _loading[1];
  var _totalInscritos = useState(CORREDORES.length), totalInscritos = _totalInscritos[0], setTotalInscritos = _totalInscritos[1];

  var evtPast = EVENTO.estado === "finalizado";

  // Escuchar estado de autenticacion de Firebase
  useEffect(function() {
    var unsub = onAuthStateChanged(auth, function(fbUser) {
      if (fbUser) {
        setUser(fbUser);
        // Cargar datos del usuario desde Firestore
        getDoc(doc(db, "usuarios", fbUser.uid)).then(function(snap) {
          if (snap.exists()) {
            setUserData(snap.data());
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return function() { unsub(); };
  }, []);

  // Contar inscritos
  useEffect(function() {
    getDocs(collection(db, "usuarios")).then(function(snap) {
      setTotalInscritos(CORREDORES.length + snap.size);
    }).catch(function() {});
  }, [userData]);

  useEffect(function() {
    if (scr === "splash") {
      setTimeout(function() { setFade(true); }, 100);
      setTimeout(function() {
        if (!loading && user && userData) { setScr("app"); }
        else { setScr("login"); }
        setFade(false);
      }, 2200);
    }
  }, [loading]);

  useEffect(function() { if (scr !== "splash") setTimeout(function() { setFade(true); }, 50); }, [scr, tab]);

  function go(s, d) { setFade(false); setTimeout(function() { setScr(s); if (d) setSel(d); }, 150); }
  function goTab(t) { setFade(false); setTimeout(function() { setTab(t); setScr("app"); }, 100); }

  function getLugaresDisp() { return Math.max(0, EVENTO.cupoMax - totalInscritos); }

  // ── REGISTRO CON FIREBASE ──
  function doReg() {
    setErr("");
    if (!form.nombre.trim() || !form.apellidoP.trim() || !form.correo.trim() || !form.pass || !form.genero) return setErr("Completa los campos obligatorios (*)");
    if (form.pass.length < 6) return setErr("La contrasena debe tener al menos 6 caracteres");
    if (form.pass !== form.pass2) return setErr("Las contrasenas no coinciden");
    if (getLugaresDisp() <= 0) return setErr("Lo sentimos, el cupo esta lleno");

    var nombreCompleto = form.nombre.trim() + " " + form.apellidoP.trim() + (form.apellidoM.trim() ? " " + form.apellidoM.trim() : "");

    createUserWithEmailAndPassword(auth, form.correo.trim(), form.pass)
      .then(function(cred) {
        var dorsal = 300 + Math.floor(Math.random() * 700);
        var datos = {
          nombre: nombreCompleto,
          correo: form.correo.trim().toLowerCase(),
          dorsal: dorsal,
          telefono: form.telefono || "",
          edad: form.edad || "",
          genero: form.genero,
          talla: form.talla || "",
          contactoEmergencia: form.contactoEmergencia || "",
          fechaReg: new Date().toLocaleDateString("es-MX"),
          evento: "Codigo 26",
        };
        return setDoc(doc(db, "usuarios", cred.user.uid), datos).then(function() {
          setUserData(datos);
          go("welcome");
        });
      })
      .catch(function(error) {
        if (error.code === "auth/email-already-in-use") setErr("Este correo ya esta registrado");
        else if (error.code === "auth/weak-password") setErr("La contrasena debe tener al menos 6 caracteres");
        else if (error.code === "auth/invalid-email") setErr("Correo electronico no valido");
        else setErr("Error al registrar: " + error.message);
      });
  }

  // ── LOGIN CON FIREBASE ──
  function doLogin() {
    setErr("");
    if (!lf.correo.trim() || !lf.pass) return setErr("Completa todos los campos");

    signInWithEmailAndPassword(auth, lf.correo.trim(), lf.pass)
      .then(function(cred) {
        return getDoc(doc(db, "usuarios", cred.user.uid)).then(function(snap) {
          if (snap.exists()) setUserData(snap.data());
          setTab("home");
          go("app");
        });
      })
      .catch(function(error) {
        if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") setErr("Correo o contrasena incorrectos");
        else if (error.code === "auth/wrong-password") setErr("Contrasena incorrecta");
        else setErr("Error: " + error.message);
      });
  }

  // ── LOGOUT ──
  function doLogout() {
    signOut(auth).then(function() {
      setUser(null);
      setUserData(null);
      go("login");
    });
  }

  var filtered = search.trim() ? CORREDORES.filter(function(c) { return c.nombre.toLowerCase().includes(search.toLowerCase()) || c.dorsal.toString().includes(search); }) : CORREDORES;
  var leaderboard = CORREDORES.filter(function(c) { return ramaF === "Todas" || c.cat === ramaF; }).sort(function(a, b) { return ramaF === "Todas" ? a.pos - b.pos : a.posR - b.posR; });
  function ini(n) { return n ? n.split(" ").map(function(x) { return x[0]; }).slice(0, 2).join("") : "?"; }
  function isTop10(c) { return c.pos <= 10; }

  function W(content) {
    return <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:C.bg, fontFamily:"'Outfit','SF Pro Display',system-ui,sans-serif", color:"#FFF", position:"relative", overflow:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />
      <div style={{ opacity:fade ? 1 : 0, transform:fade ? "translateY(0)" : "translateY(12px)", transition:"all 0.35s ease" }}>{content}</div>
    </div>;
  }

  // SPLASH
  if (scr === "splash") return W(
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:"100vh" }}>
      <div style={{ position:"absolute", top:"15%", right:"-10%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,77,106,0.15), transparent 70%)" }} />
      <div style={{ fontSize:14, fontWeight:700, color:C.accent, letterSpacing:4, marginBottom:16 }}>RUMBO AL MUNDIAL</div>
      <div style={{ fontSize:52, fontWeight:900, letterSpacing:-3 }}>CODIGO <span style={{ color:C.accent }}>26</span></div>
      <div style={{ width:60, height:3, background:C.accent, borderRadius:2, margin:"16px 0" }} />
      <div style={{ fontSize:13, color:C.muted }}>Meta 26 - Experiencia post-carrera</div>
      <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
      {loading && <div style={{ fontSize:11, color:C.muted, marginTop:20 }}>Conectando...</div>}
    </div>
  );

  // LOGIN
  if (scr === "login") return W(
    <div style={{ padding:"60px 24px 40px" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>META 26</div>
        <div style={{ fontSize:28, fontWeight:900, lineHeight:1.1 }}>Rumbo al Mundial<br /><span style={{ color:C.accent }}>Codigo 26</span></div>
        <p style={{ color:C.muted, marginTop:8, fontSize:12 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</p>
      </div>
      <label style={lbl}>Correo electronico</label>
      <input style={inp} type="email" placeholder="tu@correo.com" value={lf.correo} onChange={function(e) { setLf({ correo:e.target.value, pass:lf.pass }); }} />
      <label style={lbl}>Contrasena</label>
      <input style={inp} type="password" placeholder="Tu contrasena" value={lf.pass} onChange={function(e) { setLf({ correo:lf.correo, pass:e.target.value }); }} />
      {err && <p style={{ color:C.accent, textAlign:"center", fontSize:13 }}>{err}</p>}
      <button style={btnP} onClick={doLogin}>Iniciar sesion</button>
      <div style={{ textAlign:"center", marginTop:24 }}>
        <span style={{ color:C.muted }}>No tienes cuenta? </span>
        <span style={{ color:C.accent, fontWeight:700, cursor:"pointer" }} onClick={function() { setErr(""); go("register"); }}>Registrate aqui</span>
      </div>
    </div>
  );

  // REGISTER
  if (scr === "register") return W(
    <div style={{ padding:"36px 24px 40px", maxHeight:"100vh", overflowY:"auto" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:24, fontWeight:900 }}>Registro de corredor</div>
        <p style={{ color:C.muted, marginTop:6, fontSize:13 }}>Codigo 26 - 5K - Ciclopista Rio Mayo, Cuernavaca</p>
      </div>
      <div style={{ background:getLugaresDisp() > 50 ? "rgba(16,185,129,0.08)" : "rgba(245,166,35,0.08)", borderRadius:12, padding:"12px 16px", marginBottom:20, border:"1px solid " + (getLugaresDisp() > 50 ? "rgba(16,185,129,0.2)" : "rgba(245,166,35,0.2)"), display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><div style={{ fontSize:12, fontWeight:700, color:getLugaresDisp() > 50 ? C.green : C.gold }}>LUGARES DISPONIBLES</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{totalInscritos} de {EVENTO.cupoMax} inscritos</div></div>
        <div style={{ fontSize:28, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:getLugaresDisp() > 50 ? C.green : C.gold }}>{getLugaresDisp()}</div>
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:2, marginBottom:12 }}>DATOS PERSONALES</div>
      <label style={lbl}>Nombre(s) *</label>
      <input style={inp} placeholder="Ej: Juan Carlos" value={form.nombre} onChange={function(e) { setForm(Object.assign({}, form, { nombre:e.target.value })); }} />
      <label style={lbl}>Apellido paterno *</label>
      <input style={inp} placeholder="Ej: Perez" value={form.apellidoP} onChange={function(e) { setForm(Object.assign({}, form, { apellidoP:e.target.value })); }} />
      <label style={lbl}>Apellido materno</label>
      <input style={inp} placeholder="Opcional" value={form.apellidoM} onChange={function(e) { setForm(Object.assign({}, form, { apellidoM:e.target.value })); }} />
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}><label style={lbl}>Edad</label><input style={inp} type="number" placeholder="25" value={form.edad} onChange={function(e) { setForm(Object.assign({}, form, { edad:e.target.value })); }} /></div>
        <div style={{ flex:1 }}><label style={lbl}>Genero *</label><select style={Object.assign({}, inp, { cursor:"pointer" })} value={form.genero} onChange={function(e) { setForm(Object.assign({}, form, { genero:e.target.value })); }}><option value="">Seleccionar</option><option value="Varonil">Varonil</option><option value="Femenil">Femenil</option></select></div>
      </div>
      <label style={lbl}>Telefono</label>
      <input style={inp} type="tel" placeholder="777 123 4567" value={form.telefono} onChange={function(e) { setForm(Object.assign({}, form, { telefono:e.target.value })); }} />
      <label style={lbl}>Talla de playera</label>
      <select style={Object.assign({}, inp, { cursor:"pointer" })} value={form.talla} onChange={function(e) { setForm(Object.assign({}, form, { talla:e.target.value })); }}><option value="">Seleccionar</option><option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option></select>
      <label style={lbl}>Contacto de emergencia</label>
      <input style={inp} placeholder="Nombre y telefono" value={form.contactoEmergencia} onChange={function(e) { setForm(Object.assign({}, form, { contactoEmergencia:e.target.value })); }} />
      <div style={{ fontSize:11, fontWeight:700, color:C.cyan, letterSpacing:2, marginBottom:12, marginTop:8 }}>DATOS DE CUENTA</div>
      <label style={lbl}>Correo electronico *</label>
      <input style={inp} type="email" placeholder="tu@correo.com" value={form.correo} onChange={function(e) { setForm(Object.assign({}, form, { correo:e.target.value })); }} />
      <label style={lbl}>Contrasena * (minimo 6 caracteres)</label>
      <input style={inp} type="password" placeholder="Minimo 6 caracteres" value={form.pass} onChange={function(e) { setForm(Object.assign({}, form, { pass:e.target.value })); }} />
      <label style={lbl}>Confirmar contrasena *</label>
      <input style={inp} type="password" placeholder="Repite tu contrasena" value={form.pass2} onChange={function(e) { setForm(Object.assign({}, form, { pass2:e.target.value })); }} />
      {err && <p style={{ color:C.accent, textAlign:"center", fontSize:13, marginBottom:8 }}>{err}</p>}
      <button style={btnP} onClick={doReg}>Registrarme y obtener mi dorsal</button>
      <div style={{ textAlign:"center", marginTop:20, paddingBottom:20 }}><span style={{ color:C.muted }}>Ya tienes cuenta? </span><span style={{ color:C.accent, fontWeight:700, cursor:"pointer" }} onClick={function() { setErr(""); go("login"); }}>Inicia sesion</span></div>
    </div>
  );

  // WELCOME
  if (scr === "welcome" && userData) return W(
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:"100vh", padding:24, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <div style={{ fontSize:28, fontWeight:900, marginBottom:6 }}>Registro exitoso!</div>
      <p style={{ color:C.muted, marginBottom:28 }}>Bienvenido, {userData.nombre.split(" ")[0]}</p>
      <div style={{ background:"linear-gradient(135deg, rgba(255,77,106,0.1), rgba(255,77,106,0.03))", borderRadius:22, padding:"28px 24px", width:"100%", border:"1.5px solid rgba(255,77,106,0.2)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:10 }}>TU NUMERO DE CORREDOR</div>
        <div style={{ fontSize:68, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", letterSpacing:-3 }}>#{userData.dorsal}</div>
        <p style={{ color:C.muted, fontSize:13, marginTop:10, lineHeight:1.5 }}>Dorsal asignado para Codigo 26 - 5K<br />Ciclopista Rio Mayo, Cuernavaca, Morelos</p>
      </div>
      <div style={{ background:C.card, borderRadius:14, padding:16, width:"100%", marginTop:16, border:"0.5px solid " + C.border }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2 }}>REGISTRADO COMO</div>
        <div style={{ fontSize:17, fontWeight:700, marginTop:4 }}>{userData.nombre}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Categoria: {userData.genero}</div>
      </div>
      <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:12, padding:"12px 16px", width:"100%", marginTop:12, border:"1px solid rgba(16,185,129,0.15)" }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.green }}>Datos guardados en la nube</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Tu registro esta seguro. Puedes cerrar la app y volver a entrar con tu correo y contrasena.</div>
      </div>
      <button style={Object.assign({}, btnP, { marginTop:24, width:"100%" })} onClick={function() { setTab("home"); go("app"); }}>Entrar a la app</button>
    </div>
  );

  // RESULT
  if (scr === "result" && sel) { var c = sel; return W(
    <div style={{ padding:"0 0 40px" }}>
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}><span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span><span style={{ fontWeight:700 }}>Tu resultado</span></div>
      <div style={{ margin:"0 16px", background:"linear-gradient(135deg," + C.card + "," + C.cardL + ")", borderRadius:24, padding:24, border:"0.5px solid " + C.border }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textAlign:"center", marginBottom:12 }}>CODIGO 26 - 5K - CUERNAVACA, MORELOS</div>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:26, background:"linear-gradient(135deg," + C.accent + "," + C.gold + ")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, flexShrink:0 }}>{ini(c.nombre)}</div>
          <div><div style={{ fontSize:19, fontWeight:800 }}>{c.nombre}</div><div style={{ fontSize:13, color:C.muted }}>Dorsal #{c.dorsal} - {c.cat}</div></div>
        </div>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginBottom:6 }}>TIEMPO OFICIAL</div>
          <div style={{ fontSize:48, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", letterSpacing:-2 }}>{c.tiempo}</div>
        </div>
        <div style={{ fontSize:15, color:C.gold, fontStyle:"italic", textAlign:"center" }}>{c.frase}</div>
        {isTop10(c) && <div style={{ marginTop:12, background:"rgba(245,166,35,0.1)", borderRadius:10, padding:"8px 14px", textAlign:"center", border:"1px solid rgba(245,166,35,0.2)" }}><span style={{ fontSize:12, fontWeight:700, color:C.gold }}>Top 10! Tienes recompensas</span></div>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"16px 16px 0" }}>
        {[{ l:"Pos. general", v:"#" + c.pos, s:"de ~175", color:C.cyan, ic:"🏅" }, { l:"Pos. " + c.cat, v:"#" + c.posR, s:"Rama " + c.cat, color:C.green, ic:"📊" }, { l:"Ritmo", v:c.ritmo, s:"min/km", color:C.accent, ic:"⚡" }, { l:"Calorias", v:c.kcal, s:"Kcal", color:C.gold, ic:"🔥" }].map(function(s, i) {
          return <div key={i} style={{ background:C.card, borderRadius:16, padding:"14px 12px", border:"0.5px solid " + C.border }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:9, color:C.muted, letterSpacing:1.5, fontWeight:600 }}>{s.l.toUpperCase()}</span><span style={{ fontSize:14 }}>{s.ic}</span></div><div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.s}</div></div>;
        })}
      </div>
      <div style={{ margin:16, background:C.card, borderRadius:18, padding:"16px 14px", border:"0.5px solid " + C.border }}>
        <div style={{ fontSize:12, fontWeight:700, marginBottom:10 }}>Parciales</div>
        <MiniChart splits={c.splits} />
      </div>
      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
        <button style={btnP} onClick={function() { go("medal"); }}>Ver mi medalla digital</button>
        <button style={btnS} onClick={function() { go("cert"); }}>Descargar certificado</button>
        {isTop10(c) && <button style={Object.assign({}, btnS, { borderColor:"rgba(245,166,35,0.3)", background:"rgba(245,166,35,0.05)" })} onClick={function() { go("rewards"); }}>Ver recompensas (Top 10)</button>}
        <button style={btnS}>Compartir resultado</button>
      </div>
    </div>
  ); }

  // MEDAL
  if (scr === "medal" && sel) { var c = sel; return W(
    <div style={{ padding:"16px 20px 40px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ width:"100%", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}><span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("result"); }}>&#8592;</span><span style={{ fontWeight:700 }}>Tu medalla</span></div>
      <div style={{ fontSize:14, fontWeight:700, color:C.gold, letterSpacing:2, marginBottom:24 }}>MEDALLA DESBLOQUEADA!</div>
      <div style={{ position:"relative", marginBottom:8 }}>
        <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:240, height:240, borderRadius:120, background:"radial-gradient(circle, rgba(245,166,35,0.15), transparent 70%)" }} />
        <div style={{ width:210, height:210, borderRadius:105, background:"linear-gradient(145deg, #CD7F32, #D4A020, #F5D060)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(245,166,35,0.3)" }}>
          <div style={{ width:185, height:185, borderRadius:92, background:"linear-gradient(145deg, #D4A020, #E8C850)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,215,0,0.5)" }}>
            <div style={{ fontSize:9, fontWeight:800, color:"#5A3800", letterSpacing:2 }}>RUMBO AL MUNDIAL</div>
            <div style={{ fontSize:12, fontWeight:800, color:"#5A3800", letterSpacing:3, marginTop:2 }}>CODIGO 26</div>
            <div style={{ fontSize:34, fontWeight:900, color:"#3A2200", marginTop:4 }}>5K</div>
            <div style={{ width:40, height:2, background:"#8B6914", margin:"4px 0" }} />
            <div style={{ fontSize:10, fontWeight:800, color:"#5A3800", letterSpacing:4 }}>FINISHER</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:4, marginTop:-8, marginBottom:24 }}><div style={{ width:32, height:46, background:C.accent, borderRadius:"0 0 4px 4px", transform:"skewX(-8deg)" }} /><div style={{ width:32, height:46, background:"#E8304A", borderRadius:"0 0 4px 4px", transform:"skewX(8deg)" }} /></div>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{c.nombre}</div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Dorsal #{c.dorsal} - {c.cat}</div>
      <button style={Object.assign({}, btnP, { width:"100%" })}>Descargar medalla</button>
      <button style={Object.assign({}, btnS, { width:"100%", marginTop:10 })}>Compartir medalla</button>
    </div>
  ); }

  // CERTIFICATE
  if (scr === "cert" && sel) { var c = sel; return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}><span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("result"); }}>&#8592;</span><span style={{ fontWeight:700 }}>Certificado</span></div>
      <div style={{ background:"#FFFFF8", borderRadius:16, padding:28, textAlign:"center", position:"relative", overflow:"hidden", marginBottom:20 }}>
        <div style={{ position:"absolute", top:10, left:10, width:28, height:28, borderTop:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderTopLeftRadius:4 }} />
        <div style={{ position:"absolute", top:10, right:10, width:28, height:28, borderTop:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderTopRightRadius:4 }} />
        <div style={{ position:"absolute", bottom:10, left:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderBottomLeftRadius:4 }} />
        <div style={{ position:"absolute", bottom:10, right:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderBottomRightRadius:4 }} />
        <div style={{ fontSize:12, fontWeight:800, color:"#D4A020", letterSpacing:4, marginTop:10 }}>CERTIFICADO OFICIAL</div>
        <div style={{ width:80, height:1.5, background:"#D4A020", margin:"14px auto" }} />
        <div style={{ fontSize:9, color:"#8A8078", letterSpacing:3, marginBottom:6 }}>OTORGADO A</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#1A1208" }}>{c.nombre}</div>
        <div style={{ fontSize:16, fontWeight:800, color:"#5A4A30", marginTop:6 }}>Corredor #{c.dorsal}</div>
        <div style={{ width:50, height:1, background:"#E0D8C8", margin:"12px auto" }} />
        <div style={{ fontSize:16, fontWeight:700, color:"#3A2E1E" }}>Rumbo al Mundial<br />Codigo 26 - 5K</div>
        <div style={{ fontSize:12, color:"#8A8078", marginTop:6 }}>Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
        <div style={{ display:"flex", justifyContent:"center", gap:24, margin:"14px 0" }}>
          {[{ l:"TIEMPO", v:c.tiempo }, { l:"POSICION", v:"#" + c.pos }, { l:"RAMA", v:c.cat }].map(function(s) { return <div key={s.l}><div style={{ fontSize:8, fontWeight:700, color:"#8A8078", letterSpacing:2, marginBottom:3 }}>{s.l}</div><div style={{ fontSize:18, fontWeight:900, color:"#1A1208", fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div></div>; })}
        </div>
        <div style={{ width:80, height:1, background:"#D4A020", margin:"12px auto" }} />
        <div style={{ fontSize:11, color:"#8A8078" }}>Cuernavaca, Morelos - 3 de mayo de 2026</div>
        <div style={{ fontSize:9, color:"#B0A898", marginTop:12 }}>Folio: COD26-5K-{String(c.dorsal).padStart(4, "0")}</div>
        <div style={{ fontSize:14, fontWeight:900, color:"#D4D0C8", marginTop:8 }}>CODIGO <span style={{ color:"#E8C8A8" }}>26</span></div>
      </div>
      <button style={btnP}>Descargar certificado</button>
      <button style={Object.assign({}, btnS, { marginTop:10 })}>Compartir</button>
    </div>
  ); }

  // REWARDS
  if (scr === "rewards") { var c = sel; return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}><span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { if (c) go("result"); else go("app"); }}>&#8592;</span><span style={{ fontWeight:700 }}>Recompensas Top 10</span></div>
      <div style={{ background:"linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.03))", borderRadius:20, padding:22, textAlign:"center", marginBottom:20, border:"1px solid rgba(245,166,35,0.2)" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
        <div style={{ fontSize:18, fontWeight:900 }}>{c ? "Felicidades, " + c.nombre.split(" ")[0] + "!" : "Recompensas Top 10"}</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>Premios exclusivos adicionales a los presenciales</div>
      </div>
      {CUPONES.map(function(cup) { return <div key={cup.id} style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12, border:"0.5px solid " + C.border }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:cup.color + "18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{cup.icono}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700 }}>{cup.titulo}</div><div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{cup.desc}</div><div style={{ marginTop:8 }}><span style={{ background:"rgba(245,166,35,0.1)", color:C.gold, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>Proximamente</span></div></div>
        </div>
      </div>; })}
    </div>
  ); }

  // MAP
  if (scr === "map") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}><span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span><span style={{ fontWeight:700 }}>Mapa de la ruta</span></div>
      <div style={{ background:C.card, borderRadius:18, padding:20, border:"0.5px solid " + C.border, marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:4 }}>Rumbo al Mundial Codigo 26</div>
        <div style={{ fontSize:13, color:C.muted }}>5K - Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
      </div>
      <div style={{ position:"relative", paddingLeft:28 }}>
        {EVENTO.ruta.map(function(p, i) {
          var isF = i === 0, isL = i === EVENTO.ruta.length - 1, color = isF ? C.green : isL ? C.accent : C.cyan;
          return <div key={i} style={{ position:"relative", paddingBottom:i < EVENTO.ruta.length - 1 ? 20 : 0, paddingLeft:24 }}>
            {i < EVENTO.ruta.length - 1 && <div style={{ position:"absolute", left:8, top:20, width:2, height:"calc(100% - 8px)", background:"rgba(0,212,255,0.2)" }} />}
            <div style={{ position:"absolute", left:0, top:2, width:18, height:18, borderRadius:9, background:color, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid " + C.bg, fontSize:8 }}>{isF ? "▶" : isL ? "🏁" : ""}</div>
            <div style={{ background:C.card, borderRadius:12, padding:"10px 14px", border:"0.5px solid " + C.border }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:11, fontWeight:700, color:color }}>{p.punto}</span><span style={{ fontSize:10, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>Km {p.km}</span></div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{p.lugar}</div>
            </div>
          </div>;
        })}
      </div>
      <div style={{ background:"rgba(0,212,255,0.05)", borderRadius:14, padding:16, marginTop:20, border:"1px solid rgba(0,212,255,0.1)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.cyan, marginBottom:6 }}>Informacion de la ruta</div>
        <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, whiteSpace:"pre-line" }}>{EVENTO.rutaInfo}</div>
      </div>
    </div>
  );

  // MAIN APP TABS
  if (scr === "app" && userData) return W(
    <div style={{ paddingBottom:90 }}>
      {tab === "home" && <div style={{ padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div><div style={{ fontSize:20, fontWeight:800 }}>Hola, {userData.nombre.split(" ")[0]}</div><div style={{ fontSize:13, color:C.muted }}>Bienvenido a Codigo 26</div></div>
          <div style={{ background:"rgba(255,77,106,0.1)", borderRadius:12, padding:"8px 12px", textAlign:"center", border:"1px solid rgba(255,77,106,0.2)" }}><div style={{ fontSize:8, fontWeight:700, color:C.accent, letterSpacing:2 }}>DORSAL</div><div style={{ fontSize:20, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{userData.dorsal}</div></div>
        </div>
        <div style={{ background:"linear-gradient(135deg," + C.card + "," + C.cardL + ")", borderRadius:20, padding:20, marginBottom:16, border:"0.5px solid " + C.border }}>
          <div style={{ fontSize:10, fontWeight:700, color:evtPast ? C.green : C.gold, letterSpacing:2, marginBottom:8 }}>{evtPast ? "EVENTO FINALIZADO" : "PROXIMO EVENTO"}</div>
          <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>Rumbo al Mundial</div>
          <div style={{ fontSize:20, fontWeight:900, color:C.accent, marginBottom:12 }}>Codigo 26</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:12 }}>
            <span style={{ fontSize:12, color:C.muted }}>📅 3 de mayo 2026 - 7:00 AM</span>
            <span style={{ fontSize:12, color:C.muted }}>📍 Ciclopista Rio Mayo, Cuernavaca</span>
            <span style={{ fontSize:12, color:C.muted }}>🏃 {totalInscritos} inscritos de {EVENTO.cupoMax}</span>
            <span style={{ fontSize:12, color:C.muted }}>🏁 Salida/Meta: City Market (Juan Pablo II)</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>{["5K", "Varonil", "Femenil"].map(function(d, i) { return <span key={d} style={{ background:(i === 0 ? C.accent : C.cyan) + "15", padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:700, color:i === 0 ? C.accent : C.cyan }}>{d}</span>; })}</div>
        </div>
        <div style={{ marginBottom:16 }}><Countdown target={EVENTO.fechaObj} /></div>
        {evtPast ? <button style={btnP} onClick={function() { goTab("search"); }}>Buscar mi resultado</button> : <button style={Object.assign({}, btnP, { background:C.green })} onClick={function() { go("map"); }}>Ver mapa de la ruta</button>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12 }}>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { go("map"); }}>Mapa ruta</button>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { goTab("leaderboard"); }}>Rankings</button>
        </div>
      </div>}

      {tab === "search" && <div style={{ padding:16 }}>
        <div style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:"4px 14px", marginBottom:12, border:"1px solid " + C.border }}>
          <span style={{ fontSize:18, marginRight:10 }}>🔍</span>
          <input style={Object.assign({}, inp, { border:"none", background:"transparent", marginBottom:0, padding:"12px 0" })} placeholder="Nombre o dorsal..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
        </div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{filtered.length} corredores</div>
        {filtered.map(function(c) { return <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border, cursor:"pointer" }} onClick={function() { setSel(c); go("result"); }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:C.cyan, fontSize:13, flexShrink:0, marginRight:12 }}>{c.dorsal}</div>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:15, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nombre}</div><div style={{ fontSize:12, color:C.muted }}>{c.cat}</div></div>
          <div style={{ textAlign:"right", flexShrink:0 }}><div style={{ fontSize:15, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div><div style={{ fontSize:11, color:C.muted }}>{c.ritmo}</div></div>
        </div>; })}
      </div>}

      {tab === "leaderboard" && <div style={{ padding:16 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Ranking - Codigo 26</div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>{["Todas", "Varonil", "Femenil"].map(function(r) { return <span key={r} onClick={function() { setRamaF(r); }} style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:ramaF === r ? C.accent : C.card, color:ramaF === r ? "#FFF" : C.muted, border:"1px solid " + (ramaF === r ? C.accent : C.border) }}>{r}</span>; })}</div>
        {leaderboard.length >= 3 && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {leaderboard.slice(0, 3).map(function(c, i) { var cols = [C.gold, "#C0C0C0", "#CD7F32"], emo = ["🥇", "🥈", "🥉"]; return <div key={c.id} style={{ background:cols[i] + "18", borderRadius:16, padding:14, textAlign:"center", border:"1px solid " + cols[i] + "44", cursor:"pointer" }} onClick={function() { setSel(c); go("result"); }}>
            <div style={{ fontSize:28, marginBottom:4 }}>{emo[i]}</div><div style={{ fontSize:12, fontWeight:600, marginBottom:6, lineHeight:1.3, minHeight:32 }}>{c.nombre.split(" ").slice(0, 2).join(" ")}</div><div style={{ fontSize:14, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div><div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{c.cat}</div>
          </div>; })}
        </div>}
        {leaderboard.slice(3).map(function(c) { var ps = ramaF === "Todas" ? c.pos : c.posR; return <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border, cursor:"pointer" }} onClick={function() { setSel(c); go("result"); }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,77,106,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, flexShrink:0, marginRight:12 }}>#{ps}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700 }}>{c.nombre}</div><div style={{ fontSize:12, color:C.muted }}>{c.cat}</div></div>
          <div style={{ fontSize:15, fontWeight:800, fontFamily:"'JetBrains Mono',monospace" }}>{c.tiempo}</div>
        </div>; })}
      </div>}

      {tab === "profile" && <div style={{ padding:20 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:80, height:80, borderRadius:40, background:"linear-gradient(135deg," + C.accent + "," + C.gold + ")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, margin:"0 auto 12px" }}>{ini(userData.nombre)}</div>
          <div style={{ fontSize:22, fontWeight:800 }}>{userData.nombre}</div>
          <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>{userData.correo}</div>
        </div>
        <div style={{ background:"rgba(255,77,106,0.08)", borderRadius:18, padding:24, textAlign:"center", marginBottom:16, border:"1px solid rgba(255,77,106,0.15)" }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>MI DORSAL - CODIGO 26</div>
          <div style={{ fontSize:48, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{userData.dorsal}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>5K - Ciclopista Rio Mayo, Cuernavaca</div>
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Datos de la cuenta</div>
          {[["Nombre", userData.nombre], ["Correo", userData.correo], ["Dorsal", "#" + userData.dorsal], ["Genero", userData.genero || "-"], ["Telefono", userData.telefono || "-"], ["Talla", userData.talla || "-"], ["Evento", "Codigo 26 - 5K"]].map(function(row) { return <div key={row[0]} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"0.5px solid " + C.border }}><span style={{ fontSize:13, color:C.muted }}>{row[0]}</span><span style={{ fontSize:13, fontWeight:600, textAlign:"right", maxWidth:"55%" }}>{row[1]}</span></div>; })}
        </div>
        <div style={{ background:"rgba(16,185,129,0.06)", borderRadius:12, padding:12, marginBottom:16, border:"1px solid rgba(16,185,129,0.12)" }}>
          <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>Tus datos estan guardados en Firebase</div>
          <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>Puedes cerrar la app y volver a entrar con tu correo y contrasena sin perder nada.</div>
        </div>
        <button style={{ width:"100%", padding:16, borderRadius:14, background:"rgba(255,77,106,0.04)", border:"1px solid rgba(255,77,106,0.2)", color:C.accent, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }} onClick={doLogout}>Cerrar sesion</button>
      </div>}

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.bg, borderTop:"0.5px solid " + C.border, display:"flex", justifyContent:"space-around", padding:"10px 0 24px", zIndex:100 }}>
        {[{ id:"home", e:"🏠", l:"Inicio" }, { id:"search", e:"🔍", l:"Buscar" }, { id:"leaderboard", e:"🏆", l:"Rankings" }, { id:"profile", e:"👤", l:"Perfil" }].map(function(t) {
          return <div key={t.id} onClick={function() { goTab(t.id); }} style={{ textAlign:"center", cursor:"pointer", flex:1 }}><div style={{ fontSize:22, opacity:tab === t.id ? 1 : 0.4 }}>{t.e}</div><div style={{ fontSize:10, marginTop:4, fontWeight:600, color:tab === t.id ? C.accent : C.muted }}>{t.l}</div></div>;
        })}
      </div>
    </div>
  );

  return W(<div style={{ padding:40, textAlign:"center" }}><p style={{ color:C.muted }}>Cargando...</p></div>);
}

var lbl = { display:"block", fontSize:13, fontWeight:600, color:"#6B7194", marginBottom:8, marginLeft:4 };
var inp = { width:"100%", background:"rgba(255,255,255,0.05)", borderRadius:14, padding:16, fontSize:16, color:"#FFF", border:"1px solid rgba(255,255,255,0.08)", outline:"none", boxSizing:"border-box", marginBottom:18, fontFamily:"inherit" };
var btnP = { width:"100%", padding:18, borderRadius:14, background:"#FF4D6A", color:"#FFF", fontSize:16, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit" };
var btnS = { width:"100%", padding:16, borderRadius:14, background:"rgba(255,255,255,0.04)", color:"#FFF", fontSize:16, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", fontFamily:"inherit" };
