import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import {
  getUserPreferences,
  updateProfile,
  uploadAvatar,
} from "@/lib/services/profile.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const userPreferences = await getUserPreferences(session.user.id);
    return Response.json({ success: true, userPreferences });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const body = await req.json();
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

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({ success: false, message: "Aucun fichier." }, { status: 400 });
    }

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
