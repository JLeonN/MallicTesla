import { Capacitor } from '@capacitor/core';
import { AlmacenamientoLocalNavegador } from '@/repositorios/clientes/AlmacenamientoLocalNavegador';
import { AlmacenamientoPreferenciasCapacitor } from '@/repositorios/clientes/AlmacenamientoPreferenciasCapacitor';
import { RepositorioPresupuestosLocal } from './RepositorioPresupuestosLocal';
import type { RepositorioPresupuestos } from './RepositorioPresupuestos';

export function crearRepositorioPresupuestos(): RepositorioPresupuestos {
  const almacenamiento = Capacitor.isNativePlatform()
    ? new AlmacenamientoPreferenciasCapacitor()
    : new AlmacenamientoLocalNavegador();

  // TODO(firebase): reemplazar esta selección por el repositorio compartido de presupuestos.
  return new RepositorioPresupuestosLocal(almacenamiento);
}
