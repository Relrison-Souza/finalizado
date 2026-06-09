import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { createToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await createToken(user.id);
    const cookie = setAuthCookie(token);

    const response = NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email },
        message: "Cadastro realizado com sucesso!",
      },
      { status: 201 }
    );

    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
