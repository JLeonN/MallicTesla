<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { mdiWhatsapp } from '@quasar/extras/mdi-v7';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import logoMallicTesla from '@/assets/LogoMallicTeslaOriginal.jpg';
import { formatearImporte } from '@/dominio/materiales';
import {
  calcularSubtotalLinea,
  calcularTotalMateriales,
  calcularTotalPresupuesto,
  calcularTotalTrabajoYTraslado,
  crearConfiguracionDocumento,
  lineaTieneMonedaCompatible,
  normalizarDatosPresupuesto,
  type DatosPresupuesto,
} from '@/dominio/presupuestos';
import { crearEnlaceWhatsapp, normalizarNumeroWhatsapp } from '@/dominio/whatsapp';
import { useConfiguracionStore } from '@/stores/configuracion';
import { usePresupuestosStore } from '@/stores/presupuestos';

const ruta = useRoute();
const router = useRouter();
const configuracionStore = useConfiguracionStore();
const presupuestosStore = usePresupuestosStore();

const datosPresupuesto = ref<DatosPresupuesto | null>(null);
const cargando = ref(true);
const presupuestoNoEncontrado = ref(false);
const esVistaPreviaNueva = computed(() => ruta.name === 'vista-previa-nuevo-presupuesto');
const idPresupuesto = computed(() =>
  esVistaPreviaNueva.value ? null : String(ruta.params.idPresupuesto),
);
const borrador = computed(() => presupuestosStore.obtenerBorradorVistaPrevia(idPresupuesto.value));
const rutaRetorno = computed(
  () =>
    borrador.value?.rutaRetorno ??
    (idPresupuesto.value ? `/presupuestos/${idPresupuesto.value}` : '/presupuestos/nuevo'),
);
const configuracionDocumento = computed(() =>
  datosPresupuesto.value?.configuracionDocumento
    ? datosPresupuesto.value.configuracionDocumento
    : crearConfiguracionDocumento(configuracionStore.configuracion),
);
const nombreEmpresa = computed(
  () => configuracionDocumento.value.nombreEmpresa.trim() || 'Mallic Tesla',
);
const logoEmpresa = computed(() => configuracionDocumento.value.logo?.datosUrl || logoMallicTesla);
const lineas = computed(() => datosPresupuesto.value?.lineas ?? []);
const moneda = computed(() => datosPresupuesto.value?.moneda ?? 'UYU');
const totalTrabajoYTraslado = computed(() =>
  calcularTotalTrabajoYTraslado(lineas.value, moneda.value),
);
const totalMateriales = computed(() => calcularTotalMateriales(lineas.value, moneda.value));
const total = computed(() => calcularTotalPresupuesto(lineas.value, moneda.value));
const cantidadMonedasIncompatibles = computed(
  () => lineas.value.filter((linea) => !lineaTieneMonedaCompatible(linea, moneda.value)).length,
);
const numeroWhatsapp = computed(() =>
  normalizarNumeroWhatsapp(datosPresupuesto.value?.destinatario.telefono ?? ''),
);
const mensajeWhatsapp = computed(() => {
  const nombreCliente = datosPresupuesto.value?.destinatario.nombre.trim();
  const saludo = nombreCliente ? `Hola, ${nombreCliente}.` : 'Hola.';
  return `${saludo} Te envío el presupuesto de ${nombreEmpresa.value} por ${formatearImporte(total.value, moneda.value)}.`;
});
const errorCarga = computed(() => presupuestosStore.error || configuracionStore.error);

onMounted(() => {
  void cargarVistaPrevia();
});

onBeforeRouteLeave((destino) => {
  if (destino.path === rutaRetorno.value) {
    presupuestosStore.marcarRetornoVistaPrevia(rutaRetorno.value);
  }
});

async function cargarVistaPrevia(): Promise<void> {
  cargando.value = true;
  presupuestoNoEncontrado.value = false;

  try {
    await configuracionStore.cargarConfiguracion();

    if (borrador.value) {
      datosPresupuesto.value = normalizarDatosPresupuesto(borrador.value.datos);
      return;
    }

    if (idPresupuesto.value === null) {
      presupuestoNoEncontrado.value = true;
      return;
    }

    await presupuestosStore.cargarPresupuestos();
    const presupuesto = presupuestosStore.obtenerPresupuestoPorId(idPresupuesto.value);
    presupuestoNoEncontrado.value = presupuesto === undefined;
    datosPresupuesto.value = presupuesto ? normalizarDatosPresupuesto(presupuesto) : null;
  } finally {
    cargando.value = false;
  }
}

function volver(): void {
  void router.push(rutaRetorno.value);
}

function imprimir(): void {
  window.print();
}

function descargar(): void {
  window.print();
}

function enviarPorWhatsapp(): void {
  if (numeroWhatsapp.value === '') {
    return;
  }

  window.open(
    crearEnlaceWhatsapp(numeroWhatsapp.value, mensajeWhatsapp.value),
    '_blank',
    'noopener,noreferrer',
  );
}

function crearEnlaceRedSocial(red: string, usuarioOEnlace: string): string {
  const valor = usuarioOEnlace.trim();

  if (/^https?:\/\//i.test(valor)) {
    return valor;
  }

  const usuario = valor.replace(/^@/, '');
  const nombreRed = red.trim().toLowerCase();

  if (nombreRed.includes('instagram')) {
    return `https://www.instagram.com/${usuario}`;
  }

  if (nombreRed.includes('facebook')) {
    return `https://www.facebook.com/${usuario}`;
  }

  if (nombreRed.includes('tiktok')) {
    return `https://www.tiktok.com/@${usuario}`;
  }

  if (nombreRed === 'x' || nombreRed.includes('twitter')) {
    return `https://x.com/${usuario}`;
  }

  if (nombreRed.includes('youtube')) {
    return `https://www.youtube.com/@${usuario}`;
  }

  if (nombreRed.includes('linkedin')) {
    return `https://www.linkedin.com/in/${usuario}`;
  }

  return `https://${valor}`;
}

function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha;
}

function formatearCantidad(cantidad: number | null): string {
  return new Intl.NumberFormat('es-UY', { maximumFractionDigits: 2 }).format(cantidad ?? 0);
}
</script>

<template>
  <q-page class="pagina-vista-previa">
    <main class="vista-previa-presupuesto">
      <header class="encabezado-vista-previa-app">
        <div>
          <p class="etiqueta-seccion">Documento</p>
          <h1 class="titulo-pagina">Vista previa</h1>
          <p class="texto-secundario">Así verá el cliente el presupuesto.</p>
        </div>

        <div class="acciones-vista-previa">
          <q-btn
            class="boton-secundario"
            flat
            no-caps
            icon="arrow_back"
            label="Volver"
            @click="volver"
          />
          <q-btn
            class="boton-secundario"
            flat
            no-caps
            icon="download"
            label="Descargar"
            :disable="datosPresupuesto === null"
            @click="descargar"
          />
          <q-btn
            class="boton-secundario"
            flat
            no-caps
            icon="print"
            label="Imprimir"
            :disable="datosPresupuesto === null"
            @click="imprimir"
          />
          <q-btn
            class="boton-accion-principal"
            unelevated
            no-caps
            :icon="mdiWhatsapp"
            label="Enviar"
            :disable="numeroWhatsapp === '' || datosPresupuesto === null"
            @click="enviarPorWhatsapp"
          />
        </div>
      </header>

      <q-banner v-if="errorCarga" class="aviso-error" rounded>
        <template #avatar><q-icon name="error_outline" /></template>
        {{ errorCarga }}
      </q-banner>

      <div v-if="cargando" class="estado-presupuestos">
        <q-spinner class="indicador-carga" size="2rem" />
        <span>Preparando vista previa…</span>
      </div>

      <section v-else-if="presupuestoNoEncontrado" class="estado-vacio-presupuestos">
        <q-icon name="preview" aria-hidden="true" />
        <h2 class="titulo-seccion">No pudimos preparar la vista previa</h2>
        <p class="texto-secundario">Volvé al presupuesto e intentá abrirla nuevamente.</p>
        <q-btn class="boton-accion-principal" unelevated no-caps label="Volver" @click="volver" />
      </section>

      <div v-else-if="datosPresupuesto" class="vista-previa-presupuesto__lienzo">
        <article class="documento-presupuesto" aria-label="Presupuesto listo para imprimir">
          <header class="documento-presupuesto__encabezado">
            <div class="documento-presupuesto__marca">
              <img :src="logoEmpresa" :alt="`Logo de ${nombreEmpresa}`" />
              <dl class="documento-presupuesto__datos-empresa">
                <div>
                  <dt>Empresa</dt>
                  <dd>{{ nombreEmpresa }}</dd>
                </div>
                <div v-if="configuracionDocumento.nombreResponsable">
                  <dt>Nombre</dt>
                  <dd>{{ configuracionDocumento.nombreResponsable }}</dd>
                </div>
                <div v-if="configuracionDocumento.telefono">
                  <dt>Teléfono</dt>
                  <dd>{{ configuracionDocumento.telefono }}</dd>
                </div>
                <div v-if="configuracionDocumento.correo">
                  <dt>Email</dt>
                  <dd>{{ configuracionDocumento.correo }}</dd>
                </div>
                <div v-if="configuracionDocumento.direccion">
                  <dt>Dirección</dt>
                  <dd>{{ configuracionDocumento.direccion }}</dd>
                </div>
                <div v-if="configuracionDocumento.rut">
                  <dt>RUT</dt>
                  <dd>{{ configuracionDocumento.rut }}</dd>
                </div>
              </dl>
            </div>

            <div class="documento-presupuesto__identificacion">
              <span>Presupuesto</span>
              <strong>{{ formatearFecha(datosPresupuesto.fechaPresupuesto) }}</strong>
              <small>Moneda: {{ moneda }}</small>
            </div>
          </header>

          <section class="documento-presupuesto__seccion documento-presupuesto__cliente">
            <p class="documento-presupuesto__etiqueta">Cliente</p>
            <div>
              <strong>{{ datosPresupuesto.destinatario.nombre || 'Cliente' }}</strong>
              <span v-if="datosPresupuesto.destinatario.telefono">
                {{ datosPresupuesto.destinatario.telefono }}
              </span>
            </div>
          </section>

          <section class="documento-presupuesto__seccion">
            <p class="documento-presupuesto__etiqueta">Detalle del presupuesto</p>
            <div class="documento-presupuesto__tabla-contenedor">
              <table class="documento-presupuesto__tabla">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="linea in lineas"
                    :key="linea.id"
                    :class="{
                      'documento-presupuesto__linea--incompatible': !lineaTieneMonedaCompatible(
                        linea,
                        moneda,
                      ),
                    }"
                  >
                    <td>{{ linea.nombre || 'Sin descripción' }}</td>
                    <td>{{ formatearCantidad(linea.cantidad) }} {{ linea.unidad }}</td>
                    <td>{{ formatearImporte(linea.precioUnitario ?? 0, linea.moneda) }}</td>
                    <td>{{ formatearImporte(calcularSubtotalLinea(linea), linea.moneda) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="cantidadMonedasIncompatibles" class="documento-presupuesto__advertencia">
              {{ cantidadMonedasIncompatibles }} concepto(s) en otra moneda no se incluyen en los
              totales.
            </p>
          </section>

          <section class="documento-presupuesto__totales" aria-label="Totales del presupuesto">
            <div>
              <span>Trabajo y traslado</span>
              <strong>{{ formatearImporte(totalTrabajoYTraslado, moneda) }}</strong>
            </div>
            <div>
              <span>Materiales</span>
              <strong>{{ formatearImporte(totalMateriales, moneda) }}</strong>
            </div>
            <div class="documento-presupuesto__total-final">
              <span>Total</span>
              <strong>{{ formatearImporte(total, moneda) }}</strong>
            </div>
          </section>

          <section
            v-if="configuracionDocumento.metodosPago.length"
            class="documento-presupuesto__seccion"
          >
            <p class="documento-presupuesto__etiqueta">Métodos de pago</p>
            <div class="documento-presupuesto__metodos-pago">
              <div v-for="metodo in configuracionDocumento.metodosPago" :key="metodo.id">
                <strong>{{ metodo.nombre || 'Forma de pago' }}</strong>
                <span v-if="metodo.numeroCuenta">{{ metodo.numeroCuenta }}</span>
              </div>
            </div>
          </section>

          <section
            v-if="configuracionDocumento.mensajeFinal"
            class="documento-presupuesto__mensaje-final"
          >
            <p>{{ configuracionDocumento.mensajeFinal }}</p>
          </section>

          <footer
            v-if="configuracionDocumento.redesSociales.length"
            class="documento-presupuesto__redes"
          >
            <a
              v-for="redSocial in configuracionDocumento.redesSociales"
              :key="redSocial.id"
              :href="crearEnlaceRedSocial(redSocial.red, redSocial.usuarioOEnlace)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>{{ redSocial.red }}</strong>
              <span>{{ redSocial.usuarioOEnlace }}</span>
            </a>
          </footer>
        </article>
      </div>
    </main>
  </q-page>
</template>
