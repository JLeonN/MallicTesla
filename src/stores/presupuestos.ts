import { computed, ref } from 'vue';
import {
  actualizarPresupuesto,
  crearPresupuesto,
  type DatosPresupuesto,
  type Presupuesto,
} from '@/dominio/presupuestos';
import { crearRepositorioPresupuestos } from '@/repositorios/presupuestos/crearRepositorioPresupuestos';
import { defineStore } from 'pinia';

const repositorioPresupuestos = crearRepositorioPresupuestos();

export const usePresupuestosStore = defineStore('presupuestos', () => {
  const presupuestos = ref<Presupuesto[]>([]);
  const cargando = ref(false);
  const guardando = ref(false);
  const error = ref<string | null>(null);

  const presupuestosOrdenados = computed(() =>
    [...presupuestos.value].sort((presupuestoA, presupuestoB) => {
      const diferenciaFecha = presupuestoB.fechaPresupuesto.localeCompare(
        presupuestoA.fechaPresupuesto,
      );
      return (
        diferenciaFecha || presupuestoB.fechaCreacion.localeCompare(presupuestoA.fechaCreacion)
      );
    }),
  );

  async function cargarPresupuestos(): Promise<void> {
    cargando.value = true;
    error.value = null;

    try {
      presupuestos.value = await repositorioPresupuestos.obtenerTodos();
    } catch {
      error.value = 'No se pudieron cargar los presupuestos guardados.';
    } finally {
      cargando.value = false;
    }
  }

  async function agregarPresupuesto(datos: DatosPresupuesto): Promise<Presupuesto> {
    guardando.value = true;
    error.value = null;
    const presupuesto = crearPresupuesto(datos);

    try {
      await repositorioPresupuestos.guardar(presupuesto);
      presupuestos.value = [...presupuestos.value, presupuesto];
      return presupuesto;
    } catch {
      error.value = 'No se pudo guardar el presupuesto.';
      throw new Error(error.value);
    } finally {
      guardando.value = false;
    }
  }

  async function editarPresupuesto(
    idPresupuesto: string,
    datos: DatosPresupuesto,
  ): Promise<Presupuesto> {
    const presupuestoActual = obtenerPresupuestoPorId(idPresupuesto);

    if (presupuestoActual === undefined) {
      throw new Error('El presupuesto que intentás editar ya no existe.');
    }

    guardando.value = true;
    error.value = null;
    const presupuestoActualizado = actualizarPresupuesto(presupuestoActual, datos);

    try {
      await repositorioPresupuestos.guardar(presupuestoActualizado);
      presupuestos.value = presupuestos.value.map((presupuesto) =>
        presupuesto.id === idPresupuesto ? presupuestoActualizado : presupuesto,
      );
      return presupuestoActualizado;
    } catch {
      error.value = 'No se pudieron guardar los cambios del presupuesto.';
      throw new Error(error.value);
    } finally {
      guardando.value = false;
    }
  }

  function obtenerPresupuestoPorId(idPresupuesto: string): Presupuesto | undefined {
    return presupuestos.value.find((presupuesto) => presupuesto.id === idPresupuesto);
  }

  function buscarPresupuestos(termino: string): Presupuesto[] {
    const terminoNormalizado = termino.trim().toLocaleLowerCase('es');

    if (terminoNormalizado === '') {
      return presupuestosOrdenados.value;
    }

    return presupuestosOrdenados.value.filter((presupuesto) =>
      [
        presupuesto.destinatario.nombre,
        presupuesto.destinatario.telefono,
        presupuesto.fechaPresupuesto,
      ].some((dato) => dato.toLocaleLowerCase('es').includes(terminoNormalizado)),
    );
  }

  return {
    presupuestos,
    presupuestosOrdenados,
    cargando,
    guardando,
    error,
    cargarPresupuestos,
    agregarPresupuesto,
    editarPresupuesto,
    obtenerPresupuestoPorId,
    buscarPresupuestos,
  };
});
