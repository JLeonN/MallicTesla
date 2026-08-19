import {
  crearConfiguracionInicial,
  esConfiguracionGuardada,
  migrarConfiguracionAnterior,
  type Configuracion,
} from '@/dominio/configuracion';
import type { AlmacenamientoClaveValor } from '@/repositorios/clientes/AlmacenamientoClaveValor';
import type { RepositorioConfiguracion } from './RepositorioConfiguracion';

const CLAVE_CONFIGURACION = 'mallic-tesla:configuracion:v1';

export class RepositorioConfiguracionLocal implements RepositorioConfiguracion {
  // TODO(firebase): sustituir este repositorio por Firestore conservando el contrato asíncrono.
  constructor(private readonly almacenamiento: AlmacenamientoClaveValor) {}

  async obtener(): Promise<Configuracion> {
    const datosGuardados = await this.almacenamiento.obtener(CLAVE_CONFIGURACION);

    if (datosGuardados === null) {
      return crearConfiguracionInicial();
    }

    try {
      const configuracion = JSON.parse(datosGuardados) as unknown;
      if (esConfiguracionGuardada(configuracion)) {
        return structuredClone(configuracion);
      }

      return migrarConfiguracionAnterior(configuracion) ?? crearConfiguracionInicial();
    } catch {
      return crearConfiguracionInicial();
    }
  }

  async guardar(configuracion: Configuracion): Promise<void> {
    await this.almacenamiento.guardar(CLAVE_CONFIGURACION, JSON.stringify(configuracion));
  }
}
