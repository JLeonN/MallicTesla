<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import {
  calcularCostoUnitario,
  formatearImporte,
  formatearPrecioVisible,
  obtenerPresentacion,
  obtenerUnidadMedida,
  type Material,
  type PrecioMaterial,
} from '@/dominio/materiales';
import { useMaterialesStore } from '@/stores/materiales';

const ruta = useRoute();
const router = useRouter();
const $q = useQuasar();
const materialesStore = useMaterialesStore();
const material = ref<Material>();
const cargandoMaterial = ref(true);
const mostrarConfirmacionEliminar = ref(false);
const precios = computed(() => material.value?.precios ?? []);

onMounted(async () => {
  try {
    if (materialesStore.materiales.length === 0) {
      await materialesStore.cargarMateriales();
    }
    material.value = materialesStore.obtenerMaterialPorId(String(ruta.params.idMaterial));
  } finally {
    cargandoMaterial.value = false;
  }
});

function descripcionPrecio(precio: PrecioMaterial): string {
  if (precio.modalidad === 'directo') {
    return `Precio directo por ${obtenerUnidadMedida(precio).toLocaleLowerCase('es')}`;
  }

  return `${obtenerPresentacion(precio)} de ${precio.cantidadContenido ?? 0} ${obtenerUnidadMedida(precio).toLocaleLowerCase('es')}`;
}

function costoCalculado(precio: PrecioMaterial): string | null {
  const costo = calcularCostoUnitario(precio);
  return costo === null
    ? null
    : `${formatearImporte(costo, precio.moneda)} por ${obtenerUnidadMedida(precio).toLocaleLowerCase('es')}`;
}

async function eliminarMaterial(): Promise<void> {
  if (material.value === undefined) {
    return;
  }

  try {
    await materialesStore.eliminarMaterial(material.value.id);
    $q.notify({
      message: 'Material eliminado correctamente.',
      position: 'top',
      classes: 'notificacion-exito',
    });
    void router.replace('/materiales');
  } catch {
    mostrarConfirmacionEliminar.value = false;
  }
}
</script>

<template>
  <q-page class="pagina-contenido">
    <main class="contenedor-principal contenedor-detalle-material">
      <q-btn
        class="boton-secundario"
        flat
        no-caps
        icon="arrow_back"
        label="Volver a materiales"
        to="/materiales"
      />

      <div v-if="cargandoMaterial" class="estado-materiales">
        <q-spinner class="indicador-carga" size="2rem" />
        <span>Cargando material…</span>
      </div>

      <section v-else-if="material" class="detalle-material">
        <header class="encabezado-detalle-material">
          <div>
            <p class="etiqueta-seccion">Ficha del material</p>
            <h1 class="titulo-pagina">{{ material.nombre }}</h1>
            <p class="texto-secundario">{{ precios.length }} precios registrados</p>
          </div>
          <q-btn
            class="boton-accion-principal"
            unelevated
            no-caps
            icon="edit"
            label="Editar material"
            :to="`/materiales/${material.id}/editar`"
          />
        </header>

        <div class="detalle-material__contenedor">
          <section class="tarjeta-detalle-material" aria-labelledby="titulo-precios-detalle">
            <p class="etiqueta-seccion">Costos de compra</p>
            <h2 id="titulo-precios-detalle" class="titulo-seccion">Precios</h2>
            <div class="lista-detalle-material">
              <article v-for="precio in precios" :key="precio.id" class="fila-detalle-material">
                <div class="fila-detalle-material__contenido">
                  <div class="fila-detalle-material__titulo">
                    <strong>{{ precio.comercio }}</strong>
                    <q-badge
                      v-if="precio.id === material.idPrecioPredeterminado"
                      class="insignia-principal"
                    >
                      Predeterminado
                    </q-badge>
                  </div>
                  <span>{{ descripcionPrecio(precio) }}</span>
                  <strong>{{ formatearPrecioVisible(precio) }}</strong>
                  <span v-if="costoCalculado(precio)">
                    Costo aproximado: {{ costoCalculado(precio) }}
                  </span>
                </div>
                <q-icon name="payments" aria-hidden="true" />
              </article>
            </div>
          </section>

          <section class="zona-peligro-material" aria-labelledby="titulo-eliminar-material">
            <div>
              <p class="etiqueta-seccion">Acción irreversible</p>
              <h2 id="titulo-eliminar-material" class="titulo-seccion">Eliminar material</h2>
              <p class="texto-secundario">Se eliminarán también todos sus precios actuales.</p>
            </div>
            <q-btn
              class="boton-peligro"
              flat
              no-caps
              icon="delete_outline"
              label="Eliminar material"
              @click="mostrarConfirmacionEliminar = true"
            />
          </section>
        </div>
      </section>

      <section v-else class="estado-vacio-materiales">
        <q-icon name="inventory_2" aria-hidden="true" />
        <h1 class="titulo-seccion">No encontramos este material</h1>
        <p class="texto-secundario">
          Puede haber sido eliminado o no estar disponible en este dispositivo.
        </p>
        <q-btn
          class="boton-accion-principal"
          unelevated
          no-caps
          label="Volver a materiales"
          to="/materiales"
        />
      </section>
    </main>
  </q-page>

  <q-dialog v-model="mostrarConfirmacionEliminar" persistent>
    <q-card class="dialogo-confirmacion">
      <q-card-section>
        <p class="etiqueta-seccion">Acción irreversible</p>
        <h2 class="titulo-seccion">¿Eliminar {{ material?.nombre }}?</h2>
        <p class="texto-secundario">
          Se eliminarán el material y sus {{ precios.length }} precios actuales.
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="boton-secundario" flat no-caps label="Cancelar" v-close-popup />
        <q-btn
          class="boton-peligro"
          flat
          no-caps
          :loading="materialesStore.guardando"
          label="Eliminar material"
          @click="eliminarMaterial"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
