import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    if (!passcode || passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, message: "Invalid admin passcode. Please check and try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });

    // Set cookie valid for 7 days
    response.cookies.set({
      name: "cc_admin_session",
      value: "authenticated",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal authentication error." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("cc_admin_session");
  const isAuthenticated = session?.value === "authenticated";

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
  response.cookies.delete("cc_admin_session");
  return response;
}
