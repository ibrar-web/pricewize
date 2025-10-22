"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface ModelSearchProps {
  placeholder?: string;
  onSearch?: (model: string) => void;
}

const POPULAR_MODELS = [
  "iPhone 15 Pro Max",
  "iPhone 14 Pro",
  "Samsung Galaxy S24",
  "Samsung Galaxy S23",
  "OnePlus 12",
  "MacBook Pro 14",
  "iPad Pro 12.9",
  "Google Pixel 8",
];

export function ModelSearch({ placeholder, onSearch }: ModelSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = POPULAR_MODELS.filter((model) =>
        model.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (model: string) => {
    const slug = model.toLowerCase().replace(/\s+/g, "-");
    if (onSearch) {
      onSearch(model);
    } else {
      router.push(`/devices/${slug}`);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
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
            onFocus={() => query && setShowSuggestions(true)}
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

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {suggestions.map((model, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(model)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <Search size={16} className="inline mr-2 text-gray-400" />
              {model}
            </button>
          ))}
        </div>
      )}

      {/* Popular Models */}
      {!showSuggestions && query === "" && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popular Models:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MODELS.slice(0, 4).map((model, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(model)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

