import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";

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
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await getAuthUser();
    if (!payload) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { description, value, type, category, paymentMethod, date } =
      validation.data;

    const transaction = await prisma.transaction.create({
      data: {
        description,
        value,
        type,
        category,
        paymentMethod,
        date: new Date(date),
        userId: payload.userId,
      },
    });

    return NextResponse.json(
      { transaction, message: "Transação criada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
