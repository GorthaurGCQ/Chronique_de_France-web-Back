// POST /api/admin/upload — Upload image, formData { file }

// Service : src/lib/services_M/admin/auth.ts
import { getAdminSessionOr403 } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/upload.service.ts
import { uploadAdminImage } from "@/lib/services_M/admin/upload.service";

/** Handler POST — upload une image pour le panel admin (bannière, miniature…) */
export async function POST(req: Request) {
  try {
    const authResult = await getAdminSessionOr403([
      "GERER_RESSOURCES_ADMIN",
      "IMPORTER_MEDIAS",
    ]);
    if (!authResult.ok) return authResult.response;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ success: false, message: "Aucun fichier reçu." }, { status: 400 });
    }

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
