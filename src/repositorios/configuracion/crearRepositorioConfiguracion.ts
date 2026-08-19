import { Capacitor } from '@capacitor/core';
import { AlmacenamientoLocalNavegador } from '@/repositorios/clientes/AlmacenamientoLocalNavegador';
import { AlmacenamientoPreferenciasCapacitor } from '@/repositorios/clientes/AlmacenamientoPreferenciasCapacitor';
import { RepositorioConfiguracionLocal } from './RepositorioConfiguracionLocal';
import type { RepositorioConfiguracion } from './RepositorioConfiguracion';

export function crearRepositorioConfiguracion(): RepositorioConfiguracion {
  const almacenamiento = Capacitor.isNativePlatform()
    ? new AlmacenamientoPreferenciasCapacitor()
    : new AlmacenamientoLocalNavegador();

  // TODO(firebase): reemplazar esta selección por un repositorio Firestore para la configuración.
  return new RepositorioConfiguracionLocal(almacenamiento);
}
