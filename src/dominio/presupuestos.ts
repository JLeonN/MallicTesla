import {
  crearIdentificadorMaterial,
  obtenerPresentacion,
  obtenerPrecioPredeterminado,
  obtenerUnidadMedida,
  type Material,
  type Moneda,
  type PrecioMaterial,
} from '@/dominio/materiales';

export const TIPOS_DESTINATARIO = ['potencial', 'guardado'] as const;
export const TIPOS_CONCEPTO_PRESUPUESTO = ['material', 'manoObra', 'traslado'] as const;
export const ORIGENES_LINEA_PRESUPUESTO = ['predefinido', 'catalogo', 'manual'] as const;

export type TipoDestinatario = (typeof TIPOS_DESTINATARIO)[number];
export type TipoConceptoPresupuesto = (typeof TIPOS_CONCEPTO_PRESUPUESTO)[number];
export type OrigenLineaPresupuesto = (typeof ORIGENES_LINEA_PRESUPUESTO)[number];

export interface OpcionUnidadPresupuesto {
  unidad: string;
  precioUnitario: number | null;
}

export interface LineaPresupuesto {
  id: string;
  tipo: TipoConceptoPresupuesto;
  origen: OrigenLineaPresupuesto;
  idMaterial: string | null;
  nombre: string;
  cantidad: number | null;
  unidad: string;
  opcionesUnidad: OpcionUnidadPresupuesto[];
  precioUnitario: number | null;
  moneda: Moneda;
}

export interface DatosDestinatarioPresupuesto {
  tipo: TipoDestinatario;
  idCliente: string | null;
  nombre: string;
  telefono: string;
}

export interface ValoresInicialesPresupuesto {
  nombreManoObra?: string | undefined;
  precioManoObraHora?: number | null | undefined;
  precioTrasladoKilometro?: number | null | undefined;
}

export interface DatosPresupuesto {
  destinatario: DatosDestinatarioPresupuesto;
  fechaPresupuesto: string;
  moneda: Moneda;
  lineas: LineaPresupuesto[];
}

export interface Presupuesto extends DatosPresupuesto {
  id: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export function crearLineasInicialesPresupuesto(
  moneda: Moneda = 'UYU',
  valores: ValoresInicialesPresupuesto = {},
): LineaPresupuesto[] {
  return [
    crearLineaPredefinida(
      'manoObra',
      valores.nombreManoObra?.trim() || 'Mano de obra',
      'Hora',
      valores.precioManoObraHora,
      moneda,
    ),
    crearLineaPredefinida(
      'traslado',
      'Traslado',
      'Kilómetro',
      valores.precioTrasladoKilometro,
      moneda,
    ),
  ];
}

export function crearPresupuesto(datos: DatosPresupuesto): Presupuesto {
  const ahora = new Date().toISOString();

  return {
    id: crearIdentificadorMaterial(),
    ...normalizarDatosPresupuesto(datos),
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
}

export function actualizarPresupuesto(
  presupuesto: Presupuesto,
  datos: DatosPresupuesto,
): Presupuesto {
  return {
    ...presupuesto,
    ...normalizarDatosPresupuesto(datos),
    fechaActualizacion: new Date().toISOString(),
  };
}

export function normalizarDatosPresupuesto(datos: DatosPresupuesto): DatosPresupuesto {
  return {
    destinatario: {
      tipo: datos.destinatario.tipo,
      idCliente: datos.destinatario.idCliente,
      nombre: datos.destinatario.nombre.trim(),
      telefono: datos.destinatario.telefono.trim(),
    },
    fechaPresupuesto: datos.fechaPresupuesto,
    moneda: datos.moneda,
    lineas: structuredClone(datos.lineas).map((linea) => ({
      ...linea,
      nombre: linea.nombre.trim(),
    })),
  };
}

export function esPresupuestoGuardado(valor: unknown): valor is Presupuesto {
  if (!esRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.id === 'string' &&
    typeof valor.fechaPresupuesto === 'string' &&
    (valor.moneda === 'UYU' || valor.moneda === 'USD') &&
    esDestinatarioGuardado(valor.destinatario) &&
    Array.isArray(valor.lineas) &&
    valor.lineas.every(esLineaPresupuestoGuardada) &&
    typeof valor.fechaCreacion === 'string' &&
    typeof valor.fechaActualizacion === 'string'
  );
}

export function crearLineaMaterialManual(nombre: string, moneda: Moneda = 'UYU'): LineaPresupuesto {
  return {
    id: crearIdentificadorMaterial(),
    tipo: 'material',
    origen: 'manual',
    idMaterial: null,
    nombre: nombre.trim(),
    cantidad: 1,
    unidad: 'Unidad',
    opcionesUnidad: [],
    precioUnitario: null,
    moneda,
  };
}

export function crearLineaDesdeMaterial(material: Material): LineaPresupuesto {
  const precio = obtenerPrecioPredeterminado(material);
  const opcionesUnidad = precio ? crearOpcionesUnidad(precio) : [];
  const opcionPredeterminada = precio
    ? obtenerOpcionPredeterminada(precio, opcionesUnidad)
    : undefined;

  return {
    id: crearIdentificadorMaterial(),
    tipo: 'material',
    origen: 'catalogo',
    idMaterial: material.id,
    nombre: material.nombre,
    cantidad: 1,
    unidad: opcionPredeterminada?.unidad ?? 'Unidad',
    opcionesUnidad,
    precioUnitario: opcionPredeterminada?.precioUnitario ?? null,
    moneda: precio?.moneda ?? 'UYU',
  };
}

export function calcularSubtotalLinea(linea: LineaPresupuesto): number {
  const precio = normalizarNumeroNoNegativo(linea.precioUnitario);
  return precio * normalizarNumeroNoNegativo(linea.cantidad);
}

export function lineaTieneMonedaCompatible(
  linea: LineaPresupuesto,
  monedaPresupuesto: Moneda,
): boolean {
  return linea.moneda === monedaPresupuesto;
}

export function calcularTotalPresupuesto(
  lineas: LineaPresupuesto[],
  monedaPresupuesto: Moneda,
): number {
  return lineas.reduce((total, linea) => {
    if (!lineaTieneMonedaCompatible(linea, monedaPresupuesto)) {
      return total;
    }

    return total + calcularSubtotalLinea(linea);
  }, 0);
}

export function lineaTienePrecioPendiente(linea: LineaPresupuesto): boolean {
  return linea.precioUnitario === null || !Number.isFinite(Number(linea.precioUnitario));
}

function crearLineaPredefinida(
  tipo: Exclude<TipoConceptoPresupuesto, 'material'>,
  nombre: string,
  unidad: string,
  precioUnitario: number | null | undefined,
  moneda: Moneda,
): LineaPresupuesto {
  return {
    id: crearIdentificadorMaterial(),
    tipo,
    origen: 'predefinido',
    idMaterial: null,
    nombre,
    cantidad: 0,
    unidad,
    opcionesUnidad: [],
    precioUnitario: precioUnitario ?? 0,
    moneda,
  };
}

function crearOpcionesUnidad(precio: PrecioMaterial): OpcionUnidadPresupuesto[] {
  if (precio.modalidad === 'directo') {
    return [
      {
        unidad: obtenerUnidadMedida(precio),
        precioUnitario: precio.importe,
      },
    ];
  }

  const opciones = [
    {
      unidad: obtenerPresentacion(precio),
      precioUnitario: precio.importe,
    },
    {
      unidad: obtenerUnidadMedida(precio),
      precioUnitario: precio.precioCantidadParcial,
    },
  ];

  return opciones.filter(
    (opcion, indice) =>
      opciones.findIndex(
        (actual) => actual.unidad.toLocaleLowerCase('es') === opcion.unidad.toLocaleLowerCase('es'),
      ) === indice,
  );
}

function obtenerOpcionPredeterminada(
  precio: PrecioMaterial,
  opciones: OpcionUnidadPresupuesto[],
): OpcionUnidadPresupuesto | undefined {
  if (precio.modalidad === 'directo' || precio.valorVisible === 'total') {
    return opciones[0];
  }

  return opciones[1] ?? opciones[0];
}

function normalizarNumeroNoNegativo(valor: number | null): number {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function esDestinatarioGuardado(valor: unknown): valor is DatosDestinatarioPresupuesto {
  return (
    esRegistro(valor) &&
    (valor.tipo === 'potencial' || valor.tipo === 'guardado') &&
    (valor.idCliente === null || typeof valor.idCliente === 'string') &&
    typeof valor.nombre === 'string' &&
    typeof valor.telefono === 'string'
  );
}

function esLineaPresupuestoGuardada(valor: unknown): valor is LineaPresupuesto {
  return (
    esRegistro(valor) &&
    typeof valor.id === 'string' &&
    TIPOS_CONCEPTO_PRESUPUESTO.some((tipo) => tipo === valor.tipo) &&
    ORIGENES_LINEA_PRESUPUESTO.some((origen) => origen === valor.origen) &&
    (valor.idMaterial === null || typeof valor.idMaterial === 'string') &&
    typeof valor.nombre === 'string' &&
    esNumeroOpcional(valor.cantidad) &&
    typeof valor.unidad === 'string' &&
    Array.isArray(valor.opcionesUnidad) &&
    esNumeroOpcional(valor.precioUnitario) &&
    (valor.moneda === 'UYU' || valor.moneda === 'USD')
  );
}

function esNumeroOpcional(valor: unknown): valor is number | null {
  return valor === null || (typeof valor === 'number' && Number.isFinite(valor) && valor >= 0);
}
