import { useRouter } from 'next/router'
import songsData from '../../data/songs.json'
import Head from 'next/head'
import KeySelector from '../../components/KeySelector'
import { useMemo, useState, useEffect } from 'react'
// fffffff
const NOTE_ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT_EQUIV = { Db:'C#', Eb:'D#', Gb:'F#', Ab:'G#', Bb:'A#' }
const SHARP_TO_FLAT = { 'C#':'Db', 'D#':'Eb', 'F#':'Gb', 'G#':'Ab', 'A#':'Bb' }

function normalizeRoot(root) { return FLAT_EQUIV[root] || root }
function preferFlatsForKey(k) { if (!k) return false; if (k.includes('b')) return true; if (k.includes('#')) return false; return false }
function normalizeKeyForSteps(k) { const m = String(k).trim().match(/^([A-G][b#]?)/); return normalizeRoot(m ? m[1] : 'C') }
function transposeRoot(root, steps) { const norm = normalizeRoot(root); let n = (NOTE_ORDER.indexOf(norm) + steps) % 12; if (n < 0) n += 12; return NOTE_ORDER[n] || root }
function formatPitch(root, useFlats) { return useFlats ? SHARP_TO_FLAT[root] || root : root }
function transposeSingleChord(chord, steps, useFlats) { 
  if (!chord) return chord
  const parts = chord.split('/')
  const [rootPart, bassPart] = parts
  const match = rootPart.match(/^([A-G](?:#|b)?)(.*)$/)
  if (!match) return chord
  let [, root, suffix] = match
  let transposedRoot = formatPitch(transposeRoot(root, steps), useFlats)
  if (parts.length === 2) {
    const bassMatch = bassPart.match(/^([A-G](?:#|b)?)(.*)$/)
    const bassRoot = bassMatch ? bassMatch[1] : bassPart
    let transposedBass = formatPitch(transposeRoot(bassRoot, steps), useFlats)
    return `${transposedRoot}${suffix || ''}/${transposedBass}`
  }
  return `${transposedRoot}${suffix || ''}`
}

function parseLineSegments(line) {
  const segs = []
  const regex = /(\[[^\]]+\])|([^\[]+)/g
  let match
  while ((match = regex.exec(line)) !== null) {
    if (match[1]) segs.push({ chord: match[1].slice(1, -1), text: '' })
    else if (match[2]) segs.push({ chord: '', text: match[2] })
  }
  return segs
}

export default function SongPage() {
  const router = useRouter()
  const { slug } = router.query

  const song = useMemo(() => songsData.find(s => s.slug === slug), [slug])
  const [currentKey, setCurrentKey] = useState('C')
  const [twoColumns, setTwoColumns] = useState(false)

  useEffect(() => {
    if (song?.key) setCurrentKey(song.key)
  }, [song?.key])

  const steps = useMemo(() => {
    const kFrom = normalizeKeyForSteps(song?.key || 'C')
    const kTo = normalizeKeyForSteps(currentKey || 'C')
    return NOTE_ORDER.indexOf(kTo) - NOTE_ORDER.indexOf(kFrom)
  }, [currentKey, song?.key])

  const useFlats = useMemo(() => preferFlatsForKey(currentKey), [currentKey])

  if (!song) return <main className='container'><p>Loading...</p></main>

  const lines = String(song.content || '').split('\n')

  // Split lines for two-column layout
  const midIndex = Math.ceil(lines.length / 2)
  const leftColumn = lines.slice(0, twoColumns ? midIndex : lines.length)
  const rightColumn = twoColumns ? lines.slice(midIndex) : []

  // Render lines with chords above lyrics
  const renderLines = (linesArray) => {
    return linesArray.map((line, i) => {
      const segs = parseLineSegments(line)
      let chordLine = ''
      let lyricLine = ''
      segs.forEach(seg => {
        const chord = seg.chord ? transposeSingleChord(seg.chord, steps, useFlats) : ''
        chordLine += chord.padEnd(seg.text.length || 1, ' ')
        lyricLine += seg.text
      })
      return (
        <div key={i} style={{ marginBottom: 2, whiteSpace: 'pre' }}>
          <div style={{ fontWeight: 'bold', color: '#1e40af' }}>{chordLine}</div>
          <div>{lyricLine}</div>
        </div>
      )
    })
  }

  return (
    <>
      <Head>
        <title>{song.title} — {song.artist}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className='container' style={{ maxWidth: 900, margin: '0 auto', padding: 16, fontFamily: 'monospace' }}>
        <h1 style={{ margin: '6px 0', fontSize:'30px',fontWeight:'bold',fontFamily:'"Muse Display Harmony", "Open Sans", -apple-system, Roboto, "Helvetic' }}>{song.title}</h1>

        {/* Artist + Key + Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize:'15px',fontWeight:'bold',fontFamily:'"Muse Display Harmony", "Open Sans", -apple-system, Roboto, "Helvetic' }}>{song.artist} — Key: {currentKey}</p>
          <button
            style={{ marginLeft: 16, padding: '4px 8px', cursor: 'pointer', fontFamily:'"Muse Display Harmony", "Open Sans", -apple-system, Roboto, "Helvetic' }}
            onClick={() => setTwoColumns(prev => !prev)}
          >
            {twoColumns ? 'Two Columns' : 'One Column'}
          </button>
        </div>

        <KeySelector currentKey={currentKey} onKeyChange={setCurrentKey} />

        {/* Screen view */}
        <div style={{ display: 'flex', gap: twoColumns ? '40px' : '0px' }}>
          <div style={{ flex: 1 }}>{renderLines(leftColumn)}</div>
          {twoColumns && <div style={{ flex: 1 }}>{renderLines(rightColumn)}</div>}
        </div>

        {/* Print area */}
        <div
          id="print-area"
          style={{
            visibility: 'hidden',
            height: 0,
            overflow: 'hidden',
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            width: '100%'
          }}
        >
          <h1 style={{ marginBottom: '4px',fontSize: '30px',fontWeight:'bold',fontFamily:'"Muse Display Harmony", "Open Sans", -apple-system, Roboto, "Helvetic' }}>{song.title}</h1>
          <p style={{ marginTop: 0, marginBottom: '8px',fontWeight:'bold',fontFamily:'"Muse Display Harmony", "Open Sans", -apple-system, Roboto, "Helvetic' }}>
            {song.artist} — Key: {currentKey}
          </p>

          {/* Thin blue line starting where title starts */}
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid gray',
              margin: '8px 0 16px 0',
              width: '100%'
            }}
          />

          <div style={{ display: 'flex', gap: twoColumns ? '40px' : '0px', width: '100%' }}>
            <div style={{ flex: 1 }}>{renderLines(leftColumn)}</div>
            {twoColumns && <div style={{ flex: 1 }}>{renderLines(rightColumn)}</div>}
          </div>
        </div>

        <style jsx>{`
          @media print {
            body * { visibility: hidden; }
            #print-area, #print-area * { visibility: visible; }
            #print-area { position: absolute; top: 0; left: 0; width: 100%; height: auto; }
          }
        `}</style>
      </main>
    </>
  )
}
