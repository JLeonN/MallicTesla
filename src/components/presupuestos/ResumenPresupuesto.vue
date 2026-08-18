<script setup lang="ts">
import { computed } from 'vue';
import { formatearImporte, type Moneda } from '@/dominio/materiales';
import {
  calcularTotalPresupuesto,
  lineaTieneMonedaCompatible,
  lineaTienePrecioPendiente,
  type LineaPresupuesto,
} from '@/dominio/presupuestos';

const props = defineProps<{
  lineas: LineaPresupuesto[];
  moneda: Moneda;
}>();

const total = computed(() => calcularTotalPresupuesto(props.lineas, props.moneda));
const cantidadIncompatibles = computed(
  () => props.lineas.filter((linea) => !lineaTieneMonedaCompatible(linea, props.moneda)).length,
);
const cantidadPendientes = computed(
  () => props.lineas.filter((linea) => lineaTienePrecioPendiente(linea)).length,
);
</script>

<template>
  <footer class="resumen-presupuesto" aria-live="polite">
    <div class="resumen-presupuesto__estado">
      <span>{{ lineas.length }} conceptos</span>
      <span v-if="cantidadPendientes">{{ cantidadPendientes }} con precio pendiente</span>
      <span v-if="cantidadIncompatibles" class="resumen-presupuesto__error">
        {{ cantidadIncompatibles }} sin sumar por moneda
      </span>
    </div>
    <div class="resumen-presupuesto__total">
      <span>Total</span>
      <strong>{{ formatearImporte(total, moneda) }}</strong>
    </div>
  </footer>
</template>
