/**
 * Genera identificadores únicos en cliente.
 * No usa crypto.randomUUID() porque solo existe en contextos seguros (HTTPS/localhost).
 */
export function createId(prefix: string): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${time}-${random}`;
}
