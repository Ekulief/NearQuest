import { useState, type ReactNode } from 'react'

type QuestRoute = 'map' | 'quests' | 'profile' | 'quest'
type Filter = 'Daily Commissions (3)' | 'Themed Trails' | 'Completed'

const activeQuests = [
  {
    id: 'easter-weaving',
    title: 'Threads of Guisad',
    place: 'Easter Weaving Room',
    location: 'Guisad',
    reward: '150',
    progress: '0/1 Photo Verified',
    type: 'weave',
    description: 'Find the heritage looms and verify your visit.',
  },
  {
    id: 'woodcarvers-nook',
    title: "Woodcarver's Nook",
    place: 'Asin Road Workshops',
    location: 'Asin',
    reward: '120',
    progress: '0/1 Photo Verified',
    type: 'wood',
    description: 'Meet a local carver and spot a hand-finished piece.',
  },
  {
    id: 'pine-brew',
    title: 'Pine & Brew',
    place: 'Guisad Local Cafe',
    location: 'Ambuklao',
    reward: '100',
    progress: '0/1 Photo Verified',
    type: 'coffee',
    description: 'Check in with a locally roasted cup above the pines.',
  },
]

// Themed trails: the visitor picks which stops to do. Partner businesses appear as ordinary stops.
const themedTrails = [
  { id: 'coffee', icon: 'coffee', title: 'Baguio Specialty Coffee Trail', blurb: 'Choose any 5 of 8 cafes · Half day', reward: '500', badge: 'Coffee Master Badge' },
  { id: 'crafts', icon: 'location', title: 'Crafts & Heritage Trail', blurb: 'Choose any 3 of 6 workshops · 2–3 hrs', reward: '400', badge: 'Heritage Keeper Badge' },
  { id: 'pines', icon: 'leaf', title: 'Pine Views & Fresh Air', blurb: 'Choose any 3 of 5 viewpoints · 2 hrs', reward: '350', badge: 'Pine Wanderer Badge' },
]

function ThemedTrailCard({ trail }: { trail: (typeof themedTrails)[number] }) {
  return (
    <section className="sponsor-trail">
      <div className="sponsor-icon"><QuestIcon name={trail.icon} size={25} /></div>
      <div className="sponsor-copy">
        <span>THEMED TRAIL</span>
        <strong>{trail.title}</strong>
        <p>{trail.blurb}</p>
        <div><b>{trail.reward} EXP</b><i>+</i><b>{trail.badge}</b></div>
      </div>
      <QuestIcon name="arrow" size={18} />
    </section>
  )
}

function QuestIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z" /><path d="M8 3v15M16 6v15" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9Z" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7Z" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    leaf: <><path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14Z" /><path d="m5 19 8-8" /></>,
    coffee: <><path d="M5 9h12v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" /><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function QuestStatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="status-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M1 8h2v3H1zm4-3h2v6H5zm4-3h2v9H9zm4-2h2v11h-2z" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4.5a9 9 0 0 1 13 0M3.5 7a5.5 5.5 0 0 1 8 0M6.2 9.3a1.8 1.8 0 0 1 2.6 0" /></svg>
        <span className="battery"><i /></span>
      </div>
    </div>
  )
}

function QuestVisual({ type }: { type: string }) {
  return (
    <div className={`active-quest-visual ${type}`}>
      <div className="quest-visual-pattern" />
      <span>{type === 'weave' ? 'W' : type === 'wood' ? '✦' : '♨'}</span>
    </div>
  )
}

export default function QuestsScreen({ 
  go, 
  onSelectQuest 
}: { 
  go: (screen: QuestRoute) => void, 
  onSelectQuest: (id: string) => void 
}) {
  const [filter, setFilter] = useState<Filter>('Daily Commissions (3)')
  const filters: Filter[] = ['Daily Commissions (3)', 'Themed Trails', 'Completed']

  return (
    <div className="screen quests-screen">
      <QuestStatusBar />
      <header className="quests-header">
        <span className="quests-kicker">EXPLORE BAGUIO</span>
        <div className="quests-title">Active & Daily Quests</div>
        <p>Complete daily commissions to clear city fog and earn heritage badges.</p>
      </header>

      <div className="quest-filter-tabs" role="tablist" aria-label="Quest filters">
        {filters.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={filter === item}
            className={filter === item ? 'is-active' : ''}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <main className="quests-scroll">
        <div className="active-list-heading">
          <span>{filter === 'Daily Commissions (3)' ? 'TODAY’S ACTIVE DECK' : filter.toUpperCase()}</span>
          <strong>{filter === 'Daily Commissions (3)' ? '3 quests' : filter === 'Themed Trails' ? `${themedTrails.length} trails` : 'None yet'}</strong>
        </div>

        {filter === 'Daily Commissions (3)' && (
          <>
            <div className="active-quest-list">
              {activeQuests.map((quest) => (
                <article className="active-quest-card" key={quest.id}>
                  <QuestVisual type={quest.type} />
                  <div className="active-quest-body">
                    <div className="quest-card-topline">
                      <span className="location-tag"><QuestIcon name="location" size={11} />{quest.location}</span>
                      <span className="exp-tag"><QuestIcon name="spark" size={11} />+{quest.reward} EXP</span>
                    </div>
                    <strong className="active-quest-title">{quest.title}</strong>
                    <span className="active-quest-place">{quest.place}</span>
                    <p>{quest.description}</p>
                    <div className="quest-progress-row"><span>{quest.progress}</span><strong>0%</strong></div>
                    <div className="quest-progress-track"><i /></div>
                    <button
                      type="button"
                      className="start-quest-button"
                      onClick={() => {
                        onSelectQuest(quest.id)
                        go('quest')
                      }}
                    >
                      Start Quest <QuestIcon name="arrow" size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <ThemedTrailCard trail={themedTrails[0]} />
          </>
        )}

        {filter === 'Themed Trails' && (
          <>
            <p className="trail-intro">Short on time? Pick a theme, then choose the stops that fit your day.</p>
            {themedTrails.map((trail) => (
              <ThemedTrailCard trail={trail} key={trail.id} />
            ))}
          </>
        )}

        {filter === 'Completed' && (
          <div className="quest-empty-state">
            <QuestIcon name="spark" size={30} />
            <strong>No completed quests yet</strong>
            <p>Your cleared commissions will appear here.</p>
          </div>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button type="button" className="btn btn-ghost" onClick={() => go('map')}><QuestIcon name="map" /><span>Explore</span></button>
        <button type="button" className="btn btn-ghost nav-active" onClick={() => go('quests')}><QuestIcon name="compass" /><span>Quests</span></button>
        <button type="button" className="btn btn-ghost" onClick={() => go('profile')}><QuestIcon name="user" /><span>Collection</span></button>
      </nav>
    </div>
  )
}