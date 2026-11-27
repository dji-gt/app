/* ============================================================
   Dibujo de la tarjeta de precio (vista previa e impresión).
   Tarjeta.html(t, {ancho, alto})  ·  Tarjeta.ajustar(elemento .tj)
   Tarjeta.ICONOS  ·  Tarjeta.iconoPara(texto, "item"|"feat")
   ============================================================ */
(function(){
  "use strict";

  // Íconos de línea (24×24)
  const I = {
    dron:'<rect x="9" y="10" width="6" height="4.5" rx="1.3"/><path d="M9.3 10.6 6.3 7.6M14.7 10.6l3-3M9.3 13.9l-3 3M14.7 13.9l3 3"/><ellipse cx="5.5" cy="6.8" rx="3.2" ry="1.1"/><ellipse cx="18.5" cy="6.8" rx="3.2" ry="1.1"/><ellipse cx="5.5" cy="17.7" rx="3.2" ry="1.1"/><ellipse cx="18.5" cy="17.7" rx="3.2" ry="1.1"/>',
    bateria:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3M7 10v4M10.5 10v4"/>',
    control:'<path d="M6.5 8h11a3.5 3.5 0 0 1 3.5 3.5v2a3.5 3.5 0 0 1-3.5 3.5h-1.2l-2-2h-4.6l-2 2H6.5A3.5 3.5 0 0 1 3 13.5v-2A3.5 3.5 0 0 1 6.5 8z"/><circle cx="8" cy="12.5" r="1.4"/><circle cx="16" cy="12.5" r="1.4"/><path d="M12 8V4.5"/>',
    pantalla:'<rect x="2.5" y="6" width="19" height="12" rx="2.8"/><rect x="7" y="8.3" width="10" height="7.4" rx="1"/><circle cx="4.8" cy="12" r=".8"/><circle cx="19.2" cy="12" r=".8"/>',
    motion:'<path d="M10 3h4a2 2 0 0 1 2 2v6.5L15 21H9l-1-9.5V5a2 2 0 0 1 2-2z"/><circle cx="12" cy="7" r="1.6"/><path d="M8.3 13.5h7.4"/>',
    gafas:'<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a3 3 0 0 1-3 3h-2.6l-1.6-2.1a1 1 0 0 0-1.6 0L10.6 17H6a3 3 0 0 1-3-3z"/><circle cx="8" cy="11.6" r="1.8"/><circle cx="16" cy="11.6" r="1.8"/>',
    cargador:'<rect x="4" y="9" width="16" height="10" rx="2"/><path d="M8 9V6h3v3M13 9V6h3v3"/><path d="m12.6 11.3-2 3.2h3l-2 3.2"/>',
    rayo:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
    bolso:'<path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    helice:'<circle cx="12" cy="12" r="1.6"/><path d="M10.5 11.3C7 9.4 3 10 3 12s4 2.6 7.5.7M13.5 12.7c3.5 1.9 7.5 1.3 7.5-.7s-4-2.6-7.5-.7"/>',
    camara:'<rect x="3" y="6.5" width="18" height="12.5" rx="2.6"/><circle cx="12" cy="12.8" r="3.6"/><path d="M7 4.5h4v2"/>',
    pocket:'<rect x="9" y="10" width="6" height="11" rx="2"/><path d="M9.6 10 8.2 7.4A3 3 0 0 1 10.8 3h2.4a3 3 0 0 1 2.6 4.4L14.4 10"/><circle cx="12" cy="6.3" r="1.5"/><path d="M11 14.5h2"/>',
    c360:'<rect x="8.5" y="3" width="7" height="18" rx="3"/><circle cx="12" cy="8" r="2.1"/><path d="M5 11.5c-1.3.6-2 1.3-2 2 0 1.9 4 3.5 9 3.5s9-1.6 9-3.5c0-.7-.7-1.4-2-2"/>',
    estabilizador:'<rect x="4.5" y="2.5" width="15" height="5" rx="1.2"/><path d="M12 7.5v2h3.5v3H12"/><rect x="10" y="12.5" width="4" height="9" rx="2"/>',
    celular:'<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
    abrazadera:'<rect x="5" y="8" width="14" height="8" rx="2"/><path d="M5 12H3M21 12h-2"/><circle cx="12" cy="12" r="2"/>',
    mic:'<rect x="6.5" y="4" width="11" height="16" rx="4"/><circle cx="12" cy="9.3" r="2.4"/><path d="M10 15.5h4"/>',
    receptor:'<rect x="6" y="3" width="12" height="17" rx="3"/><rect x="8.5" y="6" width="7" height="5.5" rx="1"/><path d="M10 15h4M12 20v1.5"/>',
    receptorm:'<rect x="7" y="3" width="10" height="12" rx="3"/><path d="M10 15v3.2h4V15"/><path d="M11 18.2V21M13 18.2V21"/><path d="M10 7.5h4"/>',
    estuche:'<rect x="3" y="7" width="18" height="12" rx="4"/><path d="M3 11.5h18"/><path d="M10 15.3h4"/>',
    cable:'<rect x="3" y="3" width="5" height="6" rx="1.2"/><path d="M5.5 9v4a6 6 0 0 0 12 0v-2"/><rect x="15" y="5" width="5" height="6" rx="1.2"/><path d="M4.5 3V1.5M7 3V1.5M17.5 5V3.5"/>',
    usbc:'<rect x="4" y="8.5" width="16" height="7" rx="3.5"/><path d="M8.5 12h7"/>',
    antiviento:'<path d="M7.5 18.5a4 4 0 0 1-.6-7.9 5.2 5.2 0 0 1 10.1-1A4.5 4.5 0 0 1 16.5 18.5z"/><path d="M9 14.5l1-1M12 15.5l1-1.5M14.5 13.5l1-1"/>',
    iman:'<path d="M6 3.5v8.5a6 6 0 0 0 12 0V3.5h-4V12a2 2 0 0 1-4 0V3.5z"/><path d="M6 7.5h4M14 7.5h4"/>',
    clip:'<path d="M8 3.5h8V16a4 4 0 0 1-8 0z"/><path d="M12 7.5v8.5"/>',
    cubierta:'<rect x="5" y="5" width="14" height="14" rx="4.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>',
    multicolor:'<circle cx="9" cy="9.5" r="4"/><circle cx="15" cy="9.5" r="4"/><circle cx="12" cy="15" r="4"/>',
    funda:'<path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 11.5h16M12 11.5v3"/>',
    tripode:'<rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="M12 5.5V10M12 10 6.5 21M12 10l5.5 11M12 10v11"/>',
    mango:'<rect x="9" y="3" width="6" height="18" rx="3"/><path d="M12 7v3.5"/>',
    maletin:'<path d="M4 16v-4.5A3.5 3.5 0 0 1 7.5 8h9a3.5 3.5 0 0 1 3.5 3.5V16"/><path d="M8.5 8V5.5h7V8"/><path d="M2.5 16h19"/>',
    lente:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.5"/>',
    luz:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    filtros:'<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    palo:'<rect x="9" y="2.5" width="6" height="5" rx="1.2"/><path d="M12 7.5V21.5M10 12.5h4M10 16.5h4"/>',
    soporte:'<path d="M5 20.5h14"/><path d="M8 20.5v-4.5h8v4.5"/><path d="M10 16v-5h4v5"/><path d="M7.5 11h9l-1.2-4.5H8.7z"/>',
    tornillo:'<path d="M8.5 3h7v4h-7z"/><path d="M12 7v14"/><path d="m10 10 4 1.5M10 13.5l4 1.5M10 17l4 1.5"/>',
    almohadilla:'<rect x="3" y="9" width="18" height="6" rx="2"/><path d="M7 12h10"/>',
    pano:'<path d="M4 5.5h16v13H4z"/><path d="M4 10c4-2.5 8 2.5 16 0"/>',
    tapa:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8"/>',
    memoria:'<path d="M7 3h7.5L18 6.5V21H7z"/><path d="M10 3v3.5M12.5 3v3.5M15 4.5v2"/>',
    chip:'<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    video:'<rect x="2.5" y="6" width="14" height="12" rx="2"/><path d="m16.5 10 5-3v10l-5-3"/>',
    lenta:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2.5M10 2.5h4M12 2.5V6"/>',
    obstaculos:'<circle cx="12" cy="12" r="2"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7"/>',
    seguimiento:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    persona:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    mano:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5.5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11.5V6.5a1.5 1.5 0 0 1 3 0v7.5a7 7 0 0 1-7 7h-.4a6 6 0 0 1-5-2.7l-1.6-2.4a1.5 1.5 0 0 1 2.4-1.8L8 15.5"/>',
    pluma:'<path d="M20 4C11 4 6 9 5 19.5"/><path d="M20 4c0 8-5 12-12.5 12"/><path d="M5 19.5 4 21"/>',
    gota:'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
    frio:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9.5 3.8 2.5 2 2.5-2M9.5 20.2l2.5-2 2.5 2"/>',
    reloj:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    senal:'<circle cx="12" cy="19" r="1.2"/><path d="M8.5 15.5a5 5 0 0 1 7 0M5.5 12.5a9 9 0 0 1 13 0M2.5 9.5a13 13 0 0 1 19 0"/>',
    onda:'<path d="M3 12h1.5M7 8.5v7M11 5v14M15 7.5v9M19 10v4M21 12h.01"/>',
    ruido:'<path d="M4 10v4M8 7v10M12 9v6M16 6v12M20 10v4"/><path d="M3.5 20.5 20.5 3.5"/>',
    codigo:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10.5v3M10 10.5v3M14 10.5v3M17 10.5v3M12 11h.01M12 13h.01"/>',
    rotar:'<path d="M20.5 12a8.5 8.5 0 1 1-2.8-6.3"/><path d="M20.5 3.5v5.5H15"/>',
    canales:'<rect x="3" y="3.5" width="7" height="7" rx="1.5"/><rect x="14" y="3.5" width="7" height="7" rx="1.5"/><rect x="3" y="13.5" width="7" height="7" rx="1.5"/><rect x="14" y="13.5" width="7" height="7" rx="1.5"/>',
    ganancia:'<path d="M5 21v-6.5M5 10.5V3M12 21v-8.5M12 8.5V3M19 21v-4.5M19 12.5V3M2.5 14.5h5M9.5 8.5h5M16.5 16.5h5"/>',
    enlace:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    escudo:'<path d="M12 3 4.5 6v6c0 4.8 3.3 7.9 7.5 9 4.2-1.1 7.5-4.2 7.5-9V6z"/>',
    proteccion:'<path d="M12 3 4.5 6v6c0 4.8 3.3 7.9 7.5 9 4.2-1.1 7.5-4.2 7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    edicion:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    luna:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    apertura:'<circle cx="12" cy="12" r="9"/><path d="M14.3 3.3 9 12.5M20.6 9.5l-10.3.6M18 19l-5.3-9.2M9.7 20.7l5.3-9.2M3.4 14.5l10.3-.6M6 5l5.3 9.2"/>',
    color:'<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.2-2.2 1-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    foto:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
    zoom:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8M10.5 7.5v6M7.5 10.5h6"/>',
    monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    peso:'<path d="M6 8h12l2 13H4z"/><circle cx="12" cy="5" r="2"/>',
    candado:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    vertical:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="m10 9 2-2 2 2M10 15l2 2 2-2"/>',
    bluetooth:'<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
    caja:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    estrella:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    mundo:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    compartir:'<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
    dock:'<rect x="4" y="11" width="16" height="9" rx="2"/><rect x="8" y="4" width="8" height="7" rx="1.5"/>',
    sombrero:'<path d="M2.5 17.5h19"/><path d="M6 17.5c0-6 2-9.5 6-9.5s6 3.5 6 9.5"/>',
    correa:'<path d="M7 3.5c-2 3-2 14 0 17M17 3.5c2 3 2 14 0 17"/><rect x="8" y="9" width="8" height="6" rx="1.5"/>',
    modulo:'<rect x="6" y="6.5" width="12" height="12" rx="3"/><circle cx="12" cy="12.5" r="2.5"/><path d="M12 3v3.5"/>',
    placa:'<rect x="4" y="9" width="16" height="6" rx="1"/><path d="M8 9v6M16 9v6"/>',
    foco:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 4.5V2.5M12 21.5v-2M4.5 12h-2M21.5 12h-2"/>',
    plataforma:'<circle cx="12" cy="12" r="9"/><path d="M9 8v8M15 8v8M9 12h6"/>'
  };
  const NOMBRES = Object.keys(I);

  const sinAcentos = s => String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  // qué ícono va según el texto (lo primero que coincide)
  const R_ITEM = [
    [/^cables?\b/,"cable"], [/dock/,"dock"], [/frametap/,"control"], [/gafas|goggles/,"gafas"], [/rc motion|motion 3/,"motion"], [/rc 2|rc pro|con pantalla/,"pantalla"],
    [/rc-n3|control remoto|frametap/,"control"], [/aeronave|^dron/,"dron"],
    [/estuche de carga|charging case|estuche multifuncional de baterias|estuche cargador/,"estuche"], [/centro de carga|cargador|hub de carga/,"cargador"],
    [/bateria|empunadura con bateria/,"bateria"], [/helice/,"helice"], [/filtro|lentes correctivos/,"filtros"],
    [/bolsa de transporte|bolsa para el microfono/,"funda"], [/bolso|bolsa|maleta/,"bolso"], [/funda|estuche/,"funda"], [/receptor.*(movil|celular)/,"receptorm"], [/receptor/,"receptor"],
    [/transmisor de video|transceptor|sdr/,"senal"], [/transmisor|mic mini|dji mic|microfono/,"mic"],
    [/antiviento/,"antiviento"], [/iman/,"iman"], [/sombrero|gorra/,"sombrero"], [/clip/,"clip"], [/multicolor|colores/,"multicolor"],
    [/cubierta|tapa magnetica|tapas magneticas/,"cubierta"], [/cable/,"cable"], [/soporte|base adhesiva|montura|rotula/,"soporte"], [/adaptador|usb-c/,"usbc"],
    [/tripode/,"tripode"], [/palo|brazo extensible|baston|selfie/,"palo"], [/maletin/,"maletin"], [/mango|empunadura/,"mango"],
    [/tornillo/,"tornillo"], [/almohadilla|espuma/,"almohadilla"], [/pano/,"pano"], [/tapa/,"tapa"], [/lente/,"lente"],
    [/modulo/,"modulo"], [/luz/,"luz"], [/dock/,"dock"], [/correa|collar/,"correa"], [/abrazadera|clamp/,"abrazadera"], [/placa/,"placa"],
    [/motor de enfoque|focus/,"foco"], [/traba|bloqueo/,"candado"], [/plataforma de aterrizaje/,"plataforma"],
    [/pocket/,"pocket"], [/osmo 360|360/,"c360"], [/camara|osmo action|osmo nano/,"camara"],
    [/estabilizador|osmo mobile|rs \d/,"estabilizador"], [/telefono|celular/,"celular"]
  ];
  const R_FEAT = [
    [/conexion directa del telefono|telefono para/,"celular"], [/vista en directo|control remoto/,"monitor"],
    [/palma|gestual|gesto/,"mano"], [/activetrack|seguimiento|tracking/,"seguimiento"], [/selfie/,"persona"],
    [/obstaculo|lidar/,"obstaculos"], [/ligero|portatil|liviano|plegable|249 g/,"pluma"], [/sumergible|agua|ipx/,"gota"],
    [/frio/,"frio"], [/camara lenta|lenta/,"lenta"], [/almacenamiento interno|memoria interna|\bgb\b/,"memoria"],
    [/bateria|horas|minutos|funcionamiento|de vuelo/,"reloj"], [/carga rapida|carga del telefono|carga/,"rayo"],
    [/osmoaudio|conexion directa|conectividad|dispositivos mixtos|conexion del telefono/,"enlace"],
    [/ruido/,"ruido"], [/codigo de tiempo/,"codigo"], [/ganancia|limite automatico|clipping/,"ganancia"],
    [/4tx|4 tx|canales/,"canales"], [/anti-interferencias|sin perdidas|transmision|alcance|o4/,"senal"],
    [/tono de voz|audio|sonido|32 bits|grabacion interna/,"onda"],
    [/rotacion|gira|panoram|infinity/,"rotar"], [/360/,"c360"], [/apertura/,"apertura"],
    [/color|d-log|10 bits|hlg/,"color"], [/noche/,"luna"], [/aranazo|resistente|protector/,"escudo"],
    [/edicion|editar|tutorial/,"edicion"], [/compartir/,"compartir"], [/ecosistema|global/,"mundo"],
    [/zoom|tele/,"zoom"], [/sensor|cmos|pulgada/,"chip"], [/pantalla/,"monitor"], [/\bkg\b|soporta camaras|peso/,"peso"],
    [/bloqueo/,"candado"], [/vertical/,"vertical"], [/bluetooth/,"bluetooth"],
    [/4k|6k|8k|video|fps|imagenes/,"video"], [/hasselblad|foto|\bmp\b/,"foto"], [/acrobacia|acro|vuelo|fpv|inmersivo/,"dron"],
    [/gimbal|estabilizacion|3 ejes|rocksteady/,"estabilizador"], [/telefono|smartphone|celular/,"celular"],
    [/agarre|mango|palo|tripode|extensible/,"mango"], [/modulo|luz|iluminacion/,"luz"]
  ];
  function iconoPara(texto, tipo){
    const t=sinAcentos(texto);
    for(const [r,i] of (tipo==="item"?R_ITEM:R_FEAT)) if(r.test(t)) return i;
    return tipo==="item" ? "caja" : "estrella";
  }
  const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||I.estrella}</svg>`;
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function precio(p){
    if(p==null || p==="") return "Consultar";
    const n=Number(p); if(!isFinite(n)) return "Consultar";
    return "Q"+n.toLocaleString("en-US",{minimumFractionDigits:Number.isInteger(n)?0:2, maximumFractionDigits:2});
  }
  // "Transmisor × 2" → el "× 2" en negrita
  const item = s => esc(s).replace(/\s*[×x]\s*(\d+)(\s+pares?|\s+par)?\s*$/i, (m,n,p)=>` <b>× ${n}${p||""}</b>`);
  // nombre corto de la versión para la línea de Protection Plus
  function corto(n, titulo){
    let s=String(n||"");
    if(titulo && sinAcentos(s).startsWith(sinAcentos(titulo)+" ")) s=s.slice(titulo.length+1);
    s=s.replace(/\b(combo|pack)\b/gi,"").replace(/\s{2,}/g," ").replace(/^\s*[·-]\s*/,"").trim();
    return s || String(n||"");
  }
  function precioHtml(p){
    const t=precio(p);
    return t.charAt(0)==="Q" ? `<span class="tj-q">Q</span>${t.slice(1)}` : t;
  }

  /* ---------- fotos (las de Mensajes: fotos.js) ----------
     Cada cosa de "lo que incluye" es [foto, texto]: foto "" = la que corresponda según el
     nombre (solo entre las fotos de ese combo), "-" = sin foto, o la clave de una foto. */
  const LIB = () => window.TARJETAS_FOTOS || {fotos:{}, nombres:{}, cajas:{}};
  const STOP = new Set("de del la las el los con para y en por dji osmo al su sus un una".split(" "));
  const GENERICAS = new Set(["cable","usb","carga"]);
  const UNICOS = new Set(["dron","control","pantalla","motion","gafas","bateria","cargador","filtros","bolso","camara","pocket","c360","estabilizador","mic","receptor","receptorm","estuche","tripode","lente","luz","palo","dock","modulo","plataforma","abrazadera","maletin","sombrero","correa","foco"]);
  const raices = s => sinAcentos(s).replace(/[×x]\s*\d+(\s+pares?|\s+par)?\s*$/,"").replace(/(centro|hub) de carga/g,"hub carga")
    .split(/[^a-z0-9.]+/).filter(w=>w.length>1 && !STOP.has(w)).map(w=>w.slice(0,5));
  function idsDe(c, tid){
    const ids=String(c||"").split(/[\s,]+/).filter(Boolean);
    if(ids.length || !tid) return ids;
    return Object.keys(LIB().cajas).filter(k=>k.indexOf(tid+"-")===0);
  }
  function conFotos(lista, ids){
    const F=LIB(), usadas=new Set(), pool=[];
    ids.forEach(id=>(F.cajas[id]||[]).forEach(h=>{ if(F.fotos[h] && !pool.some(x=>x.h===h)){ const n=F.nombres[h]||""; pool.push({h, cat:iconoPara(n,"item"), r:raices(n)}); } }));
    const l=(lista||[]).map(x=>Array.isArray(x) ? {f:String(x[0]||""), t:String(x[1]||"").trim()} : {f:"", t:String(x||"").trim()}).filter(x=>x.t);
    l.forEach(x=>{ if(x.f && x.f!=="-" && F.fotos[x.f]){ x.h=x.f; usadas.add(x.f); } });
    l.forEach(x=>{
      if(x.h || x.f==="-") return;
      const cat=iconoPara(x.t,"item"), r=raices(x.t); let mejor=null, ms=-1;
      pool.forEach(c=>{
        if(usadas.has(c.h) || c.cat!==cat) return;
        const com=r.filter(w=>c.r.includes(w)), fuertes=com.filter(w=>!GENERICAS.has(w)).length;
        if(!fuertes && !UNICOS.has(cat)) return;
        const sc=fuertes*10+com.length;
        if(sc>ms){ ms=sc; mejor=c; }
      });
      if(mejor){ x.h=mejor.h; usadas.add(mejor.h); }
    });
    return l.map(x=>({t:x.t, h:x.h||null, src:x.h ? F.fotos[x.h] : null}));
  }

  function titulo(t){
    const m=String(t||"").match(/^(.*\S)\s+(PRO|PLUS)$/i);
    return m ? `${esc(m[1])} <span class="tj-tl">${esc(m[2])}</span>` : esc(t);
  }
  function cab(p){ return `<div class="tj-cab"><div class="tj-t">${titulo(p.titulo)}</div>${p.sub?`<div class="tj-s">${esc(p.sub)}</div>`:""}</div>`; }
  function feats(p){
    const f=(p.feats||[]).filter(x=>x && String(x[1]||"").trim());
    if(!f.length) return "";
    return `<div class="tj-feats">${f.map(([ic,tx])=>`<div class="tj-f">${svg(ic||iconoPara(tx,"feat"))}<span>${esc(tx)}</span></div>`).join("")}</div>`;
  }
  // con foto: foto y nombre; sin foto: en una línea "También incluye"
  function items(lista, ids){
    const l=conFotos(lista, ids); if(!l.length) return "";
    const con=l.filter(x=>x.src), sin=l.filter(x=>!x.src);
    return (con.length ? `<div class="tj-items">${con.map(x=>`<div class="tj-i"><img src="${x.src}" alt=""><span>${item(x.t)}</span></div>`).join("")}</div>` : "")
      + (sin.length ? `<div class="tj-mas"><b>${con.length?"También incluye:":"Incluye:"}</b> ${sin.map(x=>item(x.t)).join(" · ")}</div>` : "");
  }
  function versiones(p, tid){
    const vs=p.vers||[]; if(!vs.length) return "";
    return `<div class="tj-vers${vs.length===1?" solo":""}">${vs.map(v=>`<div class="tj-v"><div class="tj-vh"><div class="tj-vn">${esc(v.n)}${v.s?`<span class="tj-vs">${esc(v.s)}</span>`:""}</div>${v.antes!=null ? `<div class="tj-p tj-promo"><span class="tj-pt">${esc(String(v.promo||"Promoción").toUpperCase())}</span><span class="tj-antes">Antes <s>${precio(v.antes)}</s></span><span>${precioHtml(v.p)}</span></div>` : `<div class="tj-p${v.p==null||v.p===""?" tj-cons":""}">${precioHtml(v.p)}</div>`}</div>${items(v.items, idsDe(v.c, tid))}${v.desc?`<div class="tj-desc">${esc(v.desc)}</div>`:""}</div>`).join("")}</div>`;
  }
  function comun(p, tid){
    const ids=[]; (p.vers||[]).forEach(v=>idsDe(v.c, tid).forEach(i=>{ if(ids.indexOf(i)<0) ids.push(i); }));
    const c=items(p.comun, ids.length ? ids : idsDe("", tid)); if(!c) return "";
    const n=(p.vers||[]).length;
    return `<div class="tj-comun"><div class="tj-ct">${n===2?"Ambas versiones incluyen":n>2?"Todas las versiones incluyen":"Incluye"}</div>${c}</div>`;
  }
  function ppLinea(t){
    const vs=[];
    t.partes.forEach(p=>(p.vers||[]).forEach(v=>{ if(v.pp!=null && v.pp!=="" && isFinite(Number(v.pp))) vs.push([v,p]); }));
    if(!vs.length) return "";
    let lista;
    if(vs.length===1) lista=`<b>${precio(vs[0][0].pp)}</b>`;
    else if(t.partes.length>1 && t.partes.every(p=>vs.some(x=>x[1]===p)))   // dos modelos: se agrupa por modelo
      lista=t.partes.map(p=>{ const de=vs.filter(x=>x[1]===p); return `<u>${esc(p.titulo)}</u> `+(de.length===1 ? `<b>${precio(de[0][0].pp)}</b>` : de.map(([v])=>`${esc(corto(v.n,p.titulo))} <b>${precio(v.pp)}</b>`).join(" · ")); }).join(" &nbsp;|&nbsp; ");
    else lista=vs.map(([v,p])=>`${esc(corto(v.n,p.titulo))} <b>${precio(v.pp)}</b>`).join(" · ");
    return `<div class="tj-pp">${svg("proteccion")}<div><b class="tj-ppt">DJI PROTECTION PLUS</b> <span class="tj-ppl">${lista}</span>${t.ppTxt?`<div class="tj-ppx">${esc(t.ppTxt)}</div>`:""}</div></div>`;
  }
  const BANDA = "Te invitamos a probar el producto. Consulta los detalles al personal de la tienda.";

  function html(t, op){
    const W=Number(op&&op.ancho)||200, H=Number(op&&op.alto)||90;
    const partes=(t.partes||[]).slice(0,2), doble=partes.length>1, tid=String(t.id||"");
    const banda = t.banda ? `<div class="tj-banda">${esc(t.bandaTxt||BANDA)}</div>` : "";
    const pp = t.ppOn ? ppLinea(t) : "";
    // promoción con fecha (Black Friday…): franja negra con hasta cuándo vale
    const promo = t.promo ? `<div class="tj-bf"><b>${esc(String(t.promo.nombre).toUpperCase())}</b> Precio especial válido hasta el ${esc(String(t.promo.hasta).split("-").reverse().join("/"))}</div>` : "";
    let cuerpo, abajo="";
    if(!doble){
      const p=partes[0]||{titulo:"",vers:[]};
      cuerpo=`<div class="tj-izq">${cab(p)}${promo}${banda}${feats(p)}</div><div class="tj-der">${versiones(p, tid)}${comun(p, tid)}${pp}</div>`;
    } else {
      cuerpo=partes.map(p=>`<div class="tj-mitad">${cab(p)}${feats(p)}${versiones(p, tid)}${comun(p, tid)}</div>`).join("");
      if(banda || pp || promo) abajo=`<div class="tj-abajo">${promo}${banda}${pp}</div>`;
    }
    const notas = String(t.notas||"").trim() ? `<div class="tj-notas">${esc(t.notas).replace(/\n/g,"<br>")}</div>` : "";
    return `<div class="tj${doble?" doble":""}" style="width:${W}mm;height:${H}mm"><div class="tj-cuerpo">${cuerpo}</div>${abajo}${notas}</div>`;
  }

  /* Busca el tamaño de letra más grande con el que todo entra en la tarjeta.
     (Se usa tal cual en la ventana de impresión, por eso no usa nada de afuera.) */
  function ajustar(tj){
    var H=tj.clientHeight, tope=H/21;
    var q=function(s){ return tj.querySelector(s); }, qa=function(s){ return Array.prototype.slice.call(tj.querySelectorAll(s)); };
    // no cabe: se pasa de alto o de ancho (también una palabra larga que se sale de su recuadro)
    var sobra=function(el){ return el.scrollHeight>el.clientHeight+0.5 || el.scrollWidth>el.clientWidth+0.5
      || Array.prototype.some.call(el.querySelectorAll(".tj-v,.tj-comun,.tj-f"), function(x){ return x.scrollWidth>x.clientWidth+0.5; }); };
    // min: un tamaño que ya se sabe que cabe
    function buscar(el, max, min){
      el.style.fontSize=max+"px"; if(!sobra(el)) return max;
      var lo=min||1.5, hi=max;
      for(var i=0;i<9;i++){ var m=(lo+hi)/2; el.style.fontSize=m+"px"; if(sobra(el)) hi=m; else lo=m; }
      el.style.fontSize=lo+"px"; return lo;
    }
    function columnas(vers, c){
      var hijos=Array.prototype.slice.call(vers.children), n=hijos.length, r=n%c;
      vers.style.gridTemplateColumns="repeat("+c+",minmax(0,1fr))";
      hijos.forEach(function(h,i){ var sp=r && i===n-1; h.style.gridColumn=sp ? "span "+(c-r+1) : ""; h.classList.toggle("ancha", c===1 || (sp && c-r+1===c)); });
    }
    var notas=q(".tj-notas"), abajo=q(".tj-abajo");
    if(notas){ var fn=H/60; notas.style.fontSize=fn+"px"; while(notas.offsetHeight>H*0.2 && fn>2.5){ fn-=0.2; notas.style.fontSize=fn+"px"; } }
    if(abajo) abajo.style.fontSize=(H/34)+"px";
    var izq=q(".tj-izq"), der=q(".tj-der"), mitades=qa(".tj-mitad");
    if(izq && der){
      var vers=der.querySelector(".tj-vers"), n=vers?vers.children.length:0, ops=[];
      (n===4 ? [2,4,3,1] : [Math.min(n,3), 2, 1]).forEach(function(c){ if(c>=1 && c<=n && ops.indexOf(c)<0) ops.push(c); });
      if(!ops.length) ops.push(1);
      var mejor=null;
      ops.forEach(function(c){
        if(vers) columnas(vers, c);
        var f=buscar(der, tope);
        // se prefiere la primera forma (versiones una al lado de la otra) si la otra no da letra bastante más grande
        if(!mejor || f>mejor.f*1.12) mejor={c:c, f:f};
      });
      if(vers) columnas(vers, mejor.c);
      // características en 3 columnas (como la tarjeta oficial); 2 si así se leen bastante mejor
      var fts=izq.querySelector(".tj-feats"), nf=fts?fts.children.length:0, fi;
      var fcol=function(c){ if(fts) fts.style.gridTemplateColumns="repeat("+c+",minmax(0,1fr))"; };
      if(nf>3){ fcol(2); var f2=buscar(izq, tope); fcol(3); fi=buscar(izq, tope); if(f2>fi*1.12){ fcol(2); fi=buscar(izq, tope); } }
      else { fcol(Math.max(1, nf)); fi=buscar(izq, tope); }
      var fd=mejor.f;
      if(fi>fd*1.6) fi=fd*1.6;
      if(fd>fi*1.6) fd=fi*1.6;
      izq.style.fontSize=fi+"px"; der.style.fontSize=fd+"px";
      tj.setAttribute("data-cols", mejor.c);
    } else if(mitades.length){
      // cada lado busca su mejor forma (versiones y características en columnas).
      // piso: solo interesa si la letra puede quedar más grande que eso (si no, devuelve 0 rápido)
      var cabe=function(el, f){ el.style.fontSize=f+"px"; return !sobra(el); };
      var lado=function(m, piso){
        var v=m.querySelector(".tj-vers"), ft=m.querySelector(".tj-feats"), nv=v?v.children.length:0, nf=ft?ft.children.length:0, vops=[], fops=[], formas=[], mejor=null;
        [Math.min(nv,3), 2, 1].forEach(function(c){ if(c>=1 && c<=nv && vops.indexOf(c)<0) vops.push(c); }); if(!vops.length) vops.push(1);
        [Math.min(nf,4), 3, 2].forEach(function(c){ if(c>=1 && c<=nf && fops.indexOf(c)<0) fops.push(c); }); if(!fops.length) fops.push(1);
        vops.forEach(function(vc){ fops.forEach(function(fc){ formas.push([vc, fc]); }); });
        var poner=function(x){ if(v) columnas(v, x[0]); if(ft) ft.style.gridTemplateColumns="repeat("+x[1]+",minmax(0,1fr))"; };
        formas.forEach(function(x){
          poner(x);
          var meta = mejor ? mejor.f*1.08 : (piso||0);
          if(meta>0 && (meta>=tope || !cabe(m, meta))) return;
          var f=buscar(m, tope, meta>0 ? meta : 0);
          if(!mejor || f>mejor.f*1.08) mejor={x:x, f:f};
        });
        if(!mejor) return 0;
        poner(mejor.x); m.style.fontSize=mejor.f+"px"; return mejor.f;
      };
      // con dos modelos, el que trae más cosas puede quedarse con más ancho
      var cuerpo=q(".tj-cuerpo"), anchos=mitades.length===2 ? [[1,1],[1.4,1],[1,1.4],[2,1],[1,2]] : [[1]], mejorA=null;
      var ponerA=function(a){ if(mitades.length===2) cuerpo.style.gridTemplateColumns="minmax(0,"+a[0]+"fr) minmax(0,"+a[1]+"fr)"; };
      anchos.forEach(function(a){
        ponerA(a);
        var piso=mejorA ? mejorA.f*1.06 : 0, f=Infinity;
        for(var k=0;k<mitades.length;k++){ var fk=lado(mitades[k], piso); if(!fk){ f=0; break; } f=Math.min(f, fk); }
        if(f && (!mejorA || f>mejorA.f*1.06)) mejorA={a:a, f:f};
      });
      ponerA(mejorA.a);
      var fs=mitades.map(function(m){ return lado(m); }), fmin=Math.min.apply(null, fs);
      // la letra de los dos lados parecida (el que tiene menos cosas puede ir un poco más grande)
      mitades.forEach(function(m, k){ m.style.fontSize=Math.min(fs[k], fmin*1.2)+"px"; });
    }
    var cortado=qa(".tj-izq,.tj-der,.tj-mitad").some(sobra) || (notas && notas.offsetHeight>H*0.3);
    tj.classList.toggle("tj-cortada", !!cortado);
    return !cortado;
  }

  const CSS = `
.tj{position:relative;background:#fff;color:#151515;overflow:hidden;display:flex;flex-direction:column;padding:3.4mm 3.8mm 2.6mm;font-family:"Segoe UI",-apple-system,Roboto,Helvetica,Arial,sans-serif;line-height:1.2;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;text-align:left}
.tj *{box-sizing:border-box}
.tj svg{display:block;flex:none}
.tj img{display:block}
.tj-cuerpo{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(0,36fr) minmax(0,64fr);grid-template-rows:minmax(0,1fr);gap:3.6mm}
.tj.doble .tj-cuerpo{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0}
.tj-izq,.tj-der,.tj-mitad{min-height:0;min-width:0;overflow:hidden;display:flex;flex-direction:column;gap:.6em}
.tj-izq{align-items:center;text-align:center;gap:.75em}
.tj-izq>*{width:100%}
.tj-mitad{padding:0 3mm}
.tj-mitad:first-child{padding-left:0}
.tj-mitad+.tj-mitad{border-left:.25mm solid #c9c9c9;padding-right:0}
.tj-t{font-weight:800;font-size:2.15em;line-height:1;letter-spacing:.01em;text-transform:uppercase}
.tj-tl{font-weight:300}
.tj-s{font-size:1.02em;font-weight:400;margin-top:.35em;color:#2b2b2b}
.tj-banda{background:#5b5f66;color:#fff;border-radius:.45em;padding:.5em .8em;font-size:.8em;font-weight:700;line-height:1.25;text-align:center}
.tj-feats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75em .5em;align-content:start}
.tj-f{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.4em;font-weight:500;font-size:.8em;line-height:1.2;letter-spacing:.02em;min-width:0}
.tj-f svg{width:2.6em;height:2.6em}
.tj-mitad .tj-feats{grid-template-columns:repeat(4,minmax(0,1fr));gap:.5em}
.tj-mitad .tj-f{font-weight:700;letter-spacing:0;gap:.35em}
.tj-mitad .tj-f svg{width:2.2em;height:2.2em}
.tj-vers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55em;flex:1 0 auto}
.tj-v{background:#ededed;border-radius:.85em;padding:.65em .75em .7em;display:flex;flex-direction:column;align-items:center;gap:.55em;min-width:0}
.tj-vers.solo .tj-v{background:none;padding-top:.3em}
.tj-vh{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.2em;width:100%}
.tj.doble .tj-v{align-items:stretch}
.tj.doble .tj-vh{flex-direction:row;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;text-align:left;gap:.15em .7em}
.tj-vn{font-weight:700;font-size:.98em;line-height:1.15;min-width:0}
.tj-vs{display:block;font-size:.78em;font-weight:600;color:#4a4a4a;margin-top:.1em}
.tj-p{font-weight:700;font-size:1.85em;line-height:1;white-space:nowrap;letter-spacing:-.01em}
.tj-q{font-size:.55em;font-weight:700;margin-right:.04em}
.tj-p.tj-cons{font-size:1.1em;color:#555}
.tj-p.tj-promo{display:flex;flex-direction:column;align-items:center;gap:.07em}
.tj.doble .tj-p.tj-promo{align-items:flex-end}
.tj-pt{font-size:.3em;font-weight:800;letter-spacing:.12em;background:#000;color:#fff;border-radius:.35em;padding:.28em .65em .22em}
.tj-antes{font-size:.4em;font-weight:600;color:#555;letter-spacing:0}
.tj-antes s{text-decoration-thickness:.09em}
.tj-bf{background:#000;color:#fff;border-radius:.45em;padding:.45em .8em;font-size:.8em;font-weight:600;line-height:1.25;text-align:center}
.tj-bf b{font-weight:800;letter-spacing:.12em;margin-right:.35em}
.tj-items{display:flex;flex-wrap:wrap;justify-content:center;align-content:flex-start;gap:.55em .3em;width:100%}
.tj-i{flex:0 0 6.3em;width:6.3em;display:flex;flex-direction:column;align-items:center;text-align:center;gap:.25em;font-size:.66em;font-weight:500;line-height:1.15;letter-spacing:.01em}
.tj-i img{width:100%;height:4.4em;object-fit:contain;mix-blend-mode:multiply}
.tj-i b{font-weight:700;white-space:nowrap}
.tj-mas{font-size:.6em;color:#3d3d3d;text-align:center;line-height:1.3;width:100%}
.tj-mas b{font-weight:700}
.tj-desc{font-size:.78em;line-height:1.3;text-align:center;color:#333}
.tj.doble .tj-desc{text-align:left;color:#151515}
.tj-comun{background:#ededed;border-radius:.85em;padding:.55em .75em .65em;display:flex;flex-direction:column;align-items:center;gap:.45em}
.tj-ct{font-weight:700;font-size:.8em}
.tj-pp{display:flex;gap:.55em;align-items:center;border:.25mm solid #bdbdbd;border-radius:.75em;padding:.45em .7em;font-size:.74em;line-height:1.25}
.tj-pp svg{width:2.3em;height:2.3em}
.tj-ppt{font-weight:800;letter-spacing:.03em}
.tj-ppl b{font-weight:800}
.tj-ppl u{text-decoration:none;font-weight:700}
.tj-ppx{font-size:.88em;color:#444;margin-top:.1em}
.tj-abajo{display:flex;gap:2mm;margin-top:1.6mm;align-items:stretch}
.tj-abajo>*{flex:1}
.tj-notas{color:#575757;line-height:1.25;margin-top:1.6mm;font-weight:400}`;

  window.Tarjeta = { ICONOS:I, NOMBRES, iconoPara, svg, html, ajustar, precio, CSS, sinAcentos, conFotos, idsDe, fotos:LIB };
})();
