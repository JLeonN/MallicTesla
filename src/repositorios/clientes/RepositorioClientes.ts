import type { Cliente } from '@/dominio/clientes';

export interface RepositorioClientes {
  obtenerTodos(): Promise<Cliente[]>;
  guardar(cliente: Cliente): Promise<void>;
  eliminar(idCliente: string): Promise<void>;
}
