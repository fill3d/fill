import { useEffect, useState } from "react"

export interface UseSearchInput {
  /**
   * API route endpoint.
   * Defaults to `/api/search`.
   */
  url?: string;
}

export interface SearchInput {
  /**
   * Search ID.
   */
  id: string;
  /**
   * Search query.
   */
  query: string;
}

export interface SearchResult {
  /**
   * Object ID.
   */
  id: string;
  /**
   * Object preview image URL.
   */
  preview: string;
}

export interface UseSearchReturn {
  /**
   * Set the search query.
   */
  search: (input: SearchInput) => void;
  /**
   * Search ID.
   */
  id?: string;
  /**
   * Search results.
   */
  results?: SearchResult[];
  /**
   * Whether a search is currently loading.
   */
  loading: boolean;
  /**
   * Search error.
   */
  error?: string;
}

export function useSearch ({ url = "/api/search" }: UseSearchInput): UseSearchReturn {
  // State
  const [id, setId] = useState<string>(null);
  const [query, setQuery] = useState<string>(null);
  const [results, setResults] = useState<SearchResult[]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(null);
  // Effects
  useEffect(() => {
    // Define handler
    const search = async () => {
      setLoading(true);
      // Search
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      // Extract
      const { results, error } = await response.json();
      setLoading(false);
      if (response.status >= 400)
        setError(error);
      else
        setResults(results);
      setLoading(false);
    };
    // Reset state
    setError(null);
    // Search
    if (query)
      search();
    else
      setResults(null);
  }, [query]);
  // Create wrapper
  const wrapper = ({ id, query }: SearchInput) => {
    setId(id);
    setQuery(query);
  };
  // Return
  return { search: wrapper, id, results, loading, error };
}