"use client";

interface ListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function ListInput({ label, items, onChange, placeholder, multiline = false }: ListInputProps) {
  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const addItem = () => onChange([...items, ""]);

  return (
    <div>
      <label className="form-label d-block">{label}</label>
      <div className="d-grid gap-2">
        {items.map((item, index) => (
          <div className="d-flex gap-2" key={index}>
            {multiline ? (
              <textarea className="form-control" onChange={(event) => updateItem(index, event.target.value)} placeholder={placeholder} rows={2} value={item} />
            ) : (
              <input className="form-control" onChange={(event) => updateItem(index, event.target.value)} placeholder={placeholder} type="text" value={item} />
            )}
            <button className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={() => removeItem(index)} type="button">
              <i aria-hidden="true" className="bi bi-x-lg" />
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mt-2" onClick={addItem} type="button">
        <i aria-hidden="true" className="bi bi-plus-lg" /> Tambah Baris
      </button>
    </div>
  );
}
