"use client";

import { useState } from "react";
import { getPaymentMethodLabel } from "@/lib/validations";

export default function TransactionList({ transactions, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onDelete) onDelete();
      }
    } catch {
      console.error("Erro ao excluir");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Estilos de badge por categoria
  const categoryBadgeStyle = {
    Alimentação: "bg-[#fb923c]/10 text-[#fb923c] border-[#fb923c]/20",
    Salário: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    Lazer: "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20",
    Saúde: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
    Transporte: "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20",
    Educação: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20",
    Moradia: "bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20",
    Freelance: "bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20",
    Investimentos: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
    Outros: "bg-[#94a3b8]/10 text-[#94a3b8] border-[#94a3b8]/20",
  };

  // Estilos de badge por modalidade
  const paymentBadgeStyle = {
    PIX: "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20",
    DINHEIRO: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    CARTAO_CREDITO: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20",
    CARTAO_DEBITO: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20",
    BOLETO: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-[#8b93ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-sm font-semibold text-white">Transações</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <p className="text-xs">Nenhuma transação registrada no sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-[#8b93ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <h3 className="text-sm font-semibold text-white">
          Transações <span className="text-xs text-slate-500 font-medium ml-1">({transactions.length})</span>
        </h3>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-3.5 p-3 rounded-xl bg-[#13112a]/40 border border-[#2a2754]/20 hover:border-[#2a2754]/50 transition-all duration-200"
          >
            {/* Status icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                t.type === "RECEITA"
                  ? "bg-[#10b981]/10 text-[#10b981]"
                  : "bg-[#e01a5d]/10 text-[#e01a5d]"
              }`}
            >
              {t.type === "RECEITA" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>

            {/* Description & Tags */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{t.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Category badge */}
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${
                    categoryBadgeStyle[t.category] || "bg-slate-700/10 text-slate-400 border-slate-600/20"
                  }`}
                >
                  {t.category}
                </span>

                {/* Payment badge */}
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${
                    paymentBadgeStyle[t.paymentMethod] || "bg-slate-700/10 text-slate-400 border-slate-600/20"
                  }`}
                >
                  {getPaymentMethodLabel(t.paymentMethod)}
                </span>

                {/* Date */}
                <span className="text-[10px] text-slate-500 ml-0.5 font-medium">
                  {formatDate(t.date)}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="text-right flex-shrink-0">
              <p
                className={`text-xs font-bold ${
                  t.type === "RECEITA" ? "text-[#10b981]" : "text-[#e01a5d]"
                }`}
              >
                {t.type === "RECEITA" ? "+" : "-"} {formatCurrency(t.value)}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingId === t.id}
              className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                confirmId === t.id
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
              }`}
              title={confirmId === t.id ? "Clique novamente para confirmar" : "Excluir"}
            >
              {deletingId === t.id ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : confirmId === t.id ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
