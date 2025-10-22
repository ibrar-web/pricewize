"use client";

import { useState } from "react";
import { useSearchDevice } from "@/lib/hooks";
import { Search, Loader } from "lucide-react";

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search devices..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { search, loading, error } = useSearchDevice();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await search(query);
      onSearch?.(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Fetching live prices...</span>
        </div>
      )}
    </div>
  );
}

