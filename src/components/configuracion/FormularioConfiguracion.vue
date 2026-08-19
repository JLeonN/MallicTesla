<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Configuracion, DatosConfiguracion, LogoConfiguracion } from '@/dominio/configuracion';

const TAMANO_MAXIMO_LOGO_BYTES = 1024 * 1024;
const TIPOS_LOGO_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const props = defineProps<{
  configuracion: Configuracion;
  guardando: boolean;
}>();

const emitir = defineEmits<{
  guardar: [datos: DatosConfiguracion];
}>();

const entradaLogo = ref<HTMLInputElement>();
const nombreEmpresa = ref('');
const nombreResponsable = ref('');
const telefono = ref('');
const correo = ref('');
const direccion = ref('');
const rut = ref('');
const logo = ref<LogoConfiguracion | null>(null);
const precioManoObraHora = ref<number | null>(null);
const precioTrasladoKilometro = ref<number | null>(null);
const mensajeFinal = ref('');
const datosTransferenciaBancaria = ref('');
const errorLogo = ref('');

watch(
  () => props.configuracion,
  (configuracion) => {
    nombreEmpresa.value = configuracion.nombreEmpresa;
    nombreResponsable.value = configuracion.nombreResponsable;
    telefono.value = configuracion.telefono;
    correo.value = configuracion.correo;
    direccion.value = configuracion.direccion;
    rut.value = configuracion.rut;
    logo.value = configuracion.logo ? { ...configuracion.logo } : null;
    precioManoObraHora.value = configuracion.precioManoObraHora;
    precioTrasladoKilometro.value = configuracion.precioTrasladoKilometro;
    mensajeFinal.value = configuracion.mensajeFinal;
    datosTransferenciaBancaria.value = configuracion.datosTransferenciaBancaria;
    errorLogo.value = '';
  },
  { immediate: true },
);

function abrirSelectorLogo(): void {
  entradaLogo.value?.click();
}

function procesarLogo(evento: Event): void {
  const elemento = evento.target;

  if (!(elemento instanceof HTMLInputElement)) {
    return;
  }

  const archivo = elemento.files?.[0];
  elemento.value = '';
  errorLogo.value = '';

  if (!archivo) {
    return;
  }

  if (!TIPOS_LOGO_PERMITIDOS.includes(archivo.type)) {
    errorLogo.value = 'Elegí una imagen JPG, PNG o WebP.';
    return;
  }

  if (archivo.size > TAMANO_MAXIMO_LOGO_BYTES) {
    errorLogo.value = 'El logo debe pesar menos de 1 MB.';
    return;
  }

  const lector = new FileReader();
  lector.onload = () => {
    if (typeof lector.result !== 'string') {
      errorLogo.value = 'No se pudo leer la imagen seleccionada.';
      return;
    }

    logo.value = {
      nombre: archivo.name,
      tipoMime: archivo.type,
      datosUrl: lector.result,
    };
  };
  lector.onerror = () => {
    errorLogo.value = 'No se pudo leer la imagen seleccionada.';
  };
  lector.readAsDataURL(archivo);
}

function quitarLogo(): void {
  logo.value = null;
  errorLogo.value = '';
}

function validarCorreo(valor: unknown): true | string {
  if (valor === null || valor === '') {
    return true;
  }

  if (typeof valor !== 'string') {
    return 'Ingresá un correo válido.';
  }

  const correoIngresado = valor.trim();

  if (correoIngresado === '') {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoIngresado) || 'Ingresá un correo válido.';
}

function validarPrecio(valor: unknown): true | string {
  if (valor === null || valor === '') {
    return true;
  }

  return (Number.isFinite(Number(valor)) && Number(valor) >= 0) || 'Ingresá un precio válido.';
}

function guardarConfiguracion(): void {
  emitir('guardar', {
    nombreEmpresa: nombreEmpresa.value,
    nombreResponsable: nombreResponsable.value,
    telefono: telefono.value,
    correo: correo.value,
    direccion: direccion.value,
    rut: rut.value,
    logo: logo.value ? { ...logo.value } : null,
    precioManoObraHora: precioManoObraHora.value,
    precioTrasladoKilometro: precioTrasladoKilometro.value,
    mensajeFinal: mensajeFinal.value,
    datosTransferenciaBancaria: datosTransferenciaBancaria.value,
  });
}
</script>

<template>
  <q-form class="formulario-configuracion" greedy @submit="guardarConfiguracion">
    <div class="formulario-configuracion__contenedor">
      <section class="seccion-formulario" aria-labelledby="titulo-empresa-configuracion">
        <div class="encabezado-seccion-formulario">
          <div>
            <p class="etiqueta-seccion">Identidad y contacto</p>
            <h2 id="titulo-empresa-configuracion" class="titulo-seccion">Empresa y responsable</h2>
            <p class="texto-secundario texto-ayuda-formulario">
              Guardá la información profesional de Mallic Tesla y de Pablo.
            </p>
          </div>
        </div>

        <div class="grilla-configuracion">
          <q-input
            v-model="nombreEmpresa"
            dark
            outlined
            label="Nombre de la empresa"
            :rules="[
              (valor) => Boolean(String(valor).trim()) || 'Ingresá el nombre de la empresa.',
            ]"
          />
          <q-input
            v-model="nombreResponsable"
            dark
            outlined
            label="Nombre del responsable"
            :rules="[
              (valor) => Boolean(String(valor).trim()) || 'Ingresá el nombre del responsable.',
            ]"
          />
          <q-input v-model="telefono" dark outlined type="tel" label="Teléfono" />
          <q-input
            v-model="correo"
            dark
            outlined
            type="email"
            label="Correo electrónico"
            :rules="[validarCorreo]"
          />
          <q-input v-model="direccion" dark outlined label="Dirección" />
          <q-input v-model="rut" dark outlined label="RUT" />
        </div>

        <div class="selector-logo-configuracion">
          <div class="selector-logo-configuracion__vista">
            <img v-if="logo" :src="logo.datosUrl" :alt="`Logo ${logo.nombre}`" />
            <q-icon v-else name="image" aria-hidden="true" />
          </div>
          <div class="selector-logo-configuracion__acciones">
            <div>
              <strong>Logo de la empresa</strong>
              <p class="texto-secundario">Imagen JPG, PNG o WebP de hasta 1 MB.</p>
              <span v-if="logo" class="selector-logo-configuracion__nombre">{{ logo.nombre }}</span>
              <span v-if="errorLogo" class="selector-logo-configuracion__error" role="alert">
                {{ errorLogo }}
              </span>
            </div>
            <div class="selector-logo-configuracion__botones">
              <q-btn
                class="boton-secundario"
                flat
                no-caps
                icon="upload"
                :label="logo ? 'Reemplazar logo' : 'Elegir logo'"
                @click="abrirSelectorLogo"
              />
              <q-btn
                v-if="logo"
                class="boton-icono-secundario"
                flat
                round
                icon="delete_outline"
                aria-label="Quitar logo"
                @click="quitarLogo"
              />
            </div>
          </div>
          <input
            ref="entradaLogo"
            class="selector-logo-configuracion__entrada"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="procesarLogo"
          />
        </div>
      </section>

      <section class="seccion-formulario" aria-labelledby="titulo-tarifas-configuracion">
        <div class="encabezado-seccion-formulario">
          <div>
            <p class="etiqueta-seccion">Valores habituales</p>
            <h2 id="titulo-tarifas-configuracion" class="titulo-seccion">Tarifas</h2>
            <p class="texto-secundario texto-ayuda-formulario">
              Estos precios quedan guardados como información de referencia.
            </p>
          </div>
        </div>

        <div class="grilla-configuracion">
          <q-input
            v-model.number="precioManoObraHora"
            dark
            outlined
            type="number"
            min="0"
            step="0.01"
            label="Precio de mano de obra"
            suffix="por hora"
            :rules="[validarPrecio]"
          />
          <q-input
            v-model.number="precioTrasladoKilometro"
            dark
            outlined
            type="number"
            min="0"
            step="0.01"
            label="Precio de traslado"
            suffix="por kilómetro"
            :rules="[validarPrecio]"
          />
        </div>
      </section>

      <section class="seccion-formulario" aria-labelledby="titulo-textos-configuracion">
        <div class="encabezado-seccion-formulario">
          <div>
            <p class="etiqueta-seccion">Información adicional</p>
            <h2 id="titulo-textos-configuracion" class="titulo-seccion">Textos y pagos</h2>
            <p class="texto-secundario texto-ayuda-formulario">
              Conservá los textos que Pablo quiera reutilizar más adelante.
            </p>
          </div>
        </div>

        <div class="campos-multilinea-configuracion">
          <q-input
            v-model="mensajeFinal"
            class="campo-notas-generales"
            dark
            outlined
            type="textarea"
            autogrow
            label="Mensaje final predeterminado"
          />
          <q-input
            v-model="datosTransferenciaBancaria"
            class="campo-notas-generales"
            dark
            outlined
            type="textarea"
            autogrow
            label="Datos para transferencia bancaria"
          />
        </div>
      </section>

      <div class="acciones-formulario">
        <q-btn
          class="boton-accion-principal"
          unelevated
          no-caps
          type="submit"
          icon="save"
          label="Guardar configuración"
          :loading="guardando"
          :disable="guardando"
        />
      </div>
    </div>
  </q-form>
</template>
