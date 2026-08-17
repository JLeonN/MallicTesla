<script setup lang="ts">
defineProps<{
  titulo: string;
  descripcion: string;
  icono: string;
}>();
</script>

<template>
  <q-page class="pagina-contenido pagina-modulo-pendiente">
    <main class="contenedor-principal">
      <section class="tarjeta-modulo-pendiente" :aria-labelledby="`titulo-${icono}`">
        <div class="tarjeta-modulo-pendiente__icono" aria-hidden="true">
          <q-icon :name="icono" />
        </div>
        <p class="etiqueta-seccion">Próximamente</p>
        <h1 :id="`titulo-${icono}`" class="titulo-pagina">{{ titulo }}</h1>
        <p class="texto-secundario tarjeta-modulo-pendiente__descripcion">{{ descripcion }}</p>
        <q-btn
          class="boton-secundario"
          flat
          no-caps
          icon="arrow_back"
          label="Volver al inicio"
          to="/"
        />
      </section>
    </main>
  </q-page>
</template>
