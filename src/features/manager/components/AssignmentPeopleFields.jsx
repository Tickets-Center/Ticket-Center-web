import { useMemo, useState } from "react";

function PersonSearch({ people, placeholder, onSelect }) {
  const [search, setSearch] = useState("");

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return people
      .filter((person) => person.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [people, search]);

  const choose = (person) => {
    onSelect(person);
    setSearch("");
  };

  return (
    <div className="search-field">
      <input
        className="input"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
      />

      {matches.length > 0 && (
        <div className="search-dropdown">
          {matches.map((person) => (
            <button
              type="button"
              key={person.id}
              className="search-option"
              onClick={() => choose(person)}
            >
              {person.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Combined leader + technician picker. Encapsulates the invariant that the
 * leader can never also appear in the technician list.
 */
export default function AssignmentPeopleFields({
  technicians,
  leader,
  selectedTechnicians,
  onLeaderChange,
  onTechniciansChange,
}) {
  const selectLeader = (person) => {
    onLeaderChange(person);
    onTechniciansChange(
      selectedTechnicians.filter((technician) => technician.id !== person.id),
    );
  };

  const availableTechnicians = technicians.filter(
    (technician) =>
      technician.id !== leader?.id &&
      !selectedTechnicians.some((selected) => selected.id === technician.id),
  );

  const addTechnician = (person) => {
    onTechniciansChange([...selectedTechnicians, person]);
  };

  const removeTechnician = (id) => {
    onTechniciansChange(
      selectedTechnicians.filter((technician) => technician.id !== id),
    );
  };

  return (
    <>
      <h3>Assign Leader</h3>
      <PersonSearch
        people={technicians}
        placeholder="Search leader..."
        onSelect={selectLeader}
      />

      {leader && (
        <div className="tag leader-tag">
          {leader.name}
          <button
            type="button"
            className="tag-remove"
            onClick={() => onLeaderChange(null)}
            aria-label={`Remove leader ${leader.name}`}
          >
            ✕
          </button>
        </div>
      )}

      <h3>Assign Technicians</h3>
      <PersonSearch
        people={availableTechnicians}
        placeholder="Search technicians..."
        onSelect={addTechnician}
      />

      {selectedTechnicians.length > 0 && (
        <div className="selected-tags">
          {selectedTechnicians.map((technician) => (
            <div key={technician.id} className="tag">
              {technician.name}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTechnician(technician.id)}
                aria-label={`Remove technician ${technician.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
