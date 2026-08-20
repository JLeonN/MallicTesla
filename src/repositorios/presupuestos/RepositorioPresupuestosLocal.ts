import { esPresupuestoGuardado, type Presupuesto } from '@/dominio/presupuestos';
import type { AlmacenamientoClaveValor } from '@/repositorios/clientes/AlmacenamientoClaveValor';
import type { RepositorioPresupuestos } from './RepositorioPresupuestos';

const CLAVE_PRESUPUESTOS = 'mallic-tesla:presupuestos:v1';

export class RepositorioPresupuestosLocal implements RepositorioPresupuestos {
  // TODO(firebase): sustituir este repositorio por Firestore conservando las copias históricas.
  constructor(private readonly almacenamiento: AlmacenamientoClaveValor) {}

  async obtenerTodos(): Promise<Presupuesto[]> {
    const datosGuardados = await this.almacenamiento.obtener(CLAVE_PRESUPUESTOS);

    if (datosGuardados === null) {
      return [];
    }

    try {
      const presupuestos = JSON.parse(datosGuardados) as unknown;
      return Array.isArray(presupuestos)
        ? structuredClone(presupuestos.filter(esPresupuestoGuardado))
        : [];
    } catch {
      return [];
    }
  }

  async guardar(presupuesto: Presupuesto): Promise<void> {
    const presupuestos = await this.obtenerTodos();
    const indicePresupuesto = presupuestos.findIndex(
      (presupuestoActual) => presupuestoActual.id === presupuesto.id,
    );

    if (indicePresupuesto === -1) {
      presupuestos.push(structuredClone(presupuesto));
    } else {
      presupuestos.splice(indicePresupuesto, 1, structuredClone(presupuesto));
    }

    await this.almacenamiento.guardar(CLAVE_PRESUPUESTOS, JSON.stringify(presupuestos));
  }
}
