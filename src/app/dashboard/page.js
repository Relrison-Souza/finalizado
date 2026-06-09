"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DashboardCards from "@/components/DashboardCards";
import CategoryChart from "@/components/CategoryChart";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, dashRes, transRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/dashboard"),
        fetch("/api/transactions"),
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const dashboardData = await dashRes.json();
      const transactionsData = await transRes.json();

      setUser(userData.user);
      setDashData(dashboardData);
      setTransactions(transactionsData.transactions || []);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleRefresh() {
    fetchData();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c1b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0c1b] text-white flex flex-col font-sans">
      {/* Header superior da página */}
      <Header userName={user?.name} />

      {/* Main container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Resumo Financeiro (Cards) */}
        <DashboardCards
          saldo={dashData?.saldo || 0}
          totalReceitas={dashData?.totalReceitas || 0}
          totalDespesas={dashData?.totalDespesas || 0}
        />

        {/* Grid de Gráfico + Formulário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div>
            <CategoryChart data={dashData?.categoryBreakdown || []} />
          </div>
          <div>
            <TransactionForm onSuccess={handleRefresh} />
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="w-full">
          <TransactionList
            transactions={transactions}
            onDelete={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
}
