import { NextRequest, NextResponse } from "next/server";

// Mock: não processa a imagem de verdade (sem sharp/S3 neste passo — isso
// é o "server/storage" do documento da Subtarefa 1, ainda não implementado).
// Só confirma que recebeu um arquivo e devolve uma URL de placeholder,
// suficiente pra validar o fluxo de upload no front.
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json(
      { success: false, error: "Nenhuma imagem enviada" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    imageUrl: "/images/logos/logo.png",
  });
}
