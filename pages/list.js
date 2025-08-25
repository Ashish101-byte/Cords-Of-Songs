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

      {/* Filter Dropdown */}
      <div className="mb-6 flex items-center space-x-2">
        <span className="font-semibold text-gray-700">Filter:</span>
        <div className="relative inline-block">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 border-blue-500 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white text-gray-700"
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

      {/* Song Cards */}
      <div className="space-y-4">
        {filteredSongs.map((song, idx) => (
          <Link
            key={idx}
            href={`/song/${song.slug}`}
            className="block border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md hover:border-blue-400 transition"
          >
            <h2 className="text-lg font-semibold text-blue-600">{song.title}</h2>
            <p className="text-gray-600">{song.artist}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SongList;
