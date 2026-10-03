/* ============================================================
   Nube de la tienda (Firebase · Firestore)

   - Cada computadora se conecta UNA sola vez abriendo el "link de la
     tienda":  https://dji-gt.github.io/app/#conectar=CLAVE
     La clave queda guardada en ese navegador y NUNCA se sube a GitHub.
   - Sin clave, la app funciona igual que siempre: solo en este equipo.
   - Los datos viven en  tiendas/{CLAVE}/{colección}/{documento}.
   ============================================================ */
(function(){
  "use strict";

  const CONFIG = {
    apiKey: "AIzaSyC47tINwbIwWxZ098G7z_o36w1lVZimv6U",
    authDomain: "dji-gt-app.firebaseapp.com",
    projectId: "dji-gt-app",
    storageBucket: "dji-gt-app.firebasestorage.app",
    messagingSenderId: "571367090193",
    appId: "1:571367090193:web:81c27eeb1fb3b140b5e9b0"
  };
  const SDK = "https://www.gstatic.com/firebasejs/12.19.0/";
  const LS_CLAVE  = "dji_nube_clave";
  const LS_RECIEN = "dji_nube_recien";
  const LS_EMU    = "dji_nube_emulador";   // solo para pruebas locales
  const RX_CLAVE  = /^[A-Za-z0-9_-]{32,128}$/;

  const leerLS = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
  const escribirLS = (k,v) => { try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k,v); return true; }catch(e){ return false; } };

  // ---------- 1) link de conexión: #conectar=CLAVE (puede venir con #mensajes, etc.) ----------
  (function capturar(){
    const h=location.hash.replace(/^#/,""); if(!/(^|&)conectar=/.test(h)) return;
    let clave=null; const resto=[];
    h.split("&").forEach(p=>{ const m=p.match(/^conectar=(.*)$/); if(m) clave=decodeURIComponent(m[1]); else if(p) resto.push(p); });
    if(clave && RX_CLAVE.test(clave)){ escribirLS(LS_CLAVE,clave); escribirLS(LS_RECIEN,"1"); }
    history.replaceState(null,"",location.pathname+location.search+(resto.length?"#"+resto.join("&"):""));
  })();

  const clave = () => { const c=leerLS(LS_CLAVE); return c && RX_CLAVE.test(c) ? c : null; };

  // ---------- 2) estado de la conexión ----------
  let db=null, base=null, promesa=null;
  let error=null, servidorOk=false, pendientes=0;
  const pastillas=[];

  function textoEstado(){
    if(!clave()) return ["local","💻","Solo en este equipo"];
    if(error) return ["error","⚠️",error];
    if(navigator.onLine===false) return ["off","📴","Sin internet · se sube al volver"];
    if(pendientes>0) return ["sync","⏳","Guardando en la nube…"];
    if(servidorOk) return ["ok","☁️","Guardado en la nube"];
    return ["sync","⏳","Conectando a la nube…"];
  }
  function pintarTodos(){
    const [cls,ic,txt]=textoEstado();
    pastillas.forEach(el=>{ el.className="nube-pill nube-"+cls; el.innerHTML=`<span class="nube-ic">${ic}</span><span class="nube-tx">${txt}</span>`; el.title=txt; });
  }
  function marcarServidor(meta){ if(meta && !meta.fromCache && !servidorOk){ servidorOk=true; pintarTodos(); } }
  function falla(err){
    console.error("Nube:", err);
    error = err && err.code==="permission-denied" ? "Sin permiso en la nube (revisá las reglas)" : "Error de nube";
    pintarTodos();
  }
  function seguir(p){
    pendientes++; pintarTodos();
    return Promise.resolve(p).then(r=>{ error=null; return r; }, e=>{ falla(e); throw e; })
      .finally(()=>{ pendientes=Math.max(0,pendientes-1); pintarTodos(); });
  }
  addEventListener("online", pintarTodos);
  addEventListener("offline", pintarTodos);

  // ---------- 3) conexión ----------
  function cargarScript(src){
    return new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=()=>rej(new Error("No cargó "+src)); document.head.appendChild(s); });
  }
  function iniciar(){
    if(!clave()) return Promise.resolve(null);
    if(promesa) return promesa;
    promesa=(async()=>{
      try{
        if(!window.firebase || !window.firebase.firestore){
          await cargarScript(SDK+"firebase-app-compat.js");
          await cargarScript(SDK+"firebase-firestore-compat.js");
        }
        const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CONFIG);
        db = app.firestore();
        const emu = leerLS(LS_EMU);
        if(emu){ const [h,p]=emu.split(":"); db.useEmulator(h, Number(p)); }
        // caché sin conexión compartida entre las secciones (si el navegador lo permite)
        try{ await db.enablePersistence({synchronizeTabs:true}); }catch(e){}
        base = db.collection("tiendas").doc(clave());
        pintarTodos();
        return db;
      }catch(e){ promesa=null; falla(e); return null; }
    })();
    return promesa;
  }

  // ---------- 4) ayudantes ----------
  // JSON con las llaves ordenadas: sirve para comparar sin falsos cambios
  function estable(v){
    if(v===undefined) return "null";
    if(v===null || typeof v!=="object") return JSON.stringify(v);
    if(Array.isArray(v)) return "["+v.map(estable).join(",")+"]";
    return "{"+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+":"+estable(v[k])).join(",")+"}";
  }
  const limpio = v => JSON.parse(JSON.stringify(v));
  const col = n => base.collection(n);
  const tiene = (o,k) => !!o && Object.prototype.hasOwnProperty.call(o,k);

  /* Documento "mapa": cada campo guarda un valor (en JSON).
     escucharMapa(col, id, cb(mapa, existe, meta))  ·  guardarMapa(col, id, ahora, antes) */
  function escucharMapa(colName, id, cb){
    return col(colName).doc(id).onSnapshot({includeMetadataChanges:true}, snap=>{
      marcarServidor(snap.metadata);
      const d=snap.data()||{}, out={};
      for(const k in d){ try{ out[k]=JSON.parse(d[k]); }catch(e){} }
      cb(out, snap.exists, snap.metadata);
    }, falla);
  }
  function guardarMapa(colName, id, ahora, antes){
    if(!base) return Promise.resolve(false);
    const campos=[], datos={};
    new Set([...Object.keys(ahora||{}), ...Object.keys(antes||{})]).forEach(k=>{
      const a = tiene(ahora,k) && ahora[k]!==undefined ? estable(ahora[k]) : undefined;
      const b = tiene(antes,k) && antes[k]!==undefined ? estable(antes[k]) : undefined;
      if(a===b) return;
      campos.push(new firebase.firestore.FieldPath(k));
      datos[k] = a===undefined ? firebase.firestore.FieldValue.delete() : JSON.stringify(ahora[k]);
    });
    if(!campos.length) return Promise.resolve(false);
    return seguir(col(colName).doc(id).set(datos,{mergeFields:campos})).catch(()=>false);
  }

  /* Colección: un documento por elemento.
     escucharColeccion(col, cb(mapa id->datos, meta))  ·  guardarColeccion(col, ahora, antes) */
  function escucharColeccion(colName, cb){
    return col(colName).onSnapshot({includeMetadataChanges:true}, snap=>{
      marcarServidor(snap.metadata);
      const out={}; snap.forEach(d=>{ out[d.id]=d.data(); });
      cb(out, snap.metadata);
    }, falla);
  }
  function guardarColeccion(colName, ahora, antes){
    if(!base) return Promise.resolve(false);
    const ops=[];
    for(const id in (ahora||{})) if(!tiene(antes,id) || estable(ahora[id])!==estable(antes[id])) ops.push([id,limpio(ahora[id])]);
    for(const id in (antes||{})) if(!tiene(ahora,id)) ops.push([id,null]);
    if(!ops.length) return Promise.resolve(false);
    const lotes=[];
    for(let i=0;i<ops.length;i+=400){
      const b=db.batch();
      ops.slice(i,i+400).forEach(([id,v])=>{ const r=col(colName).doc(id); if(v) b.set(r,v); else b.delete(r); });
      lotes.push(seguir(b.commit()).catch(()=>false));
    }
    return Promise.all(lotes);
  }

  // Lectura directa del servidor (para unir lo que ya había en este equipo)
  async function leerColeccion(colName){ const s=await col(colName).get({source:"server"}); const out={}; s.forEach(d=>out[d.id]=d.data()); return out; }
  async function leerMapa(colName,id){
    const s=await col(colName).doc(id).get({source:"server"}); const d=s.data()||{}, out={};
    for(const k in d){ try{ out[k]=JSON.parse(d[k]); }catch(e){} }
    return {mapa:out, existe:s.exists};
  }
  // Ejecuta "fn" solo la primera vez que este equipo se conecta (por sección)
  async function unirUnaVez(seccion, fn){
    const k="dji_nube_unido_"+seccion;
    if(leerLS(k)===clave()) return false;
    try{ await fn(); escribirLS(k,clave()); return true; }
    catch(e){ console.warn("Nube: no se pudo unir "+seccion+" (se reintenta luego)", e); return false; }
  }

  // ---------- 5) pastilla de estado ----------
  function estilos(){
    if(document.getElementById("nube-css")) return;
    const s=document.createElement("style"); s.id="nube-css";
    s.textContent=`.nube-pill{display:inline-flex;align-items:center;gap:6px;border-radius:20px;padding:5px 11px;font:700 12px/1.2 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;cursor:pointer;white-space:nowrap;border:1px solid transparent;user-select:none}
.nube-ok{background:rgba(14,159,110,.16);color:#7be0b8;border-color:rgba(14,159,110,.35)}
.nube-sync{background:rgba(37,99,235,.18);color:#a9c3ff;border-color:rgba(37,99,235,.35)}
.nube-off{background:rgba(183,121,31,.2);color:#f3cf8e;border-color:rgba(183,121,31,.4)}
.nube-error{background:rgba(224,36,36,.2);color:#ffb4b4;border-color:rgba(224,36,36,.45)}
.nube-local{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.14)}
@media(max-width:720px){.nube-pill .nube-tx{display:none}.nube-pill{padding:6px 8px}}`;
    document.head.appendChild(s);
  }
  function pintar(el){
    if(!el) return; estilos(); pastillas.push(el); pintarTodos();
    el.addEventListener("click",()=>{
      if(!clave()){ alert("Este equipo guarda los datos solo aquí.\n\nPara compartirlos con las demás computadoras, abrí una vez el link de la tienda en este equipo."); return; }
      const [,,txt]=textoEstado();
      if(confirm(txt+".\n\nEste equipo está conectado a la nube de la tienda: lo que guardés aquí lo ven todas las computadoras conectadas.\n\n¿Querés DESCONECTAR este equipo? (Los datos de la nube no se borran.)")){
        escribirLS(LS_CLAVE,null);
        try{ (window.top||window).location.reload(); }catch(e){ location.reload(); }
      }
    });
  }

  window.Nube = {
    clave, conectado:()=>!!clave(), iniciar,
    escucharMapa, guardarMapa, escucharColeccion, guardarColeccion, leerColeccion, leerMapa, unirUnaVez,
    estable, pintar,
    recienConectado(){ const r=leerLS(LS_RECIEN); if(r) escribirLS(LS_RECIEN,null); return !!r; }
  };
})();
