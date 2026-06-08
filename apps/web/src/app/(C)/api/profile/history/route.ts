import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getViewHistory, recordView } from "@/lib/services_M/profile.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const rows = await getViewHistory(session.user.id);
    return Response.json({ success: true, data: rows });
  } catch (err) {
    console.error("[GET /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const { resourceId } = await req.json();
    if (!resourceId) return Response.json({ success: false }, { status: 400 });

    await recordView(session.user.id, resourceId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
