"use client";

import { useState } from "react";

export function ContactForm({ whatsappUrl }: { whatsappUrl: string }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const text = [
      "Assalamu'alaikum, saya ingin menghubungi pihak sekolah:",
      "",
      `Nama: ${name}`,
      `Perihal: ${subject}`,
      `Pesan: ${message}`,
    ].join("\n");

    const separator = whatsappUrl.includes("?") ? "&" : "?";
    window.open(`${whatsappUrl}${separator}text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <form className="ppdb-form" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="contactName">Nama</label>
          <input className="form-control" id="contactName" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="contactSubject">Perihal</label>
          <input className="form-control" id="contactSubject" onChange={(event) => setSubject(event.target.value)} required type="text" value={subject} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="contactMessage">Pesan</label>
          <textarea className="form-control" id="contactMessage" onChange={(event) => setMessage(event.target.value)} required rows={4} value={message} />
        </div>
      </div>

      <button className="btn btn-primary btn-lg ppdb-submit" type="submit">
        <i aria-hidden="true" className="bi bi-whatsapp" /> Kirim via WhatsApp
      </button>
    </form>
  );
}
