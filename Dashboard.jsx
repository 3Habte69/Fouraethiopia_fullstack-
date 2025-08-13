import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase.js'
import { collection, addDoc, getDocs } from 'firebase/firestore'

const SAMPLE_QUIZ = [
  { q: "Which river flows through Ethiopia's capital, Addis Ababa?", options: ['Awash', 'Nile', 'Gibe', 'Omo'], answer: 0 },
  { q: 'Which university is the oldest in Ethiopia?', options: ['Bahir Dar', 'Jimma', 'Addis Ababa University', 'Mekelle'], answer: 2 },
  { q: 'What is the official working language of the Federal Government of Ethiopia?', options: ['Tigrinya', 'Afan Oromo', 'Amharic', 'Somali'], answer: 2 },
  { q: 'Which is NOT a region of Ethiopia?', options: ['Sidama', 'Afar', 'Benishangul-Gumuz', 'Darfur'], answer: 3 },
]

export default function Dashboard() {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const user = auth.currentUser

  async function submitAnswer() {
    if (selected === null) return
    if (selected === SAMPLE_QUIZ[current].answer) setScore(s => s + 1)
    if (current + 1 < SAMPLE_QUIZ.length) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      setDone(true)
      try {
        await addDoc(collection(db, 'scores'), {
          uid: user.uid,
          email: user.email,
          score: score + (selected === SAMPLE_QUIZ[current].answer ? 1 : 0),
          total: SAMPLE_QUIZ.length,
          createdAt: new Date()
        })
      } catch (e) {
        console.error('Failed to save score:', e)
      }
      loadLeaderboard()
    }
  }

  async function loadLeaderboard() {
    try {
      const snap = await getDocs(collection(db, 'scores'))
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      rows.sort((a,b)=> (b.score - a.score) || (new Date(b.createdAt?.seconds? b.createdAt.seconds*1000:b.createdAt) - new Date(a.createdAt?.seconds? a.createdAt.seconds*1000:a.createdAt)))
      setLeaderboard(rows.slice(0,10))
    } catch (e) { console.error(e) }
  }

  useEffect(()=>{ loadLeaderboard() }, [])

  if (!user) return <div>Please login.</div>

  return (
    <div>
      <h2>Quiz Dashboard</h2>
      {!started && !done && (
        <div>
          <p>Hi <b>{user.displayName || user.email}</b> 👋 — take a quick quiz! 4 questions about Ethiopia.</p>
          <button onClick={()=>{ setStarted(true); setCurrent(0); setSelected(null); setScore(0); }}>Start Quiz</button>
        </div>
      )}

      {started && !done && (
        <div style={{ marginTop: 16 }}>
          <div>
            <b>Question {current+1}/{SAMPLE_QUIZ.length}</b><br/>
            <p style={{ margin: '8px 0' }}>{SAMPLE_QUIZ[current].q}</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {SAMPLE_QUIZ[current].options.map((opt, idx)=>(
                <label key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="radio" name="opt" checked={selected===idx} onChange={()=>setSelected(idx)} />
                  {opt}
                </label>
              ))}
            </div>
            <button style={{ marginTop: 12 }} onClick={submitAnswer}>Submit</button>
          </div>
        </div>
      )}

      {done && (
        <div style={{ marginTop: 16 }}>
          <h3>Finished! 🎉</h3>
          <p>Your score: <b>{score}</b> / {SAMPLE_QUIZ.length}</p>
          <button onClick={()=>{ setStarted(false); setDone(false); setCurrent(0); setSelected(null); setScore(0); }}>Try again</button>
        </div>
      )}

      <hr style={{ margin: '24px 0' }} />
      <h3>Leaderboard (Top 10)</h3>
      <ol>
        {leaderboard.map(row => (
          <li key={row.id}>
            {row.email} — <b>{row.score}</b> / {row.total}
          </li>
        ))}
      </ol>
    </div>
  )
}
