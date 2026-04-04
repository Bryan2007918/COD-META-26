import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";

var EVENTO = {
  nombre: "Rumbo al Mundial Codigo 26",
  fecha: "3 de mayo de 2026",
  fechaObj: new Date(2026, 4, 3, 7, 0, 0),
  dist: "5K",
  ubicacion: "Ciclopista Rio Mayo, Cuernavaca, Morelos",
  hora: "7:00 AM",
  cupoMax: 200,
  estado: "proximo",
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

var CUPONES = [
  { id:1, titulo:"Cupon #1 - Top 10", desc:"Recompensa exclusiva para Top 10 varonil y femenil. Proximamente.", icono:"🎁", color:"#FF4D6A" },
  { id:2, titulo:"Cupon #2 - Top 10", desc:"Descuento en tienda deportiva. Proximamente.", icono:"👟", color:"#F5A623" },
  { id:3, titulo:"Cupon #3 - Top 10", desc:"Beneficio de patrocinador. Proximamente.", icono:"🏋️", color:"#00D4FF" },
  { id:4, titulo:"Cupon #4 - Top 10", desc:"Recompensa por tu desempeno. Proximamente.", icono:"🎯", color:"#10B981" },
  { id:5, titulo:"Cupon #5 - Top 10", desc:"Premio especial de la organizacion. Proximamente.", icono:"⭐", color:"#8B5CF6" },
];

var C = { bg:"#0A0D1B", card:"#111528", cardL:"#181D35", accent:"#FF4D6A", gold:"#F5A623", cyan:"#00D4FF", green:"#10B981", muted:"#6B7194", border:"rgba(255,255,255,0.06)", purple:"#8B5CF6" };

function padT(n) { return String(n).padStart(2, "0"); }

function secsToTime(s) {
  var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return padT(h) + ":" + padT(m) + ":" + padT(ss);
}

function timeToSecs(t) {
  if (!t) return 0;
  var p = t.split(":").map(Number);
  return p[0] * 3600 + p[1] * 60 + (p[2] || 0);
}

function calcRitmo(timeStr, km) {
  var s = timeToSecs(timeStr);
  if (!s || !km) return "-";
  var minPerKm = (s / 60) / km;
  var m = Math.floor(minPerKm), ss = Math.round((minPerKm - m) * 60);
  return m + ":" + padT(ss);
}

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

// Cronometro en vivo
function Cronometro(props) {
  var _t = useState(0), elapsed = _t[0], setElapsed = _t[1];
  var _running = useState(false), running = _running[0], setRunning = _running[1];
  var startRef = useRef(null);
  var ivRef = useRef(null);

  function start() {
    startRef.current = Date.now() - elapsed * 1000;
    ivRef.current = setInterval(function() {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    setRunning(true);
  }

  function stop() {
    clearInterval(ivRef.current);
    setRunning(false);
  }

  function reset() {
    clearInterval(ivRef.current);
    setRunning(false);
    setElapsed(0);
  }

  useEffect(function() { return function() { clearInterval(ivRef.current); }; }, []);

  var timeStr = secsToTime(elapsed);

  return <div style={{ background:C.card, borderRadius:20, padding:24, textAlign:"center", border:"0.5px solid " + C.border, marginBottom:16 }}>
    <div style={{ fontSize:11, fontWeight:700, color:C.cyan, letterSpacing:3, marginBottom:12 }}>CRONOMETRO</div>
    <div style={{ fontSize:52, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:running ? C.green : C.cyan, marginBottom:20 }}>{timeStr}</div>
    <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:16 }}>
      {!running ? (
        <button style={{ padding:"12px 28px", borderRadius:12, background:C.green, color:"#FFF", fontWeight:700, border:"none", cursor:"pointer", fontSize:15 }} onClick={start}>▶ Iniciar</button>
      ) : (
        <button style={{ padding:"12px 28px", borderRadius:12, background:C.accent, color:"#FFF", fontWeight:700, border:"none", cursor:"pointer", fontSize:15 }} onClick={stop}>⏸ Pausar</button>
      )}
      <button style={{ padding:"12px 20px", borderRadius:12, background:"rgba(255,255,255,0.06)", color:"#FFF", fontWeight:700, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontSize:15 }} onClick={reset}>↺</button>
    </div>
    {!running && elapsed > 0 && (
      <button style={{ width:"100%", padding:14, borderRadius:12, background:C.accent, color:"#FFF", fontWeight:800, border:"none", cursor:"pointer", fontSize:15 }} onClick={function() { props.onGuardar(timeStr); }}>
        ✅ Registrar este tiempo ({timeStr})
      </button>
    )}
  </div>;
}

// Rastreo GPS tipo Strava
function RastreoGPS(props) {
  var _tracking = useState(false), tracking = _tracking[0], setTracking = _tracking[1];
  var _puntos = useState([]), puntos = _puntos[0], setPuntos = _puntos[1];
  var _distancia = useState(0), distancia = _distancia[0], setDistancia = _distancia[1];
  var _elapsed = useState(0), elapsed = _elapsed[0], setElapsed = _elapsed[1];
  var _error = useState(""), error = _error[0], setError = _error[1];
  var watchRef = useRef(null);
  var ivRef = useRef(null);
  var startTimeRef = useRef(null);

  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function iniciar() {
    if (!navigator.geolocation) return setError("Tu dispositivo no soporta GPS");
    setError("");
    setPuntos([]);
    setDistancia(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    ivRef.current = setInterval(function() {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    watchRef.current = navigator.geolocation.watchPosition(
      function(pos) {
        var nuevo = { lat: pos.coords.latitude, lng: pos.coords.longitude, t: Date.now() };
        setPuntos(function(prev) {
          if (prev.length > 0) {
            var ultimo = prev[prev.length - 1];
            var d = haversine(ultimo.lat, ultimo.lng, nuevo.lat, nuevo.lng);
            if (d > 3) {
              setDistancia(function(pd) { return pd + d; });
              return [...prev, nuevo];
            }
            return prev;
          }
          return [nuevo];
        });
      },
      function(err) { setError("Error GPS: " + err.message); },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    setTracking(true);
  }

  function detener() {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    clearInterval(ivRef.current);
    setTracking(false);
  }

  useEffect(function() { return function() { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); clearInterval(ivRef.current); }; }, []);

  var km = distancia / 1000;
  var ritmo = calcRitmo(secsToTime(elapsed), km || 1);
  var timeStr = secsToTime(elapsed);

  return <div style={{ padding:"16px 20px 40px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
      <span style={{ fontSize:22, cursor:"pointer" }} onClick={props.onBack}>&#8592;</span>
      <span style={{ fontWeight:700, fontSize:18 }}>Rastreo GPS</span>
    </div>

    {/* Metricas en vivo */}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
      {[
        { l:"DISTANCIA", v:km.toFixed(2), u:"km", color:C.cyan },
        { l:"TIEMPO", v:timeStr, u:"", color:C.green },
        { l:"RITMO", v:ritmo, u:"min/km", color:C.gold },
      ].map(function(s) {
        return <div key={s.l} style={{ background:C.card, borderRadius:14, padding:"12px 8px", textAlign:"center", border:"0.5px solid " + C.border }}>
          <div style={{ fontSize:8, color:C.muted, letterSpacing:1.5, fontWeight:700, marginBottom:4 }}>{s.l}</div>
          <div style={{ fontSize:s.l === "TIEMPO" ? 14 : 20, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:s.color }}>{s.v}</div>
          {s.u && <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{s.u}</div>}
        </div>;
      })}
    </div>

    {/* Mapa simplificado con puntos */}
    <div style={{ background:C.card, borderRadius:16, padding:16, marginBottom:16, border:"0.5px solid " + C.border, minHeight:180, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      {puntos.length === 0 ? (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📍</div>
          <div style={{ fontSize:13, color:C.muted }}>{tracking ? "Esperando senal GPS..." : "Presiona Iniciar para comenzar"}</div>
        </div>
      ) : (
        <div style={{ width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:13, color:C.green, fontWeight:700, marginBottom:8 }}>📍 {puntos.length} puntos registrados</div>
          <div style={{ fontSize:11, color:C.muted }}>Lat: {puntos[puntos.length-1].lat.toFixed(5)}</div>
          <div style={{ fontSize:11, color:C.muted }}>Lng: {puntos[puntos.length-1].lng.toFixed(5)}</div>
          <div style={{ marginTop:12, display:"flex", justifyContent:"center", gap:4, flexWrap:"wrap" }}>
            {puntos.slice(-20).map(function(p, i) {
              return <div key={i} style={{ width:8, height:8, borderRadius:4, background:i === puntos.slice(-20).length - 1 ? C.accent : C.cyan, opacity: 0.4 + (i / puntos.slice(-20).length) * 0.6 }} />;
            })}
          </div>
        </div>
      )}
    </div>

    {error && <div style={{ background:"rgba(255,77,106,0.1)", borderRadius:10, padding:12, marginBottom:12, border:"1px solid rgba(255,77,106,0.2)", fontSize:12, color:C.accent }}>{error}</div>}

    {!tracking ? (
      <button style={{ width:"100%", padding:18, borderRadius:14, background:C.green, color:"#FFF", fontSize:16, fontWeight:800, border:"none", cursor:"pointer" }} onClick={iniciar}>
        📍 Iniciar rastreo GPS
      </button>
    ) : (
      <button style={{ width:"100%", padding:18, borderRadius:14, background:C.accent, color:"#FFF", fontSize:16, fontWeight:800, border:"none", cursor:"pointer" }} onClick={detener}>
        ⏹ Detener rastreo
      </button>
    )}

    {!tracking && puntos.length > 0 && (
      <div style={{ marginTop:12, background:"rgba(16,185,129,0.08)", borderRadius:12, padding:14, border:"1px solid rgba(16,185,129,0.15)", textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.green }}>Actividad completada</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{km.toFixed(2)} km · {timeStr} · Ritmo {ritmo} min/km</div>
        <button style={{ marginTop:10, padding:"10px 20px", borderRadius:10, background:C.accent, color:"#FFF", fontWeight:700, border:"none", cursor:"pointer", fontSize:13 }} onClick={function() { props.onGuardarActividad({ km: km.toFixed(2), tiempo: timeStr, ritmo: ritmo, puntos: puntos.length }); }}>
          Guardar actividad
        </button>
      </div>
    )}
  </div>;
}

export default function App() {
  var _scr = useState("splash"), scr = _scr[0], setScr = _scr[1];
  var _user = useState(null), user = _user[0], setUser = _user[1];
  var _userData = useState(null), userData = _userData[0], setUserData = _userData[1];
  var _tab = useState("home"), tab = _tab[0], setTab = _tab[1];
  var _search = useState(""), search = _search[0], setSearch = _search[1];
  var _ramaF = useState("Todas"), ramaF = _ramaF[0], setRamaF = _ramaF[1];
  var _form = useState({ nombre:"", apellidoP:"", apellidoM:"", correo:"", telefono:"", edad:"", genero:"", talla:"", contactoEmergencia:"", pass:"", pass2:"" }), form = _form[0], setForm = _form[1];
  var _lf = useState({ correo:"", pass:"" }), lf = _lf[0], setLf = _lf[1];
  var _err = useState(""), err = _err[0], setErr = _err[1];
  var _fade = useState(false), fade = _fade[0], setFade = _fade[1];
  var _loading = useState(true), loading = _loading[0], setLoading = _loading[1];
  var _splashDone = useState(false), splashDone = _splashDone[0], setSplashDone = _splashDone[1];
  var _corredores = useState([]), corredores = _corredores[0], setCorredores = _corredores[1];
  var _loadingC = useState(true), loadingC = _loadingC[0], setLoadingC = _loadingC[1];
  var _msgGuardar = useState(""), msgGuardar = _msgGuardar[0], setMsgGuardar = _msgGuardar[1];

  var evtPast = EVENTO.estado === "finalizado";

  function cargarCorredores() {
    getDocs(collection(db, "usuarios")).then(function(snap) {
      var lista = [];
      snap.forEach(function(d) { lista.push(Object.assign({ id: d.id }, d.data())); });
      lista.sort(function(a, b) {
        if (a.tiempo && b.tiempo) return timeToSecs(a.tiempo) - timeToSecs(b.tiempo);
        if (a.tiempo) return -1;
        if (b.tiempo) return 1;
        return 0;
      });
      lista = lista.map(function(c, i) { return Object.assign({}, c, { pos: i + 1 }); });
      setCorredores(lista);
      setLoadingC(false);
    }).catch(function() { setLoadingC(false); });
  }

  useEffect(function() { cargarCorredores(); }, []);

  useEffect(function() {
    var unsub = onAuthStateChanged(auth, function(fbUser) {
      if (fbUser) {
        setUser(fbUser);
        getDoc(doc(db, "usuarios", fbUser.uid)).then(function(snap) {
          if (snap.exists()) setUserData(snap.data());
          setLoading(false);
        });
      } else { setUser(null); setUserData(null); setLoading(false); }
    });
    return function() { unsub(); };
  }, []);

  useEffect(function() {
    var t = setTimeout(function() { setSplashDone(true); }, 2500);
    setTimeout(function() { setFade(true); }, 100);
    return function() { clearTimeout(t); };
  }, []);

  useEffect(function() {
    if (splashDone && !loading) {
      setFade(false);
      setTimeout(function() {
        if (user && userData) { setScr("app"); } else { setScr("login"); }
        setTimeout(function() { setFade(true); }, 50);
      }, 300);
    }
  }, [splashDone, loading]);

  useEffect(function() { if (scr !== "splash") setTimeout(function() { setFade(true); }, 50); }, [scr, tab]);

  function go(s) { setFade(false); setTimeout(function() { setScr(s); }, 150); }
  function goTab(t) { setFade(false); setTimeout(function() { setTab(t); setScr("app"); }, 100); }
  function getLugaresDisp() { return Math.max(0, EVENTO.cupoMax - corredores.length); }
  function ini(n) { return n ? n.split(" ").map(function(x) { return x[0]; }).slice(0, 2).join("") : "?"; }

  // Calcular posicion por rama
  function getPosRama(corredor) {
    var rama = corredor.genero;
    var mismaRama = corredores.filter(function(c) { return c.genero === rama && c.tiempo; }).sort(function(a, b) { return timeToSecs(a.tiempo) - timeToSecs(b.tiempo); });
    var idx = mismaRama.findIndex(function(c) { return c.id === corredor.id; });
    return idx >= 0 ? idx + 1 : 0;
  }

  function isTop10Rama(corredor) {
    if (!corredor.tiempo) return false;
    return getPosRama(corredor) <= 10;
  }

  // Guardar tiempo del corredor
  function guardarTiempo(tiempo) {
    if (!user) return;
    setMsgGuardar("Guardando...");
    updateDoc(doc(db, "usuarios", user.uid), { tiempo: tiempo }).then(function() {
      setUserData(function(prev) { return Object.assign({}, prev, { tiempo: tiempo }); });
      cargarCorredores();
      setMsgGuardar("");
      go("certificado");
    }).catch(function() { setMsgGuardar("Error al guardar"); });
  }

  function guardarActividad(datos) {
    if (!user) return;
    updateDoc(doc(db, "usuarios", user.uid), { ultimaActividad: datos }).then(function() {
      setUserData(function(prev) { return Object.assign({}, prev, { ultimaActividad: datos }); });
      setMsgGuardar("Actividad guardada!");
      setTimeout(function() { setMsgGuardar(""); }, 3000);
    }).catch(function() {});
  }

  function doReg() {
    setErr("");
    if (!form.nombre.trim() || !form.apellidoP.trim() || !form.correo.trim() || !form.pass || !form.genero) return setErr("Completa los campos obligatorios (*)");
    if (form.pass.length < 6) return setErr("La contrasena debe tener al menos 6 caracteres");
    if (form.pass !== form.pass2) return setErr("Las contrasenas no coinciden");
    if (getLugaresDisp() <= 0) return setErr("Lo sentimos, el cupo esta lleno");
    var nombreCompleto = form.nombre.trim() + " " + form.apellidoP.trim() + (form.apellidoM.trim() ? " " + form.apellidoM.trim() : "");
    createUserWithEmailAndPassword(auth, form.correo.trim(), form.pass)
      .then(function(cred) {
        var dorsal = 100 + corredores.length + 1;
        var datos = { nombre: nombreCompleto, correo: form.correo.trim().toLowerCase(), dorsal: dorsal, telefono: form.telefono || "", edad: form.edad || "", genero: form.genero, talla: form.talla || "", contactoEmergencia: form.contactoEmergencia || "", fechaReg: new Date().toLocaleDateString("es-MX"), evento: "Codigo 26", tiempo: "", pos: 0 };
        return setDoc(doc(db, "usuarios", cred.user.uid), datos).then(function() { setUserData(datos); cargarCorredores(); go("welcome"); });
      })
      .catch(function(error) {
        if (error.code === "auth/email-already-in-use") setErr("Este correo ya esta registrado");
        else if (error.code === "auth/weak-password") setErr("La contrasena debe tener al menos 6 caracteres");
        else if (error.code === "auth/invalid-email") setErr("Correo electronico no valido");
        else setErr("Error al registrar: " + error.message);
      });
  }

  function doLogin() {
    setErr("");
    if (!lf.correo.trim() || !lf.pass) return setErr("Completa todos los campos");
    signInWithEmailAndPassword(auth, lf.correo.trim(), lf.pass)
      .then(function(cred) {
        return getDoc(doc(db, "usuarios", cred.user.uid)).then(function(snap) {
          if (snap.exists()) setUserData(snap.data());
          setTab("home"); go("app");
        });
      })
      .catch(function(error) {
        if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") setErr("Correo o contrasena incorrectos");
        else if (error.code === "auth/wrong-password") setErr("Contrasena incorrecta");
        else setErr("Error: " + error.message);
      });
  }

  function doLogout() { signOut(auth).then(function() { setUser(null); setUserData(null); go("login"); }); }

  var filtered = search.trim() ? corredores.filter(function(c) { return c.nombre.toLowerCase().includes(search.toLowerCase()) || String(c.dorsal).includes(search); }) : corredores;
  var leaderboard = corredores.filter(function(c) { return ramaF === "Todas" || c.genero === ramaF; });
  var miCorredor = userData && corredores.find(function(c) { return c.correo === userData.correo; });

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
      <div style={{ fontSize:14, fontWeight:700, color:C.accent, letterSpacing:4, marginBottom:16 }}>COD META 26</div>
      <div style={{ fontSize:52, fontWeight:900, letterSpacing:-3 }}>CODIGO <span style={{ color:C.accent }}>26</span></div>
      <div style={{ width:60, height:3, background:C.accent, borderRadius:2, margin:"16px 0" }} />
      <div style={{ fontSize:13, color:C.muted }}>Plataforma oficial de carreras</div>
      <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>Cuernavaca, Morelos</div>
      <div style={{ fontSize:11, color:C.muted, marginTop:20 }}>Cargando...</div>
    </div>
  );

  // LOGIN
  if (scr === "login") return W(
    <div style={{ padding:"60px 24px 40px" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>COD META 26</div>
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
        <div><div style={{ fontSize:12, fontWeight:700, color:getLugaresDisp() > 50 ? C.green : C.gold }}>LUGARES DISPONIBLES</div><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{corredores.length} de {EVENTO.cupoMax} inscritos</div></div>
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
      <button style={Object.assign({}, btnP, { marginTop:24, width:"100%" })} onClick={function() { setTab("home"); go("app"); }}>Entrar a la app</button>
    </div>
  );

  // CERTIFICADO
  if (scr === "certificado" && userData) {
    var c = miCorredor || userData;
    var posRama = miCorredor ? getPosRama(miCorredor) : 0;
    var posGen = miCorredor ? miCorredor.pos : 0;
    var ritmoC = calcRitmo(c.tiempo, 5);
    return W(
      <div style={{ padding:"16px 20px 40px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span>
          <span style={{ fontWeight:700, fontSize:18 }}>Certificado de finisher</span>
        </div>
        {/* Certificado */}
        <div style={{ background:"#FFFFF8", borderRadius:20, padding:28, textAlign:"center", position:"relative", overflow:"hidden", marginBottom:20, border:"2px solid #D4A020" }}>
          <div style={{ position:"absolute", top:10, left:10, width:28, height:28, borderTop:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderTopLeftRadius:4 }} />
          <div style={{ position:"absolute", top:10, right:10, width:28, height:28, borderTop:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderTopRightRadius:4 }} />
          <div style={{ position:"absolute", bottom:10, left:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderLeft:"2px solid #D4A020", borderBottomLeftRadius:4 }} />
          <div style={{ position:"absolute", bottom:10, right:10, width:28, height:28, borderBottom:"2px solid #D4A020", borderRight:"2px solid #D4A020", borderBottomRightRadius:4 }} />
          <div style={{ fontSize:28, marginBottom:6 }}>🏅</div>
          <div style={{ fontSize:11, fontWeight:800, color:"#D4A020", letterSpacing:4, marginBottom:6 }}>CERTIFICADO OFICIAL</div>
          <div style={{ width:60, height:1.5, background:"#D4A020", margin:"10px auto" }} />
          <div style={{ fontSize:9, color:"#8A8078", letterSpacing:3, marginBottom:6 }}>CERTIFICA QUE</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#1A1208", marginBottom:4 }}>{c.nombre}</div>
          <div style={{ fontSize:13, fontWeight:700, color:"#5A4A30" }}>Dorsal #{c.dorsal} · {c.genero}</div>
          <div style={{ width:50, height:1, background:"#E0D8C8", margin:"12px auto" }} />
          <div style={{ fontSize:13, fontWeight:700, color:"#3A2E1E", marginBottom:4 }}>Completo exitosamente</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#1A1208" }}>Rumbo al Mundial · Codigo 26</div>
          <div style={{ fontSize:13, color:"#8A8078", marginTop:4 }}>5K · Ciclopista Rio Mayo, Cuernavaca</div>
          <div style={{ display:"flex", justifyContent:"center", gap:20, margin:"16px 0 8px" }}>
            {[
              { l:"TIEMPO", v: c.tiempo || "--:--:--" },
              { l:"POSICION", v: posGen > 0 ? "#" + posGen : "-" },
              { l:"RITMO", v: ritmoC + " min/km" },
            ].map(function(s) {
              return <div key={s.l}>
                <div style={{ fontSize:8, fontWeight:700, color:"#8A8078", letterSpacing:2, marginBottom:3 }}>{s.l}</div>
                <div style={{ fontSize:16, fontWeight:900, color:"#1A1208", fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div>
              </div>;
            })}
          </div>
          <div style={{ width:60, height:1, background:"#D4A020", margin:"10px auto" }} />
          <div style={{ fontSize:10, color:"#8A8078" }}>Cuernavaca, Morelos · 3 de mayo de 2026</div>
          <div style={{ fontSize:9, color:"#B0A898", marginTop:8 }}>Folio: COD26-5K-{String(c.dorsal || "000").padStart(4, "0")}</div>
          {isTop10Rama(miCorredor || {}) && (
            <div style={{ marginTop:10, background:"rgba(245,166,35,0.15)", borderRadius:8, padding:"6px 12px", display:"inline-block" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#D4A020" }}>🏆 Top 10 {c.genero} · Recompensas desbloqueadas</span>
            </div>
          )}
        </div>
        {isTop10Rama(miCorredor || {}) && (
          <button style={Object.assign({}, btnP, { marginBottom:10 })} onClick={function() { go("rewards"); }}>🎁 Ver mis recompensas Top 10</button>
        )}
        <button style={btnS} onClick={function() { go("app"); }}>Volver al inicio</button>
      </div>
    );
  }

  // CRONOMETRO / REGISTRAR TIEMPO
  if (scr === "cronometro") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span>
        <span style={{ fontWeight:700, fontSize:18 }}>Registrar mi tiempo</span>
      </div>
      <div style={{ background:"rgba(0,212,255,0.05)", borderRadius:14, padding:14, marginBottom:16, border:"1px solid rgba(0,212,255,0.1)" }}>
        <div style={{ fontSize:12, color:C.cyan, fontWeight:600 }}>Instrucciones</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4, lineHeight:1.6 }}>1. Presiona Iniciar al cruzar la linea de salida{"\n"}2. Presiona Pausar al cruzar la meta{"\n"}3. Presiona Registrar para guardar tu tiempo oficial</div>
      </div>
      {msgGuardar ? (
        <div style={{ textAlign:"center", padding:20, fontSize:14, color:C.green, fontWeight:700 }}>{msgGuardar}</div>
      ) : (
        <Cronometro onGuardar={guardarTiempo} />
      )}
      {userData && userData.tiempo && (
        <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:12, padding:14, border:"1px solid rgba(16,185,129,0.15)", textAlign:"center", marginTop:8 }}>
          <div style={{ fontSize:12, color:C.muted }}>Tu tiempo actual registrado</div>
          <div style={{ fontSize:24, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:C.green, marginTop:4 }}>{userData.tiempo}</div>
          <button style={{ marginTop:10, padding:"8px 20px", borderRadius:10, background:"rgba(255,255,255,0.06)", color:"#FFF", fontWeight:600, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontSize:13 }} onClick={function() { go("certificado"); }}>Ver mi certificado</button>
        </div>
      )}
    </div>
  );

  // GPS RASTREO
  if (scr === "gps") return W(
    <RastreoGPS onBack={function() { go("app"); }} onGuardarActividad={function(datos) { guardarActividad(datos); go("app"); }} />
  );

  // REWARDS
  if (scr === "rewards") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span>
        <span style={{ fontWeight:700 }}>Zona de Recompensas</span>
      </div>
      <div style={{ background:"linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.03))", borderRadius:20, padding:22, textAlign:"center", marginBottom:20, border:"1px solid rgba(245,166,35,0.2)" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
        <div style={{ fontSize:18, fontWeight:900 }}>Recompensas Top 10</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>Cupones exclusivos para los primeros 10 de cada rama (Varonil y Femenil)</div>
      </div>
      {miCorredor && isTop10Rama(miCorredor) ? (
        <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:14, padding:16, marginBottom:20, border:"1px solid rgba(16,185,129,0.2)", textAlign:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.green }}>🎉 Estas en Top 10 {miCorredor.genero} · Posicion #{getPosRama(miCorredor)}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Tienes acceso a los siguientes cupones</div>
        </div>
      ) : (
        <div style={{ background:"rgba(107,113,148,0.08)", borderRadius:14, padding:16, marginBottom:20, border:"1px solid rgba(107,113,148,0.2)", textAlign:"center" }}>
          <div style={{ fontSize:13, color:C.muted }}>Los cupones se desbloquean para los primeros 10 de cada rama al finalizar el evento</div>
        </div>
      )}
      {CUPONES.map(function(cup) {
        return <div key={cup.id} style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12, border:"0.5px solid " + C.border }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:cup.color + "18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{cup.icono}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{cup.titulo}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{cup.desc}</div>
              <div style={{ marginTop:8 }}><span style={{ background:"rgba(245,166,35,0.1)", color:C.gold, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>Proximamente</span></div>
            </div>
          </div>
        </div>;
      })}
    </div>
  );

  // MAP
  if (scr === "map") return W(
    <div style={{ padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <span style={{ fontSize:22, cursor:"pointer" }} onClick={function() { go("app"); }}>&#8592;</span>
        <span style={{ fontWeight:700 }}>Mapa de la ruta</span>
      </div>
      <div style={{ background:C.card, borderRadius:18, padding:20, border:"0.5px solid " + C.border, marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:4 }}>Rumbo al Mundial Codigo 26</div>
        <div style={{ fontSize:13, color:C.muted }}>5K · Ciclopista Rio Mayo, Cuernavaca, Morelos</div>
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

  // MAIN APP
  if (scr === "app" && userData) return W(
    <div style={{ paddingBottom:90 }}>
      {tab === "home" && <div style={{ padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div><div style={{ fontSize:20, fontWeight:800 }}>Hola, {userData.nombre.split(" ")[0]}</div><div style={{ fontSize:13, color:C.muted }}>COD Meta 26</div></div>
          <div style={{ background:"rgba(255,77,106,0.1)", borderRadius:12, padding:"8px 12px", textAlign:"center", border:"1px solid rgba(255,77,106,0.2)" }}><div style={{ fontSize:8, fontWeight:700, color:C.accent, letterSpacing:2 }}>DORSAL</div><div style={{ fontSize:20, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{userData.dorsal}</div></div>
        </div>

        {/* Banner evento */}
        <div style={{ background:"linear-gradient(135deg," + C.card + "," + C.cardL + ")", borderRadius:20, padding:20, marginBottom:16, border:"0.5px solid " + C.border }}>
          <div style={{ fontSize:10, fontWeight:700, color:evtPast ? C.green : C.gold, letterSpacing:2, marginBottom:8 }}>{evtPast ? "EVENTO FINALIZADO" : "PROXIMO EVENTO"}</div>
          <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>Rumbo al Mundial</div>
          <div style={{ fontSize:20, fontWeight:900, color:C.accent, marginBottom:12 }}>Codigo 26</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:12 }}>
            <span style={{ fontSize:12, color:C.muted }}>📅 3 de mayo 2026 · 7:00 AM</span>
            <span style={{ fontSize:12, color:C.muted }}>📍 Ciclopista Rio Mayo, Cuernavaca</span>
            <span style={{ fontSize:12, color:C.muted }}>🏃 {corredores.length} inscritos de {EVENTO.cupoMax}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>{["5K", "Varonil", "Femenil"].map(function(d, i) { return <span key={d} style={{ background:(i === 0 ? C.accent : C.cyan) + "15", padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:700, color:i === 0 ? C.accent : C.cyan }}>{d}</span>; })}</div>
        </div>

        <div style={{ marginBottom:16 }}><Countdown target={EVENTO.fechaObj} /></div>

        {/* Mi resultado si ya tiene tiempo */}
        {userData.tiempo && (
          <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:16, padding:16, marginBottom:16, border:"1px solid rgba(16,185,129,0.15)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:C.muted, letterSpacing:2 }}>MI TIEMPO OFICIAL</div>
                <div style={{ fontSize:28, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:C.green }}>{userData.tiempo}</div>
                {miCorredor && <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Posicion #{miCorredor.pos} general</div>}
              </div>
              <button style={{ padding:"10px 16px", borderRadius:12, background:C.accent, color:"#FFF", fontWeight:700, border:"none", cursor:"pointer", fontSize:13 }} onClick={function() { go("certificado"); }}>Ver certificado</button>
            </div>
          </div>
        )}

        {/* Acciones rapidas */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { go("map"); }}>🗺️ Ruta</button>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { goTab("leaderboard"); }}>🏆 Rankings</button>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { go("cronometro"); }}>⏱️ Mi tiempo</button>
          <button style={Object.assign({}, btnS, { margin:0 })} onClick={function() { go("gps"); }}>📍 Rastreo GPS</button>
          <button style={Object.assign({}, btnS, { margin:0, gridColumn:"span 2" })} onClick={function() { go("rewards"); }}>🎁 Recompensas Top 10</button>
        </div>
      </div>}

      {tab === "search" && <div style={{ padding:16 }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:12 }}>Buscar corredor</div>
        <div style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:"4px 14px", marginBottom:12, border:"1px solid " + C.border }}>
          <span style={{ fontSize:18, marginRight:10 }}>🔍</span>
          <input style={Object.assign({}, inp, { border:"none", background:"transparent", marginBottom:0, padding:"12px 0" })} placeholder="Nombre o dorsal..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
        </div>
        {loadingC ? (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏃</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{search ? "Sin resultados" : "Aun no hay corredores"}</div>
            <div style={{ fontSize:13, color:C.muted }}>{search ? "Intenta con otro nombre o dorsal" : "Se el primero en registrarte"}</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{filtered.length} corredor{filtered.length !== 1 ? "es" : ""}</div>
            {filtered.map(function(c) {
              return <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:C.cyan, fontSize:13, flexShrink:0, marginRight:12 }}>{c.dorsal}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.nombre}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{c.genero} · {c.fechaReg}</div>
                </div>
                {c.tiempo ? <div style={{ fontSize:14, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", color:C.green }}>{c.tiempo}</div> : <div style={{ fontSize:11, color:C.muted }}>Sin tiempo</div>}
              </div>;
            })}
          </>
        )}
      </div>}

      {tab === "leaderboard" && <div style={{ padding:16 }}>
        <div style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>Ranking · Codigo 26</div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>{["Todas", "Varonil", "Femenil"].map(function(r) { return <span key={r} onClick={function() { setRamaF(r); }} style={{ padding:"8px 18px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:ramaF === r ? C.accent : C.card, color:ramaF === r ? "#FFF" : C.muted, border:"1px solid " + (ramaF === r ? C.accent : C.border) }}>{r}</span>; })}</div>
        {loadingC ? (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>Cargando ranking...</div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign:"center", padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏆</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Ranking vacio</div>
            <div style={{ fontSize:13, color:C.muted }}>Los resultados apareceran aqui cuando los corredores registren sus tiempos</div>
          </div>
        ) : (
          leaderboard.map(function(c, i) {
            var emo = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
            return <div key={c.id} style={{ display:"flex", alignItems:"center", background:C.card, borderRadius:14, padding:14, marginBottom:10, border:"0.5px solid " + C.border }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,77,106,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:emo ? 22 : 15, flexShrink:0, marginRight:12 }}>{emo || "#" + (i + 1)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700 }}>{c.nombre}</div>
                <div style={{ fontSize:12, color:C.muted }}>#{c.dorsal} · {c.genero}</div>
              </div>
              {c.tiempo ? <div style={{ fontSize:14, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", color:C.green }}>{c.tiempo}</div> : <div style={{ fontSize:11, color:C.muted }}>Sin tiempo</div>}
            </div>;
          })
        )}
      </div>}

      {tab === "profile" && <div style={{ padding:20 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:80, height:80, borderRadius:40, background:"linear-gradient(135deg," + C.accent + "," + C.gold + ")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, margin:"0 auto 12px" }}>{ini(userData.nombre)}</div>
          <div style={{ fontSize:22, fontWeight:800 }}>{userData.nombre}</div>
          <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>{userData.correo}</div>
        </div>
        <div style={{ background:"rgba(255,77,106,0.08)", borderRadius:18, padding:24, textAlign:"center", marginBottom:16, border:"1px solid rgba(255,77,106,0.15)" }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:3, marginBottom:8 }}>MI DORSAL · CODIGO 26</div>
          <div style={{ fontSize:48, fontWeight:900, fontFamily:"'JetBrains Mono',monospace" }}>#{userData.dorsal}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>5K · Ciclopista Rio Mayo, Cuernavaca</div>
        </div>
        {userData.tiempo && (
          <div style={{ background:"rgba(16,185,129,0.08)", borderRadius:14, padding:16, marginBottom:16, border:"1px solid rgba(16,185,129,0.15)", textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.muted, letterSpacing:2 }}>MI TIEMPO OFICIAL</div>
            <div style={{ fontSize:32, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", color:C.green, marginTop:4 }}>{userData.tiempo}</div>
            {miCorredor && <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Posicion #{miCorredor.pos} general · #{getPosRama(miCorredor)} {userData.genero}</div>}
            {miCorredor && isTop10Rama(miCorredor) && <div style={{ fontSize:12, fontWeight:700, color:C.gold, marginTop:6 }}>🏆 Top 10 {userData.genero} · Tienes recompensas!</div>}
            <button style={{ marginTop:10, padding:"8px 20px", borderRadius:10, background:C.accent, color:"#FFF", fontWeight:700, border:"none", cursor:"pointer", fontSize:13 }} onClick={function() { go("certificado"); }}>Ver mi certificado</button>
          </div>
        )}
        {userData.ultimaActividad && (
          <div style={{ background:"rgba(0,212,255,0.06)", borderRadius:14, padding:16, marginBottom:16, border:"1px solid rgba(0,212,255,0.15)" }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.cyan, marginBottom:6 }}>Ultima actividad GPS</div>
            <div style={{ fontSize:12, color:C.muted }}>{userData.ultimaActividad.km} km · {userData.ultimaActividad.tiempo} · Ritmo {userData.ultimaActividad.ritmo} min/km</div>
          </div>
        )}
        <div style={{ background:C.card, borderRadius:16, padding:18, marginBottom:12 }}>
          {[["Nombre", userData.nombre], ["Correo", userData.correo], ["Dorsal", "#" + userData.dorsal], ["Genero", userData.genero || "-"], ["Telefono", userData.telefono || "-"], ["Talla", userData.talla || "-"], ["Registrado", userData.fechaReg || "-"]].map(function(row) {
            return <div key={row[0]} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"0.5px solid " + C.border }}>
              <span style={{ fontSize:13, color:C.muted }}>{row[0]}</span>
              <span style={{ fontSize:13, fontWeight:600, textAlign:"right", maxWidth:"55%" }}>{row[1]}</span>
            </div>;
          })}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button style={btnS} onClick={function() { go("rewards"); }}>🎁 Recompensas Top 10</button>
          <button style={btnS} onClick={function() { go("cronometro"); }}>⏱️ Registrar mi tiempo</button>
          <button style={btnS} onClick={function() { go("gps"); }}>📍 Rastreo GPS</button>
          <button style={{ width:"100%", padding:16, borderRadius:14, background:"rgba(255,77,106,0.04)", border:"1px solid rgba(255,77,106,0.2)", color:C.accent, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }} onClick={doLogout}>Cerrar sesion</button>
        </div>
      </div>}

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.bg, borderTop:"0.5px solid " + C.border, display:"flex", justifyContent:"space-around", padding:"10px 0 24px", zIndex:100 }}>
        {[{ id:"home", e:"🏠", l:"Inicio" }, { id:"search", e:"🔍", l:"Buscar" }, { id:"leaderboard", e:"🏆", l:"Rankings" }, { id:"profile", e:"👤", l:"Perfil" }].map(function(t) {
          return <div key={t.id} onClick={function() { goTab(t.id); }} style={{ textAlign:"center", cursor:"pointer", flex:1 }}>
            <div style={{ fontSize:22, opacity:tab === t.id ? 1 : 0.4 }}>{t.e}</div>
            <div style={{ fontSize:10, marginTop:4, fontWeight:600, color:tab === t.id ? C.accent : C.muted }}>{t.l}</div>
          </div>;
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
