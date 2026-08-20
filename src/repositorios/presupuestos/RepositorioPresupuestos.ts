import type { Presupuesto } from '@/dominio/presupuestos';

export interface RepositorioPresupuestos {
  obtenerTodos(): Promise<Presupuesto[]>;
  guardar(presupuesto: Presupuesto): Promise<void>;
}
