<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { mdiWhatsapp } from '@quasar/extras/mdi-v7';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import AgregadorMaterialPresupuesto from '@/components/presupuestos/AgregadorMaterialPresupuesto.vue';
import FilaPresupuesto from '@/components/presupuestos/FilaPresupuesto.vue';
import ResumenPresupuesto from '@/components/presupuestos/ResumenPresupuesto.vue';
import SelectorDestinatarioPresupuesto from '@/components/presupuestos/SelectorDestinatarioPresupuesto.vue';
import type { Material, Moneda } from '@/dominio/materiales';
import {
  clonarLineasPresupuesto,
  crearLineaDesdeMaterial,
  crearLineaMaterialManual,
  crearLineasInicialesPresupuesto,
  type DatosPresupuesto,
  type LineaPresupuesto,
  type Presupuesto,
  type TipoDestinatario,
} from '@/dominio/presupuestos';
import { useClientesStore } from '@/stores/clientes';
import { useConfiguracionStore } from '@/stores/configuracion';
import { useMaterialesStore } from '@/stores/materiales';
import { usePresupuestosStore } from '@/stores/presupuestos';

type AccionFinalPresupuesto = 'guardar' | 'descargar' | 'enviar';

const ruta = useRoute();
const router = useRouter();
const $q = useQuasar();
const clientesStore = useClientesStore();
const configuracionStore = useConfiguracionStore();
const materialesStore = useMaterialesStore();
const presupuestosStore = usePresupuestosStore();

const tipoDestinatario = ref<TipoDestinatario>('potencial');
const idCliente = ref<string | null>(null);
const nombreDestinatario = ref('');
const telefonoDestinatario = ref('');
const fechaPresupuesto = ref(obtenerFechaActualLocal());
const monedaPresupuesto = ref<Moneda>('UYU');
const lineas = ref<LineaPresupuesto[]>([]);
const presupuesto = ref<Presupuesto>();
const cargandoPagina = ref(true);
const presupuestoNoEncontrado = ref(false);
const mostrarConfirmacionCancelar = ref(false);
const estadoInicial = ref('');
const errorAccion = ref<string | null>(null);

const esNuevo = computed(() => ruta.name === 'nuevo-presupuesto');
const esEdicion = computed(() => ruta.name === 'editar-presupuesto');
const soloLectura = computed(() => ruta.name === 'detalle-presupuesto');
const tieneErroresCarga = computed(
  () =>
    errorAccion.value ||
    presupuestosStore.error ||
    clientesStore.error ||
    materialesStore.error ||
    configuracionStore.error,
);
const hayCambios = computed(
  () => estadoInicial.value !== '' && serializarDatosFormulario() !== estadoInicial.value,
);
const mensajeWhatsapp = computed(
  () =>
    `Hola, te envío el presupuesto hablado (${formatearFechaPresupuesto(fechaPresupuesto.value)}).`,
);
const tituloPagina = computed(() => {
  if (esNuevo.value) {
    return 'Nuevo presupuesto';
  }

  return esEdicion.value ? 'Editar presupuesto' : 'Presupuesto';
});

watch(
  () => ruta.fullPath,
  () => {
    void inicializarPantalla();
  },
  { immediate: true },
);

async function inicializarPantalla(): Promise<void> {
  cargandoPagina.value = true;
  presupuestoNoEncontrado.value = false;
  mostrarConfirmacionCancelar.value = false;
  errorAccion.value = null;

  try {
    await Promise.all([
      clientesStore.cargarClientes(),
      materialesStore.cargarMateriales(),
      configuracionStore.cargarConfiguracion(),
      esNuevo.value ? Promise.resolve() : presupuestosStore.cargarPresupuestos(),
    ]);

    if (esNuevo.value) {
      restablecerFormularioNuevo();
      return;
    }

    const presupuestoEncontrado = presupuestosStore.obtenerPresupuestoPorId(
      String(ruta.params.idPresupuesto),
    );
    presupuestoNoEncontrado.value = presupuestoEncontrado === undefined;

    if (presupuestoEncontrado) {
      presupuesto.value = presupuestoEncontrado;
      cargarDatosPresupuesto(presupuestoEncontrado);
    }
  } finally {
    cargandoPagina.value = false;
  }
}

function restablecerFormularioNuevo(): void {
  const primeraTarifa = configuracionStore.configuracion.tarifasManoObra[0];

  presupuesto.value = undefined;
  tipoDestinatario.value = 'potencial';
  idCliente.value = null;
  nombreDestinatario.value = '';
  telefonoDestinatario.value = '';
  fechaPresupuesto.value = obtenerFechaActualLocal();
  monedaPresupuesto.value = 'UYU';
  lineas.value = crearLineasInicialesPresupuesto('UYU', {
    nombreManoObra: primeraTarifa?.nombre,
    precioManoObraHora: primeraTarifa?.precioHora,
    precioTrasladoKilometro: configuracionStore.configuracion.precioTrasladoKilometro,
  });
  mostrarConfirmacionCancelar.value = false;
  estadoInicial.value = serializarDatosFormulario();
}

function cargarDatosPresupuesto(presupuestoGuardado: Presupuesto): void {
  tipoDestinatario.value = presupuestoGuardado.destinatario.tipo;
  idCliente.value = presupuestoGuardado.destinatario.idCliente;
  nombreDestinatario.value = presupuestoGuardado.destinatario.nombre;
  telefonoDestinatario.value = presupuestoGuardado.destinatario.telefono;
  fechaPresupuesto.value = presupuestoGuardado.fechaPresupuesto;
  monedaPresupuesto.value = presupuestoGuardado.moneda;
  lineas.value = clonarLineasPresupuesto(presupuestoGuardado.lineas);
  estadoInicial.value = serializarDatosFormulario();
}

function obtenerDatosFormulario(): DatosPresupuesto {
  return {
    destinatario: {
      tipo: tipoDestinatario.value,
      idCliente: idCliente.value,
      nombre: nombreDestinatario.value,
      telefono: telefonoDestinatario.value,
    },
    fechaPresupuesto: fechaPresupuesto.value,
    moneda: monedaPresupuesto.value,
    lineas: clonarLineasPresupuesto(lineas.value),
  };
}

function serializarDatosFormulario(): string {
  return JSON.stringify(obtenerDatosFormulario());
}

function agregarMaterial(material: Material): void {
  lineas.value.push(crearLineaDesdeMaterial(material));
}

function agregarMaterialManual(nombre: string): void {
  lineas.value.push(crearLineaMaterialManual(nombre, monedaPresupuesto.value));
}

function eliminarLinea(idLinea: string): void {
  lineas.value = lineas.value.filter((linea) => linea.id !== idLinea);
}

function solicitarCancelacion(): void {
  if (!hayCambios.value) {
    confirmarCancelacion();
    return;
  }

  mostrarConfirmacionCancelar.value = true;
}

function confirmarCancelacion(): void {
  if (esNuevo.value) {
    void router.replace('/');
    return;
  }

  void router.replace('/presupuestos');
}

async function guardarNuevoYFinalizar(accion: AccionFinalPresupuesto): Promise<void> {
  errorAccion.value = null;

  try {
    await presupuestosStore.agregarPresupuesto(obtenerDatosFormulario());

    if (accion === 'enviar') {
      abrirWhatsapp();
    }

    notificarAccionCompletada(accion);
    await router.replace('/presupuestos');
  } catch (errorCapturado) {
    errorAccion.value = obtenerMensajeErrorGuardado(errorCapturado);
  }
}

async function guardarCambios(): Promise<void> {
  if (!presupuesto.value) {
    return;
  }

  errorAccion.value = null;

  try {
    const presupuestoActualizado = await presupuestosStore.editarPresupuesto(
      presupuesto.value.id,
      obtenerDatosFormulario(),
    );
    $q.notify({
      message: 'Los cambios del presupuesto se guardaron correctamente.',
      position: 'top',
      classes: 'notificacion-exito',
    });
    await router.replace(`/presupuestos/${presupuestoActualizado.id}`);
  } catch (errorCapturado) {
    errorAccion.value = obtenerMensajeErrorGuardado(errorCapturado);
  }
}

function obtenerMensajeErrorGuardado(errorCapturado: unknown): string {
  return (
    presupuestosStore.error ||
    (errorCapturado instanceof Error
      ? errorCapturado.message
      : 'No se pudo guardar el presupuesto.')
  );
}

function descargarPresupuesto(): void {
  if (esNuevo.value) {
    void guardarNuevoYFinalizar('descargar');
    return;
  }

  notificarPdfPendiente();
}

function enviarPresupuesto(): void {
  if (esNuevo.value) {
    void guardarNuevoYFinalizar('enviar');
    return;
  }

  abrirWhatsapp();
}

function abrirWhatsapp(): void {
  const numero = normalizarNumeroWhatsapp(telefonoDestinatario.value);
  if (numero === '') {
    return;
  }

  const enlace = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeWhatsapp.value)}`;
  window.open(enlace, '_blank', 'noopener,noreferrer');
}

function notificarAccionCompletada(accion: AccionFinalPresupuesto): void {
  const mensajes: Record<AccionFinalPresupuesto, string> = {
    guardar: 'Presupuesto guardado correctamente.',
    descargar: 'Presupuesto guardado. La descarga del PDF se incorporará próximamente.',
    enviar: 'Presupuesto guardado correctamente.',
  };

  $q.notify({
    message: mensajes[accion],
    position: 'top',
    classes: 'notificacion-exito',
  });
}

function notificarPdfPendiente(): void {
  $q.notify({
    message: 'La descarga del PDF se incorporará en el módulo de documentos.',
    position: 'top',
  });
}

function obtenerFechaActualLocal(): string {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function formatearFechaPresupuesto(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');

  if (!anio || !mes || !dia) {
    return formatearFechaPresupuesto(obtenerFechaActualLocal());
  }

  return `${dia}/${mes}/${anio}`;
}

function restablecerFechaPresupuesto(): void {
  fechaPresupuesto.value = obtenerFechaActualLocal();
}

function normalizarNumeroWhatsapp(numeroIngresado: string): string {
  const incluyeCodigoPais = numeroIngresado.startsWith('+') || numeroIngresado.startsWith('00');
  const numeroSoloDigitos = numeroIngresado.replace(/\D/g, '').replace(/^00/, '');

  if (numeroSoloDigitos.startsWith('598')) {
    return numeroSoloDigitos;
  }

  if (incluyeCodigoPais) {
    return numeroSoloDigitos;
  }

  return numeroSoloDigitos.startsWith('0')
    ? `598${numeroSoloDigitos.slice(1)}`
    : numeroSoloDigitos === ''
      ? ''
      : `598${numeroSoloDigitos}`;
}
</script>

<template>
  <q-page class="pagina-contenido">
    <main class="contenedor-principal nuevo-presupuesto">
      <q-btn
        v-if="!esNuevo"
        class="boton-secundario"
        flat
        no-caps
        icon="arrow_back"
        label="Volver a presupuestos"
        to="/presupuestos"
      />

      <header class="encabezado-nuevo-presupuesto">
        <div>
          <p class="etiqueta-seccion">Presupuestos</p>
          <h1 class="titulo-pagina">{{ tituloPagina }}</h1>
          <p class="texto-secundario encabezado-nuevo-presupuesto__descripcion">
            {{
              soloLectura
                ? 'Consultá la copia guardada, descargala o enviala cuando lo necesites.'
                : 'Agregá los conceptos, ajustá sus importes y revisá el total en el mismo ticket.'
            }}
          </p>
        </div>
      </header>

      <q-banner v-if="tieneErroresCarga" class="aviso-error" rounded>
        <template #avatar><q-icon name="error_outline" /></template>
        {{ tieneErroresCarga }}
      </q-banner>

      <div v-if="cargandoPagina" class="estado-presupuestos">
        <q-spinner class="indicador-carga" size="2rem" />
        <span>Cargando presupuesto…</span>
      </div>

      <section v-else-if="presupuestoNoEncontrado" class="estado-vacio-presupuestos">
        <q-icon name="receipt_long" aria-hidden="true" />
        <h2 class="titulo-seccion">No encontramos este presupuesto</h2>
        <p class="texto-secundario">
          Puede no estar disponible en este dispositivo o haber cambiado su almacenamiento.
        </p>
        <q-btn
          class="boton-accion-principal"
          unelevated
          no-caps
          label="Volver a presupuestos"
          to="/presupuestos"
        />
      </section>

      <div v-else class="nuevo-presupuesto__contenido">
        <SelectorDestinatarioPresupuesto
          v-model:tipo="tipoDestinatario"
          v-model:id-cliente="idCliente"
          v-model:nombre="nombreDestinatario"
          v-model:telefono="telefonoDestinatario"
          :clientes="clientesStore.clientesOrdenados"
          :cargando="clientesStore.cargando"
          :solo-lectura="soloLectura"
        />

        <AgregadorMaterialPresupuesto
          v-if="!soloLectura"
          :materiales="materialesStore.materiales"
          :cargando="materialesStore.cargando"
          @agregar-material="agregarMaterial"
          @agregar-manual="agregarMaterialManual"
        />

        <section class="ticket-presupuesto" aria-labelledby="titulo-ticket-presupuesto">
          <div class="ticket-presupuesto__encabezado">
            <div class="ticket-presupuesto__encabezado-superior">
              <div>
                <p class="etiqueta-seccion">Detalle {{ soloLectura ? 'guardado' : 'editable' }}</p>
                <h2 id="titulo-ticket-presupuesto" class="titulo-seccion">Ticket</h2>
              </div>

              <div class="ticket-presupuesto__fecha-controles">
                <q-input
                  v-model="fechaPresupuesto"
                  class="ticket-presupuesto__fecha"
                  dark
                  outlined
                  dense
                  type="date"
                  label="Fecha"
                  :readonly="soloLectura"
                />
                <q-btn
                  v-if="!soloLectura"
                  class="boton-icono-secundario"
                  flat
                  round
                  dense
                  icon="today"
                  aria-label="Restablecer la fecha al día actual"
                  @click="restablecerFechaPresupuesto"
                />
              </div>
            </div>
          </div>

          <div v-if="lineas.length" class="ticket-presupuesto__lineas">
            <FilaPresupuesto
              v-for="(linea, indice) in lineas"
              :key="linea.id"
              v-model="lineas[indice]!"
              :moneda-presupuesto="monedaPresupuesto"
              :tarifas-mano-obra="configuracionStore.configuracion.tarifasManoObra"
              :solo-lectura="soloLectura"
              @eliminar="eliminarLinea(linea.id)"
            />
          </div>

          <div v-else class="ticket-presupuesto__vacio">
            <q-icon name="receipt_long" aria-hidden="true" />
            <strong>El ticket está vacío</strong>
            <span>{{
              soloLectura ? 'Este presupuesto no tiene conceptos.' : 'Agregá un material.'
            }}</span>
          </div>

          <ResumenPresupuesto
            v-model:moneda="monedaPresupuesto"
            :lineas="lineas"
            :solo-lectura="soloLectura"
          />
        </section>

        <section class="acciones-presupuesto" aria-label="Acciones del presupuesto">
          <div class="acciones-presupuesto__edicion">
            <q-btn
              v-if="soloLectura && presupuesto"
              class="boton-accion-principal"
              unelevated
              no-caps
              icon="edit"
              label="Editar"
              :to="`/presupuestos/${presupuesto.id}/editar`"
            />
            <template v-else>
              <q-btn
                class="boton-accion-principal"
                unelevated
                no-caps
                icon="save"
                :label="esEdicion ? 'Guardar cambios' : 'Guardar'"
                :loading="presupuestosStore.guardando"
                :disable="presupuestosStore.guardando"
                @click="esEdicion ? guardarCambios() : guardarNuevoYFinalizar('guardar')"
              />

              <Transition name="confirmacion-cancelacion" mode="out-in">
                <div
                  v-if="mostrarConfirmacionCancelar"
                  key="confirmacion"
                  class="confirmacion-cancelacion-presupuesto"
                  role="alert"
                >
                  <q-btn
                    class="boton-peligro"
                    flat
                    no-caps
                    icon="warning_amber"
                    label="Hay cambios sin guardar. ¿Descartar?"
                    @click="confirmarCancelacion"
                  />
                  <q-btn
                    class="boton-icono-secundario"
                    flat
                    round
                    dense
                    icon="close"
                    aria-label="Anular la cancelación"
                    @click="mostrarConfirmacionCancelar = false"
                  />
                </div>
                <q-btn
                  v-else
                  key="cancelar"
                  class="boton-secundario"
                  flat
                  no-caps
                  icon="close"
                  :label="esEdicion ? 'Cancelar cambios' : 'Cancelar'"
                  :disable="presupuestosStore.guardando"
                  @click="solicitarCancelacion"
                />
              </Transition>
            </template>
          </div>

          <div class="acciones-presupuesto__salida">
            <q-btn
              class="boton-secundario"
              no-caps
              flat
              icon="visibility"
              label="Vista previa"
              @click="notificarPdfPendiente"
            />
            <q-btn
              class="boton-secundario"
              flat
              no-caps
              icon="download"
              label="Descargar PDF"
              :disable="esEdicion || presupuestosStore.guardando"
              @click="descargarPresupuesto"
            />
            <q-btn
              class="boton-secundario"
              flat
              no-caps
              :icon="mdiWhatsapp"
              label="Enviar"
              :disable="
                esEdicion || presupuestosStore.guardando || telefonoDestinatario.trim() === ''
              "
              @click="enviarPresupuesto"
            />
          </div>
        </section>
      </div>
    </main>
  </q-page>
</template>
