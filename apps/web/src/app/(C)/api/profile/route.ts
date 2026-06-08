// GET   /api/profile — Préférences utilisateur (user authentifié)
// PATCH /api/profile — Mise à jour profil, body JSON (user authentifié)
// POST  /api/profile — Upload avatar, formData { file } (user authentifié)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import {
  getUserPreferences,
  updateProfile,
  uploadAvatar,
} from "@/lib/services_M/profile.service";

/** Handler GET — retourne les préférences et infos du profil utilisateur */
export async function GET() {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    // Lecture des préférences en BDD
    const userPreferences = await getUserPreferences(session.user.id);
    return Response.json({ success: true, userPreferences });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

/** Handler PATCH — met à jour les informations du profil (nom, préférences…) */
export async function PATCH(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const body = await req.json();

    // Mise à jour en BDD via le service (validation métier incluse)
    const result = await updateProfile(session.user.id, body);

    if ("error" in result) {
      return Response.json({ success: false, message: result.error }, { status: result.status });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/profile]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler POST — upload et enregistrement de l'avatar utilisateur */
export async function POST(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    // Extraction du fichier depuis le formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({ success: false, message: "Aucun fichier." }, { status: 400 });
    }

    // Upload vers le stockage + mise à jour URL en BDD
    const result = await uploadAvatar(session.user.id, file);

    if ("error" in result) {
      return Response.json({ success: false, message: result.error }, { status: result.status });
    }

    return Response.json({ success: true, url: result.url });
  } catch (err) {
    console.error("[POST /api/profile]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
