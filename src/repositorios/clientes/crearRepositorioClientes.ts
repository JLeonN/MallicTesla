import { Capacitor } from '@capacitor/core';
import { AlmacenamientoLocalNavegador } from './AlmacenamientoLocalNavegador';
import { AlmacenamientoPreferenciasCapacitor } from './AlmacenamientoPreferenciasCapacitor';
import { RepositorioClientesLocal } from './RepositorioClientesLocal';
import type { RepositorioClientes } from './RepositorioClientes';

export function crearRepositorioClientes(): RepositorioClientes {
  const almacenamiento = Capacitor.isNativePlatform()
    ? new AlmacenamientoPreferenciasCapacitor()
    : new AlmacenamientoLocalNavegador();

  // TODO(firebase): reemplazar esta selección por un repositorio Firestore que conserve el contrato asíncrono.
  return new RepositorioClientesLocal(almacenamiento);
}
