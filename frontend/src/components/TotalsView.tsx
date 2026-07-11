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
    <div>
      <h2>Totais</h2>

      <ul>
        {totals.byPerson.map((person) => (
          <li key={person.personId}>
            {person.personName}: receitas R${person.totalIncome}, despesas R${person.totalExpense}, saldo R${person.balance}
          </li>
        ))}
      </ul>

      <hr />

      <p>
        <strong>Total geral:</strong> receitas R${totals.totalIncome}, despesas R${totals.totalExpense}, saldo R${totals.balance}
      </p>
    </div>
  );
}