"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const articles = [
  {
    id: 1,
    category: "Mantenimiento",
    title: "5 senales de que tu montacargas necesita servicio urgente",
    excerpt: "Aprende a identificar problemas antes de que se conviertan en paradas costosas. Desde ruidos inusuales hasta fugas hidraulicas.",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "1. Ruidos inusuales en el mastil", text: "Si escuchas chirridos, golpes o zumbidos al elevar carga, puede indicar cadenas desgastadas, rodillos danados o falta de lubricacion. Ignoring these sounds can lead to catastrophic failure during operation." },
      { subtitle: "2. Fugas de aceite hidraulico", text: "Manchas de aceite debajo del equipo o en el mastil son senal de sellos danados. Un sistema hidraulico con fugas pierde presion progresivamente, reduciendo la capacidad de carga segura." },
      { subtitle: "3. Direccion dura o imprecisa", text: "Dificultad para girar puede indicar problemas en la bomba de direccion, bajo nivel de fluido o desgaste en los componentes del sistema. Esto es un riesgo de seguridad inmediato." },
      { subtitle: "4. Humo excesivo (diesel/GLP)", text: "Humo negro indica mezcla rica o filtro de aire obstruido. Humo blanco puede ser agua en el combustible. Humo azul es aceite quemandose en la camara de combustion." },
      { subtitle: "5. Frenos blandos o lentos", text: "Si el equipo no frena con la misma eficacia, revisa inmediatamente. Pastillas desgastadas, fluido de frenos bajo o aire en las lineas son causas comunes. Nunca operates un equipo con frenos deficientes." },
    ],
  },
  {
    id: 2,
    category: "Guia de compra",
    title: "Montacargas electrico vs diesel: cual conviene en 2024?",
    excerpt: "Analisis completo de costos, rendimiento y aplicaciones. Te ayudamos a elegir el motor correcto para tu operacion.",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "Costo de operacion", text: "Un montacargas electrico cuesta aproximadamente $0.85/hora en energia, vs $2.40/hora para diesel. En una operacion de 8h/dia, 22 dias/mes, la diferencia es de $273/mes por equipo." },
      { subtitle: "Ambiente de trabajo", text: "Electricos son obligatorios en espacios cerrados (cero emisiones). Diesel es ideal para exteriores, terrenos irregulares y condiciones donde necesitas potencia bruta." },
      { subtitle: "Mantenimiento", text: "Electricos tienen 60% menos piezas moviles = menos mantenimiento. Sin cambios de aceite, filtros de combustible ni ajustes de motor. Baterias de litio duran 3,000+ ciclos." },
      { subtitle: "Inversion inicial", text: "Electricos cuestan 20-30% mas de entrada, pero el TCO a 5 anos suele ser menor. Usa nuestra calculadora TCO para comparar con tus numeros reales." },
      { subtitle: "Nuestra recomendacion", text: "Para almacenes, centros de distribucion y trabajo en interiores: electrico siempre. Para construccion, puertos y trabajo exterior pesado: diesel o GLP." },
    ],
  },
  {
    id: 3,
    category: "Seguridad",
    title: "LOPCYMAT: requisitos legales para operadores de montacargas",
    excerpt: "Lo que toda empresa venezolana debe cumplir segun la ley. Certificaciones, inspecciones y responsabilidades.",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "Certificacion del operador", text: "Todo operador debe estar certificado por un ente reconocido. La empresa es responsable de garantizar que solo personal capacitado opere el equipo." },
      { subtitle: "Inspecciones diarias", text: "La LOPCYMAT exige una inspeccion pre-operacional diaria documentada. Incluye revision de frenos, direccion, mastil, horquillas, luces y alarmas." },
      { subtitle: "Mantenimiento preventivo", text: "Debe existir un programa documentado de mantenimiento preventivo. Las horas de servicio deben registrarse y los trabajos realizados deben quedar en bitacora." },
      { subtitle: "Senalizacion y areas de trabajo", text: "Zonas de transito de montacargas deben estar debidamente senalizadas. Limites de velocidad, pasos peatonales y areas de carga deben estar demarcados." },
      { subtitle: "Sanciones", text: "El incumplimiento puede resultar en multas de 26 a 75 Unidades Tributarias por trabajador expuesto, ademas de responsabilidad penal en caso de accidentes." },
    ],
  },
  {
    id: 4,
    category: "Tips",
    title: "Como extender la vida util de las baterias de litio",
    excerpt: "Mejores practicas para maximizar los ciclos de carga y mantener el rendimiento optimo de tus equipos electricos.",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "Carga oportunista", text: "Las baterias de litio se benefician de cargas parciales frecuentes. No esperes a que se descarguen completamente. Aprovechar pausas y almuerzos para cargar." },
      { subtitle: "Temperatura", text: "Mantener las baterias entre 15-35°C. El calor excesivo reduce la vida util. En climas calidos, asegurar ventilacion adecuada en la zona de carga." },
      { subtitle: "Cargador correcto", text: "Usar siempre el cargador especificado por el fabricante. Cargadores inadecuados pueden danar las celdas y anular la garantia." },
      { subtitle: "Almacenamiento", text: "Si el equipo no se usara por tiempo prolongado, mantener la bateria entre 40-60% de carga. Nunca almacenar completamente descargada." },
    ],
  },
  {
    id: 5,
    category: "Industria",
    title: "Tendencias en logistica de almacen para LATAM",
    excerpt: "Automatizacion, equipos autonomos y tecnologia IoT: que viene para la industria de manejo de materiales.",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "Electrificacion acelerada", text: "La tendencia global hacia montacargas electricos se acelera. En 2024, mas del 65% de montacargas vendidos globalmente son electricos. LATAM va en la misma direccion." },
      { subtitle: "IoT y telemetria", text: "Sensores conectados permiten monitorear el uso, estado de bateria, impactos y mantenimiento en tiempo real. Grupo RCA ya ofrece estas soluciones." },
      { subtitle: "Automatizacion gradual", text: "AGVs (vehiculos guiados automaticamente) crecen 15% anual. Aunque aun premium para LATAM, las primeras implementaciones estan llegando." },
      { subtitle: "Seguridad aumentada", text: "Camaras, sensores de proximidad y sistemas de alerta estan siendo adoptados como estandar en nuevos equipos." },
    ],
  },
  {
    id: 6,
    category: "Caso de exito",
    title: "Distribuidora Oriental: 40% menos downtime con mantenimiento preventivo",
    excerpt: "Como un programa de servicio planificado transformo la operacion logistica de uno de nuestros clientes.",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80",
    content: [
      { subtitle: "El problema", text: "Distribuidora Oriental operaba 12 montacargas con mantenimiento reactivo. En promedio, 3 equipos estaban fuera de servicio al mismo tiempo, generando $15,000/mes en costos por downtime." },
      { subtitle: "La solucion", text: "Implementamos un contrato de servicio preventivo con visitas cada 250 horas. Incluye revision completa, cambio de filtros, ajustes y reporte digital." },
      { subtitle: "Resultados", text: "En 6 meses: downtime reducido de 25% a 8%, costo de mantenimiento reducido 35%, vida util de equipos extendida un estimado de 2 anos." },
      { subtitle: "Testimonio", text: "\"Antes perdíamos días enteros esperando repuestos. Ahora todo está planificado y nuestros equipos siempre están operativos\" — Gerente de Operaciones, Distribuidora Oriental." },
    ],
  },
];

const categories = ["Todos", ...Array.from(new Set(articles.map((a) => a.category)))];

export default function KnowledgeCenter() {
  const [filter, setFilter] = useState("Todos");
  const [openArticle, setOpenArticle] = useState<number | null>(null);
  const { ref, visible } = useInView();

  const filtered = filter === "Todos" ? articles : articles.filter((a) => a.category === filter);
  const article = openArticle !== null ? articles.find((a) => a.id === openArticle) : null;

  return (
    <section id="blog" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-10">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Centro de conocimiento</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Recursos y guias</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Informacion practica para tomar mejores decisiones sobre tu flota de montacargas</p>
        </div>

        {/* Article modal */}
        {article && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpenArticle(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setOpenArticle(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
                  <h3 className="text-white text-xl font-bold mt-2">{article.title}</h3>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                {article.content.map((section, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <h4 className="font-bold text-brand-navy mb-2">{section.subtitle}</h4>
                    <p className="text-brand-muted text-sm leading-relaxed">{section.text}</p>
                  </div>
                ))}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-brand-muted text-sm mb-3">Necesitas asesoria personalizada?</p>
                  <a href={`https://wa.me/584241700600?text=${encodeURIComponent(`Hola, lei el articulo "${article.title}" y tengo algunas preguntas`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    Hablar con un experto
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === cat ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy hover:border-brand-gold/40"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <button key={a.id} onClick={() => setOpenArticle(a.id)} className="text-left group rca-card bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-full">{a.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors leading-tight">{a.title}</h3>
                <p className="text-brand-muted text-sm mt-2 line-clamp-2">{a.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-brand-muted">{a.readTime} de lectura</span>
                  <span className="text-brand-gold text-xs font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Leer mas
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
