# PLAN DEL APARTADO DE CONFIGURACIÓN

## Descripción del plan

Implementar el apartado de Configuración de Mallic Tesla para que Pablo pueda registrar y mantener los datos de la empresa, su información de contacto, las tarifas habituales y textos generales. Este plan cubre únicamente la captura, validación y persistencia de la información; su uso dentro de presupuestos, tickets, PDF u otros módulos se resolverá posteriormente.

## Objetivo principal

- Reemplazar la pantalla pendiente de Configuración por un formulario responsive
- Guardar los datos de la empresa y de Pablo en SPA y Android
- Registrar los precios habituales de mano de obra y traslado
- Permitir guardar un mensaje final y datos opcionales para transferencias bancarias
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

- [ ] Crear el dominio de Configuración con tipos para datos de empresa, responsable, tarifas y textos generales
- [ ] Incluir nombre de la empresa, nombre de Pablo, teléfono, correo electrónico, dirección y RUT
- [ ] Incluir un logo configurable con su referencia o contenido persistible
- [ ] Incluir el precio de mano de obra por hora
- [ ] Incluir el precio de traslado por kilómetro
- [ ] Incluir un mensaje final predeterminado de texto libre
- [ ] Incluir un único campo opcional y multilínea llamado `Datos para transferencia bancaria`
- [ ] Definir valores iniciales seguros para una configuración todavía no completada
- [ ] Normalizar espacios y textos antes de guardar sin alterar el contenido multilínea necesario
- [ ] Rechazar precios negativos y aceptar cero mientras la tarifa todavía no esté definida

## FASE 2: Implementar la persistencia

### Objetivo

Guardar una única configuración y recuperarla de forma consistente en navegador y Android.

- [ ] Crear un contrato asíncrono para obtener y guardar la configuración
- [ ] Implementar el repositorio local usando el almacenamiento existente para SPA y Capacitor
- [ ] Usar una clave versionada y exclusiva para la configuración de Mallic Tesla
- [ ] Devolver los valores iniciales cuando todavía no exista información guardada
- [ ] Manejar datos guardados ausentes o inválidos sin bloquear la aplicación
- [ ] Mantener aislada la selección del almacenamiento para facilitar la migración futura a Firebase
- [ ] Crear un store de Pinia con estados de carga, guardado, éxito y error
- [ ] Evitar guardar duplicados porque solo existe una configuración general

## FASE 3: Construir el formulario

### Objetivo

Crear una pantalla clara que agrupe los datos por responsabilidad y sea cómoda en móvil y escritorio.

- [ ] Crear una página específica para Configuración y sustituir el componente de módulo pendiente en la ruta existente
- [ ] Crear un bloque `Empresa y responsable` con los datos generales y de contacto
- [ ] Permitir seleccionar, previsualizar, reemplazar y quitar el logo
- [ ] Crear un bloque `Tarifas` con mano de obra por hora y traslado por kilómetro
- [ ] Mostrar claramente las unidades `por hora` y `por kilómetro` junto a sus campos
- [ ] Crear un bloque `Textos y pagos` con el mensaje final y los datos para transferencia bancaria
- [ ] Usar campos multilínea para el mensaje final y los datos bancarios
- [ ] Mostrar validaciones junto al campo correspondiente con textos claros
- [ ] Incorporar una acción principal para guardar los cambios
- [ ] Desactivar o proteger la acción de guardado mientras ya exista una operación en curso
- [ ] Informar claramente cuando la configuración se guarde o cuando ocurra un error
- [ ] Mantener la pantalla accesible, legible y sin desbordes en móvil y escritorio

## FASE 4: Integrar y mantener el alcance

### Objetivo

Integrar el apartado con la aplicación actual sin adelantar conexiones con módulos futuros.

- [ ] Cargar la configuración guardada al entrar en la página
- [ ] Mantener funcionando el acceso actual desde el menú de escritorio y la página Más
- [ ] Reutilizar estilos globales de formularios, botones, encabezados, avisos y contenedores cuando corresponda
- [ ] Agregar únicamente las variables visuales nuevas que sean necesarias
- [ ] Confirmar que guardar la configuración no modifica clientes, materiales ni el presupuesto en edición
- [ ] Dejar documentado en el código el punto de integración futura con presupuestos sin implementar esa conexión

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
- [ ] Guardar un mensaje final y datos bancarios multilínea y comprobar que mantengan sus saltos de línea
- [ ] Simular datos locales ausentes o inválidos y verificar que la pantalla siga siendo utilizable
- [ ] Confirmar que ningún valor guardado se aplique todavía al formulario de presupuesto
- [ ] Verificar navegación, controles táctiles, foco, textos visibles y ausencia de desbordes en móvil y escritorio
- [ ] Ejecutar `npm run lint`
- [ ] Ejecutar `npm run typecheck`
- [ ] Ejecutar `npm run build`

## Progreso del plan

- [ ] Fase 1: Modelar la configuración
- [ ] Fase 2: Implementar la persistencia
- [ ] Fase 3: Construir el formulario
- [ ] Fase 4: Integrar y mantener el alcance
- [ ] Fase Testing

Fecha de creación: 19 de Agosto 2026
Fecha de última actualización: 19 de Agosto 2026
Estado: BORRADOR
