/* ============================================================
   Lector de órdenes de la tienda en línea (PDF) — sin IA.
   pdf.js saca cada texto del PDF con su posición; aquí se ubica
   cada dato por las columnas y títulos de la orden
   (CLIENTE, INFORMACIÓN FISCAL, Producto, SKU, TOTAL:, etc.).
   ============================================================ */
(function(raiz){
  "use strict";

  const fold = s => String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase().replace(/\s+/g," ").trim();
  const RX_DINERO = /^-?\s*Q\s*-?\s*\d[\d,]*(?:\.\d+)?$/i;
  function dinero(s){
    const t=String(s||"").replace(/[\s,]/g,""), m=t.match(/^(-?)Q(-?)(\d+(?:\.\d+)?)$/i);
    return m ? Number(m[3])*((m[1]||m[2])?-1:1) : null;
  }
  const r2 = n => Math.round(n*100)/100;

  // ---------- 1) une los pedazos de texto que están pegados en la misma línea ----------
  function segmentos(items){
    const L=items.filter(i=>i && i.s && String(i.s).trim())
      .map(i=>({s:String(i.s).replace(/\s+/g," ").trim(), x:+i.x||0, y:+i.y||0, w:+i.w||0, h:+i.h||7}))
      .sort((a,b)=>a.y-b.y||a.x-b.x);
    const lineas=[];
    for(const it of L){
      const ln=lineas[lineas.length-1];
      if(ln && Math.abs(it.y-ln.y)<=2.5) ln.items.push(it); else lineas.push({y:it.y, items:[it]});
    }
    const segs=[];
    for(const ln of lineas){
      ln.items.sort((a,b)=>a.x-b.x);
      let act=null;
      for(const it of ln.items){
        const hueco = act ? it.x-act.x2 : Infinity;
        if(act && hueco < Math.max(3, it.h*0.6)){
          act.s += (hueco > it.h*0.12 ? " " : "") + it.s;
          act.x2 = Math.max(act.x2, it.x+it.w);
        }else{
          act={s:it.s, x:it.x, x2:it.x+it.w, y:ln.y, h:it.h};
          segs.push(act);
        }
      }
    }
    segs.forEach(s=>{ s.f=fold(s.s); s.c=(s.x+s.x2)/2; });
    return segs;
  }

  // ---------- 2) ayudantes de ubicación ----------
  const buscar = (segs, re, desde) => segs.find(s=>re.test(s.f) && (desde==null || s.y>desde));
  function lineasEn(segs, x0, x1, y0, y1){
    const sel=segs.filter(s=>s.y>y0+1 && s.y<y1-1 && s.x>=x0 && s.x<x1).sort((a,b)=>a.y-b.y||a.x-b.x);
    const out=[];
    for(const s of sel){
      const ln=out[out.length-1];
      if(ln && Math.abs(s.y-ln.y)<=2.5) ln.s+=" "+s.s; else out.push({y:s.y, s:s.s});
    }
    return out.map(l=>l.s.trim()).filter(Boolean);
  }
  // títulos de una fila de columnas -> {titulo: [líneas]}
  function columnas(segs, titulos, yFin){
    const T=titulos.filter(Boolean).sort((a,b)=>a.x-b.x), out=new Map();
    T.forEach((t,i)=>{
      const x0 = i===0 ? -Infinity : t.x-15, x1 = i===T.length-1 ? Infinity : T[i+1].x-15;
      out.set(t, lineasEn(segs, x0, x1, t.y, yFin));
    });
    return out;
  }
  const RX_ETIQ = /^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ.º°# ]{2,26}):\s*(.*)$/;
  const llave = k => fold(k).replace(/[^A-Z ]/g," ").replace(/\s+/g," ").trim();
  // "Etiqueta: valor" (lo que sigue en la otra línea se pega al valor anterior)
  function campos(lineas){
    const c={}, libres=[]; let ult=null;
    for(const l of lineas){
      const m=l.match(RX_ETIQ);
      if(m){ ult=llave(m[1]); c[ult]=(c[ult]?c[ult]+" ":"")+m[2].trim(); }
      else if(ult && !/@/.test(l)) c[ult]+=" "+l;
      else libres.push(l);
    }
    return {c, libres};
  }
  function ids(v){
    const t=String(v||"");
    const nit=(t.match(/NIT\s*:?\s*(C\s*\.?\s*\/?\s*F\.?|\d[\d-]*[0-9Kk]?)/i)||[])[1]||"";
    const dpi=(t.match(/DPI\s*:?\s*(\d[\d\s]{5,}\d)/i)||[])[1]||"";
    return {nit:nit.replace(/\s+/g,"").toUpperCase(), dpi:dpi.replace(/\s+/g,"")};
  }
  const soloTel = t => { const d=String(t||"").replace(/\D/g,""); return d.length===11 && d.startsWith("502") ? d.slice(3) : d; };

  // ---------- 3) la orden ----------
  function parsear(items, titulo){
    const segs=segmentos(items);
    const todo=segs.map(s=>s.s).join("\n");
    const o={
      orden:"", fecha:"", plataforma:"",
      cliente:{nombre:"",nit:"",dpi:"",correo:"",telefono:""},
      fiscal:{nombre:"",tipoId:"",numId:"",nit:"",dpi:"",correo:""},
      direccion:"",
      productos:[], cargos:[],
      subtotal:null, envio:null, impuestos:null, descuento:null, total:null,
      pago1:null, pago2:null,
      entrega:{transportista:"",tipo:"",sku:""},
      recibe:{nombre:"",dpi:"",cedula:""},
      modo:"", avisos:[], esOrden:false
    };

    // encabezado
    const mOrden = todo.match(/ORDEN\s*#\s*(\d{3,})/i) || String(titulo||"").match(/Orden\s*#\s*(\d{3,})/i);
    if(mOrden) o.orden=mOrden[1];
    const mFecha = todo.match(/Fecha\s*:\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
    if(mFecha) o.fecha=mFecha[3]+"-"+mFecha[2].padStart(2,"0")+"-"+mFecha[1].padStart(2,"0");
    const mPlat = todo.match(/Plataforma de venta\s*:\s*([^\n]+)/i);
    if(mPlat) o.plataforma=mPlat[1].trim();

    const hCli=buscar(segs,/^CLIENTE$/), hFis=buscar(segs,/^INFORMACION FISCAL$/), hDir=buscar(segs,/^DIRECCION DE ENVIO$/);
    const tProd=buscar(segs,/^PRODUCTOS?$/);
    const fila = tProd ? segs.filter(s=>Math.abs(s.y-tProd.y)<=2.5) : [];
    const enFila = re => fila.find(s=>re.test(s.f));
    const tSku=enFila(/^(SKU|CODIGO)$/), tCant=enFila(/^CANT(\.|IDAD)?$/), tPrecio=enFila(/^PRECIO/), tTotal=enFila(/^TOTAL$/);
    const lSub=buscar(segs,/^SUBTOTAL:?$/, tProd&&tProd.y);
    const hPago1=buscar(segs,/^INFORMACION DE PAGO( 1)?$/), hPago2=buscar(segs,/^INFORMACION DE PAGO 2$/);
    const hEnv=buscar(segs,/^INFORMACION DE ENVIO$/), hRec=buscar(segs,/^PERSONA QUE RECIBE$/);
    const fin=buscar(segs,/^FIRMA DEL CLIENTE$/) || buscar(segs,/^FIRMA AUTORIZADA$/);
    o.esOrden = !!(o.orden && (hCli || tProd) && /PLATAFORMA DE VENTA|INFORMACION FISCAL|PERSONA QUE RECIBE/.test(fold(todo)));

    const siguiente = (y, ...cands) => Math.min(...cands.filter(c=>c && c.y>y+3).map(c=>c.y), y+400);

    // CLIENTE · INFORMACIÓN FISCAL · DIRECCIÓN DE ENVÍO
    if(hCli){
      const yFin=siguiente(hCli.y, tProd, lSub, hPago1, hEnv, fin);
      const cols=columnas(segs,[hCli,hFis,hDir],yFin);
      // cliente: el nombre va primero, luego "Cédula:", el correo y "Tel:"
      const lc=cols.get(hCli)||[], nom=[]; let ult=null, enCorreo=false; const cc={};
      for(const l of lc){
        const m=l.match(RX_ETIQ);
        if(m){ ult=llave(m[1]); cc[ult]=(cc[ult]?cc[ult]+" ":"")+m[2].trim(); enCorreo=false; }
        else if(/@/.test(l)){ o.cliente.correo=l.replace(/\s+/g,""); ult=null; enCorreo=true; }
        else if(enCorreo && !/\s/.test(l)) o.cliente.correo+=l;   // correo largo partido en dos líneas
        else if(ult) cc[ult]+=" "+l;
        else nom.push(l);
      }
      o.cliente.nombre=nom.join(" ").trim();
      const idc=ids(cc["CEDULA"]||cc["NIT"]||"");
      o.cliente.nit=idc.nit || (cc["NIT"]||"").trim(); o.cliente.dpi=idc.dpi || (cc["DPI"]||"").replace(/\D/g,"");
      o.cliente.telefono=soloTel(cc["TEL"]||cc["TELEFONO"]||cc["CELULAR"]||"");
      if(!o.cliente.correo && (cc["EMAIL"]||cc["CORREO"])) o.cliente.correo=(cc["EMAIL"]||cc["CORREO"]).replace(/\s+/g,"");
      if(hFis){
        const {c}=campos(cols.get(hFis)||[]);
        o.fiscal.nombre=(c["NOMBRE"]||"").trim();
        o.fiscal.tipoId=(c["TIPO ID"]||"").trim();
        o.fiscal.numId=(c["NUM ID"]||c["NIT"]||"").trim();
        const idf=ids(o.fiscal.numId); o.fiscal.nit=idf.nit; o.fiscal.dpi=idf.dpi;
        o.fiscal.correo=(c["EMAIL"]||c["CORREO"]||"").replace(/\s+/g,"");
      }
      if(hDir){
        const ld=(cols.get(hDir)||[]).filter(l=>!/^N\/?A$/i.test(l));
        o.direccion=ld.join("\n");
      }
    }

    // productos
    if(tProd && tSku){
      const yFin = lSub ? lSub.y : siguiente(tProd.y, hPago1, hEnv, fin);
      const xNombre = tSku.x-8;
      const zona=segs.filter(s=>s.y>tProd.y+3 && s.y<yFin-1);
      const nombres=zona.filter(s=>s.x<xNombre), otros=zona.filter(s=>s.x>=xNombre);
      const filas=[];
      for(const s of otros.sort((a,b)=>a.y-b.y||a.x-b.x)){
        const f=filas[filas.length-1];
        if(f && Math.abs(s.y-f.y)<=3) f.s.push(s); else filas.push({y:s.y, s:[s], nom:[]});
      }
      const reales=filas.filter(f=>f.s.some(s=>RX_DINERO.test(s.s)));
      for(const n of nombres){
        if(!reales.length) break;
        let mejor=reales[0]; reales.forEach(f=>{ if(Math.abs(f.y-n.y)<Math.abs(mejor.y-n.y)) mejor=f; });
        if(Math.abs(mejor.y-n.y)<40) mejor.nom.push(n);
      }
      const cSku=tSku.c, cCant=tCant?tCant.c:null;
      for(const f of reales){
        const plata=f.s.filter(s=>RX_DINERO.test(s.s)).sort((a,b)=>a.x-b.x);
        const resto=f.s.filter(s=>!RX_DINERO.test(s.s));
        let sku=[], cant=null;
        for(const s of resto){
          const esNum=/^\d{1,4}$/.test(s.s);
          const aCant = cCant!=null ? Math.abs(s.c-cCant) < Math.abs(s.c-cSku) : esNum;
          if(esNum && aCant && cant==null) cant=Number(s.s); else sku.push(s.s);
        }
        const p={
          nombre:f.nom.sort((a,b)=>a.y-b.y||a.x-b.x).map(n=>n.s).join(" ").replace(/\s+/g," ").trim(),
          sku:sku.join(" ").trim(),
          cant: cant==null ? 1 : cant,
          precio: plata.length>1 ? dinero(plata[plata.length-2].s) : (plata.length ? dinero(plata[0].s) : null),
          total: plata.length ? dinero(plata[plata.length-1].s) : null
        };
        if(p.precio==null && p.total!=null) p.precio=r2(p.total/(p.cant||1));
        const esCargo = /^S\d{4,6}$/i.test(p.sku) || /^ENVIO\b/.test(fold(p.nombre));
        (esCargo ? o.cargos : o.productos).push(p);
      }
    }

    // totales (Subtotal:, Envío:, Impuestos:, Descuento:, TOTAL:)
    const yTot0 = lSub ? lSub.y-3 : (tProd ? tProd.y : 0);
    const yTot1 = siguiente(yTot0+3, hPago1, hEnv, hRec, fin);
    segs.filter(s=>s.y>=yTot0 && s.y<yTot1 && /:$/.test(s.s)).forEach(et=>{
      const v=segs.filter(s=>Math.abs(s.y-et.y)<=3 && s.x>et.x && RX_DINERO.test(s.s)).sort((a,b)=>b.x-a.x)[0];
      if(!v) return;
      const k=llave(et.s), n=dinero(v.s);
      if(k==="SUBTOTAL") o.subtotal=n;
      else if(k==="ENVIO") o.envio=n;
      else if(k==="IMPUESTOS" || k==="IVA") o.impuestos=n;
      else if(k.startsWith("DESCUENTO")) o.descuento=n;
      else if(k==="TOTAL") o.total=n;
    });

    // INFORMACIÓN DE PAGO 1 · PAGO 2 · INFORMACIÓN DE ENVÍO · PERSONA QUE RECIBE
    const hAbajo=[hPago1,hPago2,hEnv,hRec].filter(Boolean);
    if(hAbajo.length){
      const y0=Math.min(...hAbajo.map(h=>h.y));
      const yFin=siguiente(y0, fin, ...segs.filter(s=>/^DJI STORE GUATEMALA •/.test(s.f)));
      const cols=columnas(segs,hAbajo,yFin);
      const pago = h => {
        if(!h) return null;
        const ls=cols.get(h)||[];
        if(!ls.length || (ls.length===1 && /^N\/?A$/i.test(ls[0]))) return null;
        const {c,libres}=campos(ls);
        const p={metodo:(c["METODO"]||"").trim(), financiamiento:(c["FINANCIAMIENTO"]||"").trim(), autorizacion:(c["AUTORIZACION"]||"").trim(), tarjeta:(c["TARJETA"]||"").trim(), monto:null, otros:""};
        const m=c["MONTO"]||c["TOTAL"]; if(m!=null) p.monto=dinero(m.replace(/\s+/g,""));
        const extra=Object.keys(c).filter(k=>!["METODO","FINANCIAMIENTO","AUTORIZACION","TARJETA","MONTO","TOTAL"].includes(k)).map(k=>k.toLowerCase()+": "+c[k]);
        p.otros=[...extra,...libres].join(" · ");
        return p;
      };
      o.pago1=pago(hPago1); o.pago2=pago(hPago2);
      if(hEnv){
        const {c}=campos(cols.get(hEnv)||[]);
        o.entrega={transportista:(c["TRANSPORTISTA"]||"").trim(), tipo:(c["TIPO"]||"").trim(), sku:(c["SKU ENVIO"]||"").trim()};
      }
      if(hRec){
        const ls=cols.get(hRec)||[], nom=[]; let ced="";
        for(const l of ls){ const m=l.match(RX_ETIQ); if(m && /CEDULA|DPI|DOCUMENTO|ID/.test(llave(m[1]))) ced=m[2].trim(); else if(ced) ced+=" "+l; else if(!/^N\/?A$/i.test(l)) nom.push(l); }
        o.recibe={nombre:nom.join(" ").trim(), cedula:ced, dpi:ids(ced).dpi || ced.replace(/^DPI\s*:?\s*/i,"").replace(/\s+/g,"")};
      }
    }

    // ---------- respaldo por si el formato cambia ----------
    if(!o.cliente.telefono){ const m=todo.match(/Tel\s*:\s*(\+?[\d\s-]{8,})/g); if(m){ const t=m.map(x=>soloTel(x)).find(t=>t.length===8 && t!=="22272840"); if(t) o.cliente.telefono=t; } }
    if(!o.cliente.correo){ const m=todo.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g); if(m){ const c=m.find(x=>!/djistore/i.test(x)); if(c) o.cliente.correo=c; } }
    if(!o.cliente.nombre){ const m=todo.match(/Orden\s*#\d+\s*•\s*([^•\n]+?)\s*•/i); if(m) o.cliente.nombre=m[1].trim(); }
    if(!o.cliente.nit && !o.cliente.dpi){ const i=ids(todo); o.cliente.nit=i.nit; o.cliente.dpi=i.dpi; }
    if(o.total==null){ const m=todo.match(/TOTAL\s*:\s*\n?\s*(Q\s*[\d,]+\.\d{2})/i); if(m) o.total=dinero(m[1]); }
    if(!o.entrega.transportista){ const m=todo.match(/Transportista\s*:\s*([^\n]+)/i); if(m) o.entrega.transportista=m[1].trim(); }
    if(!o.entrega.tipo){ const m=todo.match(/\bTipo\s*:\s*([^\n]+)/i); if(m) o.entrega.tipo=m[1].trim(); }
    if(!o.fiscal.nombre) o.fiscal.nombre=o.cliente.nombre;
    if(!o.fiscal.nit && !o.fiscal.dpi){ o.fiscal.nit=o.cliente.nit; o.fiscal.dpi=o.cliente.dpi; }

    // envío por Forza, Pick Up (retiro en tienda) u otro
    const ent=fold(o.entrega.transportista+" "+o.entrega.tipo);
    if(/RETIRO|PICK ?UP|RECOGER|EN TIENDA/.test(ent)) o.modo="pickup";
    else if(/FORZA/.test(ent)) o.modo="forza";
    else if(o.direccion || o.entrega.transportista) o.modo="envio";
    else o.modo = o.direccion ? "envio" : "";

    // costo del envío: la línea "Envío Standard" de la tabla o el renglón "Envío:"
    o.costoEnvio = r2(o.cargos.reduce((s,c)=>s+(c.total||0),0) + (o.envio||0));

    // ---------- revisión ----------
    if(!o.orden) o.avisos.push("No encontré el número de orden.");
    if(!o.cliente.nombre) o.avisos.push("No encontré el nombre del cliente.");
    if(o.cliente.telefono.length!==8) o.avisos.push("Revisá el teléfono del cliente.");
    if(!o.productos.length) o.avisos.push("No encontré los productos.");
    if(o.total==null) o.avisos.push("No encontré el total.");
    if(!o.modo) o.avisos.push("No supe si es envío o Pick Up.");
    o.productos.concat(o.cargos).forEach(p=>{
      if(p.precio!=null && p.total!=null && Math.abs(r2(p.precio*p.cant)-p.total)>0.01) o.avisos.push(`Revisá la cantidad o el precio de "${p.nombre||p.sku}".`);
    });
    if(o.subtotal!=null && o.productos.length){
      const suma=r2(o.productos.concat(o.cargos).reduce((s,p)=>s+(p.total||0),0));
      if(Math.abs(suma-o.subtotal)>0.01) o.avisos.push(`La suma de los productos (Q${suma.toFixed(2)}) no cuadra con el subtotal (Q${o.subtotal.toFixed(2)}): puede faltar un producto.`);
    }
    return o;
  }

  // ---------- 4) otros documentos (factura / guía) ----------
  function tipoDocumento(texto){
    const t=fold(texto);
    if(/ORDEN\s*#\s*\d{3,}/.test(t) && /PLATAFORMA DE VENTA|PERSONA QUE RECIBE|INFORMACION FISCAL/.test(t)) return "orden";
    if(/FORZA|GUIA|REMITENTE|DESTINATARIO|TRACKING/.test(t) && !/DOCUMENTO TRIBUTARIO|DTE\b|FACTURA ELECTRONICA/.test(t)) return "guia";
    if(/FACTURA|DTE\b|DOCUMENTO TRIBUTARIO|SAT\b|AUTORIZACION/.test(t)) return "factura";
    return "";
  }
  function numeroGuia(texto){
    const m=String(texto||"").match(/gu[ií]a\s*(?:n[o°º.]*|n[uú]mero|#)?\s*:?\s*([A-Z]{0,4}\d{6,})/i);
    return m ? m[1] : "";
  }
  function numeroFactura(texto){
    const t=String(texto||"");
    const serie=(t.match(/\bserie\s*:?\s*([A-Z0-9]{4,12})\b/i)||[])[1]||"";
    const num=(t.match(/\bn[uú]mero(?:\s+de\s+dte)?\s*:?\s*(\d{5,12})\b/i)||[])[1]||"";
    return [serie,num].filter(Boolean).join(" - ");
  }

  // ---------- 5) leer un PDF con pdf.js ----------
  // Safari no sabe recorrer un ReadableStream con "for await" (pdf.js lo usa en getTextContent):
  // se lo enseñamos, y además leemos el texto con getReader(), que funciona en todos los navegadores.
  if(typeof ReadableStream!=="undefined" && typeof Symbol!=="undefined" && Symbol.asyncIterator && !ReadableStream.prototype[Symbol.asyncIterator]){
    try{
      Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, {configurable:true, writable:true, value:async function*(){
        const r=this.getReader();
        try{ for(;;){ const {done,value}=await r.read(); if(done) return; yield value; } }
        finally{ try{ r.releaseLock(); }catch(e){} }
      }});
    }catch(e){}
  }
  async function textoDePagina(pg){
    if(typeof pg.streamTextContent!=="function") return pg.getTextContent();
    const rd=pg.streamTextContent().getReader(), items=[];
    for(;;){
      const {done,value}=await rd.read();
      if(done) break;
      if(value && value.items) for(const it of value.items) items.push(it);
    }
    return {items};
  }
  async function leerPdf(datos, pdfjs){
    const doc=await pdfjs.getDocument({data:datos, isEvalSupported:false, disableFontFace:true, useSystemFonts:false}).promise;
    let titulo="";
    try{ const m=await doc.getMetadata(); titulo=(m && m.info && m.info.Title) || ""; }catch(e){}
    const items=[]; let base=0;
    for(let p=1;p<=Math.min(doc.numPages,6);p++){
      const pg=await doc.getPage(p), vp=pg.getViewport({scale:1}), tc=await textoDePagina(pg);
      for(const it of tc.items){
        if(!it.str || !it.str.trim()) continue;
        items.push({s:it.str, x:it.transform[4], y:base+vp.height-it.transform[5], w:it.width, h:Math.abs(it.height||it.transform[3]||7)});
      }
      base+=vp.height;
    }
    const paginas=doc.numPages;
    try{ await doc.destroy(); }catch(e){}
    const texto=segmentos(items).map(s=>s.s).join("\n");
    return {items, titulo, texto, paginas};
  }

  const api={parsear, segmentos, tipoDocumento, numeroGuia, numeroFactura, leerPdf, dinero, fold};
  if(typeof module!=="undefined" && module.exports) module.exports=api;
  else raiz.LectorOrden=api;
})(typeof window!=="undefined" ? window : globalThis);
