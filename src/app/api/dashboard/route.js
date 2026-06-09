import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: payload.userId },
    });

    let totalReceitas = 0;
    let totalDespesas = 0;
    const categoryMap = {};

    for (const t of transactions) {
      if (t.type === "RECEITA") {
        totalReceitas += t.value;
      } else {
        totalDespesas += t.value;
        if (categoryMap[t.category]) {
          categoryMap[t.category] += t.value;
        } else {
          categoryMap[t.category] = t.value;
        }
      }
    }

    const saldo = totalReceitas - totalDespesas;

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      saldo: parseFloat(saldo.toFixed(2)),
      totalReceitas: parseFloat(totalReceitas.toFixed(2)),
      totalDespesas: parseFloat(totalDespesas.toFixed(2)),
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
