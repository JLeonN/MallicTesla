# PLAN DE CREACIÓN Y CÁLCULO DE PRESUPUESTOS

## Descripción del plan

Implementar el formulario responsive para crear y calcular presupuestos desde SPA y Android. El flujo permitirá elegir un cliente guardado o ingresar un potencial cliente, agregar materiales guardados o escritos manualmente y editar todos los conceptos dentro de una lista compacta con apariencia de ticket.

Este plan cubre la composición y el cálculo del presupuesto. No incluye historial, PDF, envío por WhatsApp, conversión automática de monedas ni la futura configuración de valores predeterminados para mano de obra y nafta.

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

- [ ] Crear el dominio de presupuestos con tipos para destinatario, moneda, concepto y línea del ticket
- [ ] Definir los tipos de concepto `material`, `manoObra` y `nafta` sin darles diferencias visuales en el ticket
- [ ] Definir el origen de una línea como material guardado o concepto escrito manualmente
- [ ] Definir `UYU` como moneda inicial y permitir cambiar todo el presupuesto a `USD`
- [ ] Implementar funciones puras para calcular el subtotal de cada línea y el total del presupuesto
- [ ] Evitar sumar al total líneas cuya moneda sea distinta de la moneda del presupuesto
- [ ] Implementar una validación que identifique claramente las líneas con moneda incompatible
- [ ] Reutilizar las unidades, monedas y funciones de formato existentes en `src/dominio/materiales.ts` sin duplicar lógica

## FASE 2: Crear la selección del destinatario

### Objetivo

Permitir trabajar con un potencial cliente por defecto o reutilizar un cliente existente sin modificar ni crear registros del catálogo.

- [ ] Crear un selector entre `Potencial cliente` y `Cliente guardado`
- [ ] Seleccionar `Potencial cliente` al abrir un presupuesto nuevo
- [ ] Mostrar para el potencial cliente un único campo destinado al nombre, comercio o referencia que Pablo decida escribir
- [ ] Mostrar un campo de teléfono opcional
- [ ] Cargar los clientes mediante `useClientesStore` cuando se elija `Cliente guardado`
- [ ] Permitir buscar y seleccionar un cliente existente reutilizando la búsqueda actual
- [ ] Completar el campo único con el nombre del cliente seleccionado y el teléfono con su número principal disponible
- [ ] Asegurar que cualquier edición realizada en estos campos permanezca dentro del formulario y no actualice el cliente guardado
- [ ] No exigir teléfono para completar el presupuesto

## FASE 3: Crear el agregador de materiales

### Objetivo

Agregar rápidamente materiales del catálogo o conceptos manuales y convertirlos en líneas editables del presupuesto.

- [ ] Crear un buscador con autocompletado sobre los materiales de `useMaterialesStore`
- [ ] Permitir seleccionar un material existente y agregarlo al ticket
- [ ] Usar automáticamente el precio que el material tenga marcado como predeterminado
- [ ] Copiar al estado editable del formulario el nombre, unidad, moneda y precio seleccionado sin modificar el material original
- [ ] Permitir escribir un nombre inexistente y agregarlo únicamente al presupuesto
- [ ] Inicializar un material manual con cantidad `1`, unidad `Unidad` y precio vacío
- [ ] No mostrar ninguna opción para guardar el material manual en el catálogo
- [ ] Limpiar y devolver el foco al buscador después de agregar una línea para agilizar la carga consecutiva
- [ ] Evitar agregar una línea vacía o sin nombre

## FASE 4: Construir el ticket editable

### Objetivo

Presentar todos los conceptos en una lista compacta donde Pablo pueda revisar y corregir el presupuesto sin abandonar la pantalla.

- [ ] Inicializar el ticket con `Mano de obra` y `Nafta` como sus dos primeras filas
- [ ] Inicializar los importes de mano de obra y nafta en cero
- [ ] Tratar mano de obra y nafta visualmente como cualquier otra línea, sin tarjetas ni destacados especiales
- [ ] Mantener mano de obra y nafta por encima de los materiales mientras existan
- [ ] Permitir eliminar mano de obra y nafta
- [ ] Mostrar en cada material su nombre, cantidad, unidad, precio unitario y subtotal
- [ ] Mostrar mano de obra y nafta como importes únicos, sin controles de cantidad ni unidad
- [ ] Permitir editar el nombre, la cantidad, la unidad y el precio de un material desde el propio ticket
- [ ] Permitir sustituir el contenido de una línea por otro material sin afectar el catálogo
- [ ] Permitir eliminar cualquier material del ticket
- [ ] Recalcular inmediatamente el subtotal y el total después de cada cambio
- [ ] Diseñar la edición para que sea cómoda tanto con teclado en escritorio como de forma táctil en Android

## FASE 5: Resolver moneda, avisos y resumen

### Objetivo

Impedir totales engañosos y mostrar claramente el resultado actual del presupuesto.

- [ ] Agregar un selector de moneda general con `UYU` seleccionado por defecto
- [ ] Permitir cambiar la moneda general a `USD` sin convertir automáticamente los importes existentes
- [ ] Comparar la moneda de cada línea con la moneda general del presupuesto
- [ ] Marcar en rojo cualquier línea cuya moneda sea diferente
- [ ] Mostrar junto a la línea incompatible un mensaje corto que indique que debe editarse antes de incluirla en el total
- [ ] Mantener visible el subtotal de la línea incompatible en su moneda original
- [ ] Excluir del total general las líneas incompatibles y explicar visualmente por qué no fueron sumadas
- [ ] Mostrar al final del ticket el total válido con la moneda general del presupuesto
- [ ] Mostrar estados claros cuando todavía no existan materiales o haya precios pendientes
- [ ] Usar `--color-error` y las demás variables existentes para avisos y estados visuales

## FASE 6: Integrar la pantalla en la aplicación

### Objetivo

Reemplazar la pantalla pendiente de nuevo presupuesto y mantener la integración coherente con la navegación actual.

- [ ] Crear componentes pequeños para selección de destinatario, agregador, fila editable y resumen del ticket
- [ ] Crear la página de nuevo presupuesto y conectar sus componentes mediante props y eventos tipados
- [ ] Sustituir `PaginaModuloPendiente.vue` en la ruta `/presupuestos/nuevo`
- [ ] Mantener funcionando los accesos existentes desde inicio, menú de escritorio y navegación móvil
- [ ] Reutilizar clases globales de botones, encabezados, formularios, avisos y contenedores cuando correspondan
- [ ] Agregar solamente las variables visuales nuevas que sean necesarias en `src/css/Variables.css`
- [ ] Crear estilos específicos del presupuesto sin repetir colores, espaciados, radios, sombras ni tamaños reutilizables
- [ ] Mantener fuera de esta fase cualquier guardado histórico, exportación o envío

## FASE TESTING

### Objetivo

Validar el flujo completo de creación y cálculo en escritorio y móvil sin alterar los datos existentes.

- [ ] Abrir un presupuesto nuevo y verificar que `Potencial cliente`, `UYU`, mano de obra en cero y nafta en cero sean los valores iniciales
- [ ] Completar solamente el campo de nombre y verificar que el teléfono pueda quedar vacío
- [ ] Elegir un cliente guardado y comprobar que se carguen su nombre y teléfono principal sin modificar el registro original
- [ ] Agregar un material guardado y comprobar que utilice su precio predeterminado
- [ ] Editar el precio de una línea y verificar que el precio del catálogo no cambie
- [ ] Agregar un material inexistente y comprobar que comience con cantidad `1`, unidad `Unidad` y precio vacío
- [ ] Verificar que el material manual no se guarde en el catálogo
- [ ] Editar nombre, cantidad, unidad y precio desde el ticket y comprobar subtotal y total
- [ ] Eliminar materiales, mano de obra y nafta y comprobar que el total se actualice
- [ ] Agregar una línea en USD a un presupuesto UYU y verificar el marcado rojo, el mensaje y su exclusión del total
- [ ] Cambiar la moneda general a USD y verificar nuevamente la detección de líneas incompatibles
- [ ] Probar precios vacíos, cero, decimales y cantidades decimales sin producir `NaN` ni totales incorrectos
- [ ] Verificar navegación, foco, controles táctiles, textos visibles y ausencia de desbordes en anchos de móvil y escritorio
- [ ] Ejecutar `npm run lint:check`
- [ ] Ejecutar `npm run typecheck`
- [ ] Ejecutar `npm run build`

## Progreso del plan

- [ ] Fase 1: Modelar el presupuesto y sus cálculos
- [ ] Fase 2: Crear la selección del destinatario
- [ ] Fase 3: Crear el agregador de materiales
- [ ] Fase 4: Construir el ticket editable
- [ ] Fase 5: Resolver moneda, avisos y resumen
- [ ] Fase 6: Integrar la pantalla en la aplicación
- [ ] Fase Testing

Fecha de creación: 18 de Agosto 2026
Fecha de última actualización: 18 de Agosto 2026
Estado: BORRADOR
