/* ============================================================
   Tarjetas de precio para las mesas (las de acrílico).
   Las de DJI Mic 3, Mic Mini 2, Mic Mini 2S, Osmo Mobile 8/7,
   Osmo Action 6, Neo 2, Osmo Nano y Osmo 360 II son las de la
   tienda; las demás salen del catálogo de Mensajes.
   Lo que se cambia en la página se guarda en la nube y tiene
   prioridad sobre esto.

   Cada tarjeta: {id, cat, partes:[{titulo, sub, feats:[[ícono, texto]],
   vers:[{n, s, p, pp, items:[], desc}], comun:[]}], banda, ppOn, ppTxt, notas}
   (ícono "" = el que corresponda al texto)
   ============================================================ */
(function(){
  "use strict";
  const PP_TXT = "Sustitución a precio reducido, DJI Care Express, asistencia y servicio global, envío gratuito y servicio técnico exclusivo";
  const NOTA_GEN = "Para obtener descripciones detalladas de las características y condiciones de uso, consulta el sitio web oficial de DJI o el manual de usuario del producto.";
  const f = t => ["", t];
  const T = (id, cat, partes, extra) => Object.assign({id, cat, partes, banda:true, ppOn:false, ppTxt:PP_TXT, notas:NOTA_GEN}, extra||{});
  const P = (titulo, sub, feats, vers, comun) => ({titulo, sub, feats:feats.map(x=>Array.isArray(x)?x:f(x)), vers, comun:comun||[]});
  const V = (n, p, items, extra) => Object.assign({n, s:"", p, pp:null, items, desc:""}, extra||{});

  window.TARJETAS_BASE = [
    // ======================= DRONES =======================
    T("neo2","drones",[P("DJI NEO 2","El dron cámara que te sigue a todas partes",[
        "Despegue y aterrizaje en la palma de la mano, control gestual","Seguimiento más rápido y fluido con ActiveTrack","Captura fácilmente cada momento con SelfieShot",
        "Detección de obstáculos omnidireccional y vuelo versátil","Imágenes de alta calidad en 4K","Diseño ligero y portátil, con protectores de hélices integrales"],[
      V("Pack DJI Neo 2",2099,["Aeronave","Batería × 1"],{s:"Vuela Más (solo el dron)",pp:269}),
      V("DJI Neo 2 Fly More Combo",3699,["Aeronave","Batería × 3","Centro de carga bidireccional","RC-N3","Transceptor digital"],{pp:659}),
      V("DJI Neo 2 Motion Fly More Combo",5299,["Aeronave","Batería × 3","Centro de carga bidireccional","Goggles N3","RC Motion 3","Transceptor digital"],{pp:689})])]),
    T("lito1","drones",[P("DJI LITO 1","Dron con cámara de 48 MP, fácil de volar",[
        "Cámara de 1/2\" con fotos de 48 MP","Video 4K a 60 fps y cámara lenta 4K a 100 fps","Gimbal mecánico de 3 ejes",
        "Detección de obstáculos en todas direcciones","Seguimiento ActiveTrack y tomas automáticas","Hasta 36 minutos de vuelo"],[
      V("Estándar (DJI RC-N3)",2849,["Aeronave","Control remoto DJI RC-N3","Batería × 1","Hélices de repuesto (par)"],{pp:539}),
      V("Fly More Combo (DJI RC-N3)",4299,["Aeronave","Control remoto DJI RC-N3","Batería × 3","Centro de carga","Bolso de hombro","Hélices de repuesto × 3 pares"],{pp:759})])]),
    T("litox1","drones",[P("DJI LITO X1","Dron con sensor de 1/1.3\" y LiDAR",[
        "Sensor de 1/1.3\" con fotos de 48 MP y apertura f/1.7","Video 4K a 60 fps y cámara lenta 4K a 100 fps","Color de 10 bits D-Log M",
        "Detección de obstáculos omnidireccional y LiDAR frontal","Transmisión de video DJI O4","Hasta 36 minutos de vuelo y 42 GB de memoria interna"],[
      V("Estándar (DJI RC-N3)",3299,["Aeronave","Control remoto DJI RC-N3","Batería × 1","Hélices de repuesto (par)"],{pp:689}),
      V("Fly More Combo (DJI RC-N3)",4849,["Aeronave","Control remoto DJI RC-N3","Batería × 3","Centro de carga","Bolso de hombro"],{pp:999}),
      V("Fly More Combo (DJI RC 2)",5849,["Aeronave","Control DJI RC 2 con pantalla","Batería × 3","Centro de carga","Bolso de hombro"],{pp:1149}),
      V("Fly More Combo Plus (DJI RC 2)",6629,["Aeronave","Control DJI RC 2 con pantalla","Batería Plus × 3 (52 min)","Centro de carga","Bolso de hombro"],{pp:1379})])]),
    // tal como la tarjeta oficial escaneada
    T("mini5pro","drones",[P("DJI MINI 5 PRO","Dron mini con cámara todo en uno con CMOS grande de 1 pulgada",[
        ["chip","Cámara CMOS grande de 1 pulgada"],["obstaculos","Detección de obstáculos omnidireccional en escenas nocturnas¹"],["rotar","Filmación vertical real y rotación flexible del estabilizador de 225°"],
        ["seguimiento","ActiveTrack 360° mejorado"],["pluma","Ligero y portátil"],["bateria","Vida de la batería aumentada²"]],[
      V("Pack DJI Mini 5 Pro Vuela Más Plus (RC 2)",9999,["Aeronave","RC 2","Batería Plus × 3","Centro de carga","Juego de filtros ND (ND8/32/128)"],{pp:1069, desc:"Por favor consulte a los asesores para más detalles sobre DJI Mini 5 Pro"})])],
      {notas:"1. Esta función solo es eficaz en superficies con texturas reconocibles y con una iluminación superior a 1 lux. Consulta los detalles en el sitio web oficial de DJI o en el manual de usuario del producto. 2. La vida de la batería extendida es de hasta 36 o 52 minutos. El tiempo puede variar según la batería instalada. Medido en un entorno de prueba controlado. Consulta más detalles en la página del producto del sitio web oficial de DJI. La batería de vuelo inteligente Plus solo está disponible en ciertos países y regiones."}),
    T("avata360","drones",[P("DJI AVATA 360","Dron 360° en 8K con hélices protegidas",[
        "Video 360° en 8K a 60 fps con HDR","Fotos 360° de hasta 120 MP","Reencuadre después de volar: una toma, muchos ángulos",
        "Protectores de hélices integrados","Detección de obstáculos omnidireccional y LiDAR frontal","Transmisión DJI O4+ de hasta 20 km"],[
      V("Estándar (DJI RC 2)",6599,["Aeronave","Control DJI RC 2 con pantalla","Batería × 1","Plataforma de aterrizaje"],{pp:1639}),
      V("Fly More Combo (DJI RC 2)",9219,["Aeronave","Control DJI RC 2 con pantalla","Batería × 3","Centro de carga","Bolso bandolera"],{pp:2339}),
      V("Motion Fly More Combo",9219,["Aeronave","Goggles N3","RC Motion 3","Batería × 3","Centro de carga","Bolso bandolera"],{pp:2339})])]),
    T("avata2","drones",[P("DJI AVATA 2","Vuelo inmersivo en primera persona",[
        "Sensor de 1/1.3\" con video 4K a 60 fps","Lente ultra gran angular de 155°","Acrobacias con un solo botón (Easy ACRO)",
        "Hélices protegidas integradas","Estabilización RockSteady 3.0+ y HorizonSteady","Transmisión DJI O4 de hasta 13 km"],[
      V("Fly Smart Combo",7399,["Aeronave",["465f1b13c6","Goggles N3"],["02a341d8d1","RC Motion 3"],"Batería × 3","Centro de carga bidireccional"],{s:"3 baterías, con gafas",pp:2219})])]),
    T("flip","drones",[P("DJI FLIP","Dron para vlogs todo en uno",[
        "Cámara de 1/1.3\" con fotos de 48 MP","Video 4K a 60 fps HDR","Protectores de hélices plegables integrados",
        "Seguimiento de objetivos con IA","Menos de 249 g: se pliega y cabe en cualquier bolso","Hasta 31 minutos de vuelo"],[
      V("Estándar (DJI RC-N3)",3999,["Aeronave","Control remoto DJI RC-N3","Batería × 1","Hélices de repuesto (par)"]),
      V("Fly More Combo (DJI RC 2)",6699,["Aeronave","Control DJI RC 2 con pantalla","Batería × 3","Centro de carga","Bolso de hombro"],{pp:989})])]),
    T("air3s","drones",[P("DJI AIR 3S","Doble cámara para fotografía de viajes",[
        "Cámara principal de 1 pulgada con fotos de 50 MP","Cámara tele de 70 mm con zoom óptico 3x","Video 4K a 60 fps HDR con 14 pasos de rango dinámico",
        "Detección de obstáculos omnidireccional, también de noche","Transmisión DJI O4 de hasta 20 km","Hasta 45 minutos de vuelo"],[
      V("Fly More Combo (DJI RC 2)",13799,["Aeronave","Control DJI RC 2 con pantalla","Batería × 3","Centro de carga","Filtros ND (ND8/32/128)","Bolso de hombro"],{pp:2299})])]),
    T("mavic4pro","drones",[P("DJI MAVIC 4 PRO","Triple cámara con Hasselblad de 4/3",[
        "Cámara Hasselblad de 4/3 con 100 MP","Video 6K a 60 fps HDR","Tele de 70 mm y tele de 168 mm",
        "Gimbal Infinity con rotación de 360°","Detección de obstáculos omnidireccional, incluso de noche","Hasta 51 minutos de vuelo y transmisión de hasta 30 km"],[
      V("Fly More Combo (DJI RC 2)",24799,["Aeronave","Control DJI RC 2 con pantalla","Batería × 3","Centro de carga","Cargador USB-C de 100 W","Bolso de hombro"]),
      V("Creator Combo (DJI RC Pro 2)",32899,["Aeronave (512 GB)","Control DJI RC Pro 2 (pantalla de 7\")","Batería × 3","Centro de carga","Cargador de 240 W","Bolso de hombro"])])]),

    // ======================= CÁMARAS =======================
    T("pocket3","camaras",[P("OSMO POCKET 3","Cámara de bolsillo con sensor de 1 pulgada",[
        "Sensor CMOS de 1 pulgada","Video 4K a 60 fps y cámara lenta 4K a 120 fps","Gimbal mecánico de 3 ejes",
        "Pantalla táctil giratoria de 2\"","Seguimiento ActiveTrack 6.0","Color de 10 bits D-Log M y HLG"],[
      V("Creator Combo",5139,["Osmo Pocket 3","Transmisor DJI Mic 2","Mango con batería","Lente gran angular","Mini trípode","Bolso de transporte"],{pp:689})])]),
    T("pocket4","camaras",[P("OSMO POCKET 4","La nueva cámara de bolsillo",[
        "Sensor CMOS de 1 pulgada","Cámara lenta 4K hasta 240 fps","Gimbal mecánico de 3 ejes",
        "Pantalla de 2\" y 1000 nits","Seguimiento ActiveTrack 7.0","107 GB de memoria interna y hasta 240 min de grabación"],[
      V("Standard Combo",4899,["Osmo Pocket 4","Estuche portátil","Mango con rosca 1/4\"","Traba de gimbal","Correa de muñeca","Cable USB-C"],{pp:839}),
      V("Creator Combo",6299,["Pack Estándar","Micrófono DJI Mic 3","Luz de relleno","Lente gran angular","Mini trípode","Bolso de transporte"],{pp:839})])]),
    T("pocket4p","camaras",[P("OSMO POCKET 4P","Doble cámara con zoom óptico 3x",[
        "Doble cámara: 1 pulgada + tele de 1/1.28\"","Zoom óptico 3x para retratos","Cámara lenta 4K hasta 240 fps",
        "Gimbal mecánico de 3 ejes","Pantalla de 2\" y 1000 nits","103 GB de memoria interna"],[
      V("Standard Combo",5999,["Osmo Pocket 4P","Luz de relleno","Estuche portátil","Mango con rosca 1/4\"","Correa de muñeca","Cable USB-C"],{pp:997}),
      V("Vlog Combo",6999,["Pack Estándar","Control remoto Osmo FrameTap","Micrófono DJI Mic Mini 2","Mini trípode","Bolso de transporte"],{pp:1228})])]),
    T("nano","camaras",[P("OSMO NANO","Cámara portátil para perspectivas versátiles",[
        "Nuevo sensor de 1/1.3\"","4K/60 fps y campo de visión amplio de 143°","Rendimiento de color de 10 bits y D-Log M","Diseño magnético ligero y de doble cara",
        "Vida de la batería aumentada a 200 minutos¹ y carga rápida","Vista en directo con control remoto y transferencia rápida de contenido","Conexión directa de micrófono OsmoAudio™²","Cámara sumergible a 10 m³, Dock de transmisión de vídeo con índice IPX4⁴"],[
      V("Pack Estándar (64 GB)",3389,["Cámara (64 GB)"]),
      V("Pack Estándar (128 GB)",3699,["Cámara (128 GB)"],{pp:424})],
      ["Dock multifuncional de transmisión de vídeo","Clip magnético para sombrero","Correa magnética","Estuche de protección","Cable PD (USB 3.1)","Soporte adaptador magnético con articulación de rótula bidireccional"])],
      {notas:"1. Hasta 200 minutos con el dock multifuncional de transmisión de vídeo. Los datos se tomaron en un entorno controlado. Consulta los detalles en el sitio web oficial de DJI. 2. No admite conexión directa al DJI Mic de primera generación. Los micrófonos de DJI se venden por separado. 3. Para sugerencias de uso, consulta el sitio web oficial de DJI. 4. La resistencia al agua IPX4 solo está disponible cuando el dock multifuncional de transmisión de vídeo está acoplado a la cámara."}),
    T("action6","camaras",[P("OSMO ACTION 6","Cámara de acción insignia todo en uno",[
        "Nuevo sensor cuadrado de 1/1.1 pulgadas","Apertura variable f/2.0-f/4.0","Resistente al frío y con una batería de 4 horas de duración¹",
        "Conexión directa de micrófono OsmoAudio™²","50 GB de memoria interna","Sumergible hasta 20 m³"],[
      V("Standard Combo",3499,["Cámara","Batería extrema Plus (1950 mAh)","Soporte adaptador de liberación rápida bidireccional","Base adhesiva curva","Tornillo de fijación","Cable PD (USB 3.1)","Almohadilla antideslizante"],{pp:890}),
      V("Adventure Combo",4399,["Pack Estándar","Batería extrema Plus (1950 mAh) × 2","Soporte adaptador de liberación rápida bidireccional","Tornillo de fijación","Estuche multifuncional de baterías 3","Brazo extensible de 1.5 m"],{pp:1120})])],
      {ppOn:true, notas:"1. Los datos se recopilaron en un entorno controlado. La experiencia real podría variar. Consulta más detalles en la página del producto del sitio web oficial de DJI. 2. No admite conexión directa al DJI Mic de primera generación. Los micrófonos de DJI se venden por separado. 3. Consulta los detalles de las pruebas pertinentes y las sugerencias de uso de la cámara y el estuche impermeable en la página del producto en el sitio web oficial de DJI."}),
    T("osmo360ii","camaras",[P("OSMO 360 II","Todos los ángulos. Todo épico",[
        "Imágenes 360° HDR en 8K/60 fps de 1 pulgada¹","Supernoche IA 2.0","Lentes ultraduras y resistentes a los arañazos² con diseño reemplazable",
        "Edición inteligente, compartir al instante","Ecosistema Osmo para todos los escenarios³","105 GB de memoria interna"],[
      V("Standard Combo",5599,["Osmo 360 II","Batería extrema Plus Osmo (2150 mAh)","Funda protectora para cámara Osmo 360","Paño de limpieza de objetivos Osmo","Cable PD USB-C a USB-C (USB 3.1)","Tapa de silicona para objetivo Osmo 360 2"],{pp:839}),
      V("Adventure Combo",6999,["Pack Estándar Osmo 360 II","Batería extrema Plus Osmo (2150 mAh) × 2","Estuche multifuncional de baterías Osmo 3.ª generación","Soporte adaptador ajustable de liberación rápida bidireccional Osmo","Palo de selfie invisible Osmo de 1.2 m"],{pp:1228})])],
      {notas:"1. Al capturar contenidos en 360°, cada uno de los dos sensores CMOS de Osmo 360 II presenta un área de imagen equivalente a la de un sensor CMOS de 1 pulgada, con una relación de aspecto de 4:3. 2. Se aplica un proceso mejorado de recubrimiento por pulverización iónica a las superficies de ambas lentes. Consulta más detalles en la página del producto del sitio web oficial de DJI. 3. Los accesorios relacionados se venden por separado."}),

    // ======================= ESTABILIZADORES =======================
    T("om8-om7","estabilizadores",[
      P("OSMO MOBILE 8","",["Seguimiento nativo con capacidades de audio e iluminación integradas¹","Conexión directa del teléfono para seguimiento²","Rotación panorámica de 360° fluida","Agarre ultra cómodo para tomas en contrapicado"],[
        V("Osmo Mobile 8",1349,[],{pp:149,desc:"Incluye el estabilizador, abrazadera magnética para teléfonos, módulo multifuncional DJI OM, cable de alimentación, cable de carga/audio para teléfono, bolsa de almacenamiento."})]),
      P("OSMO MOBILE 7","",["Robusta estabilización en 3 ejes","ActiveTrack 7.0","Sencillos tutoriales y edición en un toque","10 horas de batería³ y carga del teléfono"],[
        V("Osmo Mobile 7",599,[],{pp:149,desc:"Incluye el estabilizador, la abrazadera magnética para teléfonos 4 DJI OM, el cable de alimentación, etc."})])],
      {banda:false, notas:"1. Se necesita el módulo multifuncional DJI OM para habilitar las funciones de seguimiento, iluminación y recepción de audio (compatible con el transmisor DJI Mic Mini o DJI Mic 2). Solo admite seguimiento de personas o animales (gatos y perros). 2. Para obtener información sobre compatibilidad, consulta la lista de smartphones compatibles en la página web oficial de DJI. 3. Medido con el estabilizador equilibrado en un estado nivelado e inmóvil sin accesorios adicionales."}),
    T("om8p","estabilizadores",[P("OSMO MOBILE 8P","Estabilizador para celular con control FrameTap",[
        "Estabilización en 3 ejes","Control remoto desmontable FrameTap con pantalla","Rotación horizontal de 360° sin límite",
        "Seguimiento ActiveTrack 8.0","Palo extensible y trípode integrados","Hasta 10 horas de batería"],[
      V("Advanced Tracking Combo",1849,["Osmo Mobile 8P","Control remoto Osmo FrameTap","Módulo multifunción 2","Abrazadera magnética","Estuche de transporte"],{pp:299}),
      V("Creator Combo",2309,["Pack Advanced Tracking","Micrófono DJI Mic Mini 2","Receptor DJI Mic para celular"],{pp:379})])]),
    T("rs5","estabilizadores",[P("DJI RS 5","Estabilizador profesional para cámaras de hasta 3 kg",[
        "Soporta cámaras de hasta 3 kg","Bloqueo automático de ejes","Grabación vertical nativa",
        "Hasta 14 horas de batería","Carga rápida en aprox. 1 hora","Control de la cámara por Bluetooth y cable"],[
      V("Combo",6159,["Estabilizador DJI RS 5","Módulo de seguimiento inteligente","Mango tipo maletín","Empuñadura con batería BG33","Trípode","Placas de liberación rápida","Cables de control de cámara","Estuche de transporte"],{pp:1149})])]),
    T("rs4pro","estabilizadores",[P("DJI RS 4 PRO","Estabilizador para cámaras de cine de hasta 4.5 kg",[
        "Soporta cámaras de hasta 4.5 kg","Bloqueo automático de ejes","Grabación vertical nativa",
        "Brazos de fibra de carbono","Hasta 13 horas de batería","Carga rápida en aprox. 1.5 horas"],[
      V("Combo (2026)",null,["Estabilizador DJI RS 4 Pro","Transmisor y receptor DJI SDR","Motor de enfoque DJI Focus Pro","Empuñadura con batería BG30","Mango tipo maletín","Trípode de metal","Soporte para celular","Placas de liberación rápida"],{pp:1459})])]),
    T("rs4mini","estabilizadores",[P("DJI RS 4 MINI","Estabilizador compacto para cámaras mirrorless",[
        "Soporta cámaras de 0.4 a 2 kg","Liviano: aprox. 890 g","Bloqueo automático de ejes",
        "Grabación vertical","Hasta 13 horas de batería","Control de la cámara por Bluetooth"],[
      V("Combo",3699,["Estabilizador DJI RS 4 Mini","Módulo de seguimiento inteligente","Mango tipo maletín","Trípode","Placa de liberación rápida","Cable de control de cámara","Cable de carga USB-C"],{pp:609})])]),

    // ======================= MICRÓFONOS =======================
    T("mic3","microfonos",[P("DJI MIC 3","Micrófono inalámbrico mini avanzado",[
        "Ligero e intuitivo, almacenamiento compacto","4TX + 8RX y salida de cuatro canales¹","Control de ganancia adaptativo","Tres preajustes de tono de voz, cancelación de ruido de dos niveles",
        "Anti-interferencias, transmisión de audio sin pérdidas","Grabación interna flotante de 32 bits","Código de tiempo integrado para una edición fluida","Tiempo de funcionamiento extendido y carga rápida"],[
      V("DJI Mic 3 (2 TX + 1 RX)",2999,["Transmisor × 2","Receptor","Estuche de carga","Adaptador de teléfono móvil (USB-C)","Cable de datos USB-C a USB-C","Cable de audio con bloqueo (3.5 mm TRS)","Antiviento × 4","Imán × 2","Clip magnético × 2","Funda de transporte"])])],
      {notas:"* Para obtener instrucciones y precauciones sobre características específicas, consulte el sitio web oficial de DJI. 1. Para lograr la configuración 4TX + 8RX o la salida de cuatro canales, es necesario comprar accesorios adicionales por separado. Para obtener una lista de dispositivos compatibles con la función de salida de cuatro canales, consulte el sitio web oficial de DJI."}),
    T("micmini2","microfonos",[P("DJI MIC MINI 2","Micrófono mini inalámbrico",[
        "Ligero y versátil, almacenamiento compacto","Audio de alta calidad, transmisión a través de dispositivos mixtos¹","Tres preajustes de tono de voz, cancelación de ruido de dos niveles",
        "Límite automático para prevenir el clipping de audio","Conexión directa con DJI OsmoAudio²","Tiempo de funcionamiento extendido y ahorro de energía"],[
      V("2 TX + 1 RX + Charging Case",1099,["Transmisor × 2","Receptor","Estuche de carga","Clip magnético × 2","Imán × 2","Antiviento × 2","Funda de transporte","Cable de carga USB-C","Cubierta frontal magnética × 2","Cubierta frontal magnética multicolor"]),
      V("2 TX + 1 Mobile RX + Charging Case",849,["Transmisor × 2","Receptor móvil","Estuche de carga","Antiviento × 2","Imán × 2","Cable de carga USB-C DJI Mic","Clip magnético × 2","Cubierta frontal magnética × 2","Funda de transporte"]),
      V("1 TX + 1 RX móvil",599,["Transmisor","Receptor móvil","Adaptador USB-C","Cubierta frontal magnética","Antiviento","Clip magnético","Imán","Cable de carga USB-C DJI Mic","Cable de audio para cámara (3.5 mm TRS)","Cable de carga magnético del transmisor","Funda de transporte compacta"]),
      V("1 TX + 1 RX móvil + Charging Case",599,["Transmisor","Receptor móvil","Clip magnético","Cable de carga USB-C DJI Mic","Antiviento","Imán","Estuche de carga (1 TX + 1 RX móvil)","Cubierta frontal magnética","Funda de transporte compacta"])])],
      {notas:"* Para obtener instrucciones y precauciones sobre ciertas características específicas, consulte el sitio web oficial de DJI. 1. Ambos receptores admiten conexión mixta, con hasta dos transmisores conectados a la vez. Consulta los detalles en el sitio web oficial de DJI. 2. Los transmisores se pueden conectar directamente a determinados productos de DJI. Consulta los detalles en el sitio web oficial de DJI."}),
    T("micmini2s","microfonos",[P("DJI MIC MINI 2S","Micrófono inalámbrico Mini con grabación interna",[
        "28 horas de almacenamiento interno¹, Grabación interna flotante de 32 bits*","4 TX + 1 RX*, conectividad entre generaciones*","Cancelación de ruido con IA de dos niveles*, tres preajustes de tono de voz*",
        "Ligero y versátil, almacenamiento compacto*","Conexión directa mediante DJI OsmoAudio*","Mayor tiempo de funcionamiento y carga rápida*"],[
      V("2 TX + 1 RX",1999,["Transmisor × 2","Receptor","Estuche de carga","Adaptador de teléfono móvil (USB-C)","Cable de carga USB-C","Cable de audio para cámara (3.5 mm TRS)","Antiviento × 2","Imán × 2","Clip magnético × 2","Cubierta frontal magnética × 2","Funda de transporte","Juego de cubiertas frontales magnéticas multicolor"]),
      V("1 TX + 1 RX móvil",1149,["Transmisor","Receptor móvil de la serie DJI MIC","Estuche de carga (1 TX + 1 RX móvil)","Cable de carga USB-C","Antiviento","Imán","Clip magnético","Cubierta frontal magnética × 2 pares","Funda de transporte compacta"]),
      V("1 TX + 1 RX",1079,["Transmisor","Receptor","Antiviento","Clip magnético","Imán","Cable de carga USB-C","Funda de transporte","Cubierta frontal magnética × 1 par","Cable de audio para cámara (3.5 mm TRS)","Adaptador de teléfono móvil (USB-C)","Cable de carga magnético del transmisor"])])],
      {notas:"* Para conocer las funciones específicas y las condiciones de uso, consulta el sitio web oficial o el folleto de DJI. 1. El transmisor DJI Mic Mini 2S puede grabar hasta 28 horas de audio en el modo predeterminado de grabación interna de 24 bits."}),

    // ======================= ACCESORIOS =======================
    T("goggles3","accesorios",[P("DJI GOGGLES 3","Gafas FPV para volar en primera persona",[
        "Pantallas Micro-OLED 1080p de hasta 100 Hz","Transmisión DJI O4 con latencia de 24 ms","Ajuste de dioptrías de -6.0 D a +2.0 D",
        "Batería integrada de aprox. 3 horas","Videos panorámicos y 3D hasta 4K/60","Compatibles con DJI Avata 2"],[
      V("Estándar",4799,["Gafas DJI Goggles 3","Lentes correctivos (par)","Almohadilla de espuma","Cable USB-C OTG"])])])
  ];
  // de qué combos de Mensajes salen las fotos de "lo que incluye" (una lista por versión, en orden)
  const FOTOS_DE = {
    neo2:["neo2-solo","neo2-fmc","neo2-motion"], lito1:["lito1-solo","lito1-fmc"], litox1:["litox1-solo","litox1-fmc-n3","litox1-fmc","litox1-fmcplus"],
    mini5pro:["mini5pro-fmcplus"], avata360:["avata360-rc2","avata360-fmc","avata360-motion"], flip:["flip-std","flip-fmc"], air3s:["air3s-fmc"],
    mavic4pro:["mavic4pro-fmc","mavic4pro-creator"], pocket3:["pocket3-creator"], pocket4:["pocket4-std","pocket4-creator"], pocket4p:["pocket4p-std","pocket4p-vlog"],
    nano:["nano-std","nano-std"], action6:["action6-adv","action6-adv"], osmo360ii:["osmo360ii-std","osmo360ii-adv"], om8p:["om8p-adv","om8p-creator"],
    rs5:["rs5-combo"], rs4pro:["rs4pro-combo"], rs4mini:["rs4mini-combo"], mic3:["pocket4-creator"], goggles3:["goggles3-std"],
    micmini2:["micmini2-rx","micmini2-movil","micmini2-movil micmini2-1tx","micmini2-movil"], micmini2s:["micmini2s-2tx","micmini2s-movil","micmini2s-2tx"]
  };
  window.TARJETAS_BASE.forEach(t=>{ const c=FOTOS_DE[t.id]; if(c) t.partes[0].vers.forEach((v,i)=>{ if(c[i]) v.c=c[i]; }); });
  window.TARJETAS_TEXTOS = {pp:PP_TXT, notas:NOTA_GEN, banda:"Te invitamos a probar el producto. Consulta los detalles al personal de la tienda."};
  window.TARJETAS_CATS = [["drones","Drones"],["camaras","Cámaras"],["estabilizadores","Estabilizadores"],["microfonos","Micrófonos"],["accesorios","Accesorios"]];
})();
