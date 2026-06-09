import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinanceApp — Gestão Financeira Pessoal",
  description:
    "Gerencie suas finanças pessoais com segurança. Controle receitas, despesas e acompanhe seus gastos por categoria.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
