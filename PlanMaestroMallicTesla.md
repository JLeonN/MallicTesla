# PLAN MAESTRO DE INICIALIZACIÓN DE MALLIC TESLA

## Descripción del plan

Crear la base técnica de Mallic Tesla como una aplicación responsive para navegador y Android. El resultado debe ser un proyecto Quasar funcional, construido con Vue 3, TypeScript, Vite y Capacitor, que muestre una pantalla mínima en modo oscuro y quede preparado para que Leo realice el primer commit y push.

Este plan solamente inicializa el proyecto, su arquitectura, documentación, identidad técnica, compilaciones y preparación de GitHub Pages. Las funciones comerciales se implementarán posteriormente mediante planes independientes.

## Objetivo principal

- Crear un proyecto técnico ejecutable mediante `npm run dev`.
- Mantener una única base de código responsive para web y Android.
- Configurar Capacitor con el nombre e identificador aprobados.
- Centralizar las decisiones visuales en `src/css/Variables.css`.
- Preparar un repositorio público y el despliegue futuro en GitHub Pages.
- Documentar reglas suficientes para que futuros agentes continúen el desarrollo sin ambigüedades.
- Terminar sin crear commits ni ejecutar push.

## Reglas del plan

- Ejecutar el plan completo una vez iniciado, sin pedir confirmación entre fases.
- Detenerse y consultar a Leo únicamente ante una decisión importante no contemplada, una acción externa no autorizada o un bloqueo real.
- Trabajar el proyecto técnico exclusivamente en `C:/Z-Programacion/Quasar/MallicTesla`.
- Leer antes de implementar el `AGENTS.md` y el contexto de Mallic Tesla disponibles en el repositorio comercial.
- No desarrollar todavía clientes, materiales, presupuestos, PDF, WhatsApp, adicionales, estadísticas, Firebase ni otras funciones comerciales.
- No instalar Firebase ni librerías específicas de PDF, firma, gráficos o WhatsApp.
- Usar npm como gestor de paquetes y conservar `package-lock.json`.
- Usar versiones estables y compatibles disponibles en el momento de ejecución. No fijar versiones antiguas por memoria.
- No guardar credenciales, tokens, claves privadas ni secretos.
- No crear commits y no ejecutar push bajo ninguna circunstancia.
- Se permite crear el repositorio público vacío y configurar el remoto `origin`, sin publicar contenido.
- No modificar el logo original; copiarlo como referencia manteniendo intacto el archivo fuente.
- Mantener todo el contenido propio en español natural y UTF-8.
- Usar nombres descriptivos en español según las convenciones del `AGENTS.md` técnico.
- No crear automáticamente los planes derivados; solamente documentar que quedan pendientes.

## Identidad técnica confirmada

- Nombre visible: `Mallic Tesla`.
- Nombre técnico y paquete npm: `mallic-tesla`.
- Identificador Android: `com.mallictesla.presupuestos`.
- Ruta local: `C:/Z-Programacion/Quasar/MallicTesla`.
- Repositorio público: `https://github.com/JLeonN/MallicTesla`.
- Modalidad web: SPA responsive.
- Enrutamiento: modo hash para compatibilidad con GitHub Pages y Capacitor.
- Apariencia inicial: modo oscuro permanente.

## Referencias obligatorias

- Repositorio comercial y fuente de contexto: `https://github.com/JLeonN/SolucionesAMedida`.
- Contexto local del cliente: `C:/Z-Programacion/SolucionesAMedida/Clientes/MallicTesla/Contexto.md`.
- Problemas documentados: `C:/Z-Programacion/SolucionesAMedida/Clientes/MallicTesla/Problemas.md`.
- Logo original local: `C:/Z-Programacion/SolucionesAMedida/Clientes/MallicTesla/Recursos/Imagenes/LogoMallicTeslaOriginal.jpg`.
- Logo dentro del repositorio comercial: `Clientes/MallicTesla/Recursos/Imagenes/LogoMallicTeslaOriginal.jpg`.
- Ejemplo de variables visuales de Leo: `C:/Z-Programacion/Quasar/TaTeTi/src/css/Variables.css`.
- Creación de proyectos Quasar: `https://quasar.dev/quasar-cli-vite/creating-a-quasar-app-vite-project-folder/`.
- Configuración de Capacitor: `https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/preparation/`.
- Configuración del modo oscuro: `https://quasar.dev/quasar-plugins/dark/`.
- Despliegue de SPA en GitHub Pages: `https://quasar.dev/quasar-cli-vite/developing-spa/deploying/`.
- Creación de repositorios con GitHub CLI: `https://cli.github.com/manual/gh_repo_create`.

## Planes derivados pendientes

Después de completar y publicar la base técnica, crear un plan independiente para cada área:

1. Base visual y navegación.
2. Clientes y catálogo de materiales.
3. Creación y cálculo de presupuestos.
4. PDF configurable y envío por WhatsApp.
5. Adicionales y aceptación del cliente.
6. Historial y estadísticas.
7. Persistencia, sincronización, Google Login y seguridad con Firebase.

Cada plan derivado deberá leer el `AGENTS.md` técnico, este plan maestro y el contexto comercial relacionado antes de definir o ejecutar cambios.

## FASE 1: Validar el entorno y el alcance

### Objetivo

Confirmar que el equipo puede crear y ejecutar el proyecto sin modificar instalaciones o repositorios ajenos.

- [x] Leer completamente el `AGENTS.md` de `C:/Z-Programacion/SolucionesAMedida` y los archivos de contexto indicados en las referencias obligatorias.
- [x] Verificar que `C:/Z-Programacion/Quasar/MallicTesla` es la ruta exacta aprobada y que está vacía antes de generar archivos.
- [x] Si la carpeta contiene archivos inesperados, detenerse y consultar a Leo sin sobrescribirlos ni eliminarlos.
- [x] Verificar Node.js 22 o superior mediante `node --version`.
- [x] Verificar npm mediante `npm --version`.
- [x] Verificar Git mediante `git --version`.
- [x] Verificar GitHub CLI mediante `gh --version` y comprobar la sesión con `gh auth status`.
- [x] Verificar Java, Android Studio, Android SDK y licencias necesarias para preparar o compilar Android.
- [x] Registrar cualquier requisito ausente como bloqueo real sin instalar herramientas globales o modificar el sistema silenciosamente.

## FASE 2: Crear el proyecto Quasar

### Objetivo

Generar una base oficial de Quasar con las opciones técnicas aprobadas y dependencias mínimas.

- [x] Ejecutar el generador oficial dentro de la carpeta vacía mediante `npm create quasar@latest .`.
- [x] Elegir `App with Quasar CLI` y el motor Vite vigente recomendado por Quasar.
- [x] Configurar el paquete como `mallic-tesla` y el nombre visible como `Mallic Tesla`.
- [x] Seleccionar Vue 3, TypeScript y Composition API con `<script setup>`.
- [x] Seleccionar Vue Router y Pinia porque serán dependencias transversales de los módulos futuros.
- [x] Seleccionar ESLint y Prettier cuando el generador los ofrezca.
- [x] No seleccionar Axios, i18n ni otras dependencias que todavía no tengan un uso validado.
- [x] Evitar que el generador cree commits. Si ofrece inicializar Git automáticamente, elegir la opción que no cree historial.
- [x] Confirmar que `package.json` incluye como mínimo scripts equivalentes a `dev`, `build` y `lint`; agregar únicamente los scripts ausentes.
- [x] Ejecutar `npm install` si el generador no lo hizo.
- [x] Ejecutar `npm run dev` y comprobar que la base de Quasar abre en el navegador antes de personalizarla.

## FASE 3: Crear reglas y documentación técnica

### Objetivo

Dejar instrucciones claras para los agentes y humanos que trabajarán posteriormente en el repositorio técnico.

- [x] Crear `AGENTS.md` en la raíz técnica y declararlo como fuente principal de instrucciones del proyecto.
- [x] Indicar en `AGENTS.md` que el usuario es Leo, el asistente es CH y toda comunicación y documentación propia debe estar en español.
- [x] Exigir que cualquier agente lea `AGENTS.md`, `README.md`, el plan activo y las referencias comerciales necesarias antes de modificar código.
- [x] Exigir variables y funciones en camelCase y español, por ejemplo `clienteSeleccionado` y `calcularTotalPresupuesto`.
- [x] Exigir constantes en MAYÚSCULAS con guiones bajos, por ejemplo `ESTADOS_PRESUPUESTO`.
- [x] Exigir componentes Vue en PascalCase, por ejemplo `FormularioCliente.vue`.
- [x] Exigir composables con prefijo `use`, por ejemplo `usePresupuestos.ts`.
- [x] Exigir clases CSS globales y variables CSS semánticas en kebab-case, por ejemplo `tarjeta-presupuesto` y `--color-fondo-principal`.
- [x] Exigir TypeScript estricto, Composition API y componentes pequeños con responsabilidades claras.
- [x] Prohibir valores visuales repetidos fuera de `src/css/Variables.css`, salvo una excepción local documentada.
- [x] Prohibir que agentes creen commits o ejecuten push salvo una solicitud explícita de Leo.
- [x] Indicar que los secretos nunca deben escribirse en archivos versionados.
- [x] Crear `README.md` con propósito, stack, rutas importantes, comandos, plataformas, planes pendientes y relación con `SolucionesAMedida`.
- [x] Crear `.env.example` sin valores reales y documentar que Firebase se configurará en un plan posterior.
- [x] Verificar que `.env` y variantes locales sensibles estén ignoradas por Git.

## FASE 4: Preparar la base visual oscura

### Objetivo

Mostrar una pantalla mínima responsive en modo oscuro sin adelantar el plan de diseño y navegación.

- [x] Crear `src/css/Variables.css` como fuente única de colores, tipografía, espaciados, radios, bordes, sombras y tamaños globales reutilizables.
- [x] Usar variables semánticas en español y valores oscuros provisionales con contraste legible.
- [x] Incluir como mínimo variables para fondo principal, superficies, textos, borde, acción principal, éxito, advertencia, error, tipografía, espaciados, radios y sombras.
- [x] Importar `Variables.css` globalmente antes de los estilos que la consumen.
- [x] Configurar Quasar con `framework.config.dark: true`; no usar modo automático ni ofrecer selector de tema.
- [x] Eliminar el contenido demostrativo innecesario del generador sin borrar archivos estructurales requeridos por Quasar.
- [x] Crear una pantalla inicial mínima que muestre `Mallic Tesla` y que utilice las variables globales.
- [x] No crear todavía menú, navegación comercial, dashboard ni componentes de los planes derivados.
- [x] Copiar el logo original sin modificarlo a `src/assets/LogoMallicTeslaOriginal.jpg`.
- [x] No usar todavía el logo como ícono definitivo ni intentar vectorizarlo, recortarlo o recolorearlo.
- [x] Verificar que la pantalla no produzca destellos de modo claro durante la carga.

## FASE 5: Configurar Capacitor para Android

### Objetivo

Preparar la misma base web como proyecto Android sin desarrollar funciones nativas adicionales.

- [x] Agregar el modo Capacitor mediante `npx quasar mode add capacitor`.
- [x] Responder los prompts con `Mallic Tesla` y `com.mallictesla.presupuestos` antes de que se genere la plataforma Android.
- [x] Verificar en `src-capacitor/capacitor.config.ts` el nombre, identificador y directorio web generado por Quasar.
- [x] Confirmar que el identificador no se cambie después de crear la plataforma Android sin una migración explícita.
- [x] Agregar scripts npm descriptivos para desarrollo y compilación Android usando Quasar, por ejemplo `dev:android` y `build:android`.
- [x] No instalar plugins nativos de Firebase, compartir, firma, cámara ni archivos en esta etapa.
- [x] Ejecutar una compilación Android de desarrollo si el SDK y las licencias están disponibles.
- [x] Si el entorno Android no está disponible, conservar la configuración válida y registrar exactamente el requisito pendiente.

## FASE 6: Preparar Git y GitHub Pages

### Objetivo

Dejar el proyecto listo para que Leo cree el primer commit, ejecute push y obtenga después el despliegue web.

- [x] Inicializar Git con rama principal `main` si el proyecto todavía no contiene un repositorio local.
- [x] Verificar que `.gitignore` excluya dependencias, compilaciones, archivos locales, credenciales y artefactos Android que no deban versionarse.
- [x] Configurar Vue Router en modo hash.
- [x] Configurar `build.publicPath` como `/MallicTesla/` solamente para la compilación SPA de producción destinada a GitHub Pages.
- [x] Mantener `/` como ruta pública para desarrollo y compilaciones Capacitor.
- [x] Crear `.github/workflows/deploy-pages.yml` siguiendo el flujo oficial de GitHub Pages para instalar con `npm ci`, compilar la SPA y publicar `dist/spa`.
- [x] Usar Node.js 22 o una versión LTS superior compatible en el workflow.
- [x] No introducir tokens manuales ni secretos dentro del workflow.
- [x] Comprobar si existe `JLeonN/MallicTesla` mediante GitHub CLI.
- [x] Si no existe, crear el repositorio público vacío mediante `gh repo create JLeonN/MallicTesla --public --source=. --remote=origin`, sin `--push` y sin `--add-readme`.
- [x] Si ya existe, verificar su propietario y propósito antes de configurar `origin`; no sobrescribir ni eliminar contenido remoto.
- [x] Confirmar que `origin` apunta exactamente a `https://github.com/JLeonN/MallicTesla`.
- [x] Documentar en `README.md` que GitHub Pages no podrá desplegar hasta que Leo cree el primer commit, haga push y habilite GitHub Actions como fuente de Pages cuando GitHub lo requiera.
- [x] No ejecutar `git add`, `git commit`, `git push` ni comandos equivalentes.

## FASE 7: Documentar la continuidad modular

### Objetivo

Cerrar el plan maestro dejando límites y próximos pasos inequívocos.

- [x] Documentar en `README.md` los siete planes derivados pendientes y el orden recomendado.
- [x] Indicar que cada módulo tendrá su propio plan y no debe implementarse improvisadamente desde el plan maestro.
- [x] Registrar Firebase Authentication con Google Login, Cloud Firestore, persistencia offline, sincronización y reglas cerradas como arquitectura aprobada pero todavía no instalada.
- [x] Registrar que la tipografía y los tres colores definitivos están pendientes de Pablo.
- [x] Registrar que el logo copiado es solamente el original de referencia y requiere un plan visual posterior.
- [x] Verificar que no existan implementaciones parciales de clientes, materiales, presupuestos, PDF, WhatsApp, adicionales, estadísticas o Firebase.
- [x] Dejar una lista breve de comandos para iniciar web, compilar SPA y preparar Android.

## FASE TESTING

### Objetivo

Validar que la base técnica sea ejecutable, responsive, compilable y entregable sin commits ni publicaciones realizadas por el agente.

- [x] Ejecutar `npm run lint` y corregir todos los errores.
- [x] Ejecutar `npm run build` y verificar que la SPA se genere correctamente.
- [x] Ejecutar `npm run dev`, abrir la aplicación en el navegador y comprobar la pantalla mínima de Mallic Tesla.
- [x] Verificar visualmente que el fondo sea oscuro desde la carga inicial, que el texto tenga contraste y que no aparezca contenido demostrativo de Quasar.
- [x] Probar la pantalla en anchos aproximados de 360, 768 y 1280 píxeles sin desbordamientos horizontales.
- [x] Verificar que los estilos visibles consuman variables de `src/css/Variables.css` y que no existan colores globales duplicados injustificadamente.
- [x] Verificar que el logo original exista tanto en la referencia comercial como en `src/assets/LogoMallicTeslaOriginal.jpg` y que ambas copias coincidan.
- [x] Ejecutar el build Android mediante el script definido si el entorno nativo está disponible y comprobar `com.mallictesla.presupuestos`.
- [x] Revisar `package.json` y confirmar que Firebase y las librerías funcionales diferidas no estén instaladas.
- [x] Revisar `.env.example`, `.gitignore` y el árbol de archivos para confirmar que no existen secretos ni datos reales de clientes.
- [x] Verificar que el workflow use `dist/spa`, el `publicPath` `/MallicTesla/` y rutas hash.
- [x] Verificar que el remoto `origin` sea correcto y que el repositorio remoto sea público.
- [x] Ejecutar `git status` y confirmar que todos los archivos permanezcan pendientes para que Leo decida cuándo usar la skill `commit`.
- [x] Confirmar que no se haya creado ningún commit ni ejecutado push durante el plan.
- [x] Entregar a Leo un resumen con pruebas realizadas, bloqueos reales y los comandos exactos para continuar.

## Progreso del plan

- [x] Fase 1: Validar el entorno y el alcance
- [x] Fase 2: Crear el proyecto Quasar
- [x] Fase 3: Crear reglas y documentación técnica
- [x] Fase 4: Preparar la base visual oscura
- [x] Fase 5: Configurar Capacitor para Android
- [x] Fase 6: Preparar Git y GitHub Pages
- [x] Fase 7: Documentar la continuidad modular
- [x] Fase Testing

Fecha de creación: 16 de agosto de 2026
Fecha de última actualización: 17 de agosto de 2026
Estado: COMPLETADO

## Registro de ejecución

- Implementación técnica completada el 16 de agosto de 2026.
- Estado Git previo conservado: commit `373849760616aaaf4884201b3df0ecc0357b451f`; CH no creó commits ni ejecutó push.
- El repositorio `JLeonN/MallicTesla`, el remoto `origin` y la sesión de GitHub CLI quedaron verificados.
- La SPA se comprobó visualmente en desarrollo: carga directamente en modo oscuro, presenta contraste correcto y no tiene desbordamientos horizontales en anchos aproximados de 360, 768 y 1280 píxeles.
- El build SPA, TypeScript, lint y el build Android finalizaron correctamente. El APK sin firmar quedó en `dist/capacitor/android/apk/release/app-release-unsigned.apk`.
- La auditoría del proyecto raíz informó cero vulnerabilidades. Capacitor conserva tres avisos moderados transitivos en la herramienta de compilación (`@capacitor/cli` → `xcode` → `uuid`); no se instaló una versión preliminar para evitarlos.
