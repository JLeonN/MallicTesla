export interface LogoConfiguracion {
  nombre: string;
  tipoMime: string;
  datosUrl: string;
}

export interface DatosConfiguracion {
  nombreEmpresa: string;
  nombreResponsable: string;
  telefono: string;
  correo: string;
  direccion: string;
  rut: string;
  logo: LogoConfiguracion | null;
  precioManoObraHora: number | null;
  precioTrasladoKilometro: number | null;
  mensajeFinal: string;
  datosTransferenciaBancaria: string;
}

export interface Configuracion extends DatosConfiguracion {
  fechaActualizacion: string | null;
}

export function crearConfiguracionInicial(): Configuracion {
  return {
    nombreEmpresa: '',
    nombreResponsable: '',
    telefono: '',
    correo: '',
    direccion: '',
    rut: '',
    logo: null,
    precioManoObraHora: null,
    precioTrasladoKilometro: null,
    mensajeFinal: '',
    datosTransferenciaBancaria: '',
    fechaActualizacion: null,
  };
}

export function actualizarConfiguracion(datos: DatosConfiguracion): Configuracion {
  return {
    ...normalizarDatosConfiguracion(datos),
    fechaActualizacion: new Date().toISOString(),
  };
}

export function normalizarDatosConfiguracion(datos: DatosConfiguracion): DatosConfiguracion {
  return {
    nombreEmpresa: datos.nombreEmpresa.trim(),
    nombreResponsable: datos.nombreResponsable.trim(),
    telefono: datos.telefono.trim(),
    correo: datos.correo.trim(),
    direccion: datos.direccion.trim(),
    rut: datos.rut.trim(),
    logo: datos.logo ? { ...datos.logo, nombre: datos.logo.nombre.trim() } : null,
    precioManoObraHora: normalizarPrecio(datos.precioManoObraHora),
    precioTrasladoKilometro: normalizarPrecio(datos.precioTrasladoKilometro),
    mensajeFinal: normalizarTextoMultilinea(datos.mensajeFinal),
    datosTransferenciaBancaria: normalizarTextoMultilinea(datos.datosTransferenciaBancaria),
  };
}

export function esConfiguracionGuardada(valor: unknown): valor is Configuracion {
  if (!esRegistro(valor)) {
    return false;
  }

  const camposTexto = [
    'nombreEmpresa',
    'nombreResponsable',
    'telefono',
    'correo',
    'direccion',
    'rut',
    'mensajeFinal',
    'datosTransferenciaBancaria',
  ];

  return (
    camposTexto.every((campo) => typeof valor[campo] === 'string') &&
    esPrecioGuardado(valor.precioManoObraHora) &&
    esPrecioGuardado(valor.precioTrasladoKilometro) &&
    esLogoGuardado(valor.logo) &&
    (valor.fechaActualizacion === null || typeof valor.fechaActualizacion === 'string')
  );
}

function normalizarPrecio(valor: number | null): number | null {
  if (valor === null || !Number.isFinite(Number(valor))) {
    return null;
  }

  const precio = Number(valor);

  if (precio < 0) {
    throw new RangeError('Los precios de configuración no pueden ser negativos.');
  }

  return precio;
}

function normalizarTextoMultilinea(valor: string): string {
  return valor
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((linea) => linea.trimEnd())
    .join('\n')
    .trim();
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function esPrecioGuardado(valor: unknown): valor is number | null {
  return valor === null || (typeof valor === 'number' && Number.isFinite(valor) && valor >= 0);
}

function esLogoGuardado(valor: unknown): valor is LogoConfiguracion | null {
  return (
    valor === null ||
    (esRegistro(valor) &&
      typeof valor.nombre === 'string' &&
      typeof valor.tipoMime === 'string' &&
      typeof valor.datosUrl === 'string' &&
      valor.datosUrl.startsWith('data:image/'))
  );
}
