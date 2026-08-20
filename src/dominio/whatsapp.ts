export function normalizarNumeroWhatsapp(numeroIngresado: string): string {
  const numero = numeroIngresado.trim();
  const incluyeCodigoPais = numero.startsWith('+') || numero.startsWith('00');
  const numeroSoloDigitos = numero.replace(/\D/g, '').replace(/^00/, '');

  if (numeroSoloDigitos.startsWith('598')) {
    return numeroSoloDigitos;
  }

  if (incluyeCodigoPais) {
    return numeroSoloDigitos;
  }

  return numeroSoloDigitos.startsWith('0')
    ? `598${numeroSoloDigitos.slice(1)}`
    : numeroSoloDigitos === ''
      ? ''
      : `598${numeroSoloDigitos}`;
}

export function crearEnlaceWhatsapp(numero: string, mensaje: string): string {
  const numeroNormalizado = normalizarNumeroWhatsapp(numero);
  const consultaMensaje = mensaje.trim() ? `?text=${encodeURIComponent(mensaje.trim())}` : '';
  return `https://wa.me/${numeroNormalizado}${consultaMensaje}`;
}
