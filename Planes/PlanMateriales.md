# PLAN DEL CATÁLOGO DE MATERIALES

## Descripción del plan

Implementar el apartado de materiales con una lista responsive, búsqueda, ordenamiento, alta, detalle, edición y eliminación. Cada material podrá tener uno o más precios, uno de ellos marcado como predeterminado, con moneda, comercio y presentación. Las presentaciones guardarán además un precio obligatorio para cantidades parciales. El módulo reutilizará los patrones visuales y técnicos ya establecidos en clientes sin mezclar ambos dominios.

## Objetivo principal

- Registrar materiales y sus precios de referencia en pesos uruguayos o dólares.
- Consultar rápidamente el nombre, el comercio y el precio predeterminado de cada material.
- Calcular el costo aproximado por unidad de medida cuando la compra sea por caja, paquete, rollo, bolsa, bobina u otra presentación.
- Mantener una experiencia responsive consistente con el apartado de clientes.

## Reglas del plan

- Usar Vue 3, TypeScript estricto, Pinia, Composition API con `<script setup>` y componentes Quasar existentes.
- Mantener el dominio, store y repositorio de materiales separados de los correspondientes a clientes.
- Reutilizar o extraer el buscador y los estilos de lista/formulario de clientes cuando resulte claro y no genere acoplamiento entre dominios.
- Centralizar cualquier nueva decisión visual reutilizable en `src/css/Variables.css`.
- No instalar dependencias nuevas.
- No implementar historial de precios ni funciones del futuro apartado de historial.
- Guardar fechas de creación y modificación internamente, sin mostrarlas todavía en la interfaz.
- No incluir márgenes de ganancia ni implementar todavía la lógica de presupuestos.
- Guardar el precio para cantidades parciales como dato obligatorio de las presentaciones para utilizarlo posteriormente en presupuestos.

## FASE 1: Modelar materiales y precios

### Objetivo

Definir un modelo tipado que represente materiales, precios directos y compras por presentación.

- [x] Crear los tipos de dominio para material, precio de material, moneda, unidad de medida y presentación.
- [x] Limitar las monedas disponibles a `UYU` y `USD`.
- [x] Incluir las unidades de medida acordadas: unidad, metro, kilogramo, litro, rollo y otro.
- [x] Incluir las presentaciones acordadas: caja, paquete, rollo, bolsa, bobina y otro.
- [x] Permitir precios directos por unidad de medida y precios totales por presentación.
- [x] Para precios por presentación, guardar cantidad contenida, unidad de medida y precio total.
- [x] Calcular el costo aproximado por unidad de medida dividiendo el precio total entre la cantidad contenida y mostrarlo con dos decimales.
- [x] Guardar un precio obligatorio por unidad de medida para presupuestar cantidades menores a una presentación completa.
- [x] Permitir que un precio por presentación elija si su valor visible será el total de la presentación o el precio para cantidad parcial por unidad de medida.
- [x] Permitir uno o más precios por material y guardar el identificador de un único precio predeterminado.
- [x] Asignar automáticamente como predeterminado el primer precio agregado.
- [x] Impedir que un material guardado quede sin precios o sin un precio predeterminado válido.
- [x] Reasignar el precio predeterminado al eliminar el que estaba seleccionado, siempre que exista otro precio.
- [x] Guardar en cada precio el comercio como texto libre y las fechas internas de creación y modificación.
- [x] Guardar en cada material las fechas internas de creación y modificación.
- [x] Crear funciones puras para normalizar datos, validar cantidades y obtener el texto del precio visible.

## FASE 2: Implementar persistencia y estado

### Objetivo

Guardar y administrar materiales siguiendo la arquitectura local ya utilizada por clientes.

- [x] Crear el contrato de repositorio de materiales.
- [x] Implementar almacenamiento local para navegador y Capacitor mediante los adaptadores existentes cuando sean reutilizables.
- [x] Crear la fábrica del repositorio de materiales para seleccionar el almacenamiento correspondiente a la plataforma.
- [x] Crear un store Pinia para cargar, agregar, editar, eliminar y obtener materiales por identificador.
- [x] Implementar búsqueda por nombre del material y comercio de cualquiera de sus precios.
- [x] Implementar ordenamiento ascendente y descendente por nombre.
- [x] Implementar ordenamiento ascendente y descendente por comercio usando el precio predeterminado.
- [x] Implementar ordenamiento ascendente y descendente por el valor visible del precio predeterminado, agrupando primero por moneda para no mezclar importes UYU y USD.
- [x] Mantener estados de carga, guardado y error consistentes con el store de clientes.
- [x] Actualizar el precio existente al editarlo sin crear ni conservar versiones históricas.

## FASE 3: Crear la lista de materiales

### Objetivo

Construir una pantalla de consulta rápida y responsive basada en el patrón visual de clientes.

- [x] Extraer o adaptar el buscador de clientes como componente compartido para listados.
- [x] Agregar búsqueda con limpieza y debounce por nombre del material o comercio.
- [x] Agregar controles para ordenar por nombre, precio y local, indicando visualmente el criterio y la dirección activos.
- [x] Crear una tabla de escritorio con exactamente cuatro elementos por fila: nombre, local, precio predeterminado y botón `Ver material`.
- [x] Mostrar en el precio únicamente el valor visible elegido por el usuario, con moneda y unidad o presentación correspondiente.
- [x] Crear la variante móvil en tarjetas conservando los mismos cuatro elementos y sin información adicional.
- [x] Agregar botón `Agregar material nuevo`.
- [x] Implementar estados de carga, error, lista vacía y búsqueda sin resultados.
- [x] Mantener textos, accesibilidad y estética consistentes con la lista de clientes.

## FASE 4: Crear el formulario de materiales

### Objetivo

Permitir crear y editar un material junto con una cantidad dinámica de precios.

- [x] Crear `FormularioMaterial.vue` reutilizando la estética y las clases compartidas del formulario de clientes.
- [x] Agregar el campo obligatorio `Nombre del material`.
- [x] Crear un bloque repetible de precios con botón para agregar otro precio.
- [x] Permitir eliminar bloques de precio, sin permitir eliminar el único precio restante.
- [x] Agregar en cada precio el comercio de compra como texto libre.
- [x] Agregar en cada precio el selector de moneda limitado a UYU o USD.
- [x] Agregar en cada precio la elección entre precio directo por unidad de medida o precio por presentación.
- [x] Para el precio directo, solicitar importe y unidad de medida.
- [x] Para el precio por presentación, solicitar presentación, precio total, cantidad contenida y unidad de medida del contenido.
- [x] Mostrar en tiempo real el costo aproximado calculado por unidad de medida cuando los datos sean válidos.
- [x] Solicitar obligatoriamente el precio para cantidades parciales en compras por presentación.
- [x] Agregar en precios por presentación un selector dinámico para mostrar como valor visible el total o el precio parcial por la unidad de medida elegida.
- [x] Agregar un control equivalente al teléfono principal de clientes para marcar un único precio como predeterminado.
- [x] Ocultar las fechas automáticas en el formulario.
- [x] Validar nombre, comercio, moneda, importes positivos, cantidad contenida positiva y selecciones requeridas.
- [x] Mantener acciones de guardar y cancelar consistentes con clientes.

## FASE 5: Crear detalle, edición y eliminación

### Objetivo

Ofrecer una ficha completa del material con las mismas operaciones principales disponibles para clientes.

- [x] Crear la página de detalle del material.
- [x] Mostrar nombre y todos los precios actuales del material.
- [x] Identificar claramente cuál es el precio predeterminado.
- [x] Mostrar en cada precio el comercio, moneda, modalidad, importe y cálculo aproximado cuando corresponda.
- [x] Mostrar el precio configurado para cantidades parciales cuando corresponda.
- [x] Agregar la acción para editar el material usando el mismo formulario.
- [x] Agregar la acción para eliminar el material mediante un diálogo de confirmación.
- [x] Redirigir correctamente a la lista después de guardar o eliminar.
- [x] Resolver de forma segura el acceso a un identificador inexistente.
- [x] No mostrar fechas ni información histórica.

## FASE 6: Integrar navegación y diseño responsive

### Objetivo

Conectar el módulo al resto de la aplicación y asegurar una experiencia coherente en SPA y Android.

- [x] Registrar las rutas para lista, alta, detalle y edición de materiales.
- [x] Incorporar el acceso a materiales en la navegación existente sin alterar el identificador Android.
- [x] Reutilizar estilos globales actuales y agregar únicamente variables visuales semánticas necesarias.
- [x] Verificar que tabla, tarjetas, formulario, diálogos y controles funcionen con teclado y lectores de pantalla.
- [ ] Verificar la adaptación visual en escritorio y tamaños móviles utilizados por Capacitor.

## FASE TESTING

### Objetivo

Validar de forma ejecutable por IA y revisable por humano el flujo completo del catálogo de materiales.

- [x] Ejecutar lint, comprobación de TypeScript y build de la SPA sin errores.
- [ ] Crear un material con un único precio directo y verificar que quede predeterminado automáticamente.
- [ ] Crear un material con cinco precios, distintas monedas y distintos comercios.
- [ ] Cambiar el precio predeterminado y verificar que la tabla actualice local y precio.
- [ ] Registrar una compra por rollo con precio total y cantidad de metros, y comprobar el cálculo aproximado con dos decimales.
- [ ] Confirmar que una presentación no pueda guardarse sin un precio válido para cantidades parciales.
- [ ] Alternar el valor visible entre precio total y precio parcial por unidad de medida, y verificar el resultado en la tabla.
- [ ] Verificar las presentaciones caja, paquete, rollo, bolsa, bobina y otro.
- [ ] Verificar las unidades unidad, metro, kilogramo, litro, rollo y otro.
- [ ] Intentar guardar importes o cantidades inválidas y comprobar los mensajes de validación.
- [ ] Eliminar el precio predeterminado y verificar la reasignación automática.
- [ ] Confirmar que no sea posible guardar un material sin precios.
- [ ] Buscar por nombre y comercio, limpiar la búsqueda y comprobar los estados sin resultados.
- [ ] Probar orden ascendente y descendente por nombre, local y precio.
- [ ] Confirmar que el orden por precio agrupe UYU y USD sin comparar ambas monedas entre sí.
- [ ] Editar un precio y comprobar que se actualice sin generar historial visible ni persistido.
- [ ] Editar y eliminar un material desde su ficha, incluyendo cancelación del diálogo de eliminación.
- [ ] Recargar la SPA y verificar que los datos persistan.
- [ ] Revisar manualmente la interfaz en escritorio y móvil, confirmando que la lista conserve solo nombre, local, precio y acción.

## Progreso del plan

- [x] Fase 1: Modelar materiales y precios
- [x] Fase 2: Implementar persistencia y estado
- [x] Fase 3: Crear la lista de materiales
- [x] Fase 4: Crear el formulario de materiales
- [x] Fase 5: Crear detalle, edición y eliminación
- [ ] Fase 6: Integrar navegación y diseño responsive
- [ ] Fase Testing

Fecha de creación: 17 de Agosto 2026
Fecha de última actualización: 18 de Agosto 2026
Estado: EN PROCESO
