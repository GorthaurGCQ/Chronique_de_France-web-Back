import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services/admin/auth";
import { uploadAdminImage } from "@/lib/services/admin/upload.service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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
