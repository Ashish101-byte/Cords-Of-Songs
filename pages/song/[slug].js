import { useRouter } from 'next/router'
import songsData from '../../data/songs.json'
import Head from 'next/head'
import KeySelector from '../../components/KeySelector'
import { useMemo, useState, useEffect } from 'react'

const NOTE_ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT_EQUIV = { Db:'C#', Eb:'D#', Gb:'F#', Ab:'G#', Bb:'A#' }
const SHARP_TO_FLAT = { 'C#':'Db', 'D#':'Eb', 'F#':'Gb', 'G#':'Ab', 'A#':'Bb' }

function normalizeRoot(root) {
  return FLAT_EQUIV[root] || root
}

function preferFlatsForKey(k) {
  if (!k) return false
  if (k.includes('b')) return true
  if (k.includes('#')) return false
  return false
}

function normalizeKeyForSteps(k) {
  if (!k) return 'C'
  const m = String(k).trim().match(/^([A-G][b#]?)/)
  const root = m ? m[1] : 'C'
  return normalizeRoot(root)
}

function transposeRoot(root, steps) {
  const norm = normalizeRoot(root)
  const idx = NOTE_ORDER.indexOf(norm)
  if (idx === -1) return root
  let n = (idx + steps) % 12
  if (n < 0) n += 12
  return NOTE_ORDER[n]
}

function formatPitch(root, useFlats) {
  if (!useFlats) return root
  return SHARP_TO_FLAT[root] || root
}

function transposeSingleChord(chord, steps, useFlats) {
  if (!chord) return chord
  const parts = chord.split('/')
  const [rootPart, bassPart] = parts
  const match = rootPart.match(/^([A-G](?:#|b)?)(.*)$/)
  if (!match) return chord
  const [, root, suffix] = match
  let transposedRoot = transposeRoot(root, steps)
  transposedRoot = formatPitch(transposedRoot, useFlats)
  if (parts.length === 2) {
    const bassMatch = bassPart.match(/^([A-G](?:#|b)?)(.*)$/)
    const bassRoot = bassMatch ? bassMatch[1] : bassPart
    let transposedBass = transposeRoot(bassRoot, steps)
    transposedBass = formatPitch(transposedBass, useFlats)
    return `${transposedRoot}${suffix || ''}/${transposedBass}`
  }
  return `${transposedRoot}${suffix || ''}`
}

function parseLineSegments(line) {
  const segs = []
  const regex = /(\[[^\]]+\])|([^\[]+)/g
  let match
  while ((match = regex.exec(line)) !== null) {
    if (match[1]) {
      const chord = match[1].slice(1, -1)
      segs.push({ chord, text: '' })
    } else if (match[2]) {
      segs.push({ chord: '', text: match[2] })
    }
  }
  return segs
}

export default function SongPage() {
  const router = useRouter()
  const { slug } = router.query

  const song = useMemo(() => {
    return songsData.find(s => s.slug === slug)
  }, [slug])

  const [currentKey, setCurrentKey] = useState('C')

  useEffect(() => {
    if (song?.key) setCurrentKey(song.key)
  }, [song?.key])

  const steps = useMemo(() => {
    const kFrom = normalizeKeyForSteps(song?.key || 'C')
    const kTo = normalizeKeyForSteps(currentKey || 'C')
    const idxFrom = NOTE_ORDER.indexOf(kFrom)
    const idxTo = NOTE_ORDER.indexOf(kTo)
    if (idxFrom === -1 || idxTo === -1) return 0
    return idxTo - idxFrom
  }, [currentKey, song?.key])

  const useFlats = useMemo(() => preferFlatsForKey(currentKey), [currentKey])

  if (!song) {
    return (
      <main className='container'>
        <p>Loading...</p>
      </main>
    )
  }

  const lines = String(song.content || '').split('\n')

  return (
    <>
      <Head>
        <title>{song.title} — {song.artist}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className='container' style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        
        {/* Screen view */}
        <div className="screen-only">
          <h1 style={{ margin: '6px 0' }}>{song.title}</h1>
          <p style={{ margin: '0 0 12px 0', opacity: 0.8 }}>{song.artist}</p>

          <KeySelector currentKey={currentKey} onKeyChange={setCurrentKey} />

          <div style={{
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {lines.map((line, i) => {
              const segs = parseLineSegments(line)
              let chordLine = ''
              let lyricLine = ''
              segs.forEach(seg => {
                const chord = seg.chord ? transposeSingleChord(seg.chord, steps, useFlats) : ''
                chordLine += chord.padEnd(seg.text.length || 1, ' ')
                lyricLine += seg.text
              })
              return (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div className="font-semibold text-blue-600">{chordLine}</div>
                  <div>{lyricLine}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Print-only area */}
        <div id="print-area" className="print-only" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {/* Title */}
          <h1 style={{ margin: '6px 0', fontSize: '28px' }}>{song.title}</h1>

          {/* Artist + Key with black line below */}
          <p style={{ margin: '0 0 12px 0' }}>
            {song.artist} — Key: {currentKey}
          </p>
          <hr style={{ border: '0.1 px solid #000', margin: '12px 0 20px 0', fontWeight:"lighter" }} />

          {/* Lyrics + Chords */}
          {lines.map((line, i) => {
            const segs = parseLineSegments(line)
            let chordLine = ''
            let lyricLine = ''
            segs.forEach(seg => {
              const chord = seg.chord ? transposeSingleChord(seg.chord, steps, useFlats) : ''
              chordLine += chord.padEnd(seg.text.length || 1, ' ')
              lyricLine += seg.text
            })
            return (
              <div key={i} style={{ marginBottom: 4 }}>
                <div className="font-semibold text-blue-600">{chordLine}</div>
                <div>{lyricLine}</div>
              </div>
            )
          })}
        </div>

      </main>
    </>
  )
}
