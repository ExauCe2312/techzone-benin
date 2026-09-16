"use client";

/**
 * Redimensionne et recompresse une image côté navigateur avant envoi, pour
 * éviter d'envoyer des photos de plusieurs Mo prises directement au
 * téléphone (lent pour toi, lent pour les visiteurs en 3G/4G ensuite).
 * Ne touche pas aux fichiers déjà légers.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82, skipBelowBytes = 300_000 } = {},
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  if (file.size <= skipBelowBytes) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // En cas de souci (format non supporté, navigateur ancien…), on envoie
    // l'original plutôt que de bloquer l'ajout du produit.
    return file;
  }
}
