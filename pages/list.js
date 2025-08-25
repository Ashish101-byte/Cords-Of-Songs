// pages/list.js
import React, { useState } from "react";
import Link from "next/link";
import songs from "../data/songs.json";

const SongList = () => {
  const [filter, setFilter] = useState("alphabetical");

  const getFilteredSongs = () => {
    let sortedSongs = [...songs];

    switch (filter) {
      case "fast-english":
        sortedSongs = sortedSongs.filter(
          (song) => song.language === "english" && song.speed === "fast"
        );
        break;
      case "slow-english":
        sortedSongs = sortedSongs.filter(
          (song) => song.language === "english" && song.speed === "slow"
        );
        break;
      case "fast-hindi":
        sortedSongs = sortedSongs.filter(
          (song) => song.language === "hindi" && song.speed === "fast"
        );
        break;
      case "slow-hindi":
        sortedSongs = sortedSongs.filter(
          (song) => song.language === "hindi" && song.speed === "slow"
        );
        break;
      case "alphabetical":
      default:
        sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sortedSongs;
  };

  const filteredSongs = getFilteredSongs();

  return (
    <div className="container mx-auto px-4 md:px-20 py-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Songs List</h1>

      {/* Dropdown Filter */}
      <div className="mb-6">
        <div className="relative inline-block w-full md:w-64">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border-2 border-blue-500 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white text-gray-700"
          >
            <option value="alphabetical">Alphabetical</option>
            <option value="fast-english">Fast English</option>
            <option value="slow-english">Slow English</option>
            <option value="fast-hindi">Fast Hindi</option>
            <option value="slow-hindi">Slow Hindi</option>
          </select>
          {/* Custom Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="w-5 h-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Song List - one per row */}
      <div className="space-y-3">
        {filteredSongs.map((song, idx) => (
          <Link
            key={idx}
            href={`/song/${song.slug}`}
            className="block w-full border border-gray-300 rounded-lg px-4 py-3 hover:bg-blue-50 transition"
          >
            <span className="font-semibold text-blue-600">{song.title}</span>
            <span className="text-gray-600 ml-2">({song.artist})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SongList;

