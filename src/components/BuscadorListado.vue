<script setup lang="ts">
defineProps<{
  etiqueta: string;
}>();

const modelo = defineModel<string | null>({ required: true });
</script>

<template>
  <q-input v-model="modelo" dark outlined clearable debounce="150" :label="etiqueta">
    <template #prepend><q-icon name="search" /></template>
  </q-input>
</template>
