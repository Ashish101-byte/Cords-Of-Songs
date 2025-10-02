
import React from 'react'

// Order inspired by your screenshot
const KEYS = ['Ab','A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#']

export default function KeySelector({ currentKey, onKeyChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, margin: '12px 0 18px 0', overflowX: 'auto' }}>
      {KEYS.map(k => {
        const active = currentKey === k
        return (
          <button
            key={k}
            onClick={() => onKeyChange(k)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: active ? '1px solid #1d4ed8' : '1px solid #e5e7eb',
              background: active ? '#1d4ed8' : '#f3f4f6',
              color: active ? '#fff' : '#111827',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {k}
          </button>
        )
      })}
    </div>
  )
}
