import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get cookies and clear them
    const cookieStore = cookies();

    // Clear authentication cookies
    const response = NextResponse.json({ success: true });

    response.cookies.delete("authToken");
    response.cookies.delete("x-tenant");
    response.cookies.delete("tenantId");
    response.cookies.delete("workspaceId");

    return response;
  } catch (error) {
    console.error("Error in /api/auth/logout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
