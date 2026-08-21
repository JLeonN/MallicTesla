<script setup lang="ts">
import { computed } from 'vue';
import InsigniaEstadoPresupuesto from '@/components/presupuestos/InsigniaEstadoPresupuesto.vue';
import type { EstadoPresupuesto } from '@/dominio/presupuestos';

const props = defineProps<{
  estado: EstadoPresupuesto;
  fechaCambioEstado: string | null;
  estadoEnProceso: EstadoPresupuesto | null;
}>();

const emitir = defineEmits<{
  cambiar: [estado: EstadoPresupuesto];
}>();

const fechaFormateada = computed(() => {
  if (!props.fechaCambioEstado) {
    return null;
  }

  const fecha = new Date(props.fechaCambioEstado);

  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('es-UY', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(fecha);
});

function solicitarCambio(estado: EstadoPresupuesto): void {
  if (props.estado !== estado && props.estadoEnProceso === null) {
    emitir('cambiar', estado);
  }
}
</script>

<template>
  <section class="estado-presupuesto" aria-labelledby="titulo-estado-presupuesto">
    <div class="estado-presupuesto__informacion">
      <p class="etiqueta-seccion">Seguimiento interno</p>
      <div class="estado-presupuesto__encabezado">
        <h2 id="titulo-estado-presupuesto" class="titulo-seccion">Estado del presupuesto</h2>
        <InsigniaEstadoPresupuesto :estado="estado" />
      </div>
      <p v-if="fechaFormateada" class="texto-secundario estado-presupuesto__fecha">
        Marcado el {{ fechaFormateada }}
      </p>
      <p v-else class="texto-secundario estado-presupuesto__fecha">
        Todavía no se registró una decisión del cliente.
      </p>
    </div>

    <div class="estado-presupuesto__acciones">
      <q-btn
        class="boton-estado-presupuesto boton-estado-presupuesto--aceptar"
        flat
        no-caps
        icon="check_circle"
        label="Aceptar"
        :disable="estado === 'aceptado' || estadoEnProceso !== null"
        :loading="estadoEnProceso === 'aceptado'"
        @click="solicitarCambio('aceptado')"
      />
      <q-btn
        class="boton-estado-presupuesto boton-estado-presupuesto--rechazar"
        flat
        no-caps
        icon="cancel"
        label="Rechazar"
        :disable="estado === 'rechazado' || estadoEnProceso !== null"
        :loading="estadoEnProceso === 'rechazado'"
        @click="solicitarCambio('rechazado')"
      />
      <q-btn
        v-if="estado !== 'pendiente'"
        class="boton-secundario"
        flat
        no-caps
        icon="undo"
        label="Volver a pendiente"
        :disable="estadoEnProceso !== null"
        :loading="estadoEnProceso === 'pendiente'"
        @click="solicitarCambio('pendiente')"
      />
    </div>
  </section>
</template>
