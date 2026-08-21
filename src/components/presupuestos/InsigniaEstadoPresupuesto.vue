<script setup lang="ts">
import { computed } from 'vue';
import type { EstadoPresupuesto } from '@/dominio/presupuestos';

const props = defineProps<{
  estado: EstadoPresupuesto;
}>();

const etiqueta = computed(() => {
  const etiquetas: Record<EstadoPresupuesto, string> = {
    pendiente: 'Pendiente',
    aceptado: 'Aceptado',
    rechazado: 'Rechazado',
  };

  return etiquetas[props.estado];
});
</script>

<template>
  <span class="insignia-estado-presupuesto" :class="`insignia-estado-presupuesto--${estado}`">
    {{ etiqueta }}
  </span>
</template>
