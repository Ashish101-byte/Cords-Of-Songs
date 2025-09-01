// components/Header.js
import React, { useState } from "react";
import Link from "next/link";
import songs from "../data/songs.json";

const Header = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // mobile search state

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
    } else {
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(value.toLowerCase()) ||
          song.artist.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsSearching(false); // reset mobile view
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between gap-4 py-4 px-4 md:px-20 relative">
          {/* Logo (always visible on desktop, hidden on mobile when searching) */}
          <div
            className={`text-2xl font-bold text-blue-600 whitespace-nowrap md:block 
              ${isSearching ? "hidden md:block" : "block"}`}
          >
            <Link href="/">ChordsOfSongs</Link>
          </div>

          {/* Search Bar */}
          <div
            className={`flex items-center relative transition-all duration-300 
              ${isSearching ? "w-full" : "flex-grow max-w-lg"} `}
          >
            {/* Back Arrow (mobile only) */}
            {isSearching && (
              <button
                onClick={clearSearch}
                aria-label="Back"
                className="md:hidden mr-2 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <input
              type="text"
              value={query}
              onFocus={() => setIsSearching(true)} // expand on mobile focus
              onChange={handleSearchChange}
              placeholder="Search songs..."
              className="w-full border border-gray-300 rounded-full pl-4 pr-14 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Clear/Search Button */}
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </button>

            {/* Dropdown Results */}
            {results.length > 0 && (
              <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                {results.map((song, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/song/${song.slug}`}
                      onClick={clearSearch}
                      className="block px-4 py-2 hover:bg-blue-50"
                    >
                      <span className="font-semibold text-blue-600">
                        {song.title}
                      </span>
                      <span className="text-gray-600 ml-2">
                        ({song.artist})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 font-semibold">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/list" className="text-gray-700 hover:text-blue-600">
              List
            </Link>
            <button
              onClick={handlePrint}
              className="text-gray-700 hover:text-blue-600"
            >
              Print
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className="container mx-auto px-4 block md:hidden"
        style={{
          marginTop: "2px",
          marginBottom: "2px",
          lineHeight: "1.2",
          height: "20px",
        }}
      >
        <nav className="flex justify-center font-semibold">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 border-r border-blue-600 pr-4"
          >
            Home
          </Link>
          <Link
            href="/list"
            className="text-gray-700 hover:text-blue-600 border-r border-blue-600 px-4"
          >
            List
          </Link>
          <button
            onClick={handlePrint}
            className="text-gray-700 hover:text-blue-600 pl-4"
          >
            Print
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
