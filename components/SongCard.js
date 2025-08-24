        import Link from 'next/link'
export default function SongCard({ song }) {
  return (
    <article className='card'>
      <Link href={'/song/' + song.slug} className='card-link'>
        <div className='card-body'>
          <div className='card-title'>{song.title}</div>
          <div className='card-artist'>{song.artist}</div>
        </div>
      </Link>
    </article>
  )
}
