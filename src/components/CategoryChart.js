"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Usamos uma paleta de cores elegantes e compatíveis com a imagem (predomínio de azul-claro violáceo)
const COLORS = [
  "#8b93ff", "#38bdf8", "#a78bfa", "#f43f5e",
  "#fb923c", "#facc15", "#2dd4bf", "#ec4899"
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181630]/95 border border-[#2a2754]/60 rounded-xl px-4 py-2 shadow-2xl">
        <p className="text-xs font-semibold text-white">{payload[0].name}</p>
        <p className="text-xs text-[#8b93ff] font-bold mt-0.5">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default function CategoryChart({ data }) {
  // Calcula o total das despesas
  const total = data ? data.reduce((acc, curr) => acc + curr.value, 0) : 0;

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="rounded-2xl bg-[#181630] border border-[#2a2754]/40 p-6 flex flex-col justify-between h-full shadow-lg">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-[#8b93ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <h3 className="text-sm font-semibold text-white">Despesas por Categoria</h3>
        </div>

        {/* Chart Content */}
        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs">Nenhuma despesa para esta visualização</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Rosca */}
            <div className="w-full h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationDuration={600}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3 mb-6">
              {data.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[11px] font-medium text-slate-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-[#2a2754]/40 pt-4 flex items-center justify-between text-xs mt-auto">
        <span className="text-slate-400">Total de despesas</span>
        <span className="font-bold text-[#e01a5d]">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
