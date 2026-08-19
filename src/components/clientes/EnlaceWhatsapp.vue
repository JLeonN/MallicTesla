<script setup lang="ts">
import { computed } from 'vue';
import { mdiWhatsapp } from '@quasar/extras/mdi-v7';

const props = defineProps<{
  nombreCliente: string;
  numero: string;
  etiqueta?: string;
  mensaje?: string;
  asumirCodigoUruguay?: boolean;
}>();

const numeroWhatsapp = computed(() => {
  const numeroIngresado = props.numero.trim();
  const incluyeCodigoPais = numeroIngresado.startsWith('+') || numeroIngresado.startsWith('00');
  const numeroSoloDigitos = numeroIngresado.replace(/\D/g, '').replace(/^00/, '');

  if (numeroSoloDigitos.startsWith('598')) {
    return numeroSoloDigitos;
  }

  if (incluyeCodigoPais) {
    return numeroSoloDigitos;
  }

  if (numeroSoloDigitos.startsWith('0')) {
    return `598${numeroSoloDigitos.slice(1)}`;
  }

  if (props.asumirCodigoUruguay && numeroSoloDigitos !== '') {
    return `598${numeroSoloDigitos}`;
  }

  return numeroSoloDigitos;
});

const enlaceWhatsapp = computed(() => {
  const mensaje = props.mensaje?.trim();
  const consultaMensaje = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${numeroWhatsapp.value}${consultaMensaje}`;
});
</script>

<template>
  <q-btn
    class="enlace-whatsapp boton-secundario"
    flat
    no-caps
    :href="enlaceWhatsapp"
    :disable="numeroWhatsapp === ''"
    target="_blank"
    rel="noopener noreferrer"
    :icon="mdiWhatsapp"
    :label="etiqueta ?? numero"
    :aria-label="`Abrir WhatsApp con ${nombreCliente} al ${numero}`"
  />
</template>
