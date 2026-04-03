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
