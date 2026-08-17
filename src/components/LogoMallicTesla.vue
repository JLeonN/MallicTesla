<script setup lang="ts">
import logoMallicTesla from '@/assets/LogoMallicTeslaOriginal.jpg';

withDefaults(
  defineProps<{
    tamano?: 'pequeno' | 'mediano' | 'grande';
  }>(),
  {
    tamano: 'mediano',
  },
);
</script>

<template>
  <span class="logo-mallic-tesla" :class="`logo-mallic-tesla--${tamano}`">
    <img class="logo-mallic-tesla__imagen" :src="logoMallicTesla" alt="Logo de Mallic Tesla" />
  </span>
</template>
