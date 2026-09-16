import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, checkAdminPassword, createSessionToken } from "@/lib/auth";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const waitSeconds = checkRateLimit(`login:${ip}`);
  if (waitSeconds !== null) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessaie dans ${Math.ceil(waitSeconds / 60)} minute(s).` },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mot de passe requis." }, { status: 400 });
  }

  let ok: boolean;
  try {
    ok = checkAdminPassword(parsed.data.password);
  } catch {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD n'est pas configuré côté serveur." },
      { status: 500 },
    );
  }

  if (!ok) {
    // Volontairement vague : ne pas confirmer qu'un mot de passe existe.
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  resetRateLimit(`login:${ip}`);
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
