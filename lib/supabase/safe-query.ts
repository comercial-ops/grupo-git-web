/**
 * Envuelve una consulta a Supabase para que nunca tumbe el render.
 * Antes de correr supabase/schema.sql, o si las credenciales aún no están
 * configuradas, las tablas/red pueden fallar: en ese caso se devuelve una
 * lista vacía en lugar de un error 500.
 */
export async function safeQuery<T>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  try {
    const { data, error } = await query;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
