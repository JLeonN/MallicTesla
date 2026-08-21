# PLAN DE CREACIÓN Y CÁLCULO DE PRESUPUESTOS

## Descripción del plan

Implementar el formulario responsive para crear y calcular presupuestos desde SPA y Android. El flujo permitirá elegir un cliente guardado o ingresar un potencial cliente, agregar materiales guardados o escritos manualmente y editar todos los conceptos dentro de una lista compacta con apariencia de ticket.

Este plan cubre la composición y el cálculo del presupuesto. No incluye historial, PDF, envío por WhatsApp, conversión automática de monedas ni la futura configuración de valores predeterminados para mano de obra y nafta.

Ampliación acordada con Leo el 19 de agosto de 2026: conectar las tarifas de Configuración, guardar copias independientes de los presupuestos y agregar listado, visualización y edición explícita.

Ampliación acordada con Leo el 20 de agosto de 2026: generar el PDF desde la vista previa, descargarlo y compartirlo mediante el selector nativo de Android para enviarlo por WhatsApp. En web se descarga el archivo y se abre la conversación para adjuntarlo manualmente debido a las restricciones del navegador.

Ampliación acordada con Leo el 20 de agosto de 2026: permitir agregar varias líneas de mano de obra en un mismo ticket, eligiendo una tarifa guardada o escribiendo un concepto manual para cada línea.

## Objetivo principal

- Crear presupuestos en una única pantalla clara y cómoda para móvil
- Reutilizar clientes, materiales, precios, unidades, stores y componentes existentes
- Permitir editar cantidades, unidades, precios y conceptos sin modificar los catálogos generales
- Calcular subtotales y total en una única moneda, usando UYU por defecto
- Dejar mano de obra y nafta integradas como las primeras filas del ticket

## Reglas del plan

- Usar Vue 3, TypeScript estricto, Composition API con `<script setup>`, Quasar y Pinia
- Mantener una única interfaz responsive para SPA y Android
- Usar nombres en español y respetar las convenciones de `AGENTS.md`
- Reutilizar `useClientesStore`, `useMaterialesStore`, las funciones de dominio y los componentes existentes cuando su responsabilidad coincida
- Centralizar todo valor visual reutilizable nuevo en `src/css/Variables.css`
- No agregar dependencias
- No guardar potenciales clientes en el catálogo de clientes
- No guardar materiales escritos manualmente en el catálogo de materiales
- No modificar un cliente, material ni precio del catálogo al editar datos dentro del presupuesto
- No implementar todavía persistencia histórica ni copias históricas de clientes y materiales
- No implementar PDF, WhatsApp, estados, aceptación, adicionales ni estadísticas
- No implementar el futuro apartado de configuración de mano de obra y nafta

## FASE 1: Modelar el presupuesto y sus cálculos

### Objetivo

Definir un modelo estricto y desacoplado que represente los datos editables de la pantalla sin alterar los catálogos existentes.

- [x] Crear el dominio de presupuestos con tipos para destinatario, moneda, concepto y línea del ticket
- [x] Definir los tipos de concepto `material`, `manoObra` y `nafta` sin darles diferencias visuales en el ticket
- [x] Definir el origen de una línea como material guardado o concepto escrito manualmente
- [x] Definir `UYU` como moneda inicial y permitir cambiar todo el presupuesto a `USD`
- [x] Implementar funciones puras para calcular el subtotal de cada línea y el total del presupuesto
- [x] Evitar sumar al total líneas cuya moneda sea distinta de la moneda del presupuesto
- [x] Implementar una validación que identifique claramente las líneas con moneda incompatible
- [x] Reutilizar las unidades, monedas y funciones de formato existentes en `src/dominio/materiales.ts` sin duplicar lógica

## FASE 2: Crear la selección del destinatario

### Objetivo

Permitir trabajar con un potencial cliente por defecto o reutilizar un cliente existente sin modificar ni crear registros del catálogo.

- [x] Crear un selector entre `Potencial cliente` y `Cliente guardado`
- [x] Seleccionar `Potencial cliente` al abrir un presupuesto nuevo
- [x] Mostrar para el potencial cliente un único campo destinado al nombre, comercio o referencia que Pablo decida escribir
- [x] Mostrar un campo de teléfono opcional
- [x] Cargar los clientes mediante `useClientesStore` cuando se elija `Cliente guardado`
- [x] Permitir buscar y seleccionar un cliente existente reutilizando la búsqueda actual
- [x] Completar el campo único con el nombre del cliente seleccionado y el teléfono con su número principal disponible
- [x] Asegurar que cualquier edición realizada en estos campos permanezca dentro del formulario y no actualice el cliente guardado
- [x] No exigir teléfono para completar el presupuesto

## FASE 3: Crear el agregador de materiales

### Objetivo

Agregar rápidamente materiales del catálogo o conceptos manuales y convertirlos en líneas editables del presupuesto.

- [x] Crear un buscador con autocompletado sobre los materiales de `useMaterialesStore`
- [x] Permitir seleccionar un material existente y agregarlo al ticket
- [x] Usar automáticamente el precio que el material tenga marcado como predeterminado
- [x] Copiar al estado editable del formulario el nombre, unidad, moneda y precio seleccionado sin modificar el material original
- [x] Permitir escribir un nombre inexistente y agregarlo únicamente al presupuesto
- [x] Inicializar un material manual con cantidad `1`, unidad `Unidad` y precio vacío
- [x] No mostrar ninguna opción para guardar el material manual en el catálogo
- [x] Limpiar y devolver el foco al buscador después de agregar una línea para agilizar la carga consecutiva
- [x] Evitar agregar una línea vacía o sin nombre

## FASE 4: Construir el ticket editable

### Objetivo

Presentar todos los conceptos en una lista compacta donde Pablo pueda revisar y corregir el presupuesto sin abandonar la pantalla.

- [x] Inicializar el ticket con `Mano de obra` y `Nafta` como sus dos primeras filas
- [x] Inicializar los importes de mano de obra y nafta en cero
- [x] Tratar mano de obra y nafta visualmente como cualquier otra línea, sin tarjetas ni destacados especiales
- [x] Mantener mano de obra y nafta por encima de los materiales mientras existan
- [x] Permitir eliminar mano de obra y nafta
- [x] Mostrar en cada material su nombre, cantidad, unidad, precio unitario y subtotal
- [x] Mostrar mano de obra y nafta como importes únicos, sin controles de cantidad ni unidad
- [x] Permitir editar el nombre, la cantidad, la unidad y el precio de un material desde el propio ticket
- [x] Permitir sustituir el contenido de una línea por otro material sin afectar el catálogo
- [x] Permitir eliminar cualquier material del ticket
- [x] Recalcular inmediatamente el subtotal y el total después de cada cambio
- [x] Diseñar la edición para que sea cómoda tanto con teclado en escritorio como de forma táctil en Android

## FASE 5: Resolver moneda, avisos y resumen

### Objetivo

Impedir totales engañosos y mostrar claramente el resultado actual del presupuesto.

- [x] Agregar un selector de moneda general con `UYU` seleccionado por defecto
- [x] Permitir cambiar la moneda general a `USD` sin convertir automáticamente los importes existentes
- [x] Comparar la moneda de cada línea con la moneda general del presupuesto
- [x] Marcar en rojo cualquier línea cuya moneda sea diferente
- [x] Mostrar junto a la línea incompatible un mensaje corto que indique que debe editarse antes de incluirla en el total
- [x] Mantener visible el subtotal de la línea incompatible en su moneda original
- [x] Excluir del total general las líneas incompatibles y explicar visualmente por qué no fueron sumadas
- [x] Mostrar al final del ticket el total válido con la moneda general del presupuesto
- [x] Mostrar estados claros cuando todavía no existan materiales o haya precios pendientes
- [x] Usar `--color-error` y las demás variables existentes para avisos y estados visuales

## FASE 6: Integrar la pantalla en la aplicación

### Objetivo

Reemplazar la pantalla pendiente de nuevo presupuesto y mantener la integración coherente con la navegación actual.

- [x] Crear componentes pequeños para selección de destinatario, agregador, fila editable y resumen del ticket
- [x] Crear la página de nuevo presupuesto y conectar sus componentes mediante props y eventos tipados
- [x] Sustituir `PaginaModuloPendiente.vue` en la ruta `/presupuestos/nuevo`
- [x] Mantener funcionando los accesos existentes desde inicio, menú de escritorio y navegación móvil
- [x] Reutilizar clases globales de botones, encabezados, formularios, avisos y contenedores cuando correspondan
- [x] Agregar solamente las variables visuales nuevas que sean necesarias en `src/css/Variables.css`
- [x] Crear estilos específicos del presupuesto sin repetir colores, espaciados, radios, sombras ni tamaños reutilizables
- [x] Mantener fuera de esta fase cualquier guardado histórico, exportación o envío

## FASE TESTING

### Objetivo

Validar el flujo completo de creación y cálculo en escritorio y móvil sin alterar los datos existentes.

- [ ] Abrir un presupuesto nuevo y verificar que `Potencial cliente`, `UYU`, horas en cero y kilómetros en cero sean los valores iniciales
- [ ] Completar solamente el campo de nombre y verificar que el teléfono pueda quedar vacío
- [ ] Elegir un cliente guardado y comprobar que se carguen su nombre y teléfono principal sin modificar el registro original
- [ ] Agregar un material guardado y comprobar que utilice su precio predeterminado
- [ ] Editar el precio de una línea y verificar que el precio del catálogo no cambie
- [ ] Agregar un material inexistente y comprobar que comience con cantidad `1`, unidad `Unidad` y precio vacío
- [ ] Verificar que el material manual no se guarde en el catálogo
- [ ] Editar nombre, cantidad, unidad y precio desde el ticket y comprobar subtotal y total
- [ ] Eliminar materiales, mano de obra y traslado y comprobar que el total se actualice
- [ ] Agregar una línea en USD a un presupuesto UYU y verificar el marcado rojo, el mensaje y su exclusión del total
- [ ] Cambiar la moneda general a USD y verificar nuevamente la detección de líneas incompatibles
- [ ] Probar precios vacíos, cero, decimales y cantidades decimales sin producir `NaN` ni totales incorrectos
- [ ] Verificar navegación, foco, controles táctiles, textos visibles y ausencia de desbordes en anchos de móvil y escritorio
- [x] Ejecutar `npm run lint:check`
- [x] Ejecutar `npm run typecheck`
- [x] Ejecutar `npm run build`

## FASE 7: Integrar configuración y presupuestos guardados

### Objetivo

Conectar los valores habituales de Pablo sin vincular retroactivamente los presupuestos y crear el flujo persistente de creación, consulta y edición.

- [x] Copiar la primera tarifa de mano de obra y el precio de traslado al crear un presupuesto
- [x] Iniciar horas y kilómetros en cero
- [x] Reemplazar Nafta por Traslado en el modelo y la interfaz
- [x] Permitir seleccionar o escribir manualmente una mano de obra dentro del ticket
- [x] Permitir agregar varias manos de obra y mantenerlas agrupadas al comienzo del ticket
- [x] Consolidar mano de obra y traslado en el desglose de totales del Ticket
- [x] Consolidar mano de obra y traslado en una única línea final para el cliente
- [x] Repetir el importe consolidado en el resumen para evitar diferencias visibles
- [x] Guardar cada presupuesto como una copia independiente de clientes, materiales y configuración
- [x] Crear el listado responsive de presupuestos con cliente, fecha, total y acceso al detalle
- [x] Crear modos separados de visualización y edición explícita
- [x] Desactivar envío y descarga durante la edición
- [x] Incorporar cancelación integrada y animada sin modal
- [x] Guardar y volver al listado desde las acciones Guardar, Descargar y Enviar de un presupuesto nuevo
- [x] Normalizar valores editables y recuperar presupuestos persistidos sin descartarlos silenciosamente
- [x] Separar las acciones de edición a la izquierda y las acciones de salida a la derecha
- [x] Confirmar la cancelación solamente cuando existan cambios sin guardar
- [x] Crear una vista previa profesional en una página independiente y preparada para impresión A4
- [x] Conservar en cada presupuesto una copia del nombre comercial, contacto, logo, métodos de pago, redes y mensaje final
- [x] Permitir volver al formulario sin perder cambios y abrir WhatsApp cuando el destinatario tenga teléfono
- [ ] Validar visualmente el flujo completo en navegador y Android

## FASE 8: Descargar y compartir el PDF

### Objetivo

Convertir la vista previa profesional en un archivo PDF real y permitir descargarlo o compartirlo desde Android.

- [x] Generar un PDF A4 usando el mismo documento presentado en la vista previa
- [x] Nombrar el archivo con cliente, fecha, hora y minutos
- [x] Guardar cambios pendientes antes de descargar o enviar
- [x] Descargar el PDF desde web y guardarlo en Documentos desde Android
- [x] Compartir el archivo mediante el selector nativo de Android
- [x] Descargar el PDF y abrir WhatsApp en web para adjuntarlo manualmente
- [x] Mostrar carga, confirmación y errores durante las acciones
- [ ] Validar visualmente el PDF descargado y el envío en un dispositivo Android

## Progreso del plan

- [x] Fase 1: Modelar el presupuesto y sus cálculos
- [x] Fase 2: Crear la selección del destinatario
- [x] Fase 3: Crear el agregador de materiales
- [x] Fase 4: Construir el ticket editable
- [x] Fase 5: Resolver moneda, avisos y resumen
- [x] Fase 6: Integrar la pantalla en la aplicación
- [x] Fase 7: Integrar configuración y presupuestos guardados
- [x] Fase 8: Descargar y compartir el PDF
- [ ] Fase Testing

Fecha de creación: 18 de Agosto 2026
Fecha de última actualización: 20 de Agosto 2026
Estado: EN PROCESO
