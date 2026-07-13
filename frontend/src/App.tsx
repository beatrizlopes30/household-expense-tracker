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
    <div className="app-shell">
      <header className="app-header">
        <img src="/logo.png" alt="Controle de Gastos Residenciais" className="app-logo" />
        <h1 className="app-title">Controle de Gastos Residenciais</h1>
      </header>

      <div className="toolbar">
        <nav className="tab-nav">
          <button
            className={`tab-button ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            Transações
          </button>
          <button
            className={`tab-button ${activeTab === "totals" ? "active" : ""}`}
            onClick={() => setActiveTab("totals")}
          >
            Totais
          </button>
        </nav>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Adicionar Pessoa
        </button>
      </div>

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