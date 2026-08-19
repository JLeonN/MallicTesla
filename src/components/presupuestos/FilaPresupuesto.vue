<script setup lang="ts">
import { computed } from 'vue';
import { formatearImporte, UNIDADES_MEDIDA, type Moneda } from '@/dominio/materiales';
import {
  calcularSubtotalLinea,
  lineaTieneMonedaCompatible,
  type LineaPresupuesto,
} from '@/dominio/presupuestos';

const props = defineProps<{
  monedaPresupuesto: Moneda;
}>();

const linea = defineModel<LineaPresupuesto>({ required: true });

const emitir = defineEmits<{
  eliminar: [];
}>();

const esMaterial = computed(() => linea.value.tipo === 'material');
const monedaCompatible = computed(() =>
  lineaTieneMonedaCompatible(linea.value, props.monedaPresupuesto),
);
const subtotal = computed(() => calcularSubtotalLinea(linea.value));
const etiquetaCantidad = computed(() => (linea.value.tipo === 'nafta' ? 'Kilómetros' : 'Cantidad'));
const etiquetaPrecio = computed(() => {
  if (linea.value.tipo === 'nafta') {
    return 'Precio por km';
  }

  return 'Precio unitario';
});
const opcionesUnidad = computed(() => {
  if (linea.value.origen === 'catalogo') {
    return linea.value.opcionesUnidad.map((opcion) => opcion.unidad);
  }

  return [...UNIDADES_MEDIDA];
});
const mostrarSelectorUnidad = computed(
  () =>
    esMaterial.value &&
    (linea.value.origen !== 'catalogo' || linea.value.opcionesUnidad.length > 1),
);
function actualizarPrecioPorUnidad(unidad: string): void {
  const opcion = linea.value.opcionesUnidad.find((actual) => actual.unidad === unidad);
  if (opcion !== undefined) {
    linea.value.precioUnitario = opcion.precioUnitario;
  }
}

function seleccionarContenidoNumerico(evento: Event): void {
  if (evento.target instanceof HTMLInputElement) {
    evento.target.select();
  }
}
</script>

<template>
  <article
    class="fila-presupuesto"
    :class="{ 'fila-presupuesto--moneda-incompatible': !monedaCompatible }"
  >
    <div
      class="fila-presupuesto__principal"
      :class="{ 'fila-presupuesto__principal--importe-unico': !esMaterial }"
    >
      <q-input v-model="linea.nombre" dark outlined dense label="Concepto" />

      <q-input
        v-model.number="linea.cantidad"
        dark
        outlined
        dense
        type="number"
        min="0"
        step="0.01"
        :label="etiquetaCantidad"
        @focus="seleccionarContenidoNumerico"
      />

      <template v-if="esMaterial">
        <q-select
          v-if="mostrarSelectorUnidad && linea.origen === 'catalogo'"
          v-model="linea.unidad"
          dark
          outlined
          dense
          label="Unidad"
          :options="opcionesUnidad"
          @update:model-value="actualizarPrecioPorUnidad"
        />
        <q-select
          v-else-if="mostrarSelectorUnidad"
          v-model="linea.unidad"
          dark
          outlined
          dense
          use-input
          new-value-mode="add-unique"
          label="Unidad"
          :options="opcionesUnidad"
        />
        <div v-else class="fila-presupuesto__unidad-fija">
          <strong>{{ linea.unidad }}</strong>
        </div>
      </template>

      <q-input
        v-model.number="linea.precioUnitario"
        dark
        outlined
        dense
        type="number"
        min="0"
        step="0.01"
        :label="etiquetaPrecio"
        @focus="seleccionarContenidoNumerico"
      />

      <div class="fila-presupuesto__subtotal">
        <span>Subtotal</span>
        <strong>{{ formatearImporte(subtotal, linea.moneda) }}</strong>
      </div>

      <q-btn
        class="boton-icono-secundario fila-presupuesto__eliminar"
        flat
        round
        dense
        icon="delete_outline"
        :aria-label="`Eliminar ${linea.nombre}`"
        @click="emitir('eliminar')"
      />
    </div>

    <p v-if="!monedaCompatible" class="fila-presupuesto__aviso" role="alert">
      Esta línea está en {{ linea.moneda }} y no se incluye en el total {{ monedaPresupuesto }}.
      Elegí la misma moneda en el resumen o eliminá el material.
    </p>
  </article>
</template>
