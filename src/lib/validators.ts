// Utilidades de validación de teléfono.

/** Deja solo los dígitos del valor ingresado. */
export function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Comprobación ligera para obtener un número de teléfono real.
 * Acepta:
 *  - Móvil venezolano: 0414 / 0424 / 0412 / 0416 / 0426 + 7 dígitos
 *  - Con código de país: +58 / 58 seguido del móvil
 *  - Teléfono fijo venezolano: 0 + código de área + 7 dígitos (11 dígitos)
 *  - Internacional con "+": entre 10 y 15 dígitos
 */
export function isValidPhone(raw: string): boolean {
  const value = (raw || "").trim();
  const digits = onlyDigits(value);
  if (!digits) return false;

  // Internacional explícito (otro país)
  if (value.startsWith("+") && !digits.startsWith("58")) {
    return digits.length >= 10 && digits.length <= 15;
  }

  // Normaliza el prefijo de país de Venezuela (58) a formato local (0...)
  let local = digits;
  if (local.startsWith("58")) local = "0" + local.slice(2);

  // Móvil venezolano
  if (/^0(414|424|412|416|426)\d{7}$/.test(local)) return true;

  // Fijo venezolano (0 + área + número = 11 dígitos)
  if (/^0\d{10}$/.test(local)) return true;

  return false;
}
