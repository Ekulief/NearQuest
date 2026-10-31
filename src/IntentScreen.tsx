import type { UserIntent } from './QuestsScreen'

export default function IntentScreen({ onSelect }: { onSelect: (intent: UserIntent) => void }) {
  return (
    <div className="screen intent-screen">
      <div className="status-bar status-light">
        <span>9:41</span>
        <div className="status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M1 8h2v3H1zm4-3h2v6H5zm4-3h2v9H9zm4-2h2v11h-2z" /></svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4.5a9 9 0 0 1 13 0M3.5 7a5.5 5.5 0 0 1 8 0M6.2 9.3a1.8 1.8 0 0 1 2.6 0" /></svg>
          <span className="battery"><i /></span>
        </div>
      </div>

      <div className="intent-hero">
        <span className="quests-kicker">WELCOME TO SIDEQUEST</span>
        <h1>How are you exploring Baguio?</h1>
        <p>We&apos;ll prioritize the right quests for your stay. You can change this later in Collection.</p>
      </div>

      <div className="intent-choices">
        <button type="button" className="intent-card" onClick={() => onSelect('visitor')}>
          <span className="intent-emoji">🧳</span>
          <strong>I&apos;m visiting for the weekend</strong>
          <p>Unlock curated themed trails — artisan, coffee, eco, and a 3-hour speedrun. No daily reset.</p>
          <span className="intent-cta">Show me trails →</span>
        </button>

        <button type="button" className="intent-card" onClick={() => onSelect('local')}>
          <span className="intent-emoji">🏠</span>
          <strong>I live here / long stay</strong>
          <p>Daily commissions, fog clearing, and ongoing EXP for locals, students, and repeat weekenders.</p>
          <span className="intent-cta">Show me commissions →</span>
        </button>
      </div>
    </div>
  )
}