import { useState } from "react";

const C = {
  navy: "#0B0E1A", deep: "#0F1B3D", royal: "#162350",
  coral: "#FF4D6A", gold: "#F5A623", cyan: "#00D4FF",
  white: "#FFFFFF", cloud: "#F0F2F7", pave: "#8A8FA3",
  asph: "#2A2D3E", body: "#3A3D4E", green: "#10B981",
  greenBg: "#ECFDF5", greenBd: "#6EE7B7",
  amberBg: "#FFFBEB", amberBd: "#FCD34D", amber: "#D97706",
  redBg: "#FEF2F2", redBd: "#FCA5A5", red: "#DC2626",
};

const mvpFeatures = [
  {
    id: "search",
    name: "B\u00FAsqueda de corredor",
    icon: "\uD83D\uDD0D",
    time: "5 d\u00EDas",
    priority: 1,
    reason: "Sin esto no hay app. Es la puerta de entrada a todo. El corredor necesita encontrar su resultado en menos de 10 segundos.",
    includes: [
      "Campo de b\u00FAsqueda por n\u00FAmero de dorsal",
      "Campo de b\u00FAsqueda por nombre",
      "Lista de resultados din\u00E1mica",
      "Selecci\u00F3n de evento activo",
    ],
    notIncludes: [
      "Filtros avanzados (g\u00E9nero, categor\u00EDa, distancia)",
      "B\u00FAsqueda en tiempo real mientras escribes",
      "Historial de b\u00FAsquedas recientes",
    ],
  },
  {
    id: "result",
    name: "Pantalla de resultado",
    icon: "\u23F1\uFE0F",
    time: "7 d\u00EDas",
    priority: 1,
    reason: "Es el coraz\u00F3n de toda la experiencia. Si esta pantalla no emociona, nada m\u00E1s importa. Aqu\u00ED el corredor ve su tiempo y siente que su logro vale.",
    includes: [
      "Tiempo oficial grande y destacado",
      "Posici\u00F3n general y por categor\u00EDa",
      "Nombre, dorsal y categor\u00EDa del corredor",
      "Ritmo promedio (min/km)",
      "Frase motivacional b\u00E1sica (5-6 frases seg\u00FAn posici\u00F3n)",
      "Animaci\u00F3n sutil de entrada del resultado",
    ],
    notIncludes: [
      "Animaci\u00F3n de revelaci\u00F3n tipo \u201Csobre que se abre\u201D",
      "Tiempos parciales / splits",
      "Gr\u00E1fico de ritmo por kil\u00F3metro",
      "Comparaci\u00F3n con carreras anteriores",
    ],
  },
  {
    id: "medal",
    name: "Medalla digital",
    icon: "\uD83C\uDFC5",
    time: "5 d\u00EDas",
    priority: 1,
    reason: "Es lo que hace a Meta 26 diferente de una tabla de Excel. La medalla convierte un dato en una experiencia emocional. Sin ella, somos solo otra app de resultados.",
    includes: [
      "Imagen de medalla personalizada por evento",
      "Nombre del corredor en la medalla",
      "Animaci\u00F3n b\u00E1sica de desbloqueo (fade in + escala)",
      "Bot\u00F3n para descargar como imagen",
    ],
    notIncludes: [
      "Medalla 3D con rotaci\u00F3n interactiva",
      "Efecto de giroscopio/inclinaci\u00F3n",
      "Confeti y part\u00EDculas al desbloquear",
      "Sonido y vibraci\u00F3n",
    ],
  },
  {
    id: "certificate",
    name: "Certificado descargable",
    icon: "\uD83D\uDCC4",
    time: "5 d\u00EDas",
    priority: 1,
    reason: "Los corredores quieren algo tangible que puedan guardar, imprimir o enmarcar. Es la prueba oficial de su logro y uno de los features m\u00E1s solicitados en carreras.",
    includes: [
      "Certificado generado como imagen (PNG)",
      "Datos del corredor: nombre, tiempo, posici\u00F3n, evento",
      "Logo del evento en el certificado",
      "Bot\u00F3n de descarga directa a galer\u00EDa",
    ],
    notIncludes: [
      "Versi\u00F3n PDF",
      "C\u00F3digo QR de verificaci\u00F3n",
      "N\u00FAmero de folio \u00FAnico",
      "Firma digital del organizador",
      "Dise\u00F1o personalizable por evento",
    ],
  },
  {
    id: "share",
    name: "Compartir resultado",
    icon: "\uD83D\uDD17",
    time: "3 d\u00EDas",
    priority: 1,
    reason: "Es el motor de crecimiento org\u00E1nico. Cada vez que un corredor comparte su resultado, Meta 26 llega a decenas de personas. Marketing gratuito en cada publicaci\u00F3n.",
    includes: [
      "Generar imagen atractiva con datos del corredor",
      "Formato optimizado para Instagram Stories (1080\u00D71920)",
      "Logo de Meta 26 como marca de agua sutil",
      "Men\u00FA nativo de compartir (WhatsApp, Instagram, etc.)",
    ],
    notIncludes: [
      "Formato cuadrado para feed",
      "Formato para Twitter/X",
      "Imagen animada (GIF/video)",
      "Personalizar colores de la imagen",
    ],
  },
  {
    id: "leaderboard",
    name: "Leaderboard b\u00E1sico",
    icon: "\uD83C\uDFC6",
    time: "5 d\u00EDas",
    priority: 2,
    reason: "Los corredores competitivos necesitan ver la clasificaci\u00F3n. Pero un leaderboard b\u00E1sico con scroll y un filtro de distancia es suficiente para el MVP.",
    includes: [
      "Tabla de posiciones con nombre, dorsal y tiempo",
      "Filtro por distancia (5K, 10K, 21K, 42K)",
      "Scroll para navegar la lista completa",
      "Indicador de \u00ABt\u00FA est\u00E1s aqu\u00ED\u00BB si est\u00E1 logueado",
    ],
    notIncludes: [
      "Podio visual animado (top 3)",
      "Filtros de g\u00E9nero y categor\u00EDa de edad",
      "Bot\u00F3n \u00ABIr a mi posici\u00F3n\u00BB",
      "B\u00FAsqueda dentro del leaderboard",
    ],
  },
  {
    id: "auth",
    name: "Registro y login",
    icon: "\uD83D\uDD10",
    time: "4 d\u00EDas",
    priority: 2,
    reason: "Necesario para que el corredor guarde sus resultados y medallas. Pero en el MVP se mantiene m\u00EDnimo: solo correo + contrase\u00F1a y opcionalmente Google.",
    includes: [
      "Registro con correo y contrase\u00F1a",
      "Login con correo y contrase\u00F1a",
      "Login con Google (opcional pero recomendado)",
      "Pantalla simple de perfil con nombre y correo",
    ],
    notIncludes: [
      "Login con Apple",
      "Verificaci\u00F3n de correo electr\u00F3nico",
      "Recuperaci\u00F3n de contrase\u00F1a",
      "Foto de perfil",
      "Editar datos personales",
    ],
  },
  {
    id: "event",
    name: "Selecci\u00F3n de evento",
    icon: "\uD83C\uDFC3",
    time: "2 d\u00EDas",
    priority: 2,
    reason: "La app necesita saber en qu\u00E9 carrera particip\u00F3 el corredor. Pero en el MVP, si solo hay 1-2 eventos, basta con una lista simple.",
    includes: [
      "Lista de eventos disponibles con nombre y fecha",
      "Seleccionar el evento activo",
      "Logo del evento en la pantalla principal",
    ],
    notIncludes: [
      "B\u00FAsqueda de eventos",
      "Historial de eventos pasados",
      "Filtros por ciudad o fecha",
      "Mapa con ubicaci\u00F3n del evento",
    ],
  },
];

const v2Features = [
  {
    name: "Insignias y logros gamificados",
    icon: "\u2B50",
    reason: "Necesitas suficientes eventos y datos acumulados para que las insignias tengan sentido. Con solo 1-2 eventos, no hay suficiente historial para desbloquear logros como \u00ABImparable\u00BB (3 carreras) o \u00ABLeyenda Local\u00BB (5 ediciones).",
    phase: "Fase 2",
    effort: "2-3 semanas",
  },
  {
    name: "Galer\u00EDa de fotos del evento",
    icon: "\uD83D\uDCF7",
    reason: "Requiere coordinaci\u00F3n con fot\u00F3grafos, almacenamiento masivo de im\u00E1genes, y un sistema de etiquetado por dorsal. Es caro en infraestructura y complejo de implementar bien.",
    phase: "Fase 2",
    effort: "3-4 semanas",
  },
  {
    name: "Cupones y patrocinadores",
    icon: "\uD83C\uDF81",
    reason: "Primero necesitas demostrar que la app tiene usuarios activos. Los patrocinadores solo pagar\u00E1n cuando vean m\u00E9tricas reales de engagement. Construye la audiencia primero.",
    phase: "Fase 2",
    effort: "2 semanas",
  },
  {
    name: "Animaciones avanzadas",
    icon: "\u2728",
    reason: "Confeti, part\u00EDculas, revelaci\u00F3n con suspenso, medalla 3D con giroscopio... todo esto es \u201Ccrema del pastel\u201D. La experiencia b\u00E1sica debe funcionar primero con animaciones simples y luego se enriquece.",
    phase: "Fase 2",
    effort: "1-2 semanas",
  },
  {
    name: "Experiencia Wrapped de fin de a\u00F1o",
    icon: "\uD83D\uDCC6",
    reason: "Necesitas un a\u00F1o completo de datos para que el resumen tenga contenido. Literalmente no puedes construirlo hasta que haya suficiente historial.",
    phase: "Fase 3",
    effort: "3 semanas",
  },
  {
    name: "Panel de administraci\u00F3n para organizadores",
    icon: "\u2699\uFE0F",
    reason: "En el MVP, t\u00FA (el desarrollador) subes los datos manualmente a la base de datos. Cuando tengas 5+ organizadores usando la app, ah\u00ED s\u00ED necesitas un panel web para que ellos mismos lo hagan.",
    phase: "Fase 3",
    effort: "4-6 semanas",
  },
  {
    name: "Red social b\u00E1sica (seguir, likes)",
    icon: "\uD83D\uDC65",
    reason: "Una red social necesita masa cr\u00EDtica de usuarios. Con pocos usuarios, se siente vac\u00EDa y abandona. Primero crece la base, luego agrega interacci\u00F3n social.",
    phase: "Fase 3",
    effort: "4-5 semanas",
  },
  {
    name: "Integraci\u00F3n Garmin, Strava, Apple Watch",
    icon: "\u231A",
    reason: "Requiere APIs externas, certificaciones de cada plataforma y testing extensivo. Es un proyecto en s\u00ED mismo que no agrega valor al core de la experiencia post-carrera.",
    phase: "Fase 4",
    effort: "6-8 semanas",
  },
  {
    name: "Reconocimiento facial en fotos",
    icon: "\uD83E\uDDE0",
    reason: "Tecnolog\u00EDa costosa (requiere servicios como AWS Rekognition o Google Vision) y con implicaciones de privacidad. Solo vale la pena con miles de fotos y usuarios.",
    phase: "Fase 4",
    effort: "4-6 semanas",
  },
  {
    name: "Tracking GPS en vivo",
    icon: "\uD83D\uDCE1",
    reason: "Requiere hardware especializado, infraestructura de tiempo real y es un producto completamente diferente. No es parte de la experiencia post-carrera.",
    phase: "Fase 4",
    effort: "8-12 semanas",
  },
];

const tabs = ["Resumen", "MVP: Qu\u00E9 s\u00ED", "V2+: Qu\u00E9 no", "Cronograma", "Decisi\u00F3n"];

function Tag({ children, color, bg, border }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, background: bg, color, border: `1px solid ${border}`,
      letterSpacing: "0.02em",
    }}>{children}</span>
  );
}

export default function MVPRoadmap() {
  const [tab, setTab] = useState(0);
  const [expandedMvp, setExpandedMvp] = useState(null);
  const [expandedV2, setExpandedV2] = useState(null);

  const totalDays = mvpFeatures.reduce((sum, f) => sum + parseInt(f.time), 0);

  return (
    <div style={{ fontFamily: "'Nunito Sans', 'Segoe UI', system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 0 40px" }}>

      {/* HERO */}
      <div style={{
        background: C.navy, borderRadius: 20, padding: "36px 28px 32px",
        marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `repeating-linear-gradient(90deg, transparent, transparent 68px, rgba(255,255,255,0.02) 68px, rgba(255,255,255,0.02) 70px)`,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.coral, letterSpacing: "0.15em" }}>META 26</span>
            <span style={{ fontSize: 11, color: C.pave }}>\u2022</span>
            <span style={{ fontSize: 11, color: C.pave, letterSpacing: "0.05em" }}>ROADMAP DEL PRODUCTO</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.white, margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Plan MVP
          </h1>
          <p style={{ fontSize: 15, color: C.pave, margin: 0, lineHeight: 1.5 }}>
            La versi\u00F3n m\u00EDnima viable que necesitas construir primero.
            <br/>Lo esencial para que funcione, emocione y se pueda probar con corredores reales.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { label: "Funciones MVP", value: mvpFeatures.length, color: C.green },
              { label: "D\u00EDas estimados", value: totalDays, color: C.cyan },
              { label: "Funciones V2+", value: v2Features.length, color: C.gold },
              { label: "Semanas aprox.", value: Math.ceil(totalDays / 5), color: C.coral },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px",
                flex: "1 1 100px", minWidth: 100,
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.pave, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex", gap: 3, marginBottom: 20, overflowX: "auto",
        background: C.cloud, borderRadius: 12, padding: 4,
      }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: "9px 16px", borderRadius: 9, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, transition: "all 0.2s", flex: 1, minWidth: 80,
            background: tab === i ? C.white : "transparent",
            color: tab === i ? C.navy : C.pave,
            boxShadow: tab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{t}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ═══ TAB 0: RESUMEN ═══ */}
        {tab === 0 && <>
          <div style={{
            background: C.greenBg, border: `1px solid ${C.greenBd}`, borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.green, marginBottom: 8 }}>
              \u00BFQu\u00E9 es un MVP y por qu\u00E9 importa?
            </div>
            <p style={{ fontSize: 14, color: C.body, lineHeight: 1.7, margin: 0 }}>
              MVP significa Producto M\u00EDnimo Viable. Es la versi\u00F3n m\u00E1s peque\u00F1a de tu app que a\u00FAn
              funciona y entrega valor real al usuario. La idea es simple: no construyas todo de una vez.
              Construye lo esencial, pru\u00E9balo con corredores reales, aprende qu\u00E9 funciona y qu\u00E9 no,
              y luego agrega m\u00E1s. As\u00ED evitas gastar meses construyendo algo que nadie quiere.
            </p>
          </div>

          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginTop: 4 }}>
            La pregunta clave para decidir qu\u00E9 entra al MVP:
          </div>
          <div style={{
            background: C.navy, borderRadius: 14, padding: "20px 24px",
            fontSize: 17, fontWeight: 700, color: C.white, textAlign: "center",
            lineHeight: 1.5, fontStyle: "italic",
          }}>
            \u00ABSi quito esta funci\u00F3n, <span style={{ color: C.coral }}>\u00BFla app deja de tener sentido?</span>\u00BB
            <div style={{ fontSize: 12, color: C.pave, fontWeight: 400, fontStyle: "normal", marginTop: 8 }}>
              Si la respuesta es s\u00ED \u2192 va al MVP. Si la respuesta es no \u2192 puede esperar.
            </div>
          </div>

          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginTop: 8 }}>Resultado del an\u00E1lisis:</div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              flex: "1 1 200px", background: C.greenBg, border: `1px solid ${C.greenBd}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.green }}>{mvpFeatures.length}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>Funciones en el MVP</div>
              <div style={{ fontSize: 12, color: C.pave, marginTop: 4 }}>Lo que s\u00ED construyes ahora</div>
            </div>
            <div style={{
              flex: "1 1 200px", background: C.amberBg, border: `1px solid ${C.amberBd}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.amber }}>{v2Features.length}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.amber }}>Funciones para despu\u00E9s</div>
              <div style={{ fontSize: 12, color: C.pave, marginTop: 4 }}>Lo que dejas para V2, V3, V4</div>
            </div>
          </div>

          <div style={{
            background: C.cloud, borderRadius: 12, padding: "16px 20px",
            borderLeft: `4px solid ${C.cyan}`, marginTop: 4,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>La regla de oro del MVP de Meta 26:</div>
            <p style={{ fontSize: 13, color: C.body, lineHeight: 1.6, margin: 0 }}>
              Un corredor debe poder abrir la app, buscar su nombre, ver su tiempo oficial,
              descargar su medalla y certificado, y compartirlo en Instagram en menos de 2 minutos.
              Si puede hacer eso, el MVP est\u00E1 completo.
            </p>
          </div>
        </>}

        {/* ═══ TAB 1: MVP ═══ */}
        {tab === 1 && <>
          <div style={{ fontSize: 14, color: C.body, lineHeight: 1.6, marginBottom: 4 }}>
            Estas son las {mvpFeatures.length} funciones que <strong>s\u00ED debes construir</strong> para la primera versi\u00F3n.
            Toca cada una para ver el detalle de qu\u00E9 incluye y qu\u00E9 se simplifica.
          </div>

          {mvpFeatures.map((f, i) => {
            const open = expandedMvp === i;
            return (
              <div key={f.id} style={{
                background: C.white, border: `1px solid ${open ? C.green : "#E8EAF0"}`,
                borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s",
              }}>
                <div
                  onClick={() => setExpandedMvp(open ? null : i)}
                  style={{
                    padding: "16px 20px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: 14,
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{f.name}</span>
                      <Tag color={f.priority === 1 ? C.green : C.cyan} bg={f.priority === 1 ? C.greenBg : "#EBF8FF"} border={f.priority === 1 ? C.greenBd : "#7DD3FC"}>
                        {f.priority === 1 ? "Cr\u00EDtica" : "Importante"}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: C.pave, marginTop: 2 }}>{f.time} de desarrollo estimado</div>
                  </div>
                  <span style={{
                    fontSize: 18, color: C.pave, transition: "transform 0.2s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}>\u25BC</span>
                </div>

                {open && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.cloud}` }}>
                    <div style={{
                      background: C.cloud, borderRadius: 10, padding: "12px 16px",
                      margin: "16px 0 14px", fontSize: 13, color: C.body, lineHeight: 1.6,
                      borderLeft: `3px solid ${C.coral}`,
                    }}>
                      <strong style={{ color: C.navy }}>\u00BFPor qu\u00E9 est\u00E1 en el MVP?</strong><br/>{f.reason}
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 200px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em", marginBottom: 8 }}>
                          \u2713 S\u00CD INCLUYE EN EL MVP
                        </div>
                        {f.includes.map(item => (
                          <div key={item} style={{
                            fontSize: 13, color: C.body, padding: "5px 0",
                            borderBottom: `1px solid ${C.cloud}`, display: "flex", gap: 8,
                          }}>
                            <span style={{ color: C.green, flexShrink: 0 }}>\u2713</span> {item}
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: "1 1 200px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.pave, letterSpacing: "0.08em", marginBottom: 8 }}>
                          \u2717 SE SIMPLIFICA / DEJA PARA V2
                        </div>
                        {f.notIncludes.map(item => (
                          <div key={item} style={{
                            fontSize: 13, color: C.pave, padding: "5px 0",
                            borderBottom: `1px solid ${C.cloud}`, display: "flex", gap: 8,
                            textDecoration: "line-through", opacity: 0.7,
                          }}>
                            <span style={{ flexShrink: 0 }}>\u2717</span> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>}

        {/* ═══ TAB 2: V2+ ═══ */}
        {tab === 2 && <>
          <div style={{ fontSize: 14, color: C.body, lineHeight: 1.6, marginBottom: 4 }}>
            Estas {v2Features.length} funciones son importantes pero <strong>no deben estar en la primera versi\u00F3n</strong>.
            Cada una tiene una raz\u00F3n concreta para esperar. Toca para ver el detalle.
          </div>

          {v2Features.map((f, i) => {
            const open = expandedV2 === i;
            const phaseColor = f.phase === "Fase 2" ? C.amber : f.phase === "Fase 3" ? C.coral : "#8B5CF6";
            const phaseBg = f.phase === "Fase 2" ? C.amberBg : f.phase === "Fase 3" ? C.redBg : "#F5F3FF";
            const phaseBd = f.phase === "Fase 2" ? C.amberBd : f.phase === "Fase 3" ? C.redBd : "#C4B5FD";
            return (
              <div key={f.name} style={{
                background: C.white, border: `1px solid ${open ? phaseBd : "#E8EAF0"}`,
                borderRadius: 14, overflow: "hidden",
              }}>
                <div
                  onClick={() => setExpandedV2(open ? null : i)}
                  style={{
                    padding: "14px 20px", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: 14,
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0, opacity: 0.5 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.pave }}>{f.name}</span>
                      <Tag color={phaseColor} bg={phaseBg} border={phaseBd}>{f.phase}</Tag>
                    </div>
                    <div style={{ fontSize: 12, color: C.pave, marginTop: 2 }}>Esfuerzo estimado: {f.effort}</div>
                  </div>
                  <span style={{
                    fontSize: 16, color: C.pave, transition: "transform 0.2s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}>\u25BC</span>
                </div>

                {open && (
                  <div style={{
                    padding: "12px 20px 16px", borderTop: `1px solid ${C.cloud}`,
                    background: C.cloud,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, letterSpacing: "0.06em", marginBottom: 6 }}>
                      \u00BFPOR QU\u00C9 NO VA EN EL MVP?
                    </div>
                    <p style={{ fontSize: 13, color: C.body, lineHeight: 1.6, margin: 0 }}>{f.reason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </>}

        {/* ═══ TAB 3: CRONOGRAMA ═══ */}
        {tab === 3 && <>
          <div style={{ fontSize: 14, color: C.body, lineHeight: 1.6, marginBottom: 8 }}>
            As\u00ED se ver\u00EDa el calendario de desarrollo del MVP si trabajas tiempo completo.
            Los tiempos son aproximados y pueden variar seg\u00FAn tu experiencia.
          </div>

          {[
            { week: "Semana 1-2", title: "Base t\u00E9cnica + B\u00FAsqueda", color: C.cyan, items: [
              "Configurar proyecto (React Native + Supabase)",
              "Crear base de datos y subir datos de prueba",
              "Pantalla de b\u00FAsqueda de corredor funcionando",
              "Pantalla de selecci\u00F3n de evento",
            ]},
            { week: "Semana 3-4", title: "Resultado + Medalla", color: C.coral, items: [
              "Pantalla de resultado con datos reales",
              "Frase motivacional seg\u00FAn posici\u00F3n",
              "Medalla digital con animaci\u00F3n b\u00E1sica",
              "Descarga de medalla como imagen",
            ]},
            { week: "Semana 5-6", title: "Certificado + Compartir", color: C.gold, items: [
              "Generaci\u00F3n de certificado como imagen",
              "Descarga a galer\u00EDa del tel\u00E9fono",
              "Imagen para compartir en redes",
              "Integraci\u00F3n con men\u00FA nativo de compartir",
            ]},
            { week: "Semana 7", title: "Leaderboard + Auth", color: C.green, items: [
              "Tabla de posiciones con filtro por distancia",
              "Registro e inicio de sesi\u00F3n b\u00E1sico",
              "Perfil simple del corredor",
            ]},
            { week: "Semana 8", title: "Pulir + Prueba piloto", color: "#8B5CF6", items: [
              "Corregir errores y pulir animaciones",
              "Pruebas en Android e iOS",
              "Probar con 10-20 corredores reales",
              "Ajustar seg\u00FAn feedback",
              "\u00A1Lanzar con un evento real peque\u00F1o!",
            ]},
          ].map((phase, pi) => (
            <div key={phase.week} style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", background: phase.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: C.white, flexShrink: 0, zIndex: 1,
                }}>{pi + 1}</div>
                {pi < 4 && <div style={{ width: 2, flex: 1, background: C.cloud, marginTop: 4 }} />}
              </div>
              {/* Content */}
              <div style={{
                flex: 1, background: C.white, border: "1px solid #E8EAF0", borderRadius: 12,
                padding: "14px 18px", marginBottom: 8,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, letterSpacing: "0.06em" }}>{phase.week}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "4px 0 10px" }}>{phase.title}</div>
                {phase.items.map(item => (
                  <div key={item} style={{
                    fontSize: 13, color: C.body, padding: "4px 0",
                    display: "flex", gap: 8, alignItems: "flex-start",
                  }}>
                    <span style={{ color: phase.color, fontSize: 8, marginTop: 5 }}>\u25CF</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{
            background: C.navy, borderRadius: 12, padding: "16px 20px",
            textAlign: "center", marginTop: 4,
          }}>
            <div style={{ fontSize: 11, color: C.pave, letterSpacing: "0.08em", marginBottom: 4 }}>OBJETIVO</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>
              MVP listo en <span style={{ color: C.coral }}>8 semanas</span> con prueba piloto incluida
            </div>
            <div style={{ fontSize: 12, color: C.pave, marginTop: 6 }}>
              Con un equipo de 2-3 personas, se puede reducir a 5-6 semanas
            </div>
          </div>
        </>}

        {/* ═══ TAB 4: DECISI\u00D3N ═══ */}
        {tab === 4 && <>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            Gu\u00EDa r\u00E1pida para decidir si algo va en el MVP
          </div>

          <div style={{
            background: C.white, border: "1px solid #E8EAF0", borderRadius: 14,
            overflow: "hidden",
          }}>
            {[
              { q: "\u00BFEl corredor puede ver su resultado sin esta funci\u00F3n?", yes: "No va en el MVP", no: "S\u00CD va en el MVP", yesC: C.green, noC: C.coral },
              { q: "\u00BFNecesita datos de m\u00FAltiples eventos para funcionar?", yes: "D\u00E9jala para V2+", no: "Puede ir en el MVP", yesC: C.amber, noC: C.green },
              { q: "\u00BFRequiere coordinaci\u00F3n con terceros (fot\u00F3grafos, sponsors)?", yes: "D\u00E9jala para V2+", no: "Puede ir en el MVP", yesC: C.amber, noC: C.green },
              { q: "\u00BFToma m\u00E1s de 2 semanas construirla bien?", yes: "Simplif\u00EDcala o d\u00E9jala", no: "Puede ir en el MVP", yesC: C.amber, noC: C.green },
              { q: "\u00BFEl corredor la pedir\u00EDa en los primeros 5 minutos de uso?", yes: "S\u00ED va en el MVP", no: "Puede esperar", yesC: C.green, noC: C.pave },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "14px 20px", borderBottom: i < 4 ? `1px solid ${C.cloud}` : "none",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{item.q}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, textAlign: "center",
                    fontSize: 12, fontWeight: 600, background: C.greenBg,
                    color: item.yesC, border: `1px solid ${C.greenBd}`,
                  }}>S\u00ED \u2192 {item.yes}</div>
                  <div style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, textAlign: "center",
                    fontSize: 12, fontWeight: 600, background: C.cloud,
                    color: item.noC, border: `1px solid #E0E2EA`,
                  }}>No \u2192 {item.no}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${C.navy} 0%, ${C.royal} 100%)`,
            borderRadius: 14, padding: "24px",
            marginTop: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, letterSpacing: "0.12em", marginBottom: 10 }}>
              RESUMEN EJECUTIVO
            </div>
            <div style={{ fontSize: 15, color: C.white, lineHeight: 1.7, marginBottom: 16 }}>
              El MVP de Meta 26 se enfoca en <strong>una sola promesa</strong>: que un corredor pueda
              encontrar su resultado, emocionarse con su medalla digital, descargar su certificado
              y compartirlo en redes sociales. Todo lo dem\u00E1s es mejora incremental.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Lanza", desc: "con 1 evento peque\u00F1o (200-500 corredores)", icon: "\uD83D\uDE80" },
                { label: "Mide", desc: "cu\u00E1ntos descargan la medalla y comparten", icon: "\uD83D\uDCCA" },
                { label: "Aprende", desc: "qu\u00E9 piden los corredores que no existe a\u00FAn", icon: "\uD83D\uDCA1" },
                { label: "Itera", desc: "agrega lo m\u00E1s pedido en la V2", icon: "\uD83D\uDD04" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: "1 1 130px", background: "rgba(255,255,255,0.06)", borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: C.pave, marginTop: 2, lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}
