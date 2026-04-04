import { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, runTransaction } from "firebase/firestore";

var EVENTO = {
  id: "codigo26",
  nombre: "Codigo 26",
  subNombre: "Rumbo al Mundial",
  fecha: "3 de mayo de 2026",
  fechaObj: new Date(2026, 4, 3, 7, 0, 0),
  dist: "5K",
  ubicacion: "Cuernavaca, Morelos",
  hora: "7:00 AM",
  cupoMax: 200,
  estado: "proximo",
  ruta: [
    { punto: "Salida", lugar: "City Market (Juan Pablo II)", km: "0.0" },
    { punto: "Km 1", lugar: "Los Quelites · Av. Teopanzolco", km: "1.0" },
    { punto: "Km 2", lugar: "Adelante de Fonda La Güera", km: "2.0" },
    { punto: "Km 3", lugar: "Cerca de Mi Gusto Es · Río Mayo", km: "3.0" },
    { punto: "Km 4", lugar: "Juan Pablo II", km: "4.0" },
    { punto: "Meta", lugar: "Atrás de City Market", km: "5.0" },
  ],
};

var C = {
  bg: "#07080F",
  surface: "#0E1018",
  card: "#13151F",
  cardHover: "#181B26",
  accent: "#FF3D5A",
  accentDim: "rgba(255,61,90,0.12)",
  gold: "#F0A500",
  goldDim: "rgba(240,165,0,0.12)",
  cyan: "#00C2E0",
  cyanDim: "rgba(0,194,224,0.1)",
  green: "#00C896",
  greenDim: "rgba(0,200,150,0.1)",
  muted: "#505570",
  mutedLight: "#7B82A0",
  border: "rgba(255,255,255,0.05)",
  borderLight: "rgba(255,255,255,0.09)",
  text: "#E8EAF2",
  textSub: "#9BA1BC",
};

var styles = {
  page: { maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif", color: C.text, position: "relative" },
  header: { padding: "52px 24px 24px", display: "flex", alignItems: "center", gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: "50%", background: C.card, border: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 16 },
  card: { background: C.card, borderRadius: 20, border: "1px solid " + C.border },
  pill: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: C.mutedLight, marginBottom: 8, letterSpacing: 0.3 },
  input: { width: "100%", background: C.card, borderRadius: 14, padding: "16px 18px", fontSize: 15, color: C.text, border: "1px solid " + C.border, outline: "none", boxSizing: "border-box", marginBottom: 16, fontFamily: "inherit", transition: "border 0.2s" },
  btnPrimary: { width: "100%", padding: "17px 20px", borderRadius: 16, background: "linear-gradient(135deg, #FF3D5A, #D4002D)", color: "#FFF", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3 },
  btnSecondary: { width: "100%", padding: "15px 20px", borderRadius: 16, background: C.card, color: C.text, fontSize: 15, fontWeight: 600, border: "1px solid " + C.borderLight, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: C.accent, fontWeight: 700, fontSize: 14 },
  tabBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.surface, borderTop: "1px solid " + C.border, display: "flex", justifyContent: "space-around", padding: "10px 0 28px", zIndex: 100, backdropFilter: "blur(20px)" },
};

function padT(n) { return String(n).padStart(2, "0"); }
function secsToTime(s) { var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60; return padT(h) + ":" + padT(m) + ":" + padT(ss); }
function timeToSecs(t) { if (!t) return 99999; var p = t.split(":").map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); }
function calcRitmo(t, km) { var s = timeToSecs(t); if (!s || s === 99999 || !km) return "--'--\""; var mpk = (s / 60) / km, m = Math.floor(mpk), ss = Math.round((mpk - m) * 60); return m + "'" + padT(ss) + "\""; }
function ini(n) { return n ? n.split(" ").map(function(x) { return x[0]; }).slice(0, 2).join("").toUpperCase() : "?"; }

// ── COUNTDOWN ──
function Countdown({ target }) {
  var [l, setL] = useState({ d: 0, h: 0, m: 0, s: 0, past: false });
  useEffect(function() {
    function calc() { var d = target - new Date(); if (d <= 0) return setL({ d: 0, h: 0, m: 0, s: 0, past: true }); setL({ d: Math.floor(d / 864e5), h: Math.floor((d % 864e5) / 36e5), m: Math.floor((d % 36e5) / 6e4), s: Math.floor((d % 6e4) / 1e3), past: false }); }
    calc(); var iv = setInterval(calc, 1000); return () => clearInterval(iv);
  }, [target]);
  if (l.past) return <div style={{ fontSize: 13, color: C.green, fontWeight: 700, textAlign: "center", padding: "12px 0" }}>✓ Evento finalizado — Resultados disponibles</div>;
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {[{ v: l.d, u: "DÍAS" }, { v: l.h, u: "HRS" }, { v: l.m, u: "MIN" }, { v: l.s, u: "SEG" }].map(function(x) {
        return (
          <div key={x.u} style={{ flex: 1, background: C.card, borderRadius: 14, padding: "14px 8px", textAlign: "center", border: "1px solid " + C.border }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: "#FFF", lineHeight: 1 }}>{String(x.v || 0).padStart(2, "0")}</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginTop: 6, fontWeight: 600 }}>{x.u}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── GPS + CRONÓMETRO INTEGRADO ──
function CarreraActiva({ onTerminar, onBack }) {
  var [phase, setPhase] = useState("ready");
  var [elapsed, setElapsed] = useState(0);
  var [puntos, setPuntos] = useState([]);
  var [distancia, setDistancia] = useState(0);
  var [gpsError, setGpsError] = useState("");
  var startRef = useRef(null);
  var ivRef = useRef(null);
  var watchRef = useRef(null);

  function haversine(a, b, c, d) {
    var R = 6371000, dL = (c - a) * Math.PI / 180, dO = (d - b) * Math.PI / 180;
    var x = Math.sin(dL / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dO / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function iniciar() {
    startRef.current = Date.now();
    ivRef.current = setInterval(function() { setElapsed(Math.floor((Date.now() - startRef.current) / 1000)); }, 1000);
    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        function(pos) {
          var nuevo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPuntos(function(prev) {
            if (prev.length > 0) {
              var u = prev[prev.length - 1];
              var d = haversine(u.lat, u.lng, nuevo.lat, nuevo.lng);
              if (d > 3) { setDistancia(function(pd) { return pd + d; }); return [...prev, nuevo]; }
              return prev;
            }
            return [nuevo];
          });
        },
        function(err) { setGpsError("GPS: " + err.message); },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else { setGpsError("GPS no disponible — solo cronómetro activo"); }
    setPhase("running");
  }

  function terminar() {
    clearInterval(ivRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    setPhase("finished");
  }

  useEffect(function() { return function() { clearInterval(ivRef.current); if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); }; }, []);

  var km = distancia / 1000;
  var timeStr = secsToTime(elapsed);
  var ritmo = calcRitmo(timeStr, km || 1);

  if (phase === "finished") {
    return (
      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ ...styles.header, padding: "52px 0 24px" }}>
          <div style={{ ...styles.backBtn }} onClick={onBack}>←</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Carrera completada</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(0,200,150,0.12), rgba(0,200,150,0.04))", borderRadius: 24, padding: 28, textAlign: "center", border: "1px solid rgba(0,200,150,0.2)", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>TIEMPO FINAL</div>
          <div style={{ fontSize: 56, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: "#FFF", letterSpacing: -2 }}>{timeStr}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { l: "Distancia", v: km.toFixed(2) + " km", color: C.cyan },
            { l: "Ritmo promedio", v: ritmo, color: C.gold },
          ].map(function(s) {
            return (
              <div key={s.l} style={{ ...styles.card, padding: "18px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>{s.l.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
              </div>
            );
          })}
        </div>
        <button style={{ ...styles.btnPrimary, marginBottom: 12 }} onClick={function() { onTerminar(timeStr, { km: km.toFixed(2), tiempo: timeStr, ritmo: ritmo, puntos: puntos.length }); }}>
          Guardar y ver mi certificado →
        </button>
        <button style={styles.btnSecondary} onClick={onBack}>Cancelar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px 40px" }}>
      <div style={{ ...styles.header, padding: "52px 0 24px" }}>
        <div style={styles.backBtn} onClick={onBack}>←</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{ phase === "ready" ? "Listo para correr" : "En carrera..." }</div>
      </div>

      <div style={{ ...styles.card, padding: 28, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 2, marginBottom: 16 }}>CRONÓMETRO</div>
        <div style={{ fontSize: 64, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: phase === "running" ? C.green : C.text, letterSpacing: -3, lineHeight: 1 }}>{timeStr}</div>
        {phase === "running" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 1s infinite" }} />
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>GRABANDO</span>
          </div>
        )}
      </div>

      {phase === "running" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ ...styles.card, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>DISTANCIA</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{km.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>km</div>
          </div>
          <div style={{ ...styles.card, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>RITMO</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, fontFamily: "'JetBrains Mono',monospace" }}>{ritmo}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>min/km</div>
          </div>
        </div>
      )}

      {gpsError && (
        <div style={{ background: C.accentDim, borderRadius: 12, padding: "10px 14px", marginBottom: 16, border: "1px solid rgba(255,61,90,0.2)", fontSize: 12, color: C.accent }}>
          ⚠ {gpsError}
        </div>
      )}

      {phase === "running" && (
        <div style={{ ...styles.card, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>PUNTOS DE REFERENCIA</div>
          {EVENTO.ruta.map(function(p, i) {
            var passed = km >= parseFloat(p.km);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 10, opacity: passed ? 1 : 0.4 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: passed ? C.green : C.card, border: "2px solid " + (passed ? C.green : C.border), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{passed ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: passed ? C.green : C.textSub }}>{p.punto}</span>
                  <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>Km {p.km}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {phase === "ready" && (
        <div style={{ ...styles.card, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Antes de iniciar</div>
          <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>
            • Presiona <strong style={{ color: C.green }}>Iniciar</strong> exactamente al cruzar la línea de salida{"\n"}
            • El GPS y cronómetro corren juntos{"\n"}
            • Presiona <strong style={{ color: C.accent }}>Terminar</strong> al cruzar la meta{"\n"}
            • Tu tiempo se guardará y recibirás tu certificado
          </div>
        </div>
      )}

      {phase === "ready" ? (
        <button style={{ ...styles.btnPrimary, background: "linear-gradient(135deg, #00C896, #00A07A)", fontSize: 17, padding: "20px 20px" }} onClick={iniciar}>
          ▶ Iniciar carrera
        </button>
      ) : (
        <button style={{ ...styles.btnPrimary, fontSize: 17, padding: "20px 20px" }} onClick={terminar}>
          ⏹ Terminar y registrar tiempo
        </button>
      )}
    </div>
  );
}

// ── APP PRINCIPAL ──
export default function App() {
  var [scr, setScr] = useState("splash");
  var [user, setUser] = useState(null);
  var [userData, setUserData] = useState(null);
  var [tab, setTab] = useState("home");
  var [search, setSearch] = useState("");
  var [ramaF, setRamaF] = useState("Todas");
  var [form, setForm] = useState({ nombre: "", apellidoP: "", apellidoM: "", correo: "", telefono: "", edad: "", genero: "", talla: "", contactoEmergencia: "", pass: "", pass2: "" });
  var [lf, setLf] = useState({ correo: "", pass: "" });
  var [err, setErr] = useState("");
  var [fade, setFade] = useState(false);
  var [loading, setLoading] = useState(true);
  var [splashDone, setSplashDone] = useState(false);
  var [inscritos, setInscritos] = useState([]);
  var [loadingC, setLoadingC] = useState(true);
  var [msg, setMsg] = useState("");
  var [inscritoEnEvento, setInscritoEnEvento] = useState(false);
  var [inscripcionData, setInscripcionData] = useState(null);

  var evtPast = EVENTO.estado === "finalizado";

  function cargarInscritos() {
    getDocs(collection(db, "eventos", EVENTO.id, "inscritos")).then(function(snap) {
      var lista = [];
      snap.forEach(function(d) { lista.push(Object.assign({ id: d.id }, d.data())); });
      lista.sort(function(a, b) {
        if (a.tiempo && b.tiempo) return timeToSecs(a.tiempo) - timeToSecs(b.tiempo);
        if (a.tiempo) return -1;
        if (b.tiempo) return 1;
        return a.dorsal - b.dorsal;
      });
      setInscritos(lista);
      setLoadingC(false);
    }).catch(function() { setLoadingC(false); });
  }

  useEffect(function() { cargarInscritos(); }, []);

  useEffect(function() {
    var unsub = onAuthStateChanged(auth, function(fbUser) {
      if (fbUser) {
        setUser(fbUser);
        getDoc(doc(db, "usuarios", fbUser.uid)).then(function(snap) {
          if (snap.exists()) setUserData(snap.data());
          getDoc(doc(db, "eventos", EVENTO.id, "inscritos", fbUser.uid)).then(function(snapEvt) {
            if (snapEvt.exists()) { setInscritoEnEvento(true); setInscripcionData(snapEvt.data()); }
            setLoading(false);
          });
        });
      } else { setUser(null); setUserData(null); setLoading(false); }
    });
    return function() { unsub(); };
  }, []);

  useEffect(function() {
    var t = setTimeout(function() { setSplashDone(true); }, 2200);
    setTimeout(function() { setFade(true); }, 80);
    return function() { clearTimeout(t); };
  }, []);

  useEffect(function() {
    if (splashDone && !loading) {
      setFade(false);
      setTimeout(function() {
        setScr(user && userData ? "app" : "login");
        setTimeout(function() { setFade(true); }, 60);
      }, 280);
    }
  }, [splashDone, loading]);

  useEffect(function() { if (scr !== "splash") setTimeout(function() { setFade(true); }, 50); }, [scr, tab]);

  function go(s) { setFade(false); setTimeout(function() { setScr(s); }, 150); }
  function goTab(t) { setFade(false); setTimeout(function() { setTab(t); setScr("app"); }, 100); }

  var lugaresDisp = Math.max(0, EVENTO.cupoMax - inscritos.length);

  function inscribirseAlEvento() {
    if (!user || !userData) return;
    setErr("");
    var contadorRef = doc(db, "eventos", EVENTO.id, "config", "contador");
    runTransaction(db, function(tx) {
      return tx.get(contadorRef).then(function(snap) {
        var actual = snap.exists() ? (snap.data().ultimo || 0) : 0;
        if (actual >= EVENTO.cupoMax) throw new Error("Cupo lleno");
        var nuevoDorsal = actual + 1;
        tx.set(contadorRef, { ultimo: nuevoDorsal });
        tx.set(doc(db, "eventos", EVENTO.id, "inscritos", user.uid), {
          uid: user.uid, nombre: userData.nombre, correo: userData.correo,
          genero: userData.genero || "", dorsal: nuevoDorsal,
          fechaInscripcion: new Date().toLocaleDateString("es-MX"), tiempo: "",
        });
        return nuevoDorsal;
      });
    }).then(function(dorsal) {
      var data = { uid: user.uid, nombre: userData.nombre, correo: userData.correo, genero: userData.genero || "", dorsal: dorsal, fechaInscripcion: new Date().toLocaleDateString("es-MX"), tiempo: "" };
      setInscritoEnEvento(true); setInscripcionData(data); cargarInscritos(); go("bienvenidaEvento");
    }).catch(function(e) {
      setErr(e.message === "Cupo lleno" ? "El cupo del evento está lleno" : "Error: " + e.message);
    });
  }

  function guardarTiempoYActividad(tiempo, actividad) {
    if (!user) return;
    setMsg("Guardando...");
    Promise.all([
      updateDoc(doc(db, "eventos", EVENTO.id, "inscritos", user.uid), { tiempo: tiempo }),
      updateDoc(doc(db, "usuarios", user.uid), { ultimaActividad: actividad }),
    ]).then(function() {
      setInscripcionData(function(prev) { return Object.assign({}, prev, { tiempo: tiempo }); });
      setUserData(function(prev) { return Object.assign({}, prev, { ultimaActividad: actividad }); });
      cargarInscritos(); setMsg(""); go("certificado");
    }).catch(function() { setMsg("Error al guardar"); });
  }

  function doReg() {
    setErr("");
    if (!form.nombre.trim() || !form.apellidoP.trim() || !form.correo.trim() || !form.pass || !form.genero) return setErr("Completa los campos obligatorios");
    if (form.pass.length < 6) return setErr("La contraseña debe tener al menos 6 caracteres");
    if (form.pass !== form.pass2) return setErr("Las contraseñas no coinciden");
    var nombreCompleto = form.nombre.trim() + " " + form.apellidoP.trim() + (form.apellidoM.trim() ? " " + form.apellidoM.trim() : "");
    createUserWithEmailAndPassword(auth, form.correo.trim(), form.pass)
      .then(function(cred) {
        var datos = { nombre: nombreCompleto, correo: form.correo.trim().toLowerCase(), telefono: form.telefono || "", edad: form.edad || "", genero: form.genero, talla: form.talla || "", contactoEmergencia: form.contactoEmergencia || "", fechaReg: new Date().toLocaleDateString("es-MX") };
        return setDoc(doc(db, "usuarios", cred.user.uid), datos).then(function() { setUserData(datos); go("welcome"); });
      })
      .catch(function(e) {
        if (e.code === "auth/email-already-in-use") setErr("Este correo ya está registrado");
        else if (e.code === "auth/invalid-email") setErr("Correo no válido");
        else setErr("Error: " + e.message);
      });
  }

  function doLogin() {
    setErr("");
    if (!lf.correo.trim() || !lf.pass) return setErr("Completa todos los campos");
    signInWithEmailAndPassword(auth, lf.correo.trim(), lf.pass)
      .then(function(cred) {
        return getDoc(doc(db, "usuarios", cred.user.uid)).then(function(snap) {
          if (snap.exists()) setUserData(snap.data());
          return getDoc(doc(db, "eventos", EVENTO.id, "inscritos", cred.user.uid)).then(function(snapEvt) {
            if (snapEvt.exists()) { setInscritoEnEvento(true); setInscripcionData(snapEvt.data()); }
            setTab("home"); go("app");
          });
        });
      })
      .catch(function(e) {
        if (e.code === "auth/user-not-found" || e.code === "auth/invalid-credential") setErr("Correo o contraseña incorrectos");
        else setErr("Error: " + e.message);
      });
  }

  function doLogout() { signOut(auth).then(function() { setUser(null); setUserData(null); setInscritoEnEvento(false); setInscripcionData(null); go("login"); }); }

  function getPosRama(uid) {
    var g = inscripcionData ? inscripcionData.genero : "";
    var r = inscritos.filter(function(c) { return c.genero === g && c.tiempo; });
    var idx = r.findIndex(function(c) { return c.uid === uid; });
    return idx >= 0 ? idx + 1 : 0;
  }
  function getPosGeneral(uid) {
    var r = inscritos.filter(function(c) { return c.tiempo; });
    var idx = r.findIndex(function(c) { return c.uid === uid; });
    return idx >= 0 ? idx + 1 : 0;
  }
  function isTop10() {
    if (!inscripcionData || !inscripcionData.tiempo || !user) return false;
    return getPosRama(user.uid) <= 10;
  }

  var filtered = search.trim() ? inscritos.filter(function(c) { return c.nombre.toLowerCase().includes(search.toLowerCase()) || String(c.dorsal).includes(search); }) : inscritos;
  var leaderboard = inscritos.filter(function(c) { return ramaF === "Todas" || c.genero === ramaF; });

  function W(content) {
    return (
      <div style={styles.page}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet" />
        <style>{`* { -webkit-tap-highlight-color: transparent; } input:focus { border-color: rgba(255,61,90,0.5) !important; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} } @keyframes spin { to{transform:rotate(360deg)} }`}</style>
        <div style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>{content}</div>
      </div>
    );
  }

  // ── SPLASH ──
  if (scr === "splash") return W(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", padding: 24 }}>
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,90,0.08), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg, #FF3D5A, #D4002D)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 20px 60px rgba(255,61,90,0.3)" }}>
        <span style={{ fontSize: 32 }}>🏃</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 6 }}>COD META 26</div>
      <div style={{ fontSize: 14, color: C.mutedLight, fontWeight: 500 }}>Plataforma oficial de carreras</div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.muted }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.muted }} />
      </div>
    </div>
  );

  // ── LOGIN ──
  if (scr === "login") return W(
    <div style={{ padding: "0 24px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 8 }}>Bienvenido{"\n"}<span style={{ color: C.accent }}>Codigo 26</span></div>
        <div style={{ fontSize: 14, color: C.mutedLight }}>Cuernavaca, Morelos</div>
      </div>
      <label style={styles.label}>Correo electrónico</label>
      <input style={styles.input} type="email" placeholder="tu@correo.com" value={lf.correo} onChange={function(e) { setLf({ correo: e.target.value, pass: lf.pass }); }} />
      <label style={styles.label}>Contraseña</label>
      <input style={styles.input} type="password" placeholder="••••••••" value={lf.pass} onChange={function(e) { setLf({ correo: lf.correo, pass: e.target.value }); }} />
      {err && <div style={{ fontSize: 13, color: C.accent, marginBottom: 16, padding: "10px 14px", background: C.accentDim, borderRadius: 10, border: "1px solid rgba(255,61,90,0.2)" }}>{err}</div>}
      <button style={{ ...styles.btnPrimary, marginBottom: 20, marginTop: 8 }} onClick={doLogin}>Iniciar sesión</button>
      <div style={{ textAlign: "center", fontSize: 14 }}>
        <span style={{ color: C.mutedLight }}>¿No tienes cuenta? </span>
        <button style={styles.btnGhost} onClick={function() { setErr(""); go("register"); }}>Regístrate</button>
      </div>
    </div>
  );

  // ── REGISTER ──
  if (scr === "register") return W(
    <div style={{ padding: "52px 24px 40px", maxHeight: "100vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={styles.backBtn} onClick={function() { setErr(""); go("login"); }}>←</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Crear cuenta</div>
          <div style={{ fontSize: 13, color: C.mutedLight, marginTop: 2 }}>El dorsal se asigna al inscribirte al evento</div>
        </div>
      </div>
      <div style={{ ...styles.card, padding: "14px 18px", marginBottom: 24, borderColor: "rgba(0,194,224,0.15)", background: C.cyanDim }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>Cuenta vs inscripción al evento</div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.6 }}>Tu cuenta te permite acceder a cualquier carrera futura. El dorsal (del 1 al 200) se asigna cuando te inscribes a este evento específico.</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.mutedLight, letterSpacing: 1.5, marginBottom: 14 }}>DATOS PERSONALES</div>
      <label style={styles.label}>Nombre(s) *</label>
      <input style={styles.input} placeholder="Juan Carlos" value={form.nombre} onChange={function(e) { setForm(Object.assign({}, form, { nombre: e.target.value })); }} />
      <label style={styles.label}>Apellido paterno *</label>
      <input style={styles.input} placeholder="García" value={form.apellidoP} onChange={function(e) { setForm(Object.assign({}, form, { apellidoP: e.target.value })); }} />
      <label style={styles.label}>Apellido materno</label>
      <input style={styles.input} placeholder="Opcional" value={form.apellidoM} onChange={function(e) { setForm(Object.assign({}, form, { apellidoM: e.target.value })); }} />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><label style={styles.label}>Edad</label><input style={styles.input} type="number" placeholder="25" value={form.edad} onChange={function(e) { setForm(Object.assign({}, form, { edad: e.target.value })); }} /></div>
        <div style={{ flex: 1 }}><label style={styles.label}>Género *</label><select style={{ ...styles.input, cursor: "pointer" }} value={form.genero} onChange={function(e) { setForm(Object.assign({}, form, { genero: e.target.value })); }}><option value="">Seleccionar</option><option value="Varonil">Varonil</option><option value="Femenil">Femenil</option></select></div>
      </div>
      <label style={styles.label}>Teléfono</label>
      <input style={styles.input} type="tel" placeholder="777 123 4567" value={form.telefono} onChange={function(e) { setForm(Object.assign({}, form, { telefono: e.target.value })); }} />
      <label style={styles.label}>Talla de playera</label>
      <select style={{ ...styles.input, cursor: "pointer" }} value={form.talla} onChange={function(e) { setForm(Object.assign({}, form, { talla: e.target.value })); }}><option value="">Seleccionar</option><option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option></select>
      <label style={styles.label}>Contacto de emergencia</label>
      <input style={styles.input} placeholder="Nombre y teléfono" value={form.contactoEmergencia} onChange={function(e) { setForm(Object.assign({}, form, { contactoEmergencia: e.target.value })); }} />
      <div style={{ fontSize: 11, fontWeight: 700, color: C.mutedLight, letterSpacing: 1.5, marginBottom: 14, marginTop: 8 }}>ACCESO A LA APP</div>
      <label style={styles.label}>Correo electrónico *</label>
      <input style={styles.input} type="email" placeholder="tu@correo.com" value={form.correo} onChange={function(e) { setForm(Object.assign({}, form, { correo: e.target.value })); }} />
      <label style={styles.label}>Contraseña * (mínimo 6 caracteres)</label>
      <input style={styles.input} type="password" placeholder="••••••••" value={form.pass} onChange={function(e) { setForm(Object.assign({}, form, { pass: e.target.value })); }} />
      <label style={styles.label}>Confirmar contraseña *</label>
      <input style={styles.input} type="password" placeholder="••••••••" value={form.pass2} onChange={function(e) { setForm(Object.assign({}, form, { pass2: e.target.value })); }} />
      {err && <div style={{ fontSize: 13, color: C.accent, marginBottom: 16, padding: "10px 14px", background: C.accentDim, borderRadius: 10 }}>{err}</div>}
      <button style={{ ...styles.btnPrimary, marginBottom: 20 }} onClick={doReg}>Crear mi cuenta</button>
      <div style={{ textAlign: "center", fontSize: 14, paddingBottom: 20 }}>
        <span style={{ color: C.mutedLight }}>¿Ya tienes cuenta? </span>
        <button style={styles.btnGhost} onClick={function() { setErr(""); go("login"); }}>Inicia sesión</button>
      </div>
    </div>
  );

  // ── WELCOME ──
  if (scr === "welcome" && userData) return W(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 24, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 28, background: "linear-gradient(135deg, #00C896, #00A07A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 24 }}>✓</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Cuenta creada</div>
      <div style={{ fontSize: 15, color: C.textSub, marginBottom: 32 }}>Hola, {userData.nombre.split(" ")[0]}</div>
      <div style={{ ...styles.card, padding: 20, width: "100%", marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan, marginBottom: 8 }}>Siguiente paso</div>
        <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.7 }}>Inscríbete al evento Codigo 26 para obtener tu dorsal oficial (del 1 al 200 por orden de registro).</div>
      </div>
      <button style={{ ...styles.btnPrimary, width: "100%" }} onClick={function() { setTab("home"); go("app"); }}>Entrar e inscribirme →</button>
    </div>
  );

  // ── BIENVENIDA AL EVENTO ──
  if (scr === "bienvenidaEvento" && inscripcionData) return W(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 24, textAlign: "center" }}>
      <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,90,0.07), transparent 70%)" }} />
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: 2, marginBottom: 20 }}>CODIGO 26 · 5K</div>
      <div style={{ fontSize: 100, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: -4, color: "#FFF", marginBottom: 8 }}>{inscripcionData.dorsal}</div>
      <div style={{ fontSize: 14, color: C.mutedLight, marginBottom: 32 }}>Tu dorsal oficial · Inscripción #{inscripcionData.dorsal} de {EVENTO.cupoMax}</div>
      <div style={{ ...styles.card, padding: 20, width: "100%", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, marginBottom: 8 }}>INSCRITO COMO</div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{inscripcionData.nombre}</div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>{inscripcionData.genero} · {inscripcionData.fechaInscripcion}</div>
      </div>
      <button style={{ ...styles.btnPrimary, width: "100%" }} onClick={function() { setTab("home"); go("app"); }}>Entrar al evento →</button>
    </div>
  );

  // ── CERTIFICADO ──
  if (scr === "certificado" && inscripcionData) {
    var posGen = getPosGeneral(user ? user.uid : "");
    var posRamaC = getPosRama(user ? user.uid : "");
    var ritmoC = calcRitmo(inscripcionData.tiempo, 5);
    return W(
      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ ...styles.header, padding: "52px 0 24px" }}>
          <div style={styles.backBtn} onClick={function() { go("app"); }}>←</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Certificado de finisher</div>
        </div>
        <div style={{ background: "#FAFAF2", borderRadius: 24, padding: 32, textAlign: "center", marginBottom: 20, border: "2px solid #E8C840", position: "relative", overflow: "hidden" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(function(pos) {
            return <div key={pos.join()} style={{ position:"absolute", [pos[0]]:16, [pos[1]]:16, width:24, height:24, borderTop:pos[0]==="top"?"2px solid #D4A020":"none", borderBottom:pos[0]==="bottom"?"2px solid #D4A020":"none", borderLeft:pos[1]==="left"?"2px solid #D4A020":"none", borderRight:pos[1]==="right"?"2px solid #D4A020":"none", borderRadius:2 }} />;
          })}
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏅</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#B8860B", letterSpacing: 4, marginBottom: 4 }}>CERTIFICADO OFICIAL</div>
          <div style={{ width: 50, height: 1, background: "#D4A020", margin: "12px auto" }} />
          <div style={{ fontSize: 9, color: "#9A9080", letterSpacing: 3, marginBottom: 8 }}>CERTIFICA QUE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#1A1208", marginBottom: 4, lineHeight: 1.2 }}>{inscripcionData.nombre}</div>
          <div style={{ fontSize: 12, color: "#6A5A40", marginBottom: 16 }}>Dorsal #{inscripcionData.dorsal} · {inscripcionData.genero}</div>
          <div style={{ fontSize: 12, color: "#6A5A40", marginBottom: 4 }}>completó exitosamente</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1A1208", marginBottom: 4 }}>Rumbo al Mundial · Codigo 26</div>
          <div style={{ fontSize: 12, color: "#9A9080", marginBottom: 20 }}>5K · Cuernavaca, Morelos</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 16 }}>
            {[{ l: "TIEMPO", v: inscripcionData.tiempo || "--:--:--" }, { l: "POSICIÓN", v: posGen > 0 ? "#" + posGen : "-" }, { l: "RITMO", v: ritmoC }].map(function(s) {
              return <div key={s.l}><div style={{ fontSize: 8, color: "#9A9080", letterSpacing: 2, marginBottom: 4, fontWeight: 700 }}>{s.l}</div><div style={{ fontSize: 16, fontWeight: 900, color: "#1A1208", fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div></div>;
            })}
          </div>
          <div style={{ width: 50, height: 1, background: "#D4A020", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 10, color: "#9A9080" }}>Cuernavaca, Morelos · 3 de mayo de 2026</div>
          <div style={{ fontSize: 9, color: "#C0B898", marginTop: 6 }}>Folio: COD26-5K-{String(inscripcionData.dorsal || "0").padStart(3, "0")}</div>
          {isTop10() && (
            <div style={{ marginTop: 14, background: "rgba(240,165,0,0.15)", borderRadius: 10, padding: "8px 16px", display: "inline-block", border: "1px solid rgba(240,165,0,0.3)" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#B8860B" }}>🏆 Top 10 {inscripcionData.genero} · Recompensa desbloqueada</span>
            </div>
          )}
        </div>
        {isTop10() && <button style={{ ...styles.btnPrimary, marginBottom: 12 }} onClick={function() { go("rewards"); }}>Ver mi recompensa Top 10 →</button>}
        <button style={styles.btnSecondary} onClick={function() { go("app"); }}>Volver al inicio</button>
      </div>
    );
  }

  // ── CARRERA ACTIVA ──
  if (scr === "carrera") return W(
    <CarreraActiva
      onTerminar={function(tiempo, actividad) {
        if (msg === "Guardando...") return;
        guardarTiempoYActividad(tiempo, actividad);
      }}
      onBack={function() { go("app"); }}
    />
  );

  // ── REWARDS ──
  if (scr === "rewards") return W(
    <div style={{ padding: "0 24px 40px" }}>
      <div style={{ ...styles.header, padding: "52px 0 24px" }}>
        <div style={styles.backBtn} onClick={function() { go("app"); }}>←</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Recompensas</div>
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(240,165,0,0.12), rgba(240,165,0,0.04))", borderRadius: 24, padding: 28, textAlign: "center", marginBottom: 24, border: "1px solid rgba(240,165,0,0.2)" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Top 10 por Rama</div>
        <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>Los primeros 10 en llegar a la meta en categoría <strong style={{ color: C.text }}>Varonil</strong> y los primeros 10 en <strong style={{ color: C.text }}>Femenil</strong> obtienen:</div>
      </div>
      <div style={{ background: "linear-gradient(135deg, #1A1400, #201800)", borderRadius: 20, padding: 24, marginBottom: 16, border: "1px solid rgba(240,165,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(240,165,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🎟️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>50% de descuento</div>
            <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>En la preventa de la próxima carrera COD META 26. Exclusivo para los primeros 10 de cada categoría.</div>
            <div style={{ marginTop: 10, display: "inline-block", background: "rgba(240,165,0,0.15)", padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: C.gold, border: "1px solid rgba(240,165,0,0.25)" }}>Próximamente</div>
          </div>
        </div>
      </div>
      {isTop10() ? (
        <div style={{ ...styles.card, padding: 20, border: "1px solid rgba(0,200,150,0.2)", background: C.greenDim, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 4 }}>¡Felicidades! Estás en el Top 10 {inscripcionData ? inscripcionData.genero : ""}</div>
          <div style={{ fontSize: 13, color: C.textSub }}>Posición #{getPosRama(user ? user.uid : "")} en tu categoría. Recibirás tu descuento cuando anunciemos la próxima carrera.</div>
        </div>
      ) : (
        <div style={{ ...styles.card, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.6 }}>
            {inscripcionData && inscripcionData.tiempo
              ? "Tu posición actual es #" + getPosRama(user ? user.uid : "") + " en " + (inscripcionData.genero || "tu categoría") + ". El descuento es para los primeros 10."
              : "Inscríbete al evento, registra tu tiempo y termina entre los primeros 10 de tu categoría para ganar el descuento."}
          </div>
        </div>
      )}
    </div>
  );

  // ── MAP ──
  if (scr === "map") return W(
    <div style={{ padding: "0 24px 40px" }}>
      <div style={{ ...styles.header, padding: "52px 0 24px" }}>
        <div style={styles.backBtn} onClick={function() { go("app"); }}>←</div>
        <div><div style={{ fontSize: 18, fontWeight: 700 }}>Ruta del evento</div><div style={{ fontSize: 12, color: C.mutedLight, marginTop: 2 }}>5K · Cuernavaca, Morelos</div></div>
      </div>
      <div style={{ position: "relative", paddingLeft: 16 }}>
        {EVENTO.ruta.map(function(p, i) {
          var isF = i === 0, isL = i === EVENTO.ruta.length - 1;
          var color = isF ? C.green : isL ? C.accent : C.cyan;
          return (
            <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < EVENTO.ruta.length - 1 ? 4 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 16 }}>{isF ? "▶" : isL ? "🏁" : i}</div>
                {i < EVENTO.ruta.length - 1 && <div style={{ width: 2, flex: 1, background: "linear-gradient(" + color + ", " + (i === EVENTO.ruta.length - 2 ? C.accent : C.cyan) + ")", minHeight: 32, opacity: 0.3, marginTop: 4 }} />}
              </div>
              <div style={{ ...styles.card, flex: 1, padding: "14px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: color }}>{p.punto}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>Km {p.km}</div>
                </div>
                <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>{p.lugar}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── MAIN APP ──
  if (scr === "app" && userData) return W(
    <div style={{ paddingBottom: 100 }}>

      {/* ── HOME ── */}
      {tab === "home" && (
        <div>
          <div style={{ padding: "52px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: C.mutedLight, marginBottom: 4 }}>Hola,</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{userData.nombre.split(" ")[0]} 👋</div>
            </div>
            {inscritoEnEvento && inscripcionData ? (
              <div style={{ background: C.card, borderRadius: 16, padding: "10px 16px", textAlign: "center", border: "1px solid " + C.border }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, fontWeight: 700 }}>DORSAL</div>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.accent, lineHeight: 1.2 }}>#{inscripcionData.dorsal}</div>
              </div>
            ) : (
              <div style={{ background: C.accentDim, borderRadius: 16, padding: "10px 16px", textAlign: "center", border: "1px solid rgba(255,61,90,0.2)", cursor: "pointer" }} onClick={inscribirseAlEvento}>
                <div style={{ fontSize: 9, color: C.accent, letterSpacing: 1, fontWeight: 700 }}>INSCRIBIRME</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 4 }}>Gratis</div>
              </div>
            )}
          </div>

          <div style={{ margin: "0 24px 16px" }}>
            <div style={{ background: "linear-gradient(145deg, #0E1020, #141828)", borderRadius: 24, padding: 24, border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,90,0.08), transparent 70%)" }} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...styles.pill, background: evtPast ? C.greenDim : C.goldDim, color: evtPast ? C.green : C.gold, border: "1px solid " + (evtPast ? "rgba(0,200,150,0.2)" : "rgba(240,165,0,0.2)"), display: "inline-block", marginBottom: 12 }}>
                  {evtPast ? "✓ FINALIZADO" : "● PRÓXIMO EVENTO"}
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.15, marginBottom: 4 }}>Rumbo al Mundial</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.accent, lineHeight: 1.15 }}>Codigo 26</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: C.textSub, display: "flex", gap: 8 }}><span>📅</span><span>3 de mayo 2026 · 7:00 AM</span></div>
                <div style={{ fontSize: 13, color: C.textSub, display: "flex", gap: 8 }}><span>📍</span><span>Cuernavaca, Morelos</span></div>
                <div style={{ fontSize: 13, color: C.textSub, display: "flex", gap: 8 }}><span>🏃</span><span>{inscritos.length} inscritos · {lugaresDisp} lugares disponibles</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["5K", "Varonil", "Femenil"].map(function(d, i) {
                  return <span key={d} style={{ ...styles.pill, background: i === 0 ? C.accentDim : C.cyanDim, color: i === 0 ? C.accent : C.cyan, border: "1px solid " + (i === 0 ? "rgba(255,61,90,0.2)" : "rgba(0,194,224,0.15)") }}>{d}</span>;
                })}
              </div>
            </div>
          </div>

          <div style={{ margin: "0 24px 20px" }}>
            <Countdown target={EVENTO.fechaObj} />
          </div>

          {!inscritoEnEvento && (
            <div style={{ margin: "0 24px 20px" }}>
              <div style={{ background: "linear-gradient(135deg, #1A0008, #200010)", borderRadius: 20, padding: 20, border: "1px solid rgba(255,61,90,0.2)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>¿Listo para correr?</div>
                <div style={{ fontSize: 13, color: C.textSub, marginBottom: 16 }}>Obtén tu dorsal del 1 al 200 según el orden de inscripción. Quedan {lugaresDisp} lugares.</div>
                {err && <div style={{ fontSize: 12, color: C.accent, marginBottom: 10 }}>{err}</div>}
                {lugaresDisp > 0 ? (
                  <button style={styles.btnPrimary} onClick={inscribirseAlEvento}>Inscribirme al evento →</button>
                ) : (
                  <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "12px 0" }}>Cupo lleno</div>
                )}
              </div>
            </div>
          )}

          {inscripcionData && inscripcionData.tiempo && (
            <div style={{ margin: "0 24px 20px" }}>
              <div style={{ ...styles.card, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>MI TIEMPO OFICIAL</div>
                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green, letterSpacing: -1 }}>{inscripcionData.tiempo}</div>
                    <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>Pos #{getPosGeneral(user ? user.uid : "")} general · #{getPosRama(user ? user.uid : "")} {inscripcionData.genero}</div>
                  </div>
                  <button style={{ padding: "10px 16px", borderRadius: 14, background: C.accent, color: "#FFF", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13 }} onClick={function() { go("certificado"); }}>Ver →</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: "0 24px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: 1.5, marginBottom: 14 }}>ACCIONES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: "🗺️", label: "Ver ruta", action: function() { go("map"); } },
                { icon: "🏆", label: "Rankings", action: function() { goTab("leaderboard"); } },
                { icon: "🎟️", label: "Recompensas", action: function() { go("rewards"); } },
                { icon: "🔍", label: "Buscar", action: function() { goTab("search"); } },
              ].map(function(a) {
                return (
                  <button key={a.label} style={{ ...styles.card, padding: "18px 16px", display: "flex", alignItems: "center", gap: 12, border: "1px solid " + C.border, cursor: "pointer", background: C.card }} onClick={a.action}>
                    <span style={{ fontSize: 22 }}>{a.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{a.label}</span>
                  </button>
                );
              })}
              {inscritoEnEvento && (
                <button style={{ ...styles.card, padding: "18px 16px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(0,200,150,0.2)", background: C.greenDim, cursor: "pointer", gridColumn: "span 2" }} onClick={function() { go("carrera"); }}>
                  <span style={{ fontSize: 22 }}>⏱️</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Iniciar carrera</div>
                    <div style={{ fontSize: 12, color: C.textSub }}>GPS + cronómetro + certificado</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BUSCAR ── */}
      {tab === "search" && (
        <div style={{ padding: "52px 24px 0" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Buscar corredor</div>
          <div style={{ display: "flex", alignItems: "center", background: C.card, borderRadius: 16, padding: "4px 16px", marginBottom: 20, border: "1px solid " + C.border }}>
            <span style={{ fontSize: 16, marginRight: 10, color: C.muted }}>🔍</span>
            <input style={{ ...styles.input, border: "none", background: "transparent", marginBottom: 0, padding: "14px 0", fontSize: 15 }} placeholder="Nombre o número de dorsal..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
          </div>
          {loadingC ? (
            <div style={{ textAlign: "center", padding: 60, color: C.muted }}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏃</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{search ? "Sin resultados" : "Aún no hay inscritos"}</div>
              <div style={{ fontSize: 14, color: C.mutedLight }}>{search ? "Intenta con otro nombre o dorsal" : "Sé el primero en inscribirte"}</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{filtered.length} corredor{filtered.length !== 1 ? "es" : ""}</div>
              {filtered.map(function(c) {
                return (
                  <div key={c.id} style={{ ...styles.card, display: "flex", alignItems: "center", padding: 16, marginBottom: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: C.accentDim, border: "1px solid rgba(255,61,90,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.accent, fontSize: 15, flexShrink: 0, marginRight: 14, fontFamily: "'JetBrains Mono',monospace" }}>{c.dorsal}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nombre}</div>
                      <div style={{ fontSize: 12, color: C.textSub, marginTop: 3 }}>{c.genero} · Dorsal #{c.dorsal}</div>
                    </div>
                    {c.tiempo ? (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>{c.tiempo}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{calcRitmo(c.tiempo, 5)} /km</div>
                      </div>
                    ) : (
                      <div style={{ ...styles.pill, background: C.card, color: C.muted, border: "1px solid " + C.border, fontSize: 11 }}>Sin tiempo</div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {tab === "leaderboard" && (
        <div style={{ padding: "52px 24px 0" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Ranking · Codigo 26</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["Todas", "Varonil", "Femenil"].map(function(r) {
              return (
                <button key={r} onClick={function() { setRamaF(r); }} style={{ padding: "9px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", background: ramaF === r ? C.accent : C.card, color: ramaF === r ? "#FFF" : C.textSub, border: "1px solid " + (ramaF === r ? C.accent : C.border), fontFamily: "inherit" }}>{r}</button>
              );
            })}
          </div>
          {loadingC ? (
            <div style={{ textAlign: "center", padding: 60, color: C.muted }}>Cargando ranking...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Ranking vacío</div>
              <div style={{ fontSize: 14, color: C.mutedLight }}>Los resultados aparecerán cuando los corredores registren sus tiempos</div>
            </div>
          ) : (
            <>
              {leaderboard.slice(0, 3).length === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {leaderboard.slice(0, 3).map(function(c, i) {
                    var emo = ["🥇", "🥈", "🥉"][i];
                    var bg = ["rgba(240,165,0,0.1)", "rgba(180,180,180,0.08)", "rgba(180,100,50,0.08)"][i];
                    var border = ["rgba(240,165,0,0.25)", "rgba(180,180,180,0.15)", "rgba(180,100,50,0.15)"][i];
                    return (
                      <div key={c.id} style={{ background: bg, borderRadius: 18, padding: "16px 12px", textAlign: "center", border: "1px solid " + border }}>
                        <div style={{ fontSize: 30, marginBottom: 8 }}>{emo}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{c.nombre.split(" ").slice(0, 2).join(" ")}</div>
                        {c.tiempo && <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>{c.tiempo}</div>}
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{c.genero}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {leaderboard.slice(leaderboard.length >= 3 ? 3 : 0).map(function(c, i) {
                var pos = (leaderboard.length >= 3 ? 3 : 0) + i + 1;
                return (
                  <div key={c.id} style={{ ...styles.card, display: "flex", alignItems: "center", padding: 16, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, marginRight: 14, color: C.mutedLight }}>#{pos}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{c.nombre}</div>
                      <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>Dorsal #{c.dorsal} · {c.genero}</div>
                    </div>
                    {c.tiempo ? (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>{c.tiempo}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{calcRitmo(c.tiempo, 5)}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: C.muted }}>Sin tiempo</div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ── PERFIL ── */}
      {tab === "profile" && (
        <div style={{ padding: "52px 24px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 88, height: 88, borderRadius: 28, background: "linear-gradient(135deg, #FF3D5A, #D4002D)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, margin: "0 auto 16px" }}>{ini(userData.nombre)}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{userData.nombre}</div>
            <div style={{ fontSize: 14, color: C.mutedLight, marginTop: 4 }}>{userData.correo}</div>
          </div>

          {inscritoEnEvento && inscripcionData ? (
            <div style={{ background: "linear-gradient(135deg, #1A0008, #200010)", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 16, border: "1px solid rgba(255,61,90,0.2)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: 3, marginBottom: 8 }}>DORSAL · CODIGO 26</div>
              <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: "#FFF", letterSpacing: -2 }}>#{inscripcionData.dorsal}</div>
              <div style={{ fontSize: 12, color: C.textSub, marginTop: 6 }}>Inscripción #{inscripcionData.dorsal} de {EVENTO.cupoMax} · {inscripcionData.fechaInscripcion}</div>
            </div>
          ) : (
            <div style={{ ...styles.card, padding: 20, marginBottom: 16, textAlign: "center", border: "1px solid rgba(255,61,90,0.15)" }}>
              <div style={{ fontSize: 13, color: C.textSub, marginBottom: 12 }}>Aún no te has inscrito al evento</div>
              <button style={{ padding: "11px 24px", borderRadius: 14, background: C.accent, color: "#FFF", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }} onClick={function() { goTab("home"); }}>Inscribirme ahora</button>
            </div>
          )}

          {inscripcionData && inscripcionData.tiempo && (
            <div style={{ ...styles.card, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>MI RESULTADO</div>
              <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green, letterSpacing: -1, marginBottom: 6 }}>{inscripcionData.tiempo}</div>
              <div style={{ fontSize: 13, color: C.textSub, marginBottom: 12 }}>
                Pos #{getPosGeneral(user ? user.uid : "")} general · #{getPosRama(user ? user.uid : "")} {inscripcionData.genero}
                {isTop10() && <span style={{ color: C.gold, fontWeight: 700 }}> · 🏆 Top 10</span>}
              </div>
              <button style={{ ...styles.btnSecondary, fontSize: 14, padding: "12px 16px" }} onClick={function() { go("certificado"); }}>Ver mi certificado</button>
            </div>
          )}

          <div style={{ ...styles.card, padding: "8px 20px", marginBottom: 16 }}>
            {[["Nombre", userData.nombre], ["Correo", userData.correo], ["Género", userData.genero || "-"], ["Teléfono", userData.telefono || "-"], ["Talla", userData.talla || "-"], ["Cuenta desde", userData.fechaReg || "-"]].map(function(row) {
              return (
                <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid " + C.border }}>
                  <span style={{ fontSize: 14, color: C.mutedLight }}>{row[0]}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, textAlign: "right", maxWidth: "58%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row[1]}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
            {inscritoEnEvento && <button style={styles.btnSecondary} onClick={function() { go("carrera"); }}>⏱️ Iniciar carrera</button>}
            <button style={styles.btnSecondary} onClick={function() { go("rewards"); }}>🎟️ Ver recompensas</button>
            <button style={{ ...styles.btnSecondary, color: C.accent, borderColor: "rgba(255,61,90,0.2)" }} onClick={doLogout}>Cerrar sesión</button>
          </div>
        </div>
      )}

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        {[{ id: "home", icon: "⬜", label: "Inicio" }, { id: "search", icon: "🔍", label: "Buscar" }, { id: "leaderboard", icon: "🏆", label: "Rankings" }, { id: "profile", icon: "👤", label: "Perfil" }].map(function(t) {
          var active = tab === t.id;
          return (
            <div key={t.id} onClick={function() { goTab(t.id); }} style={{ textAlign: "center", cursor: "pointer", flex: 1, position: "relative" }}>
              {active && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 32, height: 3, borderRadius: 2, background: C.accent }} />}
              <div style={{ fontSize: 20, opacity: active ? 1 : 0.35, marginBottom: 4 }}>{t.id === "home" ? "🏠" : t.id === "search" ? "🔍" : t.id === "leaderboard" ? "🏆" : "👤"}</div>
              <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.accent : C.muted, letterSpacing: 0.3 }}>{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return W(<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><div style={{ fontSize: 14, color: C.muted }}>Cargando...</div></div>);
}
