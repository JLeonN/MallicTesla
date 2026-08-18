import type { Material } from '@/dominio/materiales';
import type { AlmacenamientoClaveValor } from '@/repositorios/clientes/AlmacenamientoClaveValor';
import type { RepositorioMateriales } from './RepositorioMateriales';

const CLAVE_MATERIALES = 'mallic-tesla:materiales:v1';

export class RepositorioMaterialesLocal implements RepositorioMateriales {
  // TODO(firebase): sustituir este repositorio por Firestore conservando el contrato asíncrono.
  constructor(private readonly almacenamiento: AlmacenamientoClaveValor) {}

  async obtenerTodos(): Promise<Material[]> {
    const datosGuardados = await this.almacenamiento.obtener(CLAVE_MATERIALES);

    if (datosGuardados === null) {
      return [];
    }

    try {
      const materiales = JSON.parse(datosGuardados) as unknown;
      return Array.isArray(materiales) ? structuredClone(materiales as Material[]) : [];
    } catch {
      return [];
    }
  }

  async guardar(material: Material): Promise<void> {
    const materiales = await this.obtenerTodos();
    const indiceMaterial = materiales.findIndex((actual) => actual.id === material.id);

    if (indiceMaterial === -1) {
      materiales.push(structuredClone(material));
    } else {
      materiales.splice(indiceMaterial, 1, structuredClone(material));
    }

    await this.guardarTodos(materiales);
  }

  async eliminar(idMaterial: string): Promise<void> {
    const materiales = await this.obtenerTodos();
    await this.guardarTodos(materiales.filter((material) => material.id !== idMaterial));
  }

  private async guardarTodos(materiales: Material[]): Promise<void> {
    await this.almacenamiento.guardar(CLAVE_MATERIALES, JSON.stringify(materiales));
  }
}
