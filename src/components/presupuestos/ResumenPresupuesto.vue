<script setup lang="ts">
import { computed } from 'vue';
import { formatearImporte, MONEDAS, type Moneda } from '@/dominio/materiales';
import {
  calcularTotalMateriales,
  calcularTotalPresupuesto,
  calcularTotalManoObraYTraslado,
  lineaTieneMonedaCompatible,
  lineaTienePrecioPendiente,
  type LineaPresupuesto,
} from '@/dominio/presupuestos';

const props = defineProps<{
  lineas: LineaPresupuesto[];
  soloLectura?: boolean;
}>();

const moneda = defineModel<Moneda>('moneda', { required: true });

const totalManoObraYTraslado = computed(() =>
  calcularTotalManoObraYTraslado(props.lineas, moneda.value),
);
const totalMateriales = computed(() => calcularTotalMateriales(props.lineas, moneda.value));
const total = computed(() => calcularTotalPresupuesto(props.lineas, moneda.value));
const cantidadIncompatibles = computed(
  () => props.lineas.filter((linea) => !lineaTieneMonedaCompatible(linea, moneda.value)).length,
);
const cantidadPendientes = computed(
  () => props.lineas.filter((linea) => lineaTienePrecioPendiente(linea)).length,
);
</script>

<template>
  <footer class="resumen-presupuesto" aria-live="polite">
    <div class="resumen-presupuesto__controles">
      <div
        class="selector-moneda-presupuesto selector-moneda-precio__opciones"
        role="radiogroup"
        aria-label="Moneda del presupuesto"
      >
        <q-radio
          v-for="opcionMoneda in MONEDAS"
          :key="opcionMoneda"
          v-model="moneda"
          :val="opcionMoneda"
          :label="opcionMoneda"
          :disable="soloLectura"
        />
      </div>

      <div class="resumen-presupuesto__estado">
        <span>{{ lineas.length }} conceptos</span>
        <span v-if="cantidadPendientes">{{ cantidadPendientes }} con precio pendiente</span>
        <span v-if="cantidadIncompatibles" class="resumen-presupuesto__error">
          {{ cantidadIncompatibles }} sin sumar por moneda
        </span>
      </div>
    </div>
    <div class="resumen-presupuesto__importes">
      <div class="resumen-presupuesto__importe">
        <span>Mano de obra</span>
        <strong>{{ formatearImporte(totalManoObraYTraslado, moneda) }}</strong>
      </div>
      <div class="resumen-presupuesto__importe">
        <span>Materiales</span>
        <strong>{{ formatearImporte(totalMateriales, moneda) }}</strong>
      </div>
      <div class="resumen-presupuesto__importe resumen-presupuesto__importe--total">
        <span>Total</span>
        <strong>{{ formatearImporte(total, moneda) }}</strong>
      </div>
    </div>
  </footer>
</template>
