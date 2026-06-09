import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { createToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const token = await createToken(user.id);
    const cookie = setAuthCookie(token);

    const response = NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email },
        message: "Login realizado com sucesso!",
      },
      { status: 200 }
    );

    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
