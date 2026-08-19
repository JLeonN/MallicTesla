<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AgregadorMaterialPresupuesto from '@/components/presupuestos/AgregadorMaterialPresupuesto.vue';
import FilaPresupuesto from '@/components/presupuestos/FilaPresupuesto.vue';
import ResumenPresupuesto from '@/components/presupuestos/ResumenPresupuesto.vue';
import SelectorDestinatarioPresupuesto from '@/components/presupuestos/SelectorDestinatarioPresupuesto.vue';
import type { Material, Moneda } from '@/dominio/materiales';
import {
  crearLineaDesdeMaterial,
  crearLineaMaterialManual,
  crearLineasInicialesPresupuesto,
  type LineaPresupuesto,
  type TipoDestinatario,
} from '@/dominio/presupuestos';
import { useClientesStore } from '@/stores/clientes';
import { useMaterialesStore } from '@/stores/materiales';

const clientesStore = useClientesStore();
const materialesStore = useMaterialesStore();

const tipoDestinatario = ref<TipoDestinatario>('potencial');
const idCliente = ref<string | null>(null);
const nombreDestinatario = ref('');
const telefonoDestinatario = ref('');
const monedaPresupuesto = ref<Moneda>('UYU');
const lineas = ref<LineaPresupuesto[]>(crearLineasInicialesPresupuesto());

const tieneErroresCarga = computed(() => clientesStore.error || materialesStore.error);

onMounted(() => {
  void cargarCatalogos();
});

async function cargarCatalogos(): Promise<void> {
  await Promise.all([clientesStore.cargarClientes(), materialesStore.cargarMateriales()]);
}

function agregarMaterial(material: Material): void {
  lineas.value.push(crearLineaDesdeMaterial(material));
}

function agregarMaterialManual(nombre: string): void {
  lineas.value.push(crearLineaMaterialManual(nombre, monedaPresupuesto.value));
}

function eliminarLinea(idLinea: string): void {
  lineas.value = lineas.value.filter((linea) => linea.id !== idLinea);
}

function reemplazarLinea(indice: number, material: Material): void {
  const lineaActual = lineas.value[indice];
  if (lineaActual === undefined) {
    return;
  }

  lineas.value.splice(indice, 1, {
    ...crearLineaDesdeMaterial(material),
    id: lineaActual.id,
  });
}
</script>

<template>
  <q-page class="pagina-contenido">
    <main class="contenedor-principal nuevo-presupuesto">
      <header class="encabezado-nuevo-presupuesto">
        <div>
          <p class="etiqueta-seccion">Presupuestos</p>
          <h1 class="titulo-pagina">Nuevo presupuesto</h1>
          <p class="texto-secundario encabezado-nuevo-presupuesto__descripcion">
            Agregá los conceptos, ajustá sus importes y revisá el total en el mismo ticket.
          </p>
        </div>
      </header>

      <q-banner v-if="tieneErroresCarga" class="aviso-error" rounded>
        <template #avatar><q-icon name="error_outline" /></template>
        {{ tieneErroresCarga }}
      </q-banner>

      <div class="nuevo-presupuesto__contenido">
        <SelectorDestinatarioPresupuesto
          v-model:tipo="tipoDestinatario"
          v-model:id-cliente="idCliente"
          v-model:nombre="nombreDestinatario"
          v-model:telefono="telefonoDestinatario"
          :clientes="clientesStore.clientesOrdenados"
          :cargando="clientesStore.cargando"
        />

        <AgregadorMaterialPresupuesto
          :materiales="materialesStore.materiales"
          :cargando="materialesStore.cargando"
          @agregar-material="agregarMaterial"
          @agregar-manual="agregarMaterialManual"
        />

        <section class="ticket-presupuesto" aria-labelledby="titulo-ticket-presupuesto">
          <div class="ticket-presupuesto__encabezado">
            <div>
              <p class="etiqueta-seccion">Detalle editable</p>
              <h2 id="titulo-ticket-presupuesto" class="titulo-seccion">Ticket</h2>
            </div>
          </div>

          <div v-if="lineas.length" class="ticket-presupuesto__lineas">
            <FilaPresupuesto
              v-for="(linea, indice) in lineas"
              :key="linea.id"
              v-model="lineas[indice]!"
              :moneda-presupuesto="monedaPresupuesto"
              :materiales="materialesStore.materiales"
              @eliminar="eliminarLinea(linea.id)"
              @reemplazar="reemplazarLinea(indice, $event)"
            />
          </div>

          <div v-else class="ticket-presupuesto__vacio">
            <q-icon name="receipt_long" aria-hidden="true" />
            <strong>El ticket está vacío</strong>
            <span>Agregá un material para continuar calculando.</span>
          </div>

          <ResumenPresupuesto v-model:moneda="monedaPresupuesto" :lineas="lineas" />
        </section>
      </div>
    </main>
  </q-page>
</template>
