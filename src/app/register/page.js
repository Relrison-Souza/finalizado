"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email inválido";
    if (!form.password || form.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error });
        return;
      }

      router.push("/dashboard");
    } catch {
      setErrors({ general: "Erro de conexão com o servidor" });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500/50 focus:ring-red-500/30"
        : "border-slate-700/50 focus:ring-emerald-500/30 focus:border-emerald-500/50"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl shadow-emerald-500/25 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Criar Conta</h1>
          <p className="text-slate-500 mt-2">Comece a gerenciar suas finanças</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          {errors.general && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="João Silva"
                className={inputClass("name")}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={inputClass("email")}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <input
                id="register-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={inputClass("password")}
                autoComplete="new-password"
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-300 mb-2">
                Confirmar Senha
              </label>
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className={inputClass("confirmPassword")}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              id="btn-register"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Criando conta...
                </span>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
