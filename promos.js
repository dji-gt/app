/* ============================================================
   Promociones con fecha (las usan "Precios para las mesas" y "Mensajes").
   - Solo valen entre "desde" y "hasta" (fecha de cada equipo). Al pasar "hasta"
     todo vuelve solo al precio normal: no hay que cambiar nada.
   - Cada producto: m = versión en Mensajes · t = tarjeta de las mesas
     (k = lado de la tarjeta, si tiene 2 modelos) · v = nombre de la versión en la tarjeta
     · antes = precio normal (PVP) · ahora = precio de la promoción.
   ============================================================ */
(function(){
  "use strict";
  const PROMOS = [
    {
      nombre: "Black Friday",
      desde: "2026-11-27", hasta: "2026-11-30",   // el 1 de diciembre ya no sale
      items: [
        // Drones
        {m:"neo2-fmc",         t:"neo2",      v:/^(?!.*motion).*fly more combo/i,   antes:3699,  ahora:3200},
        {m:"litox1-solo",      t:"litox1",    v:/^est[aá]ndar/i,                    antes:3299,  ahora:2800},
        {m:"litox1-fmc",       t:"litox1",    v:/^fly more combo \(dji rc 2\)$/i,   antes:5849,  ahora:5050},
        {m:"avata2-smart3",    t:"avata2",    v:/fly smart/i,                       antes:7399,  ahora:6400},
        {m:"mini5pro-fmcplus", t:"mini5pro",  v:/./,                                antes:9999,  ahora:8900},
        {m:"air3s-fmc",        t:"air3s",     v:/fly more/i,                        antes:13799, ahora:12200},
        // Cámaras
        {m:"osmo360ii-std",    t:"osmo360ii", v:/standard/i,                        antes:5599,  ahora:5000},
        {m:"action6-adv",      t:"action6",   v:/adventure/i,                       antes:4399,  ahora:4000},
        {m:"pocket4-creator",  t:"pocket4",   v:/creator/i,                         antes:6299,  ahora:4700},
        {m:"nano-std",         t:"nano",      v:/128/,                              antes:3309,  ahora:2610},
        // Estabilizadores
        {m:"om7-std",          t:"om8-om7",   k:1, v:/./,                           antes:599,   ahora:479},
        {m:"om8p-adv",         t:"om8p",      v:/advanced/i,                        antes:1849,  ahora:1479},
        {m:"om8p-creator",     t:"om8p",      v:/creator/i,                         antes:2309,  ahora:1847},
        // Micrófonos
        {m:"micmini2s-2tx",    t:"micmini2s", v:/^2 ?tx/i,                          antes:1999,  ahora:1699},
        {m:"micmini2-1tx",     t:"micmini2",  v:/^1 ?tx/i,                          antes:599,   ahora:509}
      ]
    }
  ];

  const dos = n => String(n).padStart(2, "0");
  const Promo = {
    lista: PROMOS,
    // la fecha de hoy en este equipo (AAAA-MM-DD); las pruebas la pueden cambiar
    hoy(){ const d = new Date(); return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate()); },
    actual(){ const h = Promo.hoy(); return PROMOS.find(p => h >= p.desde && h <= p.hasta) || null; },
    _de(x, p){ return x ? {nombre:p.nombre, hasta:p.hasta, antes:x.antes, ahora:x.ahora} : null; },
    // versión de Mensajes (id) → {nombre, hasta, antes, ahora} o null
    version(id){ const p = Promo.actual(); return p ? Promo._de(p.items.find(x => x.m === id), p) : null; },
    // versión de una tarjeta de las mesas (tarjeta, lado, nombre de la versión)
    tarjeta(tid, k, nombre){
      const p = Promo.actual(); if(!p) return null;
      return Promo._de(p.items.find(x => x.t === tid && (x.k || 0) === (k || 0) && x.v.test(String(nombre || ""))), p);
    },
    // "lunes 30 de noviembre"
    fechaTexto(f){
      const [y, m, d] = String(f).split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("es-GT", {weekday:"long", day:"numeric", month:"long"}).replace(",", "");
    }
  };
  window.Promo = Promo;
})();
