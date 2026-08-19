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
export const TIPOS_CONCEPTO_PRESUPUESTO = ['material', 'manoObra', 'nafta'] as const;
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

export function crearLineasInicialesPresupuesto(moneda: Moneda = 'UYU'): LineaPresupuesto[] {
  return [
    crearLineaPredefinida('manoObra', 'Mano de obra', moneda),
    crearLineaPredefinida('nafta', 'Nafta', moneda),
  ];
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
  moneda: Moneda,
): LineaPresupuesto {
  return {
    id: crearIdentificadorMaterial(),
    tipo,
    origen: 'predefinido',
    idMaterial: null,
    nombre,
    cantidad: 1,
    unidad: tipo === 'nafta' ? 'Kilómetro' : 'Unidad',
    opcionesUnidad: [],
    precioUnitario: 0,
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
