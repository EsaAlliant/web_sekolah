"use client";
export function BackToTop() { return <button className="floating-action btn btn-light" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Kembali ke atas"><i className="bi bi-arrow-up" aria-hidden="true" /></button>; }
