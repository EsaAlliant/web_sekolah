"use client";
import { useState } from "react";
export function FloatingAccessibility() {
  const [isOpen, setIsOpen] = useState(false);
  const [readable, setReadable] = useState(false);
  const [contrast, setContrast] = useState(false);
  const toggleReadable = () => { document.body.classList.toggle("accessibility-readable"); setReadable((value) => !value); };
  const toggleContrast = () => { document.body.classList.toggle("accessibility-contrast"); setContrast((value) => !value); };
  return <div className="accessibility-control"><div className={`accessibility-menu ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}><button type="button" className="btn btn-light" onClick={toggleReadable} aria-pressed={readable}>Ukuran teks</button><button type="button" className="btn btn-light" onClick={toggleContrast} aria-pressed={contrast}>Kontras tinggi</button></div><button className="floating-action btn btn-primary" type="button" onClick={() => setIsOpen((value) => !value)} aria-label="Buka pilihan aksesibilitas" aria-expanded={isOpen}><i className="bi bi-universal-access" aria-hidden="true" /></button></div>;
}
