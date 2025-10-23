"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/home/SearchResults";

interface ModelSearchProps {
  placeholder?: string;
  onSearch?: (model: string) => void;
  showResults?: boolean;
}

export function ModelSearch({ placeholder, onSearch, showResults = true }: ModelSearchProps) {
  const [query, setQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSearchResults(true);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowSearchResults(true)}
            placeholder={placeholder || "Search for a device model..."}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      {showResults && showSearchResults && (
        <SearchResults
          query={query}
          onClose={() => setShowSearchResults(false)}
        />
      )}
    </div>
  );
}

