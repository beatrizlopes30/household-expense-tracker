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
    setAge(value.replace(/\D/g, ""));
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Cadastro de Pessoas</h2>
          <button className="btn btn-outline" onClick={onClose}>Fechar</button>
        </div>

        <form onSubmit={handleCreate} className="form" style={{ marginBottom: "1rem" }}>
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

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
              <button className="btn btn-danger" onClick={() => handleDelete(person.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}