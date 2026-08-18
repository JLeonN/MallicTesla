import { Capacitor } from '@capacitor/core';
import { AlmacenamientoLocalNavegador } from '@/repositorios/clientes/AlmacenamientoLocalNavegador';
import { AlmacenamientoPreferenciasCapacitor } from '@/repositorios/clientes/AlmacenamientoPreferenciasCapacitor';
import { RepositorioMaterialesLocal } from './RepositorioMaterialesLocal';
import type { RepositorioMateriales } from './RepositorioMateriales';

export function crearRepositorioMateriales(): RepositorioMateriales {
  const almacenamiento = Capacitor.isNativePlatform()
    ? new AlmacenamientoPreferenciasCapacitor()
    : new AlmacenamientoLocalNavegador();

  // TODO(firebase): reemplazar esta selección por un repositorio Firestore para materiales.
  return new RepositorioMaterialesLocal(almacenamiento);
}
