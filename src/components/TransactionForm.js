"use client";

import { useState } from "react";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/validations";

export default function TransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    description: "",
    value: "",
    type: "DESPESA",
    category: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!form.value || parseFloat(form.value) <= 0) newErrors.value = "Valor deve ser positivo";
    if (!form.category) newErrors.category = "Selecione uma categoria";
    if (!form.paymentMethod) newErrors.paymentMethod = "Selecione a modalidade";
    if (!form.date) newErrors.date = "Data é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error });
        return;
      }

      setSuccess("Transação registrada!");
      setForm({
        description: "",
        value: "",
        type: form.type, // mantém o tipo selecionado
        category: "",
        paymentMethod: "",
        date: new Date().toISOString().split("T")[0],
      });

      if (onSuccess) onSuccess();

      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setErrors({ general: "Erro de conexão com o servidor" });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-xl bg-[#111024] border text-white placeholder-slate-500 text-xs transition-all duration-200 focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-500/50 focus:ring-red-500/30"
        : "border-[#2a2754]/60 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]/50"
    }`;

  return (
    <div className="rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-[#8b93ff] text-sm font-semibold">+</span>
        <h3 className="text-sm font-semibold text-white">Novo Lançamento</h3>
      </div>

      {errors.general && (
        <div className="mb-4 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {errors.general}
        </div>
      )}

      {success && (
        <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Tipo (Despesa / Receita) */}
        <div className="grid grid-cols-2 gap-2.5 bg-[#111024] p-1 rounded-xl border border-[#2a2754]/40">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, type: "DESPESA" }))}
            className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              form.type === "DESPESA"
                ? "bg-[#e01a5d]/10 border border-[#e01a5d]/30 text-[#e01a5d] shadow-sm shadow-[#e01a5d]/5"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ↓ Despesa
          </button>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, type: "RECEITA" }))}
            className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              form.type === "RECEITA"
                ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] shadow-sm shadow-[#10b981]/5"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ↑ Receita
          </button>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Descrição
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ex: Almoço, Salário..."
            className={inputClass("description")}
            autoComplete="off"
          />
          {errors.description && (
            <p className="mt-1 text-[10px] text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Valor e Data lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="value" className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Valor (R$)
            </label>
            <input
              id="value"
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="0,00"
              min="0.01"
              step="0.01"
              className={inputClass("value")}
            />
            {errors.value && (
              <p className="mt-1 text-[10px] text-red-400">{errors.value}</p>
            )}
          </div>
          <div>
            <label htmlFor="date" className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Data
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass("date")}
            />
            {errors.date && (
              <p className="mt-1 text-[10px] text-red-400">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass("category")}
          >
            <option value="">Selecione...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-[10px] text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Modalidade de Pagamento */}
        <div>
          <label htmlFor="paymentMethod" className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Modalidade de Pagamento
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className={inputClass("paymentMethod")}
          >
            <option value="">Selecione...</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
          {errors.paymentMethod && (
            <p className="mt-1 text-[10px] text-red-400">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-xs text-white transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
            form.type === "RECEITA"
              ? "bg-[#10b981] hover:bg-[#0d9488] shadow-[#10b981]/20 hover:shadow-[#10b981]/30"
              : "bg-[#e01a5d] hover:bg-[#c0124e] shadow-[#e01a5d]/20 hover:shadow-[#e01a5d]/30"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processando...
            </span>
          ) : form.type === "RECEITA" ? (
            "Registrar Receita"
          ) : (
            "Registrar Despesa"
          )}
        </button>
      </form>
    </div>
  );
}
