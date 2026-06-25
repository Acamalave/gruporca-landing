"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const LINKEDIN = "https://ve.linkedin.com/company/gruporcave";

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  source?: string;
  content: { subtitle: string; text: string }[];
};

const articles: Article[] = [
  {
    id: 1,
    category: "Mantenimiento",
    title: "5 señales de que tu montacargas necesita servicio urgente",
    excerpt: "Aprende a identificar problemas antes de que se conviertan en paradas costosas. Desde ruidos inusuales hasta fugas hidráulicas.",
    readTime: "4 min",
    image: "/img/company/servicio.jpg",
    content: [
      { subtitle: "1. Ruidos inusuales en el mástil", text: "Si escuchas chirridos, golpes o zumbidos al elevar carga, puede indicar cadenas desgastadas, rodillos dañados o falta de lubricación. Ignorar estos sonidos puede derivar en una falla catastrófica durante la operación." },
      { subtitle: "2. Fugas de aceite hidráulico", text: "Manchas de aceite debajo del equipo o en el mástil son señal de sellos dañados. Un sistema hidráulico con fugas pierde presión progresivamente, reduciendo la capacidad de carga segura." },
      { subtitle: "3. Dirección dura o imprecisa", text: "Dificultad para girar puede indicar problemas en la bomba de dirección, bajo nivel de fluido o desgaste en los componentes del sistema. Esto es un riesgo de seguridad inmediato." },
      { subtitle: "4. Humo excesivo (diésel/GLP)", text: "Humo negro indica mezcla rica o filtro de aire obstruido. Humo blanco puede ser agua en el combustible. Humo azul es aceite quemándose en la cámara de combustión." },
      { subtitle: "5. Frenos blandos o lentos", text: "Si el equipo no frena con la misma eficacia, revisa inmediatamente. Pastillas desgastadas, fluido de frenos bajo o aire en las líneas son causas comunes. Nunca operes un equipo con frenos deficientes." },
    ],
  },
  {
    id: 2,
    category: "Guía de compra",
    title: "Montacargas eléctrico vs diésel: ¿cuál conviene en 2024?",
    excerpt: "Análisis completo de costos, rendimiento y aplicaciones. Te ayudamos a elegir el motor correcto para tu operación.",
    readTime: "6 min",
    image: "/img/equipment/ec20-litio-3w.png",
    content: [
      { subtitle: "Costo de operación", text: "Un montacargas eléctrico cuesta aproximadamente $0.85/hora en energía, vs $2.40/hora para diésel. En una operación de 8h/día, 22 días/mes, la diferencia es de $273/mes por equipo." },
      { subtitle: "Ambiente de trabajo", text: "Los eléctricos son obligatorios en espacios cerrados (cero emisiones). El diésel es ideal para exteriores, terrenos irregulares y condiciones donde necesitas potencia bruta." },
      { subtitle: "Mantenimiento", text: "Los eléctricos tienen 60% menos piezas móviles = menos mantenimiento. Sin cambios de aceite, filtros de combustible ni ajustes de motor. Las baterías de litio duran 3,000+ ciclos." },
      { subtitle: "Inversión inicial", text: "Los eléctricos cuestan 20-30% más de entrada, pero el TCO a 5 años suele ser menor. Usa nuestra calculadora TCO para comparar con tus números reales." },
      { subtitle: "Nuestra recomendación", text: "Para almacenes, centros de distribución y trabajo en interiores: eléctrico siempre. Para construcción, puertos y trabajo exterior pesado: diésel o GLP." },
    ],
  },
  {
    id: 3,
    category: "Seguridad",
    title: "LOPCYMAT: requisitos legales para operadores de montacargas",
    excerpt: "Lo que toda empresa venezolana debe cumplir según la ley. Certificaciones, inspecciones y responsabilidades.",
    readTime: "5 min",
    image: "/img/company/operaciones-3.jpg",
    content: [
      { subtitle: "Certificación del operador", text: "Todo operador debe estar certificado por un ente reconocido. La empresa es responsable de garantizar que solo personal capacitado opere el equipo." },
      { subtitle: "Inspecciones diarias", text: "La LOPCYMAT exige una inspección pre-operacional diaria documentada. Incluye revisión de frenos, dirección, mástil, horquillas, luces y alarmas." },
      { subtitle: "Mantenimiento preventivo", text: "Debe existir un programa documentado de mantenimiento preventivo. Las horas de servicio deben registrarse y los trabajos realizados deben quedar en bitácora." },
      { subtitle: "Señalización y áreas de trabajo", text: "Las zonas de tránsito de montacargas deben estar debidamente señalizadas. Límites de velocidad, pasos peatonales y áreas de carga deben estar demarcados." },
      { subtitle: "Sanciones", text: "El incumplimiento puede resultar en multas de 26 a 75 Unidades Tributarias por trabajador expuesto, además de responsabilidad penal en caso de accidentes." },
    ],
  },
  {
    id: 4,
    category: "Tips",
    title: "Cómo extender la vida útil de las baterías de litio",
    excerpt: "Mejores prácticas para maximizar los ciclos de carga y mantener el rendimiento óptimo de tus equipos eléctricos.",
    readTime: "3 min",
    image: "/img/equipment/apilador-litio.jpg",
    content: [
      { subtitle: "Carga oportunista", text: "Las baterías de litio se benefician de cargas parciales frecuentes. No esperes a que se descarguen completamente. Aprovecha pausas y almuerzos para cargar." },
      { subtitle: "Temperatura", text: "Mantén las baterías entre 15-35°C. El calor excesivo reduce la vida útil. En climas cálidos, asegura ventilación adecuada en la zona de carga." },
      { subtitle: "Cargador correcto", text: "Usa siempre el cargador especificado por el fabricante. Cargadores inadecuados pueden dañar las celdas y anular la garantía." },
      { subtitle: "Almacenamiento", text: "Si el equipo no se usará por tiempo prolongado, mantén la batería entre 40-60% de carga. Nunca la almacenes completamente descargada." },
    ],
  },
  {
    id: 5,
    category: "Industria",
    title: "Tendencias en logística de almacén para LATAM",
    excerpt: "Automatización, equipos autónomos y tecnología IoT: qué viene para la industria de manejo de materiales.",
    readTime: "5 min",
    image: "/img/company/operaciones-4.jpg",
    content: [
      { subtitle: "Electrificación acelerada", text: "La tendencia global hacia montacargas eléctricos se acelera. En 2024, más del 65% de los montacargas vendidos globalmente son eléctricos. LATAM va en la misma dirección." },
      { subtitle: "IoT y telemetría", text: "Sensores conectados permiten monitorear el uso, estado de batería, impactos y mantenimiento en tiempo real. Grupo RCA ya ofrece estas soluciones." },
      { subtitle: "Automatización gradual", text: "Los AGV (vehículos guiados automáticamente) crecen 15% anual. Aunque aún premium para LATAM, las primeras implementaciones están llegando." },
      { subtitle: "Seguridad aumentada", text: "Cámaras, sensores de proximidad y sistemas de alerta están siendo adoptados como estándar en nuevos equipos." },
    ],
  },
  {
    id: 6,
    category: "Caso de éxito",
    title: "Distribuidora Oriental: 40% menos downtime con mantenimiento preventivo",
    excerpt: "Cómo un programa de servicio planificado transformó la operación logística de uno de nuestros clientes.",
    readTime: "4 min",
    image: "/img/company/alquiler.jpg",
    content: [
      { subtitle: "El problema", text: "Distribuidora Oriental operaba 12 montacargas con mantenimiento reactivo. En promedio, 3 equipos estaban fuera de servicio al mismo tiempo, generando $15,000/mes en costos por downtime." },
      { subtitle: "La solución", text: "Implementamos un contrato de servicio preventivo con visitas cada 250 horas. Incluye revisión completa, cambio de filtros, ajustes y reporte digital." },
      { subtitle: "Resultados", text: "En 6 meses: downtime reducido de 25% a 8%, costo de mantenimiento reducido 35%, vida útil de equipos extendida un estimado de 2 años." },
      { subtitle: "Testimonio", text: "\"Antes perdíamos días enteros esperando repuestos. Ahora todo está planificado y nuestros equipos siempre están operativos\" — Gerente de Operaciones, Distribuidora Oriental." },
    ],
  },
  {
    id: 7,
    category: "Novedades",
    title: "MEGALIFT Plus: el montacargas eléctrico de alto voltaje",
    excerpt: "Nuestro nuevo montacargas eléctrico con batería de litio de alto voltaje: carga completa en aproximadamente 1 hora y hasta 90% de ahorro frente a equipos de combustión.",
    readTime: "2 min",
    image: "/img/equipment/megalift-plus-2026.png",
    source: LINKEDIN,
    content: [
      { subtitle: "Potencia eléctrica de nueva generación", text: "El MEGALIFT Plus incorpora una batería de litio de alto voltaje que ofrece el rendimiento de un equipo de combustión sin emisiones, ideal para operaciones exigentes en interiores y exteriores." },
      { subtitle: "Carga ultrarrápida", text: "Alcanza carga completa en aproximadamente 1 hora, lo que permite operar en varios turnos sin tiempos muertos prolongados." },
      { subtitle: "Ahorro real", text: "Frente a un montacargas de combustión, el ahorro en costo de ciclo de vida puede llegar al 90%, considerando combustible, mantenimiento y repuestos." },
    ],
  },
  {
    id: 8,
    category: "Novedades",
    title: "NART20Li: reach truck de pasillo angosto",
    excerpt: "Equipo retráctil para almacenamiento vertical de alta densidad, con mástil que alcanza grandes alturas de elevación en pasillos estrechos.",
    readTime: "2 min",
    image: "/img/equipment/narrow-aisle.jpg",
    source: LINKEDIN,
    content: [
      { subtitle: "Máximo aprovechamiento del espacio", text: "El NART20Li está diseñado para pasillos angostos, permitiendo aumentar la capacidad de almacenamiento sin ampliar la nave." },
      { subtitle: "Elevación de gran altura", text: "Su mástil retráctil llega a alturas elevadas, ideal para racks de alta densidad y centros de distribución." },
      { subtitle: "Tecnología de litio", text: "Funciona con batería de litio, con la eficiencia, baja necesidad de mantenimiento y operación silenciosa que caracteriza a la línea Megalift." },
    ],
  },
  {
    id: 9,
    category: "Novedades",
    title: "Serie MESR: apiladores eléctricos de litio",
    excerpt: "Apiladores eléctricos con batería de litio en capacidades de 1.600 a 2.000 kg, pensados para operaciones de almacén.",
    readTime: "2 min",
    image: "/img/equipment/apilador-litio.jpg",
    source: LINKEDIN,
    content: [
      { subtitle: "Versátiles para almacén", text: "La serie MESR ofrece apiladores eléctricos en capacidades de 1.600 a 2.000 kg, ideales para movimiento y estiba de cargas en interiores." },
      { subtitle: "Batería de litio", text: "Con tecnología de litio aprovechan cargas parciales, no requieren mantenimiento de batería y mantienen un rendimiento constante durante el turno." },
    ],
  },
  {
    id: 10,
    category: "Novedades",
    title: "Transpaletas eléctricas Megalift de litio",
    excerpt: "Transpaletas eléctricas con tecnología de litio para agilizar la operación en centros de distribución.",
    readTime: "1 min",
    image: "/img/equipment/transpaleta-litio.jpg",
    source: LINKEDIN,
    content: [
      { subtitle: "Eficiencia en distribución", text: "Las transpaletas eléctricas Megalift facilitan el movimiento de pallets en centros de distribución, reduciendo el esfuerzo del operador y aumentando la productividad." },
      { subtitle: "Tecnología de litio", text: "La batería de litio permite carga oportunista y bajo mantenimiento, manteniendo el equipo disponible la mayor parte del día." },
    ],
  },
  {
    id: 11,
    category: "Novedades",
    title: "Cuida la batería de litio de tu Megalift",
    excerpt: "Recomendación clave: nunca descargues tu montacargas eléctrico Megalift por debajo del 25% para proteger el sistema BMS y mantener la garantía.",
    readTime: "1 min",
    image: "/img/equipment/bateria-litio-megalift.jpg",
    source: LINKEDIN,
    content: [
      { subtitle: "No bajes del 25%", text: "Para proteger el sistema de gestión de batería (BMS) y mantener la cobertura de garantía, nunca descargues la batería de litio de tu Megalift por debajo del 25% de su capacidad." },
      { subtitle: "Carga oportunista", text: "Aprovecha pausas y descansos para cargar parcialmente. Las baterías de litio se benefician de cargas frecuentes y no necesitan descargarse por completo." },
    ],
  },
  {
    id: 12,
    category: "Novedades",
    title: "Equipos de limpieza industrial Eureka",
    excerpt: "Sumamos a nuestro portafolio las barredoras y fregadoras Eureka (Italia), incluyendo la barredora manual Picobello.",
    readTime: "1 min",
    image: "/img/company/operaciones-1.jpg",
    source: LINKEDIN,
    content: [
      { subtitle: "Nueva alianza", text: "Incorporamos equipos de limpieza industrial de la marca italiana Eureka: barredoras y fregadoras para mantener tus instalaciones impecables." },
      { subtitle: "Picobello y más", text: "Entre las opciones está la barredora manual Picobello, ideal para espacios donde se necesita limpieza ágil y eficiente. Consúltanos por el modelo que mejor se adapta a tu operación." },
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
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Recursos y guías</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Información práctica y novedades de nuestra operación. Mira lo que compartimos en nuestro LinkedIn.</p>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-[#0a66c2] hover:underline text-sm font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            Síguenos en LinkedIn
          </a>
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
                  <p className="text-brand-muted text-sm mb-3">¿Necesitas asesoría personalizada?</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a href={`https://wa.me/584244013250?text=${encodeURIComponent(`Hola, leí el artículo "${article.title}" y tengo algunas preguntas`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-6 py-3 rounded-xl text-sm transition-all">
                      Hablar con un experto
                    </a>
                    {article.source && (
                      <a href={article.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        Ver en LinkedIn
                      </a>
                    )}
                  </div>
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
                    Leer más
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
