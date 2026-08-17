export const ETIQUETAS_TELEFONO = ['Personal', 'Trabajo', 'WhatsApp', 'Otro'] as const;

export type EtiquetaTelefono = (typeof ETIQUETAS_TELEFONO)[number];

export interface TelefonoCliente {
  id: string;
  numero: string;
  etiqueta: EtiquetaTelefono;
  esPrincipal: boolean;
}

export interface LocalCliente {
  id: string;
  nombre: string;
  direccion: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefonos: TelefonoCliente[];
  locales: LocalCliente[];
  correo: string;
  notas: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface DatosCliente {
  nombre: string;
  telefonos: TelefonoCliente[];
  locales: LocalCliente[];
  correo: string;
  notas: string;
}

export function crearIdentificador(): string {
  return crypto.randomUUID();
}

export function crearTelefono(): TelefonoCliente {
  return {
    id: crearIdentificador(),
    numero: '',
    etiqueta: 'Personal',
    esPrincipal: true,
  };
}

export function crearLocal(): LocalCliente {
  return {
    id: crearIdentificador(),
    nombre: '',
    direccion: '',
  };
}

export function normalizarTelefonos(telefonos: TelefonoCliente[]): TelefonoCliente[] {
  const indicePrincipal = telefonos.findIndex((telefono) => telefono.esPrincipal);
  const indiceTelefonoPrincipal = indicePrincipal >= 0 ? indicePrincipal : 0;

  return telefonos.map((telefono, indice) => ({
    ...telefono,
    numero: telefono.numero.trim(),
    esPrincipal: indice === indiceTelefonoPrincipal,
  }));
}

export function crearCliente(datos: DatosCliente): Cliente {
  const ahora = new Date().toISOString();

  return {
    id: crearIdentificador(),
    ...normalizarDatosCliente(datos),
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
}

export function actualizarCliente(cliente: Cliente, datos: DatosCliente): Cliente {
  return {
    ...cliente,
    ...normalizarDatosCliente(datos),
    fechaActualizacion: new Date().toISOString(),
  };
}

export function obtenerTelefonoPrincipal(cliente: Cliente): TelefonoCliente | undefined {
  return cliente.telefonos.find((telefono) => telefono.esPrincipal);
}

export function normalizarDatosCliente(datos: DatosCliente): DatosCliente {
  return {
    nombre: datos.nombre.trim(),
    telefonos: normalizarTelefonos(datos.telefonos),
    locales: datos.locales.map((local) => ({
      ...local,
      nombre: local.nombre.trim(),
      direccion: local.direccion.trim(),
    })),
    correo: datos.correo.trim(),
    notas: datos.notas.trim(),
  };
}
