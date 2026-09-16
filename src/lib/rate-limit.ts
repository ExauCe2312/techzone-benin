// Limiteur de tentatives en mémoire — volontairement simple, sans
// infrastructure supplémentaire (pas de Redis). Sur Netlify, l'état vit
// le temps qu'une instance de fonction reste "chaude" (souvent plusieurs
// minutes en usage réel) : ça ne bloque pas un attaquant très patient sur
// plusieurs instances froides, mais ça arrête net les essais en boucle
// rapide, ce qui est le scénario réaliste pour un admin à une seule
// personne. Si le trafic grossissait un jour, la même logique pourrait
// être déplacée dans une table Supabase.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

export function getClientIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Renvoie null si la requête est autorisée, ou le nombre de secondes à attendre sinon. */
export function checkRateLimit(key: string): number | null {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return Math.ceil((bucket.resetAt - now) / 1000);
  }

  bucket.count += 1;
  return null;
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
