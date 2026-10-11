/* ============================================================
   Orden de servicio (el Word "Recepción de Producto")

   Dibuja en un canvas la hoja carta horizontal con las 2 copias
   de la orden, o la hoja de TÉRMINOS (también con 2 copias).
   Se usa en la vista previa y al imprimir, así lo que se ve es
   exactamente lo que sale en papel.
   Medidas en puntos (1 pt = 1/72 de pulgada).
   ============================================================ */
(function(){
  "use strict";

  const W=704, H=540, GAP=56, CW=(W-GAP)/2;          // hoja (sin márgenes) y ancho de cada copia
  const AZUL="#4472C4", TINTA="#111111", GRIS="#4A4F59", GRIS_LOGO="#6b6d6b", LINEA="#222222";
  const FUENTE='Calibri, Carlito, "Helvetica Neue", Helvetica, Arial, sans-serif';
  const EMPRESA={nombre:"Equipos de Vuelo Inteligentes Guatemala, S.A.", tel:"(+502) 22272840", correo:"info@djistore.gt"};

  // [texto, negrita]
  const TERMINOS=[
    [["El tiempo de ejecución de su ODS es de "],["3 a 5 días hábiles",1],[", este puede variar teniendo en cuenta el volumen de casos al momento de su ingreso, el proceso de resolución de su ODS y la disponibilidad de los componentes requeridos."]],
    [["La atención a los canales de comunicación especificados en su ODS, pueden acelerar el tiempo de resolución de su caso, queda de parte del cliente mantener dicha comunicación para una gestión más efectiva."]],
    [["Al momento de retirar su equipo, recomendamos realizar las pruebas que requiera antes de salir del local."]],
    [["Todas las reparaciones cuentan con garantía de "],["90 días",1],[" sobre módulo cambiado. Con excepción de los componentes suministrados de manera externa, ya que estos no son distribuidos por nuestro taller."]],
    [["Al momento de retirar su equipo, verifique que todos los componentes suministrados estén completos y sean los correctos."]],
    [["No nos hacemos responsables por información o datos residentes en los dispositivos ingresados a taller, como tampoco por las unidades de almacenamiento que permanezcan en ellos al momento del ingreso."]]
  ];
  const IMPORTANTE=[["E.V.I. Guatemala, S.A.",1],[" o su personal, no se hacen responsables por ningún equipo o componente que no sea retirado "],["15 días",1],[" (calendarios) después de ser notificada la resolución de su ODS. En caso de no retirar su dispositivo/equipo una vez vencida la fecha indicada, pasará a estado de "],["RECICLAJE",1],[" y la unidad será desechada."]];

  const fuente=(s,b)=>(b?"bold ":"")+s+"px "+FUENTE;

  // ---------- texto con negritas, saltos de línea y justificado ----------
  function fichas(runs){
    const out=[];
    runs.forEach(r=>{
      const t=r[0]==null?"":String(r[0]), b=!!r[1], c=r[2]||null;
      t.replace(/\r/g,"").split("\n").forEach((seg,i)=>{
        if(i>0) out.push({br:true});
        seg.split(/(\s+)/).forEach(p=>{ if(!p) return; if(/^\s+$/.test(p)) out.push({esp:true}); else out.push({t:p,b,c}); });
      });
    });
    return out;
  }
  // palabras (pegadas si no hay espacio entre ellas, aunque cambie la negrita)
  function unidades(ctx, runs, s){
    const us=[]; let cur=null;
    fichas(runs).forEach(f=>{
      if(f.br){ us.push({br:true}); cur=null; return; }
      if(f.esp){ cur=null; return; }
      ctx.font=fuente(s,f.b);
      const w=ctx.measureText(f.t).width;
      if(!cur){ cur={piezas:[],w:0}; us.push(cur); }
      cur.piezas.push({t:f.t,b:f.b,c:f.c,w}); cur.w+=w;
    });
    return us;
  }
  // una palabra más larga que la línea (correo, serie): se parte por letras
  function partir(ctx, u, ancho, s){
    const out=[]; let act={piezas:[],w:0};
    u.piezas.forEach(p=>{
      ctx.font=fuente(s,p.b);
      for(const ch of p.t){
        const w=ctx.measureText(ch).width;
        if(act.w+w>ancho && act.piezas.length){ out.push(act); act={piezas:[],w:0}; }
        const ult=act.piezas[act.piezas.length-1];
        if(ult && ult.b===p.b && ult.c===p.c){ ult.t+=ch; ult.w+=w; } else act.piezas.push({t:ch,b:p.b,c:p.c,w});
        act.w+=w;
      }
    });
    if(act.piezas.length) out.push(act);
    return out;
  }
  function lineas(ctx, runs, ancho, s){
    const us=unidades(ctx, runs, s);
    ctx.font=fuente(s,false); const sp=ctx.measureText(" ").width;
    const L=[]; let lin={u:[],w:0};
    const cerrar=fin=>{ lin.fin=fin; L.push(lin); lin={u:[],w:0}; };
    const poner=u=>{ const gap=lin.u.length?sp:0; lin.u.push({piezas:u.piezas,w:u.w,gap}); lin.w+=gap+u.w; };
    us.forEach(u=>{
      if(u.br){ cerrar(true); return; }
      if(lin.u.length && lin.w+sp+u.w>ancho) cerrar(false);
      if(u.w>ancho){
        const partes=partir(ctx,u,ancho,s);
        partes.forEach((p,i)=>{ if(i>0) cerrar(false); poner(p); });
        return;
      }
      poner(u);
    });
    cerrar(true);
    return L;
  }
  // devuelve {y: debajo del párrafo, x: dónde terminó la última línea}
  function parrafo(ctx, x, y, runs, ancho, o){
    const s=o.s, lh=o.lh||s*1.22, L=lineas(ctx, runs, ancho, s);
    let finX=x;
    L.forEach(l=>{
      const huecos=Math.max(0,l.u.length-1);
      const extra=(o.just && !l.fin && huecos) ? Math.max(0,(ancho-l.w)/huecos) : 0;
      let cx = o.alinear==="center" ? x+(ancho-l.w)/2 : (o.alinear==="right" ? x+ancho-l.w : x);
      const base=y+s*0.82;
      l.u.forEach((u,i)=>{
        if(i>0) cx+=u.gap+extra;
        u.piezas.forEach(p=>{
          if(o.pintar){ ctx.font=fuente(s,p.b); ctx.fillStyle=p.c||o.color||TINTA; ctx.fillText(p.t,cx,base); }
          cx+=p.w;
        });
      });
      if(o.pintar && o.subrayar && l.u.length){ ctx.fillStyle=o.color||TINTA; ctx.fillRect(cx-l.w, base+1.3, l.w, 0.8); }
      finX=cx; y+=lh;
    });
    return {y, x:finX};
  }
  function raya(ctx, x0, x1, y, pintar){ if(pintar && x1>x0+4){ ctx.fillStyle=LINEA; ctx.fillRect(x0, y, x1-x0, 0.7); } }
  function espaciado(ctx, t, cx, y, s, sep){
    ctx.font=fuente(s,false);
    const ws=[...t].map(ch=>ctx.measureText(ch).width), total=ws.reduce((a,b)=>a+b,0)+sep*(ws.length-1);
    let x=cx-total/2;
    [...t].forEach((ch,i)=>{ ctx.fillText(ch,x,y); x+=ws[i]+sep; });
  }

  // ---------- partes de cada copia ----------
  function encabezado(ctx, x0, logo){
    const o={s:9.5, lh:12.2, pintar:true, color:AZUL};
    let r=parrafo(ctx, x0, 4, [[EMPRESA.nombre,1]], CW-74, o);
    r=parrafo(ctx, x0, r.y, [["Tel: ",1],[EMPRESA.tel]], CW-74, o);
    parrafo(ctx, x0, r.y, [["Email: ",1],[EMPRESA.correo]], CW-74, o);
    const lw=54, cx=x0+CW-lw/2-2;
    ctx.fillStyle=GRIS_LOGO;
    if(logo && logo.width){ const lh=lw*logo.height/logo.width; ctx.drawImage(logo, cx-lw/2, 1, lw, lh); espaciado(ctx,"GUATEMALA",cx,lh+9.5,6.2,1.5); }
    else { ctx.font=fuente(20,true); ctx.textAlign="center"; ctx.fillText("dji",cx,24); ctx.textAlign="left"; espaciado(ctx,"GUATEMALA",cx,34,6.2,1.5); }
  }
  function pie(ctx, x0, d, pintar){
    if(!pintar) return;
    const s=9, y=H-15, o={s, pintar:true};
    const a=parrafo(ctx, x0, y, [["ODS# ",1],[d.ods||"",1]], CW/2-10, o);
    if(!d.ods) raya(ctx, a.x+1, x0+CW/2-18, y+s*0.82+1.5, true);
    const xc=x0+CW/2+4, b=parrafo(ctx, xc, y, [["COTIZACIÓN# ",1],[d.cot||"",1]], CW/2-4, o);
    if(!d.cot) raya(ctx, b.x+1, x0+CW-4, y+s*0.82+1.5, true);
  }
  // una línea "Etiqueta: valor"; si no hay valor queda una raya para escribir a mano
  function campo(ctx, x, y, ancho, etiqueta, valor, o, opc){
    opc=opc||{};
    const v=String(valor||"").trim();
    const r=parrafo(ctx, x, y, [[etiqueta+" ",1],[v, opc.negrita!==false, opc.color]], ancho, o);
    if(!v) raya(ctx, r.x+2, x+(opc.raya||ancho), y+o.s*0.82+1.5, o.pintar);
    return r;
  }
  // dos campos en la misma línea si caben (Tel/Email, Modelo/S/N); si no, uno debajo del otro
  function dosCampos(ctx, x, y, ancho, A, B, o){
    const medir=(et,v,neg)=>{ ctx.font=fuente(o.s,true); let w=ctx.measureText(et+" ").width; ctx.font=fuente(o.s,neg!==false); w+=v?ctx.measureText(v).width:70; return w; };
    const wa=medir(A[0],A[1],A[2]&&A[2].negrita), wb=medir(B[0],B[1],B[2]&&B[2].negrita), sep=16;
    const xb=Math.max(x+wa+sep, x+ancho*0.47);
    if(xb+wb<=x+ancho){
      campo(ctx, x, y, xb-x-sep, A[0], A[1], o, Object.assign({raya:xb-x-sep},A[2]));
      return campo(ctx, xb, y, x+ancho-xb, B[0], B[1], o, Object.assign({raya:Math.min(x+ancho-xb, 130)},B[2]));
    }
    const r=campo(ctx, x, y, ancho, A[0], A[1], o, Object.assign({raya:ancho*0.7},A[2]));
    return campo(ctx, x, r.y+o.s*0.35, ancho, B[0], B[1], o, Object.assign({raya:ancho*0.7},B[2]));
  }

  const Y_TITULO=64, Y_FECHA=86, Y_DATOS=110, Y_FIRMA1=H-118, Y_FIRMA2=H-62;

  function datosOrden(ctx, x0, d, s, pintar){
    const o={s, lh:s*1.24, pintar}, g=s*0.75, ancho=CW;
    let r=campo(ctx, x0, Y_DATOS, ancho, "Nombre:", d.nombre, o, {raya:ancho*0.9});
    r=campo(ctx, x0, r.y+g, ancho, "NIT:", d.nit, o, {raya:150});
    r=dosCampos(ctx, x0, r.y+g, ancho, ["Tel:", d.tel], ["Email:", d.correo], o);
    r=dosCampos(ctx, x0, r.y+g, ancho, ["Modelo:", d.modelo, {negrita:false, color:GRIS}], ["S/N:", d.serie, {negrita:false}], o);
    if(String(d.ref||"").trim()) r=parrafo(ctx, x0, r.y+s*0.2, [[d.ref,1]], ancho, o);
    r=campo(ctx, x0, r.y+g*1.9, ancho, "Detalles:", d.detalles, o, {negrita:false, raya:ancho});
    r=campo(ctx, x0, r.y+g*1.9, ancho, "Se recibe:", d.recibe, o, {negrita:false, raya:ancho});
    if(String(d.obs||"").trim()) r=campo(ctx, x0, r.y+g*1.9, ancho, "Observaciones:", d.obs, o, {negrita:false});
    return r.y;
  }
  function copiaOrden(ctx, x0, d, logo){
    encabezado(ctx, x0, logo);
    parrafo(ctx, x0, Y_TITULO, [["ORDEN DE SERVICIO",1]], CW, {s:11, pintar:true, alinear:"center", subrayar:true});
    parrafo(ctx, x0, Y_FECHA, [["Fecha:  ",1],[d.fecha||"",1]], CW, {s:10, pintar:true, alinear:"right"});
    // si el texto es largo, la letra se achica para que no tape las firmas
    const limite=Y_FIRMA1-34;
    let s=10;
    for(const t of [10,9.5,9,8.5,8,7.5,7,6.5]){ s=t; if(datosOrden(ctx, x0, d, t, false)<=limite) break; }
    ctx.save(); ctx.beginPath(); ctx.rect(x0-1, Y_DATOS-2, CW+2, limite-Y_DATOS+6); ctx.clip();
    datosOrden(ctx, x0, d, s, true);
    ctx.restore();
    [[Y_FIRMA1,"DJI recibe","Cliente entrega"],[Y_FIRMA2,"DJI entrega","Cliente recibe"]].forEach(([y,a,b])=>{
      raya(ctx, x0, x0+128, y, true); raya(ctx, x0+CW-128, x0+CW, y, true);
      parrafo(ctx, x0, y+3, [[a,1]], 128, {s:10, pintar:true});
      parrafo(ctx, x0+CW-128, y+3, [[b,1]], 128, {s:10, pintar:true});
    });
    pie(ctx, x0, d, true);
  }

  function textoTerminos(ctx, x0, s, pintar){
    const lh=s*1.2, ind=24;
    let y=Y_TITULO+26;
    TERMINOS.forEach(p=>{
      if(pintar){ ctx.font=fuente(s,false); ctx.fillStyle=TINTA; ctx.fillText("•", x0+9, y+s*0.82); }
      y=parrafo(ctx, x0+ind, y, p, CW-ind, {s, lh, pintar, just:true}).y+s*0.45;
    });
    y+=s*0.8;
    y=parrafo(ctx, x0, y, [["IMPORTANTE:",1]], CW, {s, lh, pintar}).y+s*0.5;
    y=parrafo(ctx, x0, y, IMPORTANTE, CW, {s, lh, pintar, just:true}).y;
    y+=s*2.4;
    const r=parrafo(ctx, x0, y, [["Firma del Cliente "]], CW, {s, lh, pintar});
    raya(ctx, r.x+2, x0+CW*0.82, y+s*0.82+1.5, pintar);
    return r.y;
  }
  function copiaTerminos(ctx, x0, d, logo){
    encabezado(ctx, x0, logo);
    parrafo(ctx, x0, Y_TITULO, [["TÉRMINOS",1]], CW, {s:11, pintar:true, alinear:"center", subrayar:true});
    let s=10;
    for(const t of [10,9.5,9,8.5,8,7.5]){ s=t; if(textoTerminos(ctx, x0, t, false)<=H-30) break; }
    textoTerminos(ctx, x0, s, true);
    pie(ctx, x0, d, true);
  }

  // ---------- hoja completa ----------
  function medidas(una){ return {W:una?CW:W, H}; }
  /* hoja: "orden" | "terminos" · k: pixeles por punto
     op.girar: gira 90° (para imprimir en carta vertical) · op.una: solo una copia (vista previa) */
  function dibujar(ctx, k, hoja, d, logo, op){
    op=op||{}; d=d||{};
    const m=medidas(op.una);
    ctx.save();
    if(op.girar){ ctx.translate(m.H*k,0); ctx.rotate(Math.PI/2); }
    ctx.scale(k,k);
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,m.W,m.H);
    ctx.textBaseline="alphabetic"; ctx.textAlign="left";
    (op.una?[0]:[0,CW+GAP]).forEach(x0=>{
      ctx.save(); ctx.beginPath(); ctx.rect(x0-2,0,CW+4,m.H); ctx.clip();
      if(hoja==="terminos") copiaTerminos(ctx, x0, d, logo); else copiaOrden(ctx, x0, d, logo);
      ctx.restore();
    });
    if(!op.una){
      ctx.strokeStyle="#c3c9d3"; ctx.lineWidth=0.6; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(W/2,6); ctx.lineTo(W/2,H-6); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
  // el logo de la app es blanco: se pinta gris como el del Word
  function logoGris(img){
    try{
      const c=document.createElement("canvas"); c.width=img.naturalWidth||img.width; c.height=img.naturalHeight||img.height;
      const x=c.getContext("2d"); x.drawImage(img,0,0);
      x.globalCompositeOperation="source-in"; x.fillStyle=GRIS_LOGO; x.fillRect(0,0,c.width,c.height);
      return c;
    }catch(e){ return null; }
  }
  function cargarLogo(src){
    return new Promise(ok=>{ const i=new Image(); i.onload=()=>ok(logoGris(i)); i.onerror=()=>ok(null); i.src=src; });
  }

  window.OrdenServicio={W, H, CW, medidas, dibujar, cargarLogo, logoGris};
})();
