import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

// Protège TOUTES les routes /api/admin/* (hors login) au niveau serveur —
// et pas seulement la page /admin. C'est cette vérification-ci, pas le
// mot de passe affiché sur la page, qui empêche un appel direct à l'API
// (ex. via les outils développeur du navigateur) de créer des produits
// ou de consommer le quota Gemini sans authentification.
export const config = {
  matcher: ["/api/admin/:path*"],
};

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    return NextResponse.json(
      {
        error: "Accès refusé.",
        message: "🚨 Le gardien du catalogue vous a repéré. Cette zone n'est pas pour vous.",
      },
      { status: 401 },
    );
  }

  return NextResponse.next();
}
