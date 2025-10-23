"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Brand {
  brand: string;
  totalDevices: number;
  categories: string[];
}

interface BrandFilterProps {
  onBrandChange?: (brand: string) => void;
  onCategoryChange?: (category: string) => void;
  selectedBrand?: string;
  selectedCategory?: string;
}

export function BrandFilter({
  onBrandChange,
  onCategoryChange,
  selectedBrand = "",
  selectedCategory = "",
}: BrandFilterProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brands");

        const data = await response.json();
        setBrands(data.data || []);

        // Extract unique categories from all brands
        const allCategories = new Set<string>();
        data.data.forEach((brand: Brand) => {
          brand.categories.forEach((cat) => allCategories.add(cat));
        });
        setCategories(Array.from(allCategories).sort());
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      {/* Brand Filter */}
      <Select value={selectedBrand || "all"} onValueChange={(value) => onBrandChange?.(value === "all" ? "" : value)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.brand} value={brand.brand}>
              {brand.brand} ({brand.totalDevices})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select value={selectedCategory || "all"} onValueChange={(value) => onCategoryChange?.(value === "all" ? "" : value)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

