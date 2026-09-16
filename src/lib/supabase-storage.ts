import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (voir .env.example)");
  }
  // La clé "service role" ne doit JAMAIS être exposée côté navigateur —
  // ce fichier n'est importé que par des routes API serveur.
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Envoie une image (buffer) vers le bucket Supabase Storage et renvoie
 * son URL publique. Le bucket doit être configuré en lecture publique
 * (voir README.md — étape Supabase Storage).
 */
export async function uploadProductImage(
  file: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const supabase = getClient();
  const path = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(`Échec de l'envoi vers Supabase Storage : ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
