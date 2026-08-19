import Link from "next/link";
import type { SearchResultItem } from "@/types/search";

export function SearchResult({
  loading,
  onNavigate,
  query,
  results,
  searched,
}: {
  loading: boolean;
  onNavigate: () => void;
  query: string;
  results: SearchResultItem[];
  searched: boolean;
}) {
  if (loading) {
    return (
      <div className="search-result-status">
        <span aria-hidden="true" className="spinner-border spinner-border-sm" role="status" />
        <span>Mencari &ldquo;{query}&rdquo;...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return searched ? (
      <p className="text-body-secondary small mt-3 mb-0">
        Tidak ada hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain.
      </p>
    ) : null;
  }

  return (
    <ul className="search-result-list list-unstyled">
      {results.map((item, index) => (
        <li key={`${item.type}-${index}`}>
          <Link className="search-result-item" href={item.href} onClick={onNavigate}>
            <span className="search-result-icon">
              <i aria-hidden="true" className={`bi ${item.icon}`} />
            </span>
            <span className="search-result-text">
              <span className="search-result-title">{item.title}</span>
              {item.description && <span className="search-result-desc">{item.description}</span>}
              <span className="search-result-type">{item.typeLabel}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
