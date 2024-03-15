import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET(req: Request) {
  const url = new URL(req.url);
  const newUrl = new URL("/works", url.origin);
  const redirectUrl = newUrl.toString();

  return NextResponse.redirect(redirectUrl, {
    status: 301,
  });
}
