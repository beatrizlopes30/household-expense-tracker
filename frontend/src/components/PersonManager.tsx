import { useState, type FormEvent } from "react";
import { api } from "../api/client";
import type { Person } from "../types/domain";

interface PersonManagerProps {
  people: Person[];
  onPeopleChanged: () => void;
  onClose: () => void;
}

export function PersonManager({ people, onPeopleChanged, onClose }: PersonManagerProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleAgeChange(value: string) {
    const digitsOnly = value.replace(/\D/g, "");
    setAge(digitsOnly);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await api.createPerson({ name, age: Number(age) });
      setName("");
      setAge("");
      onPeopleChanged();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível cadastrar a pessoa.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.deletePerson(id);
      onPeopleChanged();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível excluir a pessoa.");
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Cadastro de Pessoas</h2>
          <button onClick={onClose}>Fechar</button>
        </div>

        <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Idade"
            value={age}
            onChange={(event) => handleAgeChange(event.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.name} ({person.age} anos){person.age < 18 && " — menor de idade"}
              <button onClick={() => handleDelete(person.id)} style={{ marginLeft: "0.5rem" }}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  minWidth: "400px",
  maxWidth: "90vw",
  maxHeight: "80vh",
  overflowY: "auto",
};