# PLAN DEL APARTADO DE CONFIGURACIÓN

## Descripción del plan

Implementar el apartado de Configuración de Mallic Tesla para que Pablo pueda registrar y mantener los datos de la empresa, su información de contacto, las tarifas habituales y textos generales. Este plan cubre únicamente la captura, validación y persistencia de la información; su uso dentro de presupuestos, tickets, PDF u otros módulos se resolverá posteriormente.

## Objetivo principal

- Reemplazar la pantalla pendiente de Configuración por un formulario responsive
- Guardar los datos de la empresa y de Pablo en SPA y Android
- Registrar los precios habituales de mano de obra y traslado
- Permitir guardar un mensaje final, varios métodos de pago y varias redes sociales
- Preparar una estructura desacoplada que pueda conectarse posteriormente con otros módulos

## Reglas del plan

- Usar Vue 3, TypeScript estricto, Composition API con `<script setup>`, Quasar y Pinia
- Mantener una única interfaz responsive para SPA y Android
- Usar nombres en español y respetar las convenciones de `AGENTS.md`
- Reutilizar el patrón actual de repositorios y almacenamiento local compatible con navegador y Capacitor
- Mantener el contrato de persistencia preparado para una futura sustitución por Firebase
- No agregar dependencias sin una necesidad validada
- Centralizar los valores visuales reutilizables nuevos en `src/css/Variables.css`
- No conectar todavía esta configuración con presupuestos, tickets, PDF, WhatsApp ni otros módulos
- No agregar moneda, cargo mínimo por visita, cantidad mínima de horas ni numeración de presupuestos
- Usar la denominación `Precio de traslado por kilómetro` y evitar el término `Nafta` dentro de Configuración

## FASE 1: Modelar la configuración

### Objetivo

Definir un modelo tipado y normalizado para representar toda la información configurable.

- [x] Crear el dominio de Configuración con tipos para datos de empresa, responsable, tarifas y textos generales
- [x] Incluir nombre de la empresa, nombre de Pablo, teléfono, correo electrónico, dirección y RUT
- [x] Incluir un logo configurable con su referencia o contenido persistible
- [x] Incluir el precio de mano de obra por hora
- [x] Incluir el precio de traslado por kilómetro
- [x] Incluir un mensaje final predeterminado de texto libre
- [x] Incluir una lista dinámica de métodos de pago con nombre y número de cuenta
- [x] Incluir una lista dinámica de redes sociales con plataforma, usuario o enlace
- [x] Definir valores iniciales seguros para una configuración todavía no completada
- [x] Normalizar espacios y textos antes de guardar sin alterar el contenido multilínea necesario
- [x] Rechazar precios negativos y aceptar cero mientras la tarifa todavía no esté definida

## FASE 2: Implementar la persistencia

### Objetivo

Guardar una única configuración y recuperarla de forma consistente en navegador y Android.

- [x] Crear un contrato asíncrono para obtener y guardar la configuración
- [x] Implementar el repositorio local usando el almacenamiento existente para SPA y Capacitor
- [x] Usar una clave versionada y exclusiva para la configuración de Mallic Tesla
- [x] Devolver los valores iniciales cuando todavía no exista información guardada
- [x] Manejar datos guardados ausentes o inválidos sin bloquear la aplicación
- [x] Mantener aislada la selección del almacenamiento para facilitar la migración futura a Firebase
- [x] Crear un store de Pinia con estados de carga, guardado, éxito y error
- [x] Evitar guardar duplicados porque solo existe una configuración general

## FASE 3: Construir el formulario

### Objetivo

Crear una pantalla clara que agrupe los datos por responsabilidad y sea cómoda en móvil y escritorio.

- [x] Crear una página específica para Configuración y sustituir el componente de módulo pendiente en la ruta existente
- [x] Crear un bloque `Empresa y responsable` con los datos generales y de contacto
- [x] Permitir seleccionar, previsualizar, reemplazar y quitar el logo
- [x] Crear un bloque `Tarifas` con mano de obra por hora y traslado por kilómetro
- [x] Mostrar claramente las unidades `por hora` y `por kilómetro` junto a sus campos
- [x] Crear un bloque independiente para el mensaje final con un texto predeterminado
- [x] Crear un bloque de métodos de pago que permita agregar y quitar bancos
- [x] Crear un bloque de redes sociales que permita agregar y quitar perfiles
- [x] Mostrar validaciones junto al campo correspondiente con textos claros
- [x] Incorporar una acción principal para guardar los cambios
- [x] Desactivar o proteger la acción de guardado mientras ya exista una operación en curso
- [x] Informar claramente cuando la configuración se guarde o cuando ocurra un error
- [x] Mantener la pantalla accesible, legible y sin desbordes en móvil y escritorio

## FASE 4: Integrar y mantener el alcance

### Objetivo

Integrar el apartado con la aplicación actual sin adelantar conexiones con módulos futuros.

- [x] Cargar la configuración guardada al entrar en la página
- [x] Mantener funcionando el acceso actual desde el menú de escritorio y la página Más
- [x] Reutilizar estilos globales de formularios, botones, encabezados, avisos y contenedores cuando corresponda
- [x] Agregar únicamente las variables visuales nuevas que sean necesarias
- [x] Confirmar que guardar la configuración no modifica clientes, materiales ni el presupuesto en edición
- [x] Dejar documentado en el código el punto de integración futura con presupuestos sin implementar esa conexión

## FASE TESTING

### Objetivo

Validar que la información pueda editarse, guardarse y recuperarse correctamente en SPA y Android.

- [ ] Abrir Configuración sin datos previos y verificar que el formulario cargue valores iniciales seguros
- [ ] Completar los datos de empresa y responsable, guardar y comprobar que se recuperen al volver a entrar
- [ ] Guardar teléfono, correo, dirección y RUT vacíos y verificar que los campos opcionales no bloqueen el formulario
- [ ] Seleccionar un logo, verificar su vista previa, guardar y comprobar que se recupere correctamente
- [ ] Reemplazar y quitar el logo y verificar que ambos cambios persistan
- [ ] Guardar precios válidos de mano de obra y traslado, cerrar y reabrir la pantalla y comprobar su persistencia
- [ ] Intentar guardar precios negativos y verificar que aparezca una validación clara
- [ ] Guardar el mensaje final predeterminado y comprobar que pueda editarse y recuperarse
- [ ] Agregar varios métodos de pago y comprobar que cada banco conserve su nombre y número de cuenta
- [ ] Agregar varias redes sociales y comprobar que cada una conserve su plataforma, usuario o enlace
- [ ] Simular datos locales ausentes o inválidos y verificar que la pantalla siga siendo utilizable
- [x] Confirmar que ningún valor guardado se aplique todavía al formulario de presupuesto
- [ ] Verificar navegación, controles táctiles, foco, textos visibles y ausencia de desbordes en móvil y escritorio
- [x] Ejecutar `npm run lint`
- [x] Ejecutar `npm run typecheck`
- [x] Ejecutar `npm run build`
- [x] Ejecutar `npm run build:android`

## Progreso del plan

- [x] Fase 1: Modelar la configuración
- [x] Fase 2: Implementar la persistencia
- [x] Fase 3: Construir el formulario
- [x] Fase 4: Integrar y mantener el alcance
- [ ] Fase Testing

Fecha de creación: 19 de Agosto 2026
Fecha de última actualización: 19 de Agosto 2026
Estado: EN PROCESO
