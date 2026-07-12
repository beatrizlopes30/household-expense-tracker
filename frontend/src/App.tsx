import { useEffect, useState } from "react";
import { api } from "./api/client";
import { PersonManager } from "./components/PersonManager";
import { TransactionManager } from "./components/TransactionManager";
import { TotalsView } from "./components/TotalsView";
import type { Person } from "./types/domain";

type Tab = "transactions" | "totals";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const [people, setPeople] = useState<Person[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPeople();
  }, []);

  async function loadPeople() {
    const data = await api.listPeople();
    setPeople(data);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      <h1>Controle de Gastos Residenciais</h1>

      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("transactions")}>Transações</button>
        <button onClick={() => setActiveTab("totals")}>Totais</button>
        <button onClick={() => setIsModalOpen(true)}>Adicionar Pessoa</button>
      </nav>

     {activeTab === "transactions" && (
  <TransactionManager people={people} onPeopleChanged={loadPeople} />
)}
      {activeTab === "totals" && <TotalsView />}

      {isModalOpen && (
        <PersonManager
          people={people}
          onPeopleChanged={loadPeople}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;