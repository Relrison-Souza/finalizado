"use client";

export default function DashboardCards({ saldo, totalReceitas, totalDespesas }) {
  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Saldo Atual */}
      <div className="relative overflow-hidden rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Saldo Atual</span>
          <div className="w-8 h-8 rounded-lg bg-[#242142] flex items-center justify-center text-[#7c3aed]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-white">
          {formatCurrency(saldo)}
        </p>
        <span className="text-[10px] text-slate-500 block mt-1">Balanço geral</span>
      </div>

      {/* Total Receitas */}
      <div className="relative overflow-hidden rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total Receitas</span>
          <div className="w-8 h-8 rounded-lg bg-[#142e2b] flex items-center justify-center text-[#10b981]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-[#10b981]">
          {formatCurrency(totalReceitas)}
        </p>
        <span className="text-[10px] text-slate-500 block mt-1">Entradas do período</span>
      </div>

      {/* Total Despesas */}
      <div className="relative overflow-hidden rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total Despesas</span>
          <div className="w-8 h-8 rounded-lg bg-[#2e1422] flex items-center justify-center text-[#e01a5d]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-[#e01a5d]">
          {formatCurrency(totalDespesas)}
        </p>
        <span className="text-[10px] text-slate-500 block mt-1">Saídas do período</span>
      </div>
    </div>
  );
}
