import { useState } from "react";
import songs from "../data/songs.json";
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState("");

  // Filter songs by title or artist
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans px-4">
      
      {/* Responsive Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
        Chords Of Songs
      </h1>

      {/* Responsive Search Bar */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chords, artists, or songs..."
          className="w-full pr-14 px-5 py-3 border-2 border-gray-300 rounded-full text-base sm:text-lg focus:outline-none focus:border-blue-500"
        />

        {/* HOME SEARCH BUTTON */}
        <button
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
        </button>

        {/* Search Results Dropdown */}
        {query && (
          <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <li key={song.slug} className="hover:bg-gray-100">
                  <Link
                    href={`/song/${song.slug}`}
                    className="block px-4 py-2 text-gray-700"
                  >
                    {song.title} – {song.artist}
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

