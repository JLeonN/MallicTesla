<script setup lang="ts">
import { computed } from 'vue';
import { mdiWhatsapp } from '@quasar/extras/mdi-v7';

const props = defineProps<{
  nombreCliente: string;
  numero: string;
  etiqueta?: string;
}>();

const numeroWhatsapp = computed(() => {
  const numeroSoloDigitos = props.numero.replace(/\D/g, '').replace(/^00/, '');

  if (numeroSoloDigitos.startsWith('598')) {
    return numeroSoloDigitos;
  }

  if (numeroSoloDigitos.startsWith('0')) {
    return `598${numeroSoloDigitos.slice(1)}`;
  }

  return numeroSoloDigitos;
});

const enlaceWhatsapp = computed(() => `https://wa.me/${numeroWhatsapp.value}`);
</script>

<template>
  <q-btn
    class="enlace-whatsapp"
    flat
    no-caps
    :href="enlaceWhatsapp"
    target="_blank"
    rel="noopener noreferrer"
    :icon="mdiWhatsapp"
    :label="etiqueta ?? numero"
    :aria-label="`Abrir WhatsApp con ${nombreCliente} al ${numero}`"
  />
</template>
