# Grupo RCA — Landing Page

Landing page de Grupo RCA: venta, alquiler y servicio técnico de montacargas en Venezuela y LATAM.

Construida con Next.js 14 (App Router), TypeScript, Tailwind CSS y Firebase Firestore.

## Requisitos

- Node.js 18.17 o superior
- Una cuenta de Firebase con un proyecto y Firestore habilitado

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.local.example` a `.env.local` y completa las credenciales de tu
   proyecto de Firebase (las encuentras en la consola de Firebase → Configuración
   del proyecto → Tus apps):

   ```bash
   cp .env.local.example .env.local
   ```

   Variables disponibles:

   - `NEXT_PUBLIC_FIREBASE_*` — credenciales del proyecto de Firebase.
   - `NEXT_PUBLIC_SITE_URL` — URL pública del sitio (usada en metadatos, robots y
     sitemap). Por defecto `https://www.gruporca.com`.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Build de producción

```bash
npm run build
npm run start
```

## Firebase

El sitio escribe en tres colecciones de Firestore:

- `leads` — cotizaciones del formulario de contacto.
- `partsQuotes` — solicitudes del cotizador de repuestos.
- `serviceOrders` — órdenes de servicio (lectura para el portal de seguimiento).

Las reglas de seguridad están en `firestore.rules`. Para publicarlas necesitas la
[Firebase CLI](https://firebase.google.com/docs/cli):

```bash
firebase deploy --only firestore:rules
```

## Estructura

- `src/app/` — layout, página principal, metadatos, `robots.ts` y `sitemap.ts`.
- `src/components/` — componentes de cada sección de la landing.
- `src/lib/` — configuración de Firebase e internacionalización (i18n).
- `src/hooks/` — hooks reutilizables (`useInView`, `useCountUp`).
