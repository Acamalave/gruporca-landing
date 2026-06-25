"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Locale = "es" | "en" | "pt";

const translations: Record<Locale, Record<string, string>> = {
  es: {
    // Header
    "nav.equipos": "Equipos",
    "nav.servicios": "Servicios",
    "nav.repuestos": "Repuestos",
    "nav.herramientas": "Herramientas",
    "nav.contacto": "Contacto",
    "nav.cta": "Cotizar Ahora",

    // Hero
    "hero.badge": "36+ años de experiencia",
    "hero.headline": "Montacargas nuevos y usados para toda LATAM",
    "hero.sub": "Venta, alquiler y servicio técnico de montacargas. Distribuidor autorizado de Megalift, Mitsubishi, Doosan y más marcas líderes.",
    "hero.cta1": "Explorar equipos",
    "hero.cta2": "Hablar con asesor",

    // Problem
    "problem.label": "El costo del downtime",
    "problem.headline": "Cada hora de equipo parado le cuesta a tu empresa",
    "problem.stat1": "$47K",
    "problem.stat1label": "costo promedio anual por equipo parado",
    "problem.stat2": "250h",
    "problem.stat2label": "de productividad perdida al año",
    "problem.stat3": "7x",
    "problem.stat3label": "más caro reparar que prevenir",

    // Equipment
    "equip.label": "Inventario",
    "equip.headline": "Equipos disponibles",
    "equip.sub": "Nuevos y usados certificados. Listos para entrega.",
    "equip.filter.all": "Todos",
    "equip.filter.new": "Nuevo",
    "equip.filter.used": "Usado",
    "equip.cta": "Consultar precio",

    // Compare
    "compare.label": "Soluciones flexibles",
    "compare.headline": "Compra, alquila o servicio",

    // Calculator
    "calc.label": "Herramienta exclusiva",
    "calc.headline": "Calculadora: Compra vs Alquiler vs Leasing",
    "calc.sub": "Compara costos reales y elige la modalidad que más le conviene a tu operación",

    // TCO
    "tco.label": "Para directores de planta",
    "tco.headline": "Calculadora de Costo Total (TCO)",

    // Parts
    "parts.label": "Stock permanente",
    "parts.headline": "Repuestos y partes",

    // Service
    "service.label": "Portal de cliente",
    "service.headline": "Seguimiento de servicio",

    // Blog
    "blog.label": "Centro de conocimiento",
    "blog.headline": "Recursos y guías",

    // Contact
    "contact.label": "Cotización rápida",
    "contact.headline": "Solicita tu cotización",
    "contact.sub": "Completa el formulario y te respondemos en menos de 2 horas en horario laboral.",
    "contact.send": "Enviar cotización",

    // Footer
    "footer.copyright": "Todos los derechos reservados.",

    // Common
    "common.readMore": "Leer más",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.close": "Cerrar",
  },
  en: {
    "nav.equipos": "Equipment",
    "nav.servicios": "Services",
    "nav.repuestos": "Parts",
    "nav.herramientas": "Tools",
    "nav.contacto": "Contact",
    "nav.cta": "Get Quote",

    "hero.badge": "36+ years of experience",
    "hero.headline": "New & used forklifts for all of LATAM",
    "hero.sub": "Sales, rental and technical service of forklifts. Authorized distributor of Megalift, Mitsubishi, Doosan and more leading brands.",
    "hero.cta1": "Explore equipment",
    "hero.cta2": "Talk to advisor",

    "problem.label": "The cost of downtime",
    "problem.headline": "Every hour of idle equipment costs your company",
    "problem.stat1": "$47K",
    "problem.stat1label": "average annual cost per idle unit",
    "problem.stat2": "250h",
    "problem.stat2label": "of lost productivity per year",
    "problem.stat3": "7x",
    "problem.stat3label": "more expensive to repair than prevent",

    "equip.label": "Inventory",
    "equip.headline": "Available equipment",
    "equip.sub": "New and certified used. Ready for delivery.",
    "equip.filter.all": "All",
    "equip.filter.new": "New",
    "equip.filter.used": "Used",
    "equip.cta": "Check price",

    "compare.label": "Flexible solutions",
    "compare.headline": "Buy, rent or service",

    "calc.label": "Exclusive tool",
    "calc.headline": "Calculator: Buy vs Rent vs Lease",
    "calc.sub": "Compare real costs and choose the best option for your operation",

    "tco.label": "For plant directors",
    "tco.headline": "Total Cost of Ownership (TCO) Calculator",

    "parts.label": "Permanent stock",
    "parts.headline": "Parts & spare parts",

    "service.label": "Customer portal",
    "service.headline": "Service tracking",

    "blog.label": "Knowledge center",
    "blog.headline": "Resources & guides",

    "contact.label": "Quick quote",
    "contact.headline": "Request a quote",
    "contact.sub": "Fill out the form and we'll respond within 2 hours during business hours.",
    "contact.send": "Send quote request",

    "footer.copyright": "All rights reserved.",

    "common.readMore": "Read more",
    "common.back": "Back",
    "common.next": "Next",
    "common.close": "Close",
  },
  pt: {
    "nav.equipos": "Equipamentos",
    "nav.servicios": "Serviços",
    "nav.repuestos": "Peças",
    "nav.herramientas": "Ferramentas",
    "nav.contacto": "Contato",
    "nav.cta": "Pedir Orçamento",

    "hero.badge": "36+ anos de experiência",
    "hero.headline": "Empilhadeiras novas e usadas para toda LATAM",
    "hero.sub": "Venda, aluguel e assistência técnica de empilhadeiras. Distribuidor autorizado de Megalift, Mitsubishi, Doosan e mais marcas líderes.",
    "hero.cta1": "Explorar equipamentos",
    "hero.cta2": "Falar com consultor",

    "problem.label": "O custo do tempo parado",
    "problem.headline": "Cada hora de equipamento parado custa a sua empresa",
    "problem.stat1": "$47K",
    "problem.stat1label": "custo médio anual por equipamento parado",
    "problem.stat2": "250h",
    "problem.stat2label": "de produtividade perdida por ano",
    "problem.stat3": "7x",
    "problem.stat3label": "mais caro reparar do que prevenir",

    "equip.label": "Inventário",
    "equip.headline": "Equipamentos disponíveis",
    "equip.sub": "Novos e usados certificados. Prontos para entrega.",
    "equip.filter.all": "Todos",
    "equip.filter.new": "Novo",
    "equip.filter.used": "Usado",
    "equip.cta": "Consultar preço",

    "compare.label": "Soluções flexíveis",
    "compare.headline": "Compre, alugue ou serviço",

    "calc.label": "Ferramenta exclusiva",
    "calc.headline": "Calculadora: Compra vs Aluguel vs Leasing",
    "calc.sub": "Compare custos reais e escolha a melhor opção para sua operação",

    "tco.label": "Para diretores de planta",
    "tco.headline": "Calculadora de Custo Total (TCO)",

    "parts.label": "Estoque permanente",
    "parts.headline": "Peças e componentes",

    "service.label": "Portal do cliente",
    "service.headline": "Acompanhamento de serviço",

    "blog.label": "Centro de conhecimento",
    "blog.headline": "Recursos e guias",

    "contact.label": "Orçamento rápido",
    "contact.headline": "Solicite seu orçamento",
    "contact.sub": "Preencha o formulário e respondemos em menos de 2 horas em horário comercial.",
    "contact.send": "Enviar solicitação",

    "footer.copyright": "Todos os direitos reservados.",

    "common.readMore": "Ler mais",
    "common.back": "Voltar",
    "common.next": "Próximo",
    "common.close": "Fechar",
  },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  const t = (key: string) => translations[locale]?.[key] || translations.es[key] || key;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const locales: { code: Locale; flag: string; label: string }[] = [
    { code: "es", flag: "ES", label: "Español" },
    { code: "en", flag: "EN", label: "English" },
    { code: "pt", flag: "PT", label: "Português" },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-0.5">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
            locale === l.code
              ? "bg-brand-gold text-brand-navy"
              : "text-white/50 hover:text-white"
          }`}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
