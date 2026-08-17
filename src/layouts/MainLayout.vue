<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LogoMallicTesla from '@/components/LogoMallicTesla.vue';
import {
  ELEMENTO_MAS,
  estaElementoActivo,
  obtenerElementosNavegacion,
  type ElementoNavegacion,
} from '@/configuracion/navegacion';

const ruta = useRoute();
const elementosMenuEscritorio = obtenerElementosNavegacion('menu-escritorio');
const elementosBarraMovil = [...obtenerElementosNavegacion('barra-movil'), ELEMENTO_MAS];

const rutaActual = computed(() => ruta.path);

function estaActivo(elemento: ElementoNavegacion): boolean {
  return estaElementoActivo(elemento, rutaActual.value);
}
</script>

<template>
  <q-layout view="hHh LpR fFf" class="aplicacion-mallic-tesla">
    <q-header v-if="$q.screen.lt.md" class="encabezado-movil">
      <q-toolbar class="encabezado-movil__barra">
        <router-link class="marca-movil" to="/" aria-label="Ir al inicio de Mallic Tesla">
          <LogoMallicTesla tamano="pequeno" />
          <span>Mallic Tesla</span>
        </router-link>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.gt.sm"
      :model-value="true"
      show-if-above
      bordered
      class="menu-escritorio"
    >
      <aside class="menu-escritorio__contenido" aria-label="Navegación principal">
        <router-link class="marca-escritorio" to="/" aria-label="Ir al inicio de Mallic Tesla">
          <LogoMallicTesla tamano="mediano" />
          <span class="marca-escritorio__texto">
            <strong>Mallic Tesla</strong>
            <small>Presupuestos eléctricos</small>
          </span>
        </router-link>

        <q-btn
          class="boton-accion-principal menu-escritorio__accion"
          unelevated
          no-caps
          icon="add"
          label="Nuevo presupuesto"
          to="/presupuestos/nuevo"
        />

        <nav class="lista-navegacion" aria-label="Secciones">
          <router-link
            v-for="elemento in elementosMenuEscritorio"
            :key="elemento.nombre"
            :to="elemento.ruta"
            class="enlace-navegacion-escritorio"
            :class="{ 'enlace-navegacion-escritorio--activo': estaActivo(elemento) }"
            :aria-current="estaActivo(elemento) ? 'page' : undefined"
          >
            <q-icon :name="elemento.icono" aria-hidden="true" />
            <span>{{ elemento.etiqueta }}</span>
          </router-link>
        </nav>
      </aside>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="$q.screen.lt.md" class="navegacion-movil">
      <nav class="navegacion-movil__contenido" aria-label="Navegación principal">
        <router-link
          v-for="elemento in elementosBarraMovil"
          :key="elemento.nombre"
          :to="elemento.ruta"
          class="enlace-navegacion-movil"
          :class="{ 'enlace-navegacion-movil--activo': estaActivo(elemento) }"
          :aria-current="estaActivo(elemento) ? 'page' : undefined"
        >
          <q-icon :name="elemento.icono" aria-hidden="true" />
          <span>{{ elemento.etiqueta }}</span>
        </router-link>
      </nav>
    </q-footer>
  </q-layout>
</template>
