import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ConsolidatedTotals } from "../types/domain";

export function TotalsView() {
  const [totals, setTotals] = useState<ConsolidatedTotals | null>(null);

  useEffect(() => {
    api.getTotals().then(setTotals);
  }, []);

  if (!totals) {
    return <p>Carregando totais...</p>;
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Totais</h2>

      <ul className="entry-list">
        {totals.byPerson.map((person) => (
          <li key={person.personId}>
            <div className="entry-main">
              <span>{person.personName}</span>
              <span className="entry-meta">
                receitas R$ {person.totalIncome.toFixed(2)} · despesas R$ {person.totalExpense.toFixed(2)}
              </span>
            </div>
            <span className={`amount ${person.balance >= 0 ? "amount-income" : "amount-expense"}`}>
              R$ {person.balance.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="totals-overall">
        <span>Saldo geral</span>
        <span className={`amount ${totals.balance >= 0 ? "amount-income" : "amount-expense"}`}>
          R$ {totals.balance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}