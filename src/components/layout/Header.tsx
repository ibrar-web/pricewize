"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PriceWize</h1>
              <p className="text-xs text-gray-500">Smart Device Deals</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/devices"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Browse
            </Link>
            <Link
              href="/compare"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Compare
            </Link>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden sm:block">
            <Link
              href="/devices"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

