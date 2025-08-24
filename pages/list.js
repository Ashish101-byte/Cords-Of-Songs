import songs from "../data/songs.json";
import SongCard from "../components/SongCard";

export default function SongListPage() {
  const sortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className="container mx-auto px-6 md:px-20 py-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">All Songs</h1>
      <div className="space-y-6">
        {sortedSongs.map((song) => (
          <div key={song.slug} className="w-full">
            <SongCard song={song} fullWidth />
          </div>
        ))}
      </div>
    </div>
  );
}
