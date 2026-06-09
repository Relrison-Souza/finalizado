import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(200, "Descrição muito longa"),
  value: z
    .number()
    .positive("Valor deve ser positivo")
    .max(999999999, "Valor muito alto"),
  type: z.enum(["RECEITA", "DESPESA"], {
    errorMap: () => ({ message: "Tipo deve ser RECEITA ou DESPESA" }),
  }),
  category: z
    .string()
    .min(1, "Categoria é obrigatória"),
  paymentMethod: z.enum(
    ["PIX", "DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"],
    { errorMap: () => ({ message: "Modalidade de pagamento inválida" }) }
  ),
  date: z.string().min(1, "Data é obrigatória"),
});

export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Moradia",
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
];

export const PAYMENT_METHODS = [
  { value: "PIX", label: "Pix" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
  { value: "BOLETO", label: "Boleto" },
];

export function getPaymentMethodLabel(value) {
  const method = PAYMENT_METHODS.find((m) => m.value === value);
  return method ? method.label : value;
}
