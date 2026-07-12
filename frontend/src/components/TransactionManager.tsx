import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import type { Person, Transaction, TransactionType } from "../types/domain";

interface TransactionManagerProps {
  people: Person[];
  onPeopleChanged: () => void;
}

export function TransactionManager({ people, onPeopleChanged }: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [personId, setPersonId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const data = await api.listTransactions();
    setTransactions(data);
  }

  const selectedPerson = people.find((person) => person.id === personId);
  const isMinorSelected = selectedPerson ? selectedPerson.age < 18 : false;

  useEffect(() => {
    if (isMinorSelected && type === "Income") {
      setType("Expense");
    }
  }, [isMinorSelected, type]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await api.createTransaction({ description, amount: Number(amount), type, personId });
      setDescription("");
      setAmount("");
      await loadTransactions();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível cadastrar a transação.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePerson(id: string) {
    setErrorMessage(null);
    try {
      await api.deletePerson(id);
      onPeopleChanged();
      await loadTransactions();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível excluir a pessoa.");
    }
  }

  return (
    <div>
      <h2>Transações</h2>

      <form onSubmit={handleCreate} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <select value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
          <option value="Expense">Despesa</option>
          {!isMinorSelected && <option value="Income">Receita</option>}
        </select>
        <select value={personId} onChange={(event) => setPersonId(event.target.value)} required>
          <option value="">Selecione uma pessoa</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? "Cadastrando..." : "Cadastrar transação"}
        </button>
      </form>

      {isMinorSelected && (
        <p style={{ color: "orange" }}>
          Essa pessoa é menor de idade — apenas despesas podem ser cadastradas.
        </p>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h3>Pessoas cadastradas</h3>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            {person.name} ({person.age} anos){person.age < 18 && " — menor de idade"}
            <button onClick={() => handleDeletePerson(person.id)} style={{ marginLeft: "0.5rem" }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <h3>Transações cadastradas</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.description} — {transaction.type === "Income" ? "Receita" : "Despesa"} — R${transaction.amount} ({transaction.personName})
          </li>
        ))}
      </ul>
    </div>
  );
}