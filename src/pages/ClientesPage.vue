<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { obtenerTelefonoPrincipal } from '@/dominio/clientes';
import { useClientesStore } from '@/stores/clientes';

const clientesStore = useClientesStore();
const terminoBusqueda = ref('');
const clientesFiltrados = computed(() => clientesStore.buscarClientes(terminoBusqueda.value));

onMounted(() => {
  void clientesStore.cargarClientes();
});

function textoLocales(cantidadLocales: number): string {
  return cantidadLocales === 1 ? '1 local' : `${cantidadLocales} locales`;
}
</script>

<template>
  <q-page class="pagina-contenido">
    <main class="contenedor-principal modulo-clientes">
      <header class="encabezado-modulo-clientes">
        <div>
          <p class="etiqueta-seccion">Organización</p>
          <h1 class="titulo-pagina">Clientes</h1>
          <p class="texto-secundario encabezado-modulo-clientes__descripcion">
            Consultá los datos de cada cliente y los lugares donde trabajás.
          </p>
        </div>
        <q-btn
          class="boton-accion-principal"
          unelevated
          no-caps
          icon="person_add"
          label="Agregar cliente nuevo"
          to="/clientes/nuevo"
        />
      </header>

      <q-input
        v-model="terminoBusqueda"
        class="buscador-clientes"
        dark
        outlined
        clearable
        debounce="150"
        label="Buscar por cliente, local o teléfono"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>

      <q-banner v-if="clientesStore.error" class="aviso-error" rounded>
        <template #avatar><q-icon name="error_outline" /></template>
        {{ clientesStore.error }}
      </q-banner>

      <div v-if="clientesStore.cargando" class="estado-clientes">
        <q-spinner class="indicador-carga" size="2rem" />
        <span>Cargando clientes…</span>
      </div>

      <section
        v-else-if="clientesFiltrados.length"
        class="lista-clientes"
        aria-label="Lista de clientes"
      >
        <div class="tabla-clientes" role="table" aria-label="Clientes registrados">
          <div class="tabla-clientes__encabezado" role="row">
            <span role="columnheader">Cliente</span>
            <span role="columnheader">Locales</span>
            <span role="columnheader">Teléfono principal</span>
            <span aria-label="Acciones" role="columnheader" />
          </div>
          <div
            v-for="cliente in clientesFiltrados"
            :key="cliente.id"
            class="tabla-clientes__fila"
            role="row"
          >
            <strong role="cell">{{ cliente.nombre }}</strong>
            <span role="cell">{{ textoLocales(cliente.locales.length) }}</span>
            <span role="cell">{{
              obtenerTelefonoPrincipal(cliente)?.numero ?? 'Sin teléfono'
            }}</span>
            <q-btn
              class="boton-secundario"
              flat
              no-caps
              icon-right="arrow_forward"
              label="Ver cliente"
              :to="`/clientes/${cliente.id}`"
            />
          </div>
        </div>

        <div class="tarjetas-clientes">
          <article v-for="cliente in clientesFiltrados" :key="cliente.id" class="tarjeta-cliente">
            <div class="tarjeta-cliente__contenido">
              <h2>{{ cliente.nombre }}</h2>
              <span>{{ textoLocales(cliente.locales.length) }}</span>
              <span>{{ obtenerTelefonoPrincipal(cliente)?.numero ?? 'Sin teléfono' }}</span>
            </div>
            <q-btn
              class="boton-secundario"
              flat
              no-caps
              icon-right="arrow_forward"
              label="Ver cliente"
              :to="`/clientes/${cliente.id}`"
            />
          </article>
        </div>
      </section>

      <section v-else class="estado-vacio-clientes">
        <q-icon name="groups" aria-hidden="true" />
        <h2 class="titulo-seccion">
          {{ terminoBusqueda ? 'No encontramos coincidencias' : 'Todavía no agregaste clientes' }}
        </h2>
        <p class="texto-secundario">
          {{
            terminoBusqueda
              ? 'Probá buscar por otro nombre, local o teléfono.'
              : 'Agregá el primer cliente para empezar a organizar sus locales y contactos.'
          }}
        </p>
        <q-btn
          v-if="!terminoBusqueda"
          class="boton-accion-principal"
          unelevated
          no-caps
          icon="person_add"
          label="Agregar cliente nuevo"
          to="/clientes/nuevo"
        />
      </section>
    </main>
  </q-page>
</template>
