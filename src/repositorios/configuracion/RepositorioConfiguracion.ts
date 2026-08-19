import type { Configuracion } from '@/dominio/configuracion';

export interface RepositorioConfiguracion {
  obtener(): Promise<Configuracion>;
  guardar(configuracion: Configuracion): Promise<void>;
}
