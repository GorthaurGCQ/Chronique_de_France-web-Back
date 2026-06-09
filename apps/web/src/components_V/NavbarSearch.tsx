"use client";

// Module : node_modules/react
import { useState, useEffect, useRef, useCallback } from "react";
// Module : node_modules/next/link
import Link from "next/link";
// Module : node_modules/next/navigation
import { useRouter } from "next/navigation";
// Style : src/components_V/Navbar.module.css
import styles from "./Navbar.module.css";

type SearchResult = {
  id: string;
  titre: string;
  description: string;
  type: string;
  thumbnailUrl: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE: "Chronologie",
  FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif",
  PUBLICATION: "Publication",
};

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const RESULT_LIMIT = 5;

type NavbarSearchProps = {
  fullWidth?: boolean;
  onNavigate?: () => void;
};

export default function NavbarSearch({ fullWidth = false, onNavigate }: NavbarSearchProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          search: query.trim(),
          limit: String(RESULT_LIMIT),
          page: "1",
        });
        const res = await fetch(`/api/resources?${params}`, { signal: controller.signal });
        const json = await res.json();

        if (json.success) {
          setResults(json.data ?? []);
          setTotal(json.meta?.total ?? 0);
          setOpen(true);
        } else {
          setResults([]);
          setTotal(0);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onNavigate?.();
  }, [onNavigate]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect();
      router.push(`/bibliotheque/${results[0].id}`);
    }
  }

  const showDropdown = open && query.trim().length >= MIN_QUERY_LENGTH;
  const remaining = Math.max(0, total - results.length);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.searchWrapper} ${fullWidth ? styles.searchWrapperFull : ""}`}
    >
      <svg
        className={styles.searchIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        placeholder="Rechercher..."
        className={`${styles.searchInput} ${fullWidth ? styles.searchInputFull : ""}`}
        aria-label="Rechercher une ressource"
        aria-expanded={showDropdown}
        aria-controls="navbar-search-results"
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= MIN_QUERY_LENGTH) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <ul id="navbar-search-results" className={styles.searchDropdown} role="listbox">
          {loading && (
            <li className={styles.searchMessage}>Recherche en cours…</li>
          )}
          {!loading && results.length === 0 && (
            <li className={styles.searchMessage}>Aucune ressource trouvée.</li>
          )}
          {!loading &&
            results.map((item) => (
              <li key={item.id} role="option">
                <Link
                  href={`/bibliotheque/${item.id}`}
                  className={styles.searchResult}
                  onClick={handleSelect}
                >
                  <span
                    className={styles.searchThumb}
                    style={
                      item.thumbnailUrl
                        ? { backgroundImage: `url(${item.thumbnailUrl})` }
                        : undefined
                    }
                  />
                  <span className={styles.searchResultText}>
                    <span className={styles.searchResultTitle}>{item.titre}</span>
                    <span className={styles.searchResultMeta}>
                      {TYPE_LABELS[item.type] ?? item.type}
                    </span>
                    <span className={styles.searchResultDesc}>{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          {!loading && remaining > 0 && (
            <li className={styles.searchFooter}>
              + {remaining} autre{remaining > 1 ? "s" : ""} résultat{remaining > 1 ? "s" : ""}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
