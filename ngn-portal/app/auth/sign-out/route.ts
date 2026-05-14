import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });
  response.cookies.set("ngn_persona", "", {
    expires: new Date(0),
    path: "/",
  });
  return response;
}
