import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Rota de diagnóstico - remover após debug
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    env: {
      BLOB_READ_WRITE_TOKEN_exists: !!process.env.BLOB_READ_WRITE_TOKEN,
      BLOB_READ_WRITE_TOKEN_length: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
      BLOB_READ_WRITE_TOKEN_prefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) || "não definido",
      ADMIN_TOKEN_exists: !!process.env.ADMIN_TOKEN,
      ADMIN_TOKEN_length: process.env.ADMIN_TOKEN?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('BLOB') || key.includes('ADMIN') || key.includes('VERCEL')
    ),
  };

  return NextResponse.json(diagnostics, { status: 200 });
}
