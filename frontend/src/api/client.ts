import type {
  Person,
  CreatePerson,
  Transaction,
  CreateTransaction,
  ConsolidatedTotals,
} from "../types/domain";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5168/api";
// Centralizes error handling: any non-2xx response is converted into a JS Error
// using the backend's { message } format, so components only need one try/catch pattern
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Unexpected error communicating with the server.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  listPeople: () => request<Person[]>("/people"),
  createPerson: (dto: CreatePerson) =>
    request<Person>("/people", { method: "POST", body: JSON.stringify(dto) }),
  deletePerson: (id: string) =>
    request<void>(`/people/${id}`, { method: "DELETE" }),

  listTransactions: () => request<Transaction[]>("/transactions"),
  createTransaction: (dto: CreateTransaction) =>
    request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(dto) }),

  getTotals: () => request<ConsolidatedTotals>("/totals"),
};