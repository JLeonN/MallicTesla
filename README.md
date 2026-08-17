# Mallic Tesla

Base técnica responsive para crear y gestionar presupuestos de trabajos eléctricos desde navegador y Android. Este repositorio contiene solamente la inicialización técnica; las funciones comerciales se implementarán mediante planes independientes.

## Stack

- Quasar CLI y Vite.
- Vue 3 con Composition API y `<script setup>`.
- TypeScript estricto.
- Vue Router en modo hash y Pinia.
- Capacitor 8 para Android.
- Modo oscuro permanente.

## Rutas importantes

- `src/css/Variables.css`: fuente única de decisiones visuales reutilizables.
- `src/pages/IndexPage.vue`: pantalla inicial mínima.
- `src-capacitor/`: proyecto nativo; el identificador Android es `com.mallictesla.presupuestos`.
- `.github/workflows/deploy-pages.yml`: compilación y despliegue de `dist/spa` en GitHub Pages.
- `PlanMaestroMallicTesla.md`: alcance y validaciones de la inicialización.
- `C:/Z-Programacion/SolucionesAMedida/Clientes/MallicTesla`: contexto comercial, separado del código.

El archivo `src/assets/LogoMallicTeslaOriginal.jpg` es una copia intacta de referencia. No es todavía el ícono definitivo y requiere un plan visual posterior.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run dev:android
npm run build:android
```

`npm run build` genera la SPA en `dist/spa` con ruta pública `/MallicTesla/`. Desarrollo y Capacitor mantienen `/` como ruta pública.

## GitHub Pages

El workflow se ejecutará al publicar cambios en `main`. En GitHub se debe seleccionar **Settings > Pages > Build and deployment > GitHub Actions** si la configuración no se activa automáticamente.

El repositorio y `origin` ya existían al comenzar este plan. CH no crea commits ni ejecuta push; Leo decide cuándo versionar y publicar los cambios.

## Arquitectura futura aprobada

Firebase se incorporará únicamente en su propio plan. La arquitectura prevista incluye Google Login con Firebase Authentication, Cloud Firestore compartido entre Android y web, persistencia offline, sincronización al recuperar conexión y reglas cerradas a la identidad autorizada de Pablo. Firebase todavía no está instalado.

La tipografía y los tres colores definitivos están pendientes de Pablo. Hasta recibirlos se utilizan valores oscuros provisionales centralizados en `Variables.css`.

## Planes derivados pendientes

Cada módulo tendrá un plan ejecutable propio y no debe implementarse
improvisadamente desde el plan maestro. Orden recomendado:

1. Base visual y navegación.
2. Clientes y catálogo de materiales.
3. Creación y cálculo de presupuestos.
4. PDF configurable y envío por WhatsApp.
5. Adicionales y aceptación del cliente.
6. Historial y estadísticas.
7. Persistencia, sincronización, Google Login y seguridad con Firebase.

No existen todavía implementaciones parciales de clientes, materiales, presupuestos, PDF, WhatsApp, adicionales, estadísticas ni Firebase.
