/* ============================================================
   Guía de atención al cliente (lo que nos enseñó el entrenador de DJI):
   1) Bienvenida  2) Acompañante  3) Indagar  4) Demostración  5) Cierre
   Textos para nosotros en "vos"; frases para el cliente en "usted".
   En las frases: {p} = nombre del producto, {elp} = "el DJI Air 3S"/"la Osmo Pocket 4P",
   {alp} = "al DJI Air 3S"/"a la Osmo Pocket 4P", {cosa} = "el dron"/"la cámara"…, {lo} = "lo"/"la".
   ============================================================ */
(function(){
  "use strict";

  const PASOS = [
    {id:"bienvenida", n:1, titulo:"Bienvenida", corto:"Saludar y dar confianza", icono:"👋"},
    {id:"acompanante", n:2, titulo:"Acompañante", corto:"Incluir a quien viene con él", icono:"👥"},
    {id:"indagar", n:3, titulo:"Indagar", corto:"Preguntas reveladoras", icono:"🔎"},
    {id:"demo", n:4, titulo:"Demostración", corto:"Que lo pruebe y lo sienta suyo", icono:"✋"},
    {id:"cierre", n:5, titulo:"Cierre de venta", corto:"Ayudarle a decidir", icono:"🤝"}
  ];

  const USOS = [
    ["trabajo","💼 Trabajo"], ["viaje","✈️ Vacaciones / viajes"], ["personal","🏠 Uso personal / hobby"]
  ];
  const ACOMP = [
    ["solo","Viene solo"], ["pareja","En pareja"], ["familia","Con familia / niños"], ["experto","Con alguien que “sabe”"], ["colega","Con un compañero / jefe"]
  ];
  const NIVEL = [["nuevo","Es su primera vez"], ["tiene","Ya tiene uno"]];

  // ---------- profesiones: cómo puede usarlo en su trabajo ----------
  const PROF = {
    dron: [
      {id:"inmobiliaria", nombre:"Bienes raíces / inmobiliaria", pregunta:"¿Cómo promociona hoy sus propiedades? ¿Con fotos del celular?",
       como:"Fotos y video aéreo de casas, terrenos y proyectos: se ve el tamaño, los accesos y el entorno. Una publicación con toma aérea llama mucho más la atención en redes y portales, y la propiedad se ve más profesional."},
      {id:"construccion", nombre:"Construcción / arquitectura", pregunta:"¿Cómo le reporta hoy el avance de la obra a sus clientes?",
       como:"Seguimiento del avance de obra desde el aire (la misma toma cada semana), revisar techos y estructuras sin subirse, medir a simple vista el terreno y presentarle el proyecto al cliente."},
      {id:"agro", nombre:"Fincas / agricultura / ganado", pregunta:"¿Qué tan grande es la finca? ¿Cuánto tiempo le toma recorrerla?",
       como:"Ver toda la finca en minutos: estado de los cultivos, linderos, caminos, ganado y daños después de una lluvia, sin recorrerla a pie. También sirve para fotos si quiere vender o promocionar la finca."},
      {id:"eventos", nombre:"Eventos / bodas / fotografía", pregunta:"¿Qué paquetes ofrece hoy? ¿Sus clientes le piden tomas aéreas?",
       como:"Tomas aéreas del lugar, la llegada de los novios y la foto grupal desde arriba. Le da un plus a su paquete y puede cobrar más por la cobertura con dron."},
      {id:"turismo", nombre:"Turismo / hotel / restaurante", pregunta:"¿Cómo atrae hoy a sus clientes? ¿Qué publica en redes?",
       como:"Videos del lugar desde el aire para redes y reservas: el lago, el volcán, la piscina, el entorno. Lo que más vende un lugar es verlo desde arriba."},
      {id:"contenido", nombre:"Creador de contenido / marketing", pregunta:"¿En qué redes publica y qué tipo de contenido hace?",
       como:"Tomas que el celular no puede hacer: revelaciones, seguimiento, órbitas, hyperlapse. Contenido distinto que retiene más a la gente en reels y TikTok."},
      {id:"inspeccion", nombre:"Seguridad / inspección / mantenimiento", pregunta:"¿Qué tiene que revisar hoy que le cuesta llegar o es peligroso?",
       como:"Revisar techos, torres, paneles solares, tuberías o perímetros sin poner a nadie en riesgo ni alquilar grúas; con zoom se ven los detalles."}
    ],
    camara: [
      {id:"contenido", nombre:"Creador de contenido / YouTube / TikTok", pregunta:"¿Qué tipo de contenido hace y en qué redes?",
       como:"Video estable aunque camine, la cámara lo sigue para que no se salga de cuadro, formato vertical para reels y buen sonido con micrófono inalámbrico."},
      {id:"negocio", nombre:"Negocio / vendedor en línea", pregunta:"¿Cómo muestra hoy sus productos en redes?",
       como:"Videos de producto, transmisiones en vivo y recorridos de la tienda que se ven profesionales, sin contratar a nadie."},
      {id:"eventos", nombre:"Eventos / bodas / fotógrafo", pregunta:"¿Qué equipo usa hoy en sus coberturas?",
       como:"Cámara de apoyo ligera: tomas detrás de cámara, cámara lenta y momentos espontáneos sin cargar equipo grande."},
      {id:"periodista", nombre:"Periodismo / entrevistas / podcast", pregunta:"¿Graba entrevistas? ¿A cuántas personas a la vez?",
       como:"Entrevistas con audio limpio usando micrófonos inalámbricos, una cámara discreta que no intimida y que graba por mucho tiempo."},
      {id:"docente", nombre:"Docencia / capacitaciones / iglesia", pregunta:"¿Graba sus clases, cursos o prédicas?",
       como:"Grabar clases o prédicas para subirlas a redes; con seguimiento, la persona no se sale de cuadro aunque camine."},
      {id:"deportes", nombre:"Deportes / aventura / motos", pregunta:"¿Qué deporte practica o enseña?",
       como:"Montada en casco, bici, moto o tabla; resiste agua, golpes y frío, y el video sale estable."},
      {id:"inmobiliaria", nombre:"Bienes raíces (recorridos)", pregunta:"¿Cómo enseña hoy las propiedades a clientes que no pueden ir?",
       como:"Recorridos de casas caminando, estables y en 4K, para mandarlos por WhatsApp o subirlos a redes."}
    ]
  };
  PROF.estabilizador = PROF.camara;
  PROF.microfono = PROF.camara;
  PROF.general = PROF.camara;

  // ---------- lo que va igual para todos los productos de un tipo ----------
  const TIPO = {
    dron: {
      cosa:"el dron", lo:"lo",
      preguntas:["¿Ha volado un dron antes?", "¿Qué le gustaría grabar o fotografiar desde el aire?", "¿Dónde lo va a usar más: ciudad, playa, montaña, finca?", "¿Lo quiere más para fotos, para video o para las dos?", "¿Lo va a llevar de viaje? (el tamaño y el peso importan)", "¿Publica en redes? ¿Vertical u horizontal?"],
      demo:["Encendelo en el área de demostración y mostrá la imagen en vivo en el control o el celular.", "Hacé zoom o cambiá de cámara para que vea el detalle que logra desde lejos.", "Mostrá una función automática (seguimiento o tomas automáticas): así ve que no necesita ser experto.", "Enseñale un video de muestra grabado con ese dron.", "Si es principiante, explicale en una frase la seguridad: detección de obstáculos y regreso automático."],
      accesorios:["Fly More Combo o baterías extra (más tiempo de vuelo)", "Tarjeta microSD de alta velocidad", "Filtros ND (video más de cine cuando hay sol)", "Hélices de repuesto", "Bolso o mochila para llevarlo"],
      objeciones:[
        ["¿Es difícil volarlo?", "Despega y aterriza con un botón, se queda quieto en el aire si suelta los controles y tiene detección de obstáculos. Además, aquí le enseñamos lo básico antes de que se lo lleve."],
        ["¿Y si se cae o choca?", "Para eso está DJI Protection Plus: si tiene un accidente, se lo reemplazan a precio reducido."],
        ["¿Y si pierde la señal?", "Regresa solo al punto de despegue cuando pierde la señal o le queda poca batería."],
        ["¿Necesito permiso para volar?", "Hay lugares donde no se puede volar, como cerca de aeropuertos; la app de DJI avisa de las zonas restringidas. Recomendale conocer las reglas de la DGAC."],
        ["¿Cuánto dura la batería?", "Decile el tiempo de vuelo de ese modelo y mostrale el Fly More Combo: con 3 baterías vuela el triple."]
      ]
    },
    camara: {
      cosa:"la cámara", lo:"la",
      preguntas:["¿Qué usa hoy para grabar? ¿El celular?", "¿Qué le gustaría grabar: viajes, familia, contenido, trabajo?", "¿Se graba usted mismo hablando a cámara?", "¿Publica en redes? ¿Vertical u horizontal?", "¿Graba en movimiento (caminando, haciendo deporte) o desde un lugar fijo?", "¿Le importa el sonido? (entrevistas, hablar a cámara)"],
      demo:["Encendela y ponésela en las manos al cliente, grabándolo a él: que se vea en la pantalla.", "Que camine con ella y después vean el video: la estabilización convence sola.", "Activá el seguimiento de la cara y que se mueva: la cámara lo sigue.", "Si va a hablar a cámara, conectá un micrófono DJI y que escuche la diferencia.", "Mostrale lo fácil que pasa los videos al celular para publicarlos."],
      accesorios:["Micrófono DJI Mic (audio claro)", "Tarjeta microSD", "Mini trípode o palo de selfie", "Batería extra o mango con batería", "Estuche"],
      objeciones:[
        ["Mi celular ya graba bien", "El celular no tiene estabilizador mecánico ni un sensor tan grande: caminando se mueve y con poca luz pierde calidad. Además no se le llena la memoria ni se le gasta la batería del celular."],
        ["¿No es complicado de usar?", "Se usa con un botón y la app la configura; aquí le enseñamos lo básico antes de que se la lleve."],
        ["¿Y si se me cae o se daña?", "Con DJI Protection Plus, si tiene un accidente, se la reemplazan a precio reducido."]
      ]
    },
    estabilizador: {
      cosa:"el estabilizador", lo:"lo",
      preguntas:["¿Graba con el celular o con una cámara?", "¿Qué celular tiene? (para ver que sea compatible)", "¿Qué graba: contenido, viajes, familia, eventos?", "¿Graba caminando o en movimiento?", "¿Se graba usted solo? (el seguimiento le ayuda mucho)"],
      demo:["Poné el celular del cliente en el estabilizador y que grabe caminando; después compará con un video sin estabilizador.", "Activá el seguimiento: que se mueva y el estabilizador lo sigue solo.", "Mostrá lo rápido que se pone y se quita el celular con la abrazadera magnética."],
      accesorios:["Micrófono DJI Mic Mini 2", "Trípode o extensión", "Módulo multifuncional (luz y seguimiento)", "Estuche"],
      objeciones:[
        ["Mi celular ya tiene estabilizador", "El del celular es digital y recorta la imagen; el de 3 ejes es mecánico: el video sale fluido aunque corra, y además lo sigue solo."],
        ["¿Sirve con mi celular?", "Revisemos la lista de compatibilidad en la página de DJI con su modelo."]
      ]
    },
    microfono: {
      cosa:"el micrófono", lo:"lo",
      preguntas:["¿Graba hablando a cámara, entrevistas, podcast o transmisiones en vivo?", "¿Graba con celular o con cámara?", "¿Habla una persona o dos a la vez?", "¿Graba en lugares con ruido (calle, eventos)?"],
      demo:["Ponele el transmisor al cliente y que hable lejos del celular; después escuchen la grabación con y sin micrófono.", "Mostrá la cancelación de ruido aquí en la tienda.", "Enseñá el estuche de carga: guarda y carga todo junto."],
      accesorios:["Receptor para celular o cámara (según lo que use)", "Cubiertas magnéticas de colores", "Antiviento extra"],
      objeciones:[
        ["El micrófono del celular es suficiente", "De cerca sí, pero a un metro ya se escucha el eco y el ruido. Con el inalámbrico la voz se oye clara aunque esté lejos."],
        ["¿Uno o dos transmisores?", "Si siempre habla solo, uno; si hace entrevistas o graba con alguien más, el de dos le sale mejor que comprar otro después."]
      ]
    }
  };
  TIPO.general = {
    cosa:"el producto", lo:"lo",
    preguntas:["¿Qué lo trae por aquí hoy?", "¿Para qué lo usaría?", "¿Ya tiene algún producto DJI?", "¿Qué usa hoy para grabar o tomar fotos?"],
    demo:["Ponele el producto en las manos, encendido.", "Mostrá la función que responde a lo que te contó."],
    accesorios:["Tarjeta microSD", "Baterías extra", "Estuche o bolso"],
    objeciones:[]
  };

  // ---------- productos ----------
  // claves: [característica, para qué le sirve al cliente]
  const PRODUCTOS = [
    {id:"neo2", nombre:"DJI Neo 2", tipo:"dron",
     gancho:"El dron que despega de la mano y lo sigue solo: perfecto para selfies y videos sin saber volar.",
     ideal:"Principiantes, familias, creadores de contenido y viajeros que quieren algo pequeño.",
     claves:[["Despega y aterriza en la palma, control con gestos","No necesita control ni experiencia para empezar"],["ActiveTrack y SelfieShot","Lo sigue mientras camina, corre o anda en bici: usted sale en el video"],["Protectores de hélices integrales","Seguro cerca de personas y niños"],["Detección de obstáculos omnidireccional","Menos riesgo de choques"],["Video 4K","Videos nítidos para redes"]],
     demo:["Hacelo despegar de tu palma y después de la del cliente: es lo que más impresiona.", "Mostrá el seguimiento: que el cliente camine y el Neo 2 lo siga."],
     trabajo:{contenido:"Tomas en tercera persona y seguimiento sin necesitar camarógrafo.", turismo:"Videos rápidos del lugar con la gente disfrutando."},
     viaje:"Cabe en cualquier bolso; despega de la mano en la playa o el mirador y graba al grupo completo.",
     personal:"Videos de la familia, las mascotas y los paseos sin tener que aprender a volar.",
     combo:"Fly More Combo: control RC-N3, 3 baterías y centro de carga (más tiempo y más alcance). Motion Fly More: con gafas Goggles N3 y RC Motion 3 para volar en primera persona.",
     objeciones:[["¿No es un juguete?","No: graba 4K estabilizado, tiene detección de obstáculos y seguimiento inteligente. Es un dron DJI completo en tamaño pequeño."]]},
    {id:"lito1", nombre:"DJI Lito 1", tipo:"dron",
     gancho:"El primer dron “en serio” a buen precio: cámara de 48 MP, estabilizador de 3 ejes y detección de obstáculos.",
     ideal:"Principiantes que quieren buenas fotos aéreas sin gastar mucho.",
     claves:[["Cámara de 1/2\" con fotos de 48 MP y gimbal de 3 ejes","Fotos nítidas y video estable aunque haya viento"],["4K a 60 fps y cámara lenta 4K a 100 fps","Videos fluidos y tomas en cámara lenta"],["Detección de obstáculos en todas direcciones","Más seguro para el que empieza"],["ActiveTrack y tomas automáticas","Videos que parecen profesionales con un toque"],["Hasta 36 minutos de vuelo","Tiempo de sobra para lograr la toma"]],
     demo:["Mostrá en el control la imagen en vivo y una toma automática."],
     viaje:"Liviano y fácil de llevar: fotos del viaje desde el aire con calidad de 48 MP.",
     personal:"Un primer dron que no se queda corto: buena cámara y seguridad para aprender tranquilo.",
     combo:"Fly More Combo: 3 baterías, centro de carga y bolso; casi 2 horas de vuelo en total."},
    {id:"litox1", nombre:"DJI Lito X1", tipo:"dron",
     gancho:"Sensor más grande (1/1.3\") y LiDAR: mejores fotos al atardecer y más seguridad, a precio intermedio.",
     ideal:"Quien quiere subir de nivel en calidad de imagen sin llegar al precio de un Air.",
     claves:[["Sensor de 1/1.3\" de 48 MP y apertura f/1.7","Fotos más limpias al atardecer y de noche"],["Color de 10 bits D-Log M","Para quien edita: más margen para corregir el color"],["Detección omnidireccional y LiDAR frontal","Más seguro también con poca luz"],["Transmisión de video DJI O4","Imagen estable a más distancia"],["36 minutos de vuelo y 42 GB de memoria interna","Graba aunque se le olvide la microSD"]],
     demo:["Mostrá una foto o video de atardecer: ahí se nota el sensor más grande."],
     viaje:"Fotos de paisaje con mejor luz, sobre todo al amanecer y al atardecer, que es cuando más se vuela de viaje.",
     personal:"Un dron que crece con usted: fácil para empezar y con color profesional si después quiere editar.",
     combo:"4 versiones: Estándar (RC-N3), Fly More (RC-N3), Fly More con RC 2 (control con pantalla, ya no usa el celular) y Fly More Plus (baterías Plus de mayor duración)."},
    {id:"mini5pro", nombre:"DJI Mini 5 Pro", tipo:"dron",
     gancho:"Cámara de 1 pulgada en un mini dron: lo mejor que hay en tamaño pequeño.",
     ideal:"Viajeros y creadores que quieren calidad casi profesional en algo que cabe en la mano.",
     claves:[["Sensor de 1 pulgada de 50 MP","Calidad casi profesional, excelente con poca luz"],["Estabilizador que gira 225°: vertical real","Fotos y videos verticales para reels sin recortar la imagen"],["Detección omnidireccional y LiDAR, también de noche","Vuela seguro al atardecer"],["ActiveTrack 360°","Lo sigue y lo rodea solo para tomas de cine"],["Hasta 52 minutos con la batería Plus","Más tiempo en el aire por batería"]],
     demo:["Mostrá el giro del gimbal a vertical: siempre sorprende.", "Enseñá una foto nocturna de muestra."],
     trabajo:{inmobiliaria:"Fotos verticales para historias y reels de la propiedad, y calidad de 1 pulgada para el portal.", contenido:"Vertical nativo para TikTok y reels, sin perder calidad."},
     viaje:"Cabe en la mano y le da calidad de 1 pulgada: el compañero de viaje ideal.",
     personal:"El mejor mini dron para quien quiere calidad sin cargar un equipo grande.",
     combo:"Fly More Combo Plus con RC 2 (control con pantalla), 3 baterías Plus, centro de carga y filtros ND: listo para todo."},
    {id:"avata360", nombre:"DJI Avata 360", tipo:"dron",
     gancho:"Graba en 360° y 8K: vuela una vez y después escoge el ángulo que quiera.",
     ideal:"Creadores, turismo y quien quiere tomas inmersivas y distintas.",
     claves:[["Video 360° en 8K a 60 fps con HDR","Toda la escena queda grabada: no se le escapa nada"],["Reencuadre después de volar","Una sola toma le da muchos ángulos para editar"],["Protectores de hélices integrados","Puede volar cerca de personas y en interiores con más seguridad"],["Detección omnidireccional y LiDAR frontal","Más seguridad al volar"],["Transmisión DJI O4+ de hasta 20 km","Señal fuerte y estable"]],
     demo:["Mostrá un video 360 en la app y cómo se cambia el ángulo arrastrando el dedo: es el “wow”."],
     trabajo:{turismo:"Recorridos 360 del hotel o del lugar para redes.", inmobiliaria:"Recorridos inmersivos de la propiedad.", eventos:"Tomas 360 de la fiesta sin perderse ningún momento."},
     viaje:"No tiene que apuntar: graba todo alrededor y después escoge lo mejor del viaje.",
     personal:"Tomas que nadie más tiene: perfecto para quien le gusta editar y sorprender.",
     combo:"Estándar con RC 2, Fly More con 3 baterías, o Motion Fly More con gafas Goggles N3 y RC Motion 3 para volar en primera persona."},
    {id:"avata2", nombre:"DJI Avata 2", tipo:"dron",
     gancho:"Vuelo en primera persona (FPV): se siente como si usted fuera volando.",
     ideal:"Quien busca emoción y tomas dinámicas: deportes, aventura, creadores.",
     claves:[["Gafas Goggles N3 y RC Motion 3","Vuela moviendo la mano: intuitivo y emocionante"],["Acrobacias con un botón (Easy ACRO)","Giros y volteretas sin ser experto"],["Lente ultra gran angular de 155°","Tomas inmersivas y con velocidad"],["Hélices protegidas","Puede volar cerca de cosas con más seguridad"],["Estabilización RockSteady y HorizonSteady","Video estable aunque haga maniobras"]],
     demo:["Ponele las gafas al cliente con un video de muestra: la experiencia vende sola."],
     viaje:"Tomas de aventura que se sienten como estar ahí: montaña, playa, cascadas.",
     personal:"La experiencia más emocionante de DJI: se siente como volar.",
     combo:"Fly Smart Combo: gafas, RC Motion 3 y 3 baterías con centro de carga.",
     objeciones:[["¿Me voy a marear con las gafas?","La mayoría se adapta rápido; se empieza con vuelos cortos y suaves."]]},
    {id:"flip", nombre:"DJI Flip", tipo:"dron",
     gancho:"El dron para vlogs: plegable, ligero y con hélices protegidas, ideal para grabarse a uno mismo.",
     ideal:"Vlogueros, viajeros y quien quiere grabarse sin otra persona.",
     claves:[["Cámara de 1/1.3\" de 48 MP, 4K a 60 fps HDR","Video de calidad para vlogs y redes"],["Protectores de hélices plegables integrados","Seguro cerca de personas; se dobla y cabe en el bolso"],["Seguimiento con IA","Lo sigue solo mientras usted habla o camina"],["Menos de 249 g","Muy fácil de llevar a todos lados"],["Hasta 31 minutos de vuelo","Suficiente para varias tomas"]],
     demo:["Desplegalo frente al cliente para que vea lo compacto y después mostrá el seguimiento con IA."],
     viaje:"Plegable y liviano: el dron para grabarse en cada lugar del viaje.",
     personal:"Para grabarse uno mismo sin pedirle a nadie que le tome el video.",
     combo:"Estándar con RC-N3, o Fly More Combo con RC 2 (control con pantalla), 3 baterías y bolso."},
    {id:"air3s", nombre:"DJI Air 3S", tipo:"dron",
     gancho:"Doble cámara: 1 pulgada + tele 3x. El dron de viajes y fotografía por excelencia.",
     ideal:"Viajeros, fotógrafos, inmobiliarias y creadores que quieren calidad profesional sin un dron grande.",
     claves:[["Cámara principal de 1 pulgada de 50 MP","Fotos de paisaje con mucho detalle y buen rango dinámico"],["Cámara tele de 70 mm (zoom óptico 3x)","Se acerca sin volar cerca: fachadas, personas y animales sin perder calidad"],["Video 4K a 60 fps HDR con 14 pasos de rango dinámico","El cielo y las sombras salen bien al amanecer o al atardecer"],["Detección de obstáculos omnidireccional, también de noche","Vuelo seguro en la ciudad de noche"],["Transmisión DJI O4 de hasta 20 km y 45 minutos de vuelo","Señal estable y mucho tiempo en el aire"]],
     demo:["En el control RC 2, mostrá la cámara principal y cambiá a la tele 3x: el cambio de perspectiva impresiona.", "Enseñá un video nocturno o un atardecer en HDR."],
     trabajo:{inmobiliaria:"Con la tele 3x muestra detalles de la fachada y del entorno sin acercarse; con la de 1 pulgada, tomas generales muy nítidas.", construccion:"Inspección de detalles con la tele sin arriesgar el dron cerca de la estructura.", eventos:"Tomas con la tele de la pareja o los invitados sin molestar con el ruido del dron cerca."},
     viaje:"Le cabe en la mochila y le da fotos de paisaje de nivel profesional; con la tele logra tomas que parecen de cine.",
     personal:"Para quien le gusta la fotografía: dos cámaras para crear tomas distintas.",
     combo:"Fly More Combo (RC 2): 3 baterías, centro de carga, filtros ND y bolso."},
    {id:"mavic4pro", nombre:"DJI Mavic 4 Pro", tipo:"dron",
     gancho:"Lo más alto de DJI: cámara Hasselblad de 4/3 y 100 MP con triple cámara, para profesionales.",
     ideal:"Fotógrafos y videógrafos profesionales, productoras y agencias.",
     claves:[["Cámara Hasselblad de 4/3 con 100 MP","Calidad profesional para publicidad e impresión grande"],["Video 6K a 60 fps HDR","Material de cine con mucho detalle"],["Teles de 70 mm y 168 mm","Tres perspectivas en un solo dron"],["Gimbal Infinity con rotación de 360°","Tomas que otros drones no pueden hacer"],["51 minutos de vuelo y transmisión de hasta 30 km","Jornadas de trabajo más largas"]],
     demo:["Mostrá las tres cámaras en el control y el giro del gimbal Infinity."],
     viaje:"Para el viajero que no acepta menos que lo mejor en calidad de imagen.",
     personal:"Si la fotografía es su pasión y quiere lo máximo.",
     combo:"Fly More Combo con RC 2, o Creator Combo con RC Pro 2 (pantalla de 7\" muy brillante), 512 GB internos y cargador de 240 W."},

    {id:"pocket3", nombre:"Osmo Pocket 3", tipo:"camara",
     gancho:"La cámara de bolsillo con sensor de 1 pulgada y estabilizador: video de calidad que cabe en la mano.",
     ideal:"Vlogueros, familias y viajeros que quieren algo pequeño y de calidad.",
     claves:[["Sensor CMOS de 1 pulgada","Buena imagen incluso con poca luz"],["Gimbal mecánico de 3 ejes","Video estable caminando"],["Pantalla táctil giratoria de 2\"","Se ve mientras graba, vertical u horizontal"],["ActiveTrack 6.0","Lo sigue y lo mantiene en cuadro"],["4K a 60 fps y cámara lenta 4K a 120 fps","Tomas fluidas y en cámara lenta"]],
     demo:["Girá la pantalla frente al cliente para pasar de horizontal a vertical."],
     viaje:"Cabe en la bolsa del pantalón y graba el viaje estable y con buena luz.",
     personal:"Para grabar a la familia y los momentos del día con calidad, sin sacar el celular.",
     combo:"Creator Combo: micrófono DJI Mic 2, mango con batería, lente gran angular, mini trípode y bolso."},
    {id:"pocket4", nombre:"Osmo Pocket 4", tipo:"camara",
     gancho:"La nueva Pocket: más memoria, más batería y cámara lenta hasta 240 fps.",
     ideal:"Creadores y viajeros que graban mucho y no quieren preocuparse por memoria ni batería.",
     claves:[["Sensor CMOS de 1 pulgada","Excelente con poca luz"],["Cámara lenta 4K hasta 240 fps","Tomas espectaculares en cámara lenta"],["Pantalla de 2\" y 1000 nits","Se ve bien hasta bajo el sol"],["ActiveTrack 7.0","Seguimiento más preciso"],["107 GB internos y hasta 240 minutos de grabación","Graba todo el día"]],
     demo:["Grabá al cliente en cámara lenta 4K y mostrale el resultado."],
     viaje:"Graba todo el día sin cambiar memoria ni batería: ideal para viajes largos.",
     personal:"Para guardar los momentos importantes con calidad y en cámara lenta.",
     combo:"Standard, o Creator Combo con micrófono DJI Mic 3, luz de relleno, lente gran angular, mini trípode y bolso."},
    {id:"pocket4p", nombre:"Osmo Pocket 4P", tipo:"camara",
     gancho:"Doble cámara con zoom óptico 3x: retratos y detalles que ninguna cámara de bolsillo hacía.",
     ideal:"Creadores de contenido, vlogueros, viajeros y quien quiere retratos con el fondo bonito.",
     claves:[["Doble cámara: 1 pulgada + tele de 1/1.28\"","Gran angular para el paisaje y tele para la persona"],["Zoom óptico 3x","Retratos que favorecen y acercamientos sin perder calidad"],["Cámara lenta 4K hasta 240 fps","Momentos en cámara lenta"],["Gimbal mecánico de 3 ejes","Video estable caminando"],["Pantalla de 2\" y 1000 nits, 103 GB internos","Se ve bajo el sol y graba mucho sin microSD"]],
     demo:["Ponésela en la mano al cliente apuntándose a sí mismo y cambiá a la tele 3x: verse en retrato con el fondo desenfocado convence.", "Mostrá la luz de relleno (viene en el pack estándar) en un rincón con poca luz."],
     trabajo:{contenido:"Con la tele 3x hace tomas de producto y retratos; con el Vlog Combo graba con audio limpio y controla la cámara a distancia.", negocio:"Videos de producto con zoom a los detalles, sin perder calidad."},
     viaje:"Paisaje con la gran angular y retratos con la tele: dos cámaras de bolsillo en una.",
     personal:"Videos de la familia que se ven de otro nivel, con retratos y cámara lenta.",
     combo:"Standard (con luz de relleno y estuche) o Vlog Combo: control FrameTap, micrófono Mic Mini 2, mini trípode y bolso, ideal para quien se graba hablando."},
    {id:"nano", nombre:"Osmo Nano", tipo:"camara",
     gancho:"Cámara diminuta y magnética: se pega donde sea y graba desde perspectivas que otra cámara no puede.",
     ideal:"Creadores, deportistas y quien quiere grabar con las manos libres.",
     claves:[["Diseño magnético de doble cara","Se pone en la gorra, el pecho o el carro: manos libres"],["4K a 60 fps y gran angular de 143°","Captura toda la escena"],["Cámara sumergible a 10 m","Para piscina, playa y lluvia"],["Dock con pantalla y control remoto","Ve lo que graba y pasa los videos rápido"],["Hasta 200 minutos con el dock","Graba por mucho tiempo"]],
     demo:["Pegala en la gorra o la camisa del cliente con el clip magnético y que camine; después vean el video."],
     trabajo:{deportes:"Pegada al casco o al pecho graba la actividad desde su punto de vista.", contenido:"Tomas en primera persona (POV) que le dan variedad a sus videos."},
     viaje:"Pegada en la gorra graba el recorrido sin sacar nada de la mochila.",
     personal:"Para grabar con las manos libres: con los hijos, la mascota o manejando.",
     combo:"De 64 GB o 128 GB; las dos traen dock, clip para gorra, collar magnético y estuche."},
    {id:"action6", nombre:"Osmo Action 6", tipo:"camara",
     gancho:"La cámara de acción todo terreno: sensor grande, apertura variable y resiste agua, golpes y frío.",
     ideal:"Deportistas, motociclistas, buzos y viajeros de aventura.",
     claves:[["Sensor cuadrado de 1/1.1\"","Mejor imagen con poca luz; vertical u horizontal sin perder calidad"],["Apertura variable f/2.0-f/4.0","Se adapta a mucha o poca luz"],["Sumergible hasta 20 m","Sin estuche: playa, río, piscina"],["Batería de 4 horas, resistente al frío","Todo el día de aventura"],["Conexión directa de micrófonos DJI (OsmoAudio)","Audio claro sin receptor"]],
     demo:["Ponésela en un soporte o en la mano al cliente y movela fuerte: después mostrá la estabilización en el video."],
     trabajo:{deportes:"Montada en casco, bici o moto; graba aunque llueva."},
     viaje:"Resiste agua, golpes y frío: no hay que cuidarla en la aventura.",
     personal:"Para el que hace deporte y quiere grabarlo sin miedo a dañar la cámara.",
     combo:"Standard, o Adventure Combo con 3 baterías, estuche cargador y brazo extensible de 1.5 m."},
    {id:"osmo360ii", nombre:"Osmo 360 II", tipo:"camara",
     gancho:"Graba todo a su alrededor en 360°: después escoge el ángulo, y el palo de selfie desaparece.",
     ideal:"Creadores, viajeros y deportistas que quieren tomas diferentes.",
     claves:[["Imágenes 360° HDR en 8K a 60 fps con sensores de 1 pulgada","Toda la escena con mucha calidad"],["Supernoche IA 2.0","Buenas tomas de noche"],["Lentes resistentes y reemplazables","Si se raya un lente, se cambia"],["Edición inteligente","La app arma el video y se comparte al instante"],["105 GB de memoria interna","Mucho espacio"]],
     demo:["Grabá al cliente con el palo invisible y mostrale en la app cómo desaparece el palo y cómo se cambia el ángulo."],
     viaje:"No hay que apuntar: graba todo y después elige; el palo invisible hace tomas que parecen de dron.",
     personal:"Videos distintos y fáciles: la app los arma sola.",
     combo:"Standard, o Adventure Combo con 2 baterías extra, estuche cargador y palo de selfie invisible de 1.2 m."},

    {id:"estabilizadores", nombre:"Estabilizadores (Osmo Mobile y RS)", tipo:"estabilizador",
     gancho:"Video estable con el celular (Osmo Mobile) o con cámara profesional (RS).",
     ideal:"Quien graba con el celular y quiere video fluido y que lo siga solo; o videógrafos con cámara.",
     claves:[["Osmo Mobile 7","3 ejes, ActiveTrack 7.0 y 10 horas de batería: el más accesible"],["Osmo Mobile 8","Seguimiento nativo con el módulo multifuncional (luz y audio) y rotación de 360°"],["Osmo Mobile 8P","Control remoto FrameTap con pantalla, ActiveTrack 8.0, palo y trípode integrados"],["RS 4 Mini / RS 5 / RS 4 Pro","Para cámaras mirrorless y de cine (hasta 2, 3 y 4.5 kg)"]],
     demo:["Poné el celular del cliente y que grabe caminando; compará con un video sin estabilizador."],
     viaje:"Videos fluidos del viaje con el mismo celular, y trípode para fotos de grupo.",
     personal:"Para grabar a la familia y los paseos con el celular, sin que se mueva.",
     combo:"OM 7 si busca lo básico; OM 8 si quiere seguimiento con luz y audio; OM 8P si se graba solo y quiere controlarlo a distancia."},
    {id:"microfonos", nombre:"Micrófonos DJI Mic", tipo:"microfono",
     gancho:"Audio claro sin cables: lo que más mejora un video.",
     ideal:"Creadores, entrevistas, podcast, clases y transmisiones en vivo.",
     claves:[["Mic Mini 2","Ligero, con 1 o 2 transmisores y receptor para celular o cámara"],["Mic Mini 2S","Grabación interna de 32 bits: respaldo si falla la conexión, hasta 4 transmisores"],["Mic 3","El más completo: 4TX + 8RX, código de tiempo y grabación interna de 32 bits"],["1 o 2 transmisores","Una persona, o dos para entrevistas y parejas de contenido"]],
     demo:["Ponele el transmisor al cliente y que hable lejos del celular; después escuchen con y sin micrófono."],
     viaje:"Narrar el viaje con la voz clara aunque haya viento o ruido.",
     personal:"Para que los videos de la familia o las reuniones se escuchen bien.",
     combo:"Con estuche de carga para cargar todo junto; receptor para celular (USB-C) o para cámara según lo que use."}
  ];

  // ---------- acompañantes ----------
  const ACOMP_TXT = {
    solo:{titulo:"Viene solo", hacer:["Hoy no hay acompañante: enfocate en él.", "Si menciona a alguien (“lo voy a consultar con mi esposa”), preguntá por esa persona: también decide.", "Si le manda fotos o hace videollamada, incluí a esa persona: saludala y mostrale el producto."], frases:["¿Es para usted o es un regalo?", "¿Alguien más lo va a usar en casa?"]},
    pareja:{titulo:"En pareja", hacer:["Saludá a los dos y preguntá los dos nombres.", "Imaginen el uso juntos: viajes, fotos de los dos, la familia.", "Dale {cosa} también a la pareja en la demostración.", "Fijate quién decide y quién paga, pero hablale a los dos por igual."], frases:["¿Y a usted también le gustaría usar{lo}?", "Imagínense las fotos de su próximo viaje juntos.", "¿Qué les gustaría grabar a los dos?"]},
    familia:{titulo:"Con familia / niños", hacer:["Saludá a todos, también a los niños.", "Hablá de seguridad y facilidad: lo que más le importa a una familia.", "A los niños mostrales algo divertido y seguro (por ejemplo, el seguimiento).", "Pensá en los momentos familiares: cumpleaños, viajes, deportes de los hijos."], frases:["¿Quién se anima a probar{lo}?", "Imagínese grabar los partidos o las presentaciones de los niños.", "Es muy fácil de usar: hasta los niños aprenden rápido, con supervisión."]},
    experto:{titulo:"Con alguien que “sabe”", hacer:["Apoyate en él: preguntale su opinión y qué ha usado.", "Hablá con datos técnicos cuando él pregunte (sensor, bits de color, transmisión).", "No lo contradigas frente al cliente; si se equivoca, aclaralo con respeto mostrando el dato.", "Si el experto se convence, el cliente compra."], frases:["¿Usted qué equipo ha usado?", "Como usted sabe, el sensor más grande hace la diferencia con poca luz.", "¿Qué le parece a usted para lo que él necesita?"]},
    colega:{titulo:"Con un compañero / jefe", hacer:["Hablá de cómo ayuda al negocio: ahorro de tiempo, mejores ventas, imagen profesional.", "Preguntá quién lo va a usar y quién aprueba la compra.", "Ofrecé factura a nombre de la empresa (NIT).", "Si deciden después, dejales la información por escrito o por WhatsApp."], frases:["¿Para qué área de la empresa sería?", "¿Cuánto les cuesta hoy contratar ese servicio afuera?", "Con gusto le hacemos la factura a nombre de la empresa."]}
  };

  window.GUIA = {PASOS, USOS, ACOMP, NIVEL, PROF, TIPO, PRODUCTOS, ACOMP_TXT};
})();
