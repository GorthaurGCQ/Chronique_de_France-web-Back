// POST /api/admin/upload — Upload image, formData { file } (admin | founder)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/admin/auth.ts
import { isAdminRole } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/upload.service.ts
import { uploadAdminImage } from "@/lib/services_M/admin/upload.service";

/** Handler POST — upload une image pour le panel admin (bannière, miniature…) */
export async function POST(req: Request) {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    // Extraction du fichier depuis le formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ success: false, message: "Aucun fichier reçu." }, { status: 400 });
    }

    // Upload vers le stockage (Supabase) + retour de l'URL publique
    const result = await uploadAdminImage(file);

    if ("error" in result) {
      return Response.json({ success: false, message: result.error }, { status: result.status });
    }

    return Response.json({ success: true, url: result.url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return Response.json(
      { success: false, message: "Erreur interne.", error: String(err) },
      { status: 500 },
    );
  }
}
