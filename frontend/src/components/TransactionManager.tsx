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
// Prevents an invalid state: if a subcategory is selected while "Income" is chosen,
// it forces the selection back to "Expense" so that the form never allows a business rule violation.
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
      <div className="panel">
        <h2 className="panel-title">Nova transação</h2>

        <form onSubmit={handleCreate} className="form">
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

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {isMinorSelected && (
          <p className="warning-message">
            Essa pessoa é menor de idade — apenas despesas podem ser cadastradas.
          </p>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="panel">
        <h2 className="panel-title">Pessoas cadastradas</h2>
        <ul className="entry-list">
          {people.map((person) => (
            <li key={person.id}>
              <div className="entry-main">
                <span>
                  {person.name}
                  {person.age < 18 && <span className="badge-minor">menor</span>}
                </span>
                <span className="entry-meta">{person.age} anos</span>
              </div>
              <button className="btn btn-danger" onClick={() => handleDeletePerson(person.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="panel-title">Transações cadastradas</h2>
        <ul className="entry-list">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="entry-main">
                <span>{transaction.description}</span>
                <span className="entry-meta">{transaction.personName}</span>
              </div>
              <span className={`amount ${transaction.type === "Income" ? "amount-income" : "amount-expense"}`}>
                {transaction.type === "Income" ? "+" : "−"} R$ {transaction.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}