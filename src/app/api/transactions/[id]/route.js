import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const transactionId = parseInt(id, 10);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    if (transaction.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Sem permissão para excluir esta transação" },
        { status: 403 }
      );
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { message: "Transação excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
