export interface Person {
  id: string;
  name: string;
  age: number;
}

export interface CreatePerson {
  name: string;
  age: number;
}

export type TransactionType = "Expense" | "Income";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  personId: string;
  personName: string;
}

export interface CreateTransaction {
  description: string;
  amount: number;
  type: TransactionType;
  personId: string;
}

export interface TotalsByPerson {
  personId: string;
  personName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ConsolidatedTotals {
  byPerson: TotalsByPerson[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}