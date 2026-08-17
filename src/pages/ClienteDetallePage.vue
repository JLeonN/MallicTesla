<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { obtenerTelefonoPrincipal, type Cliente } from '@/dominio/clientes';
import { useClientesStore } from '@/stores/clientes';

const ruta = useRoute();
const router = useRouter();
const $q = useQuasar();
const clientesStore = useClientesStore();
const cliente = ref<Cliente>();
const mostrarConfirmacionEliminar = ref(false);
const telefonoPrincipal = computed(() =>
  cliente.value ? obtenerTelefonoPrincipal(cliente.value) : undefined,
);

onMounted(async () => {
  if (clientesStore.clientes.length === 0) {
    await clientesStore.cargarClientes();
  }

  cliente.value = clientesStore.obtenerClientePorId(String(ruta.params.idCliente));
});

async function eliminarCliente(): Promise<void> {
  if (cliente.value === undefined) {
    return;
  }

  try {
    await clientesStore.eliminarCliente(cliente.value.id);
    $q.notify({
      message: 'Cliente eliminado correctamente.',
      position: 'top',
      classes: 'notificacion-exito',
    });
    void router.replace('/clientes');
  } catch {
    mostrarConfirmacionEliminar.value = false;
  }
}
</script>

<template>
  <q-page class="pagina-contenido">
    <main class="contenedor-principal contenedor-detalle-cliente">
      <q-btn
        class="boton-secundario"
        flat
        no-caps
        icon="arrow_back"
        label="Volver a clientes"
        to="/clientes"
      />

      <section v-if="cliente" class="detalle-cliente">
        <header class="encabezado-detalle-cliente">
          <div>
            <p class="etiqueta-seccion">Ficha del cliente</p>
            <h1 class="titulo-pagina">{{ cliente.nombre }}</h1>
            <p class="texto-secundario">
              {{ telefonoPrincipal?.numero ?? 'Sin teléfono principal' }}
            </p>
          </div>
          <q-btn
            class="boton-accion-principal"
            unelevated
            no-caps
            icon="edit"
            label="Editar cliente"
            :to="`/clientes/${cliente.id}/editar`"
          />
        </header>

        <section class="tarjeta-detalle-cliente" aria-labelledby="titulo-telefonos-cliente">
          <p class="etiqueta-seccion">Contacto</p>
          <h2 id="titulo-telefonos-cliente" class="titulo-seccion">Teléfonos</h2>
          <div class="lista-detalle-cliente">
            <div
              v-for="telefono in cliente.telefonos"
              :key="telefono.id"
              class="fila-detalle-cliente"
            >
              <div>
                <strong>{{ telefono.numero }}</strong>
                <span>{{ telefono.etiqueta }}</span>
              </div>
              <q-badge v-if="telefono.esPrincipal" class="insignia-principal">Principal</q-badge>
            </div>
          </div>
        </section>

        <section class="tarjeta-detalle-cliente" aria-labelledby="titulo-locales-cliente">
          <p class="etiqueta-seccion">Lugar de trabajo</p>
          <h2 id="titulo-locales-cliente" class="titulo-seccion">Locales</h2>
          <div class="lista-detalle-cliente">
            <div v-for="local in cliente.locales" :key="local.id" class="fila-detalle-cliente">
              <div>
                <strong>{{ local.nombre }}</strong>
                <span>{{ local.direccion }}</span>
              </div>
              <q-icon name="place" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section v-if="cliente.correo || cliente.notas" class="tarjeta-detalle-cliente">
          <p class="etiqueta-seccion">Datos adicionales</p>
          <div v-if="cliente.correo" class="dato-adicional-cliente">
            <span>Correo electrónico</span>
            <strong>{{ cliente.correo }}</strong>
          </div>
          <div v-if="cliente.notas" class="dato-adicional-cliente">
            <span>Notas generales</span>
            <p>{{ cliente.notas }}</p>
          </div>
        </section>

        <section class="zona-peligro-cliente" aria-labelledby="titulo-eliminar-cliente">
          <div>
            <p class="etiqueta-seccion">Acción irreversible</p>
            <h2 id="titulo-eliminar-cliente" class="titulo-seccion">Eliminar cliente</h2>
            <p class="texto-secundario">
              Se eliminarán también sus {{ cliente.locales.length }} locales asociados.
            </p>
          </div>
          <q-btn
            class="boton-peligro"
            flat
            no-caps
            icon="delete_outline"
            label="Eliminar cliente"
            @click="mostrarConfirmacionEliminar = true"
          />
        </section>
      </section>

      <section v-else class="estado-vacio-clientes">
        <q-icon name="person_off" aria-hidden="true" />
        <h1 class="titulo-seccion">No encontramos este cliente</h1>
        <p class="texto-secundario">
          Puede haber sido eliminado o no estar disponible en este dispositivo.
        </p>
        <q-btn
          class="boton-accion-principal"
          unelevated
          no-caps
          label="Volver a clientes"
          to="/clientes"
        />
      </section>
    </main>
  </q-page>

  <q-dialog v-model="mostrarConfirmacionEliminar" persistent>
    <q-card class="dialogo-confirmacion">
      <q-card-section>
        <p class="etiqueta-seccion">Acción irreversible</p>
        <h2 class="titulo-seccion">¿Eliminar a {{ cliente?.nombre }}?</h2>
        <p class="texto-secundario">
          Se eliminarán el cliente y sus {{ cliente?.locales.length ?? 0 }} locales asociados.
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="boton-secundario" flat no-caps label="Cancelar" v-close-popup />
        <q-btn
          class="boton-peligro"
          flat
          no-caps
          :loading="clientesStore.guardando"
          label="Eliminar cliente"
          @click="eliminarCliente"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
