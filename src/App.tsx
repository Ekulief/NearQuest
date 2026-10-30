import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import QuestsScreen from './QuestsScreen'
import AuthScreen, { clearSession, initials, loadSession, saveSession, type User } from './AuthScreen'
import greenLogo from '../public/GreenLogo.png'
import whiteLogo from '../public/WhiteLogo.png'

type Screen = 'map' | 'quests' | 'quest' | 'camera' | 'clear' | 'profile'

const cameraImage =
  'https://images.unsplash.com/photo-1700408194900-801f26396f68?auto=format&fit=crop&w=900&q=88'

function Icon({
  name,
  size = 20,
  strokeWidth = 2,
}: {
  name: string
  size?: number
  strokeWidth?: number
}) {
  const paths: Record<string, ReactNode> = {
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z" /><path d="M8 3v15M16 6v15" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9Z" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    arrow: <><path d="m15 18-6-6 6-6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h2a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3" /></>,
    jeep: <><path d="M4 16V8l2-3h11l3 4v7" /><path d="M3 13h18M7 16v2M17 16v2" /><circle cx="7" cy="13" r="1" /><circle cx="17" cy="13" r="1" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    walk: <><circle cx="13" cy="5" r="2" /><path d="m10 21 2-6-3-3 2-4 4 3 3 1M12 15l4 6M9 12l-3 3" /></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.9 7.5-9.5V6Z" /><path d="m9 12 2 2 4-4" /></>,
    sun: <><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    flash: <path d="m13 2-7 12h6l-1 8 7-12h-6Z" />,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7Z" />,    ticket: <><path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" /><path d="M14 6v2M14 11v2M14 16v2" /></>,
    logout: <><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="m16 8 4 4-4 4M20 12H9" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 4H5a2 2 0 0 0 2 4M17 4h2a2 2 0 0 1-2 4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
'user-plus': <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  ariaLabel?: string
}) {
  return <button type="button" aria-label={ariaLabel} onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand-mark ${light ? 'brand-light' : ''}`}>
      <img
        src={light ? whiteLogo : greenLogo}
        alt="SideQuest"
        className="brand-logo"
      />
      <span className="brand-word">Near<span>Quest</span></span>
    </div>
  )
}

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`status-bar ${light ? 'status-light' : ''}`}>
      <span>9:41</span>
      <div className="status-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M1 8h2v3H1zm4-3h2v6H5zm4-3h2v9H9zm4-2h2v11h-2z" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4.5a9 9 0 0 1 13 0M3.5 7a5.5 5.5 0 0 1 8 0M6.2 9.3a1.8 1.8 0 0 1 2.6 0" /></svg>
        <span className="battery"><i /></span>
      </div>
    </div>
  )
}

// 1. Update the quests array to include unique IDs and specific details
const quests = [
  { 
    id: 'easter-weaving',
    time: 'OPEN UNTIL 5 PM', 
    title: 'Threads of Guisad', 
    place: 'Easter Weaving Room', 
    exp: '150', 
    icon: 'weave',
    distance: '2.4 km away',
    sector: 'GUISAD',
    badgeName: 'Weaving Badge',
    terminal: 'Plaza – Guisad Line',
    signage: 'Look for “GUISAD”',
    fare: '₱13.00 Regular Fare',
    landmark: 'Easter Road junction, walk 50m past bakery'
  },
  { 
    id: 'woodcarvers-nook',
    time: '2 SPOTS LEFT', 
    title: "Woodcarver's Nook", 
    place: 'Asin Road Workshops', 
    exp: '120', 
    icon: 'wood',
    distance: '3.8 km away',
    sector: 'ASIN ROAD',
    badgeName: 'Woodcarver Badge',
    terminal: 'Asin Jeepney Terminal (Near City Market)',
    signage: 'Look for “ASIN / LOakan”',
    fare: '₱15.00 Regular Fare',
    landmark: 'Asin Road bridge, 200m past the wood carving stalls'
  },
  { 
    id: 'pine-brew',
    time: 'AFTER 2 PM', 
    title: 'Pine & Brew', 
    place: 'Guisad Local Cafe', 
    exp: '100', 
    icon: 'coffee',
    distance: '1.9 km away',
    sector: 'GUISAD',
    badgeName: 'Coffee Trail Badge',
    terminal: 'Baguio Plaza Jeepney Bay',
    signage: 'Look for “Guisad Central”',
    fare: '₱12.00 Regular Fare',
    landmark: 'Near Guisad Barangay Hall, look for pine sign'
  },
]

function QuestArt({ type }: { type: string }) {
  if (type === 'coffee') return <div className="quest-art coffee-art"><span>☕</span></div>
  if (type === 'wood') return <div className="quest-art wood-art"><span className="wood-flower">✦</span></div>
  return (
    <div className="quest-art weave-art">
      <div className="loom"><i /><i /><i /><i /></div>
    </div>
  )
}

function BottomNav({ current, go }: { current: Screen; go: (screen: Screen) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Button variant="ghost" className={current === 'map' ? 'nav-active' : ''} onClick={() => go('map')}>
        <Icon name="map" /><span>Explore</span>
      </Button>
      <Button variant="ghost" className={current === 'quests' ? 'nav-active' : ''} onClick={() => go('quests')}><Icon name="compass" /><span>Quests</span></Button>
      <Button variant="ghost" className={current === 'profile' ? 'nav-active' : ''} onClick={() => go('profile')}>
        <Icon name="user" /><span>Collection</span>
      </Button>
    </nav>
  )
}

function MapScreen({
  go,
  onSelectQuest,
  user,
}: {
  go: (screen: Screen) => void
  onSelectQuest: (id: string) => void
  user: User
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(true)
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const MAX_PAN = 140
  const clamp = (v: number) => Math.max(-MAX_PAN, Math.min(MAX_PAN, v))

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.locate-button')) return
    drag.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y, moved: false }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6) return // small movement = a tap, not a drag
      d.moved = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setOffset({ x: clamp(d.ox + dx), y: clamp(d.oy + dy) })
  }

  function endDrag() {
    if (drag.current?.moved) {
      suppressClick.current = true // stop the pin under the finger from opening after a drag
      setTimeout(() => { suppressClick.current = false }, 0)
    }
    drag.current = null
    setDragging(false)
  }

  return (
    <div className="screen map-screen">
      <StatusBar />
      <header className="map-header">
        <BrandMark />
        <div className="map-header-meta">
          <span className="level-pill"><Icon name="spark" size={13} /> Lv. 4 Pathfinder</span>
          <div className="clearance-row"><span>38% Map Cleared</span><div className="progress"><i /></div></div>
        </div>
        <Button variant="ghost" className="avatar-button" onClick={() => go('profile')} ariaLabel="Open profile">
          <span className="avatar">{initials(user.name)}</span>
        </Button>
      </header>

      <div
        className={`map-canvas ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
      >
        <div className="map-pan" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        <svg className="map-lines" viewBox="0 0 390 470" preserveAspectRatio="none" aria-hidden="true">
          <path className="terrain-line" d="M-20 60C40 5 77 96 136 43s108 29 159-3 90 12 124-8M-30 104c59-50 101 27 155-2s91-9 137 5 99-36 149 7M-10 168c43-27 80 12 118-16s78 32 125 4 109 34 170-4M-30 238c54-42 94 13 145-15s96 28 146-4 92 23 144-8M-18 320c50-44 91 11 138-20s86 29 135 5 97 21 153-20M-20 398c53-37 103 18 150-7s83 25 138-3 83 6 143-20" />
          <path className="road-main" d="M-20 390C53 348 46 294 113 262s60-76 128-101 88-89 167-92" />
          <path className="road" d="M36 455c18-77 94-75 128-127s-7-105 63-137M90 10c7 68 55 76 67 132s-27 97 20 145 102 52 145 153M390 267c-72-6-96 35-144 29s-77-51-129-34M12 182c72 6 80-42 138-33s73 39 121 13" />
          <path className="creek" d="M-10 286c55-5 74 30 119 19s71-60 113-40 56 80 99 69 57-67 89-52" />
        </svg>
        <div className="fog fog-one"><span>UNEXPLORED</span></div>
        <div className="fog fog-two" />
        <span className="map-label label-1">GUISAD</span>
        <span className="map-label label-2">CAMPO SIOCO</span>
        <span className="map-label label-3">BURNHAM</span>
        <span className="map-label label-4">TRANCOVILLE</span>

        <button 
          type="button" 
          className="map-pin quest-pin" 
          onClick={() => onSelectQuest('easter-weaving')} 
          aria-label="Open Easter Weaving Room quest"
        >
          <span className="gem">◆</span>
          <small>NEW QUEST</small>
        </button>
        <div className="map-pin badge-pin"><span className="mini-badge">✦</span><small>UNLOCKED</small></div>
        <div className="capacity-pin"><span className="people-dots"><i /><i /><i /></span><b>3/5</b><small>Active Questors</small></div>
        </div>
        <Button variant="secondary" className="locate-button" ariaLabel="Re-center map" onClick={() => setOffset({ x: 0, y: 0 })}><Icon name="location" /></Button>
      </div>

      <section className={`quest-sheet ${sheetOpen ? '' : 'is-collapsed'}`}>
        <button
          type="button"
          className="sheet-handle-btn"
          aria-expanded={sheetOpen}
          aria-label={sheetOpen ? 'Minimize commissions' : 'Show commissions'}
          onClick={() => setSheetOpen((o) => !o)}
        >
          <div className="sheet-handle" />
        </button>
        <div className="sheet-heading">
          <div><span className="eyebrow">WEDNESDAY • JUNE 18</span><div className="section-title">Today's 3 Commissions</div></div>
          <span className="refresh-pill">Refreshes in 08:42</span>
        </div>
        <div className="quest-deck">
          {quests.map((quest, index) => (
            <button 
              type="button" 
              className={`quest-card quest-card-${index}`} 
              key={quest.id} 
              onClick={() => onSelectQuest(quest.id)}
            >
              <QuestArt type={quest.icon} />
              <div className="quest-copy">
                <span className="quest-time">{quest.time}</span>
                <strong>{quest.title}</strong>
                <span>{quest.place}</span>
                <b>+{quest.exp} EXP <Icon name="chevron" size={14} /></b>
              </div>
            </button>
          ))}
        </div>
      </section>
      <BottomNav current="map" go={go} />
    </div>
  )
}

function DetailScreen({ questId, go }: { questId: string; go: (screen: Screen) => void }) {
  const quest = quests.find(q => q.id === questId) || quests[0]
  const [shareOpen, setShareOpen] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [challenged, setChallenged] = useState<string[]>([])

  const guide = [
    { icon: 'jeep', label: 'JEEPNEY TERMINAL', title: quest.terminal, text: 'Verified by local commuters' },
    { icon: 'route', label: 'WINDSHIELD SIGNAGE', title: quest.signage, text: 'Ask the driver for drop-off' },
    { icon: 'clock', label: 'FARE & TRAVEL TIME', title: quest.fare, text: 'Around 15 mins transit' },
    { icon: 'walk', label: 'YOUR LANDMARK', title: quest.landmark, text: 'Follow app radar upon arrival' },
  ]

  const shareText = `Join me on SideQuest: "${quest.title}" at ${quest.place} (${quest.sector}, Baguio). +${quest.exp} EXP + ${quest.badgeName}. Let's clear the fog!`
  const shareUrl = `https://sidequest.app/q/${quest.id}`

  function showToast(msg: string) {
    setShareToast(msg)
    setTimeout(() => setShareToast(null), 2200)
  }

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `SideQuest · ${quest.title}`, text: shareText, url: shareUrl })
        showToast('Quest shared')
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        showToast('Link copied')
      }
    } catch {
      /* user cancelled share sheet */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Quest link copied')
    } catch {
      showToast('Could not copy — try again')
    }
  }

  function challengeFriend(friendId: string, friendName: string) {
    if (challenged.includes(friendId)) return
    setChallenged((prev) => [...prev, friendId])
    showToast(`Challenge sent to ${friendName.split(' ')[0]}`)
  }

  return (
    <div className="screen detail-screen">
      <StatusBar />
      <header className="detail-topbar">
        <Button variant="ghost" className="icon-button" onClick={() => go('map')}><Icon name="arrow" /></Button>
        <span>QUEST BRIEF</span>
        <Button variant="ghost" className="icon-button" onClick={() => setShareOpen(true)} ariaLabel="Share quest">
          <Icon name="share" />
        </Button>
      </header>

      <main className="detail-content">
        <section className="spot-hero">
          <div className="spot-copy">
            <span className="eyebrow">HERITAGE CRAFT · {quest.sector}</span>
            <div className="hero-title">{quest.title}</div>
            <div className="distance"><Icon name="location" size={17} /> {quest.distance}</div>
          </div>
          <div className="badge-preview">
            <span className="badge-rays" />
            <div className="badge-medallion"><span className="woven-w">{quest.title.charAt(0)}</span></div>
            <span>BADGE PREVIEW</span>
          </div>
        </section>

        <section className="reward-card">
          <div className="reward-icon"><Icon name="spark" /></div>
          <div><span>QUEST REWARD</span><strong>+{quest.exp} EXP</strong></div>
          <div className="reward-divider" />
          <div><span>COLLECTIBLE</span><strong>{quest.badgeName}</strong></div>
        </section>

        <div className="section-kicker">YOUR HYPER-LOCAL COMMUTE</div>
        <section className="commute-card">
          <div className="commute-header">
            <div className="jeep-badge"><Icon name="jeep" size={24} /></div>
            <div><strong>How to get there</strong><span>Verified by locals · Updated today</span></div>
          </div>
          <div className="guide-list">
            {guide.map((item, index) => (
              <div className="guide-row" key={item.label}>
                <div className="guide-track">
                  <span><Icon name={item.icon} size={18} /></span>
                  {index < guide.length - 1 && <i />}
                </div>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="local-tip">
            <span>LOCAL TIP</span> Jeepneys queue faster during off-peak hours. Keep exact coins ready.
          </div>
        </section>

        <section className="share-quest-card">
          <div className="share-quest-copy">
            <span className="eyebrow">SIDE QUEST WITH FRIENDS</span>
            <strong>Challenge a pathfinder</strong>
            <p>Share this commission — race to verify first and earn bonus EXP together.</p>
          </div>
          <Button variant="secondary" onClick={() => setShareOpen(true)}>
            <Icon name="share" size={16} /> Share Quest
          </Button>
        </section>
      </main>

      <div className="sticky-action">
        <Button onClick={() => go('camera')}>
          <Icon name="location" size={19} /> Start Live Quest & Verify Location
        </Button>
        <span><Icon name="shield" size={13} /> GPS activates only during your quest</span>
      </div>

      {shareOpen && (
        <div className="share-sheet-scrim" onClick={() => setShareOpen(false)}>
          <div
            className="share-sheet"
            role="dialog"
            aria-label="Share quest"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />
            <div className="share-sheet-header">
              <div>
                <span className="eyebrow">SHARE QUEST</span>
                <strong>{quest.title}</strong>
              </div>
              <Button variant="ghost" className="icon-button" onClick={() => setShareOpen(false)} ariaLabel="Close">
                <Icon name="close" size={18} />
              </Button>
            </div>

            <div className="share-actions-row">
              <button type="button" className="share-action" onClick={shareNative}>
                <span className="share-action-icon"><Icon name="share" size={18} /></span>
                <span>Share</span>
              </button>
              <button type="button" className="share-action" onClick={copyLink}>
                <span className="share-action-icon">🔗</span>
                <span>Copy link</span>
              </button>
            </div>

            <span className="friends-kicker">CHALLENGE A FRIEND</span>
            <ul className="share-friends-list">
              {friends.map((f) => {
                const sent = challenged.includes(f.id)
                return (
                  <li className="share-friend-row" key={f.id}>
                    <span className={`friend-avatar status-${f.status}`}>
                      {initials(f.name)}
                      <i className={`status-dot ${f.status}`} />
                    </span>
                    <div className="friend-info">
                      <strong>{f.name}</strong>
                      <span>Lv. {f.level} {f.title}</span>
                    </div>
                    <button
                      type="button"
                      className={`challenge-btn ${sent ? 'is-sent' : ''}`}
                      disabled={sent}
                      onClick={() => challengeFriend(f.id, f.name)}
                    >
                      {sent ? 'Sent' : 'Challenge'}
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="share-sheet-note">
              Friends who clear this quest within 24h unlock a duo badge bonus.
            </p>
          </div>
        </div>
      )}

      {shareToast && <div className="share-toast" role="status">{shareToast}</div>}
    </div>
  )
}

function CameraScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="screen camera-screen" style={{ backgroundImage: `url(${cameraImage})` }}>
      <div className="camera-shade" />
      <StatusBar light />
      <header className="camera-header">
        <Button variant="ghost" className="camera-circle" onClick={() => go('quest')}><Icon name="close" /></Button>
        <div className="camera-title"><span>LIVE QUEST</span><strong>Easter Weaving Room</strong></div>
        <Button variant="ghost" className="camera-circle"><Icon name="flash" /></Button>
      </header>

      <div className="verified-pill"><span><Icon name="check" size={14} /></span><div><strong>Within 15m • Verified</strong><small>GPS signal is accurate</small></div></div>
      <div className="focus-frame"><i /><i /><i /><i /><span>Align the weaving room entrance</span></div>

      <div className="watermark-card">
        <div className="watermark-brand"><BrandMark light /><span>LIVE CHECK-IN</span></div>
        <div className="watermark-location"><Icon name="location" size={17} /><div><strong>EASTER WEAVING ROOM</strong><span>Guisad, Baguio City</span></div></div>
        <div className="watermark-meta"><span>JUN 18 • 3:42 PM</span><span><Icon name="sun" size={14} /> 19°C • CLOUDY</span></div>
      </div>

      <div className="camera-controls">
        <div className="exif-status"><Icon name="shield" size={15} /><span><b>Hardware GPS Verified</b><small>Live EXIF data secured</small></span></div>
        <div className="capture-row">
          <Button variant="ghost" className="gallery-button" ariaLabel="Open gallery"><span /></Button>
          <Button variant="ghost" className="shutter" onClick={() => go('clear')} ariaLabel="Capture and unlock badge"><span /></Button>
          <Button variant="ghost" className="flip-button" ariaLabel="Flip camera">↻</Button>
        </div>
        <strong className="capture-label">Capture & Unlock Badge</strong>
      </div>
    </div>
  )
}

function Badge({ small = false }: { small?: boolean }) {
  return (
    <div className={`master-badge ${small ? 'badge-small' : ''}`}>
      <span className="badge-shadow" />
      <span className="badge-outer">
        <span className="badge-inner">
          <span className="badge-loom"><i /><i /><i /><i /><b /></span>
        </span>
      </span>
      {!small && <><span className="badge-ribbon left">WEAVE</span><span className="badge-ribbon right">BAGUIO</span></>}
    </div>
  )
}

function ClearScreen({ onViewVouchers }: { onViewVouchers: () => void }) {
  return (
    <div className="screen clear-screen">
      <StatusBar />
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => <i key={i} />)}
      </div>
      <div className="clear-brand"><BrandMark /></div>
      <main className="clear-content">
        <span className="clear-kicker">QUEST CLEARED</span>
        <div className="clear-title">A new story<br />woven into your map.</div>
        <div className="badge-stage"><span className="stage-glow" /><Badge /></div>
        <span className="unlocked-label">NEW COLLECTIBLE</span>
        <div className="badge-name">Master Weaver Badge</div>
        <p>Earned at Easter Weaving Room</p>
        <section className="gain-card">
          <div><span className="gain-icon exp">✦</span><p><strong>+150 EXP Gained</strong><span>1,250 / 1,500 to Level 5</span></p></div>
          <div className="gain-progress"><i /></div>
          <div><span className="gain-icon fog"><Icon name="map" size={18} /></span><p><strong>Fog cleared!</strong><span>Guisad sector is now revealed</span></p><Icon name="check" size={18} /></div>
        </section>
        <section className="voucher-reward">
          <span className="voucher-reward-icon"><Icon name="ticket" size={22} /></span>
          <div>
            <strong>Discount Unlocked!</strong>
            <p>You earned 15% OFF at Easter Weaving Room! Check your Vouchers in the Collection tab.</p>
          </div>
        </section>
      </main>
<div className="clear-actions">
  <Button
    variant="secondary"
    onClick={async () => {
      const text = 'I just cleared a SideQuest in Baguio and unlocked the Master Weaver Badge! +150 EXP'
      try {
        if (navigator.share) await navigator.share({ title: 'SideQuest cleared', text })
        else await navigator.clipboard.writeText(text)
      } catch { /* cancelled */ }
    }}
  >
    <Icon name="share" size={18} /> Share to Stories
  </Button>
  <Button onClick={onViewVouchers}>
    View My Vouchers <Icon name="chevron" size={18} />
  </Button>
</div>
    </div>
  )
}
const friends = [
  { id: 'f1', name: 'Maya Reyes', level: 6, title: 'Pathfinder', status: 'online', quests: 22, mutual: 3 },
  { id: 'f2', name: 'Luis Dizon', level: 5, title: 'Pathfinder', status: 'online', quests: 18, mutual: 2 },
  { id: 'f3', name: 'Nina Cruz', level: 4, title: 'Pathfinder', status: 'away', quests: 11, mutual: 1 },
  { id: 'f4', name: 'Jon Villanueva', level: 3, title: 'Scout', status: 'offline', quests: 9, mutual: 0 },
]

const friendRequests = [
  { id: 'r1', name: 'Aya Mercado', level: 3, title: 'Scout', mutual: 2 },
  { id: 'r2', name: 'Ben Ocampo', level: 2, title: 'Scout', mutual: 1 },
]
const badges = [
  { name: 'Master Weaver', type: 'weaver', unlocked: true },
  { name: 'Pine Sentinel', type: 'pine', unlocked: true },
  { name: 'Coffee Trail', type: 'coffee', unlocked: true },
  { name: 'Woodcarver', type: 'carve', unlocked: true },
  { name: 'Market Maven', type: 'market', unlocked: false },
  { name: 'Misty Ridge', type: 'ridge', unlocked: false },
  { name: 'Garden Keeper', type: 'garden', unlocked: false },
  { name: 'Heritage Hunter', type: 'heritage', unlocked: false },
  { name: 'Secret Badge', type: 'secret', unlocked: false },
]

function MiniCollectionBadge({ type, unlocked }: { type: string; unlocked: boolean }) {
  if (!unlocked) return <div className="locked-badge"><Icon name="lock" size={19} /><span>?</span></div>
  const symbols: Record<string, string> = { weaver: 'W', pine: '♠', coffee: '♨', carve: '✦' }
  return <div className={`collection-badge ${type}`}><span>{symbols[type]}</span></div>
}

const vouchers = [
  { id: 'weave', merchant: 'Easter Weaving Room', offer: '15% OFF Handloom Products', expiry: 'Valid until July 30', code: 'GUISAD-WEAVE15' },
  { id: 'wood', merchant: "Woodcarver's Nook", offer: '10% OFF Hand-Carved Souvenirs', expiry: 'Valid until July 30', code: 'ASIN-CARVE10' },
  { id: 'brew', merchant: 'Pine & Brew', offer: '₱20 OFF Any Brewed Coffee', expiry: 'Valid until August 15', code: 'PINEBREW-20' },
]

const leaderboard = [
  { rank: 1, name: 'Kai Santos', level: 7, title: 'Trailblazer', exp: 2840, quests: 28, map: 72, isYou: false },
  { rank: 2, name: 'Maya Reyes', level: 6, title: 'Pathfinder', exp: 2310, quests: 22, map: 61, isYou: false },
  { rank: 3, name: 'Luis Dizon', level: 5, title: 'Pathfinder', exp: 1890, quests: 18, map: 54, isYou: false },
  { rank: 4, name: 'You', level: 4, title: 'Pathfinder', exp: 1250, quests: 12, map: 38, isYou: true },
  { rank: 5, name: 'Nina Cruz', level: 4, title: 'Pathfinder', exp: 1180, quests: 11, map: 35, isYou: false },
  { rank: 6, name: 'Jon Villanueva', level: 3, title: 'Scout', exp: 920, quests: 9, map: 28, isYou: false },
  { rank: 7, name: 'Aya Mercado', level: 3, title: 'Scout', exp: 870, quests: 8, map: 26, isYou: false },
  { rank: 8, name: 'Ben Ocampo', level: 2, title: 'Scout', exp: 540, quests: 5, map: 18, isYou: false },
]

// Visual placeholder only — NOT a scannable code. Swap for a real QR library (e.g. qrcode.react) later.
function QrPlaceholder({ seed }: { seed: string }) {
  const n = 21
  let h = 2166136261
  for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) }
  const next = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296 }
  const cells: ReactNode[] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const corner = (x < 7 && y < 7) ? [x, y] : (x >= n - 7 && y < 7) ? [x - (n - 7), y] : (x < 7 && y >= n - 7) ? [x, y - (n - 7)] : null
      const on = corner ? Math.max(Math.abs(corner[0] - 3), Math.abs(corner[1] - 3)) !== 2 : next() > 0.5
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
    }
  }
  return <svg className="qr-placeholder" viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges" aria-label="QR code preview">{cells}</svg>
}

function ProfileScreen({ go, user, onLogout, initialTab = 'badges' }: { go: (screen: Screen) => void; user: User; onLogout: () => void; initialTab?: 'badges' | 'vouchers' | 'ranks' | 'friends' }) {
  const [menuOpen, setMenuOpen] = useState(false)
const [tab, setTab] = useState<'badges' | 'vouchers' | 'ranks' | 'friends'>(initialTab);
  const [rankScope, setRankScope] = useState<'week' | 'all'>('week')
  const [qrOpen, setQrOpen] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function copyCode(code: string) {
    try { await navigator.clipboard.writeText(code) } catch { /* clipboard blocked — code stays visible to copy by hand */ }
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="screen profile-screen">
      <StatusBar />
      <header className="profile-topbar">
        <BrandMark />
        <div className="settings-wrap">
          <Button variant="ghost" className="settings-button" ariaLabel="Settings" onClick={() => setMenuOpen((o) => !o)}>•••</Button>
          {menuOpen && (
            <>
              <div className="menu-scrim" onClick={() => setMenuOpen(false)} />
              <div className="settings-menu" role="menu">
                <div className="settings-menu-user"><strong>{user.name}</strong><span>{user.email}</span></div>
                <button type="button" role="menuitem" className="menu-logout" onClick={onLogout}><Icon name="logout" size={17} /> Log out</button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="profile-content">
        <section className="profile-hero">
          <div className="profile-avatar-wrap"><span className="profile-avatar">{initials(user.name)}</span><i>4</i></div>
          <div className="profile-info"><span>EXPLORER SINCE MAY 2025</span><div className="profile-name">{user.name}</div><strong>Level 4 Pathfinder</strong></div>
          <div className="points"><strong>1,250</strong><span>TOTAL EXP</span></div>
        </section>

        <section className="profile-progress">
          <div><span>Next level</span><strong>250 EXP to Trailblazer</strong></div>
          <div className="profile-bar"><i /></div>
          <div className="profile-stats">
            <span><strong>12</strong>Quests cleared</span>
            <span><strong>38%</strong>Baguio revealed</span>
            <span><strong>4</strong>Badges found</span>
          </div>
        </section>

        <div className="collection-tabs" role="tablist" aria-label="Collection">
          <button type="button" role="tab" aria-selected={tab === 'badges'} className={tab === 'badges' ? 'is-active' : ''} onClick={() => setTab('badges')}>
            ✦ Badges ({badges.filter((b) => b.unlocked).length})
          </button>
          <button type="button" role="tab" aria-selected={tab === 'vouchers'} className={tab === 'vouchers' ? 'is-active' : ''} onClick={() => setTab('vouchers')}>
            <Icon name="ticket" size={15} /> Vouchers ({vouchers.length})
          </button>
          <button type="button" role="tab" aria-selected={tab === 'ranks'} className={tab === 'ranks' ? 'is-active' : ''} onClick={() => setTab('ranks')}>
            <Icon name="trophy" size={15} /> Ranks
          </button>
          <button
  type="button"
  role="tab"
  aria-selected={tab === 'friends'}
  className={tab === 'friends' ? 'is-active' : ''}
  onClick={() => setTab('friends')}
>
  <Icon name="users" size={15} /> Friends ({friends.length})
</button>
        </div>

        {tab === 'vouchers' && (
          <section className="voucher-list">
            {vouchers.map((v) => (
              <article className="voucher-card" key={v.id}>
                <div className="voucher-main">
                  <span className="voucher-merchant">{v.merchant}</span>
                  <strong className="voucher-offer">{v.offer}</strong>
                  <span className="voucher-expiry">{v.expiry}</span>
                </div>
                <div className="voucher-code-row">
                  <code>{v.code}</code>
                  <button type="button" className="voucher-copy" onClick={() => copyCode(v.code)}>
                    {copied === v.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button
                  type="button"
                  className="voucher-qr-button"
                  aria-expanded={qrOpen === v.id}
                  onClick={() => setQrOpen(qrOpen === v.id ? null : v.id)}
                >
                  {qrOpen === v.id ? 'Hide QR code' : 'Show QR code'}
                </button>
                {qrOpen === v.id && (
                  <div className="voucher-qr">
                    <QrPlaceholder seed={v.code} />
                    <span>Show this to the staff</span>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {tab === 'ranks' && (
          <section className="leaderboard-section">
            <div className="cabinet-header">
              <div>
                <span className="eyebrow">BAGUIO PATHFINDERS</span>
                <div className="section-title">Leaderboard</div>
              </div>
              <div className="rank-scope" role="tablist" aria-label="Leaderboard period">
                <button type="button" role="tab" aria-selected={rankScope === 'week'} className={rankScope === 'week' ? 'is-active' : ''} onClick={() => setRankScope('week')}>
                  This week
                </button>
                <button type="button" role="tab" aria-selected={rankScope === 'all'} className={rankScope === 'all' ? 'is-active' : ''} onClick={() => setRankScope('all')}>
                  All time
                </button>
              </div>
            </div>

            <div className="leaderboard-podium">
              {leaderboard.filter((e) => e.rank <= 3).map((entry) => (
                <div className={`podium-slot podium-${entry.rank}`} key={entry.rank}>
                  <span className="podium-rank">#{entry.rank}</span>
                  <span className="podium-avatar">{initials(entry.isYou ? user.name : entry.name)}</span>
                  <strong>{entry.isYou ? user.name.split(' ')[0] : entry.name.split(' ')[0]}</strong>
                  <span>{entry.exp.toLocaleString()} EXP</span>
                </div>
              ))}
            </div>

            <ul className="leaderboard-list">
              {leaderboard.map((entry) => {
                const displayName = entry.isYou ? user.name : entry.name
                return (
                  <li key={entry.rank} className={`leaderboard-row ${entry.isYou ? 'is-you' : ''}`}>
                    <span className="lb-rank">
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                    </span>
                    <span className="lb-avatar">{initials(displayName)}</span>
                    <div className="lb-info">
                      <strong>{displayName}{entry.isYou ? ' (you)' : ''}</strong>
                      <span>Lv. {entry.level} {entry.title} · {entry.quests} quests · {entry.map}% map</span>
                    </div>
                    <div className="lb-exp">
                      <strong>{entry.exp.toLocaleString()}</strong>
                      <span>EXP</span>
                    </div>
                  </li>
                )
              })}
            </ul>

            <p className="leaderboard-note">Ranks refresh daily. Clear more commissions to climb.</p>
          </section>
        )}

        {tab === 'badges' && (
          <section className="cabinet-section">
            <div className="cabinet-header">
              <div>
                <span className="eyebrow">YOUR COLLECTION BOOK</span>
                <div className="section-title">Baguio Badges</div>
              </div>
              <span className="found-count">4 / 9 FOUND</span>
            </div>
            <div className="cabinet">
              <div className="cabinet-pattern" />
              <div className="badge-grid">
                {badges.map((badge) => (
                  <div className={`badge-slot ${badge.unlocked ? '' : 'is-locked'}`} key={badge.name}>
                    <MiniCollectionBadge type={badge.type} unlocked={badge.unlocked} />
                    <strong>{badge.name}</strong>
                    <span>{badge.unlocked ? 'Collected' : 'Keep exploring'}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {tab === 'friends' && (
  <section className="friends-section">
    <div className="cabinet-header">
      <div>
        <span className="eyebrow">YOUR CREW</span>
        <div className="section-title">Friends</div>
      </div>
      <button type="button" className="add-friend-btn">
        <Icon name="user-plus" size={15} /> Add
      </button>
    </div>

    {friendRequests.length > 0 && (
      <div className="friend-requests">
        <span className="friends-kicker">REQUESTS · {friendRequests.length}</span>
        {friendRequests.map((req) => (
          <article className="friend-request-card" key={req.id}>
            <span className="friend-avatar">{initials(req.name)}</span>
            <div className="friend-info">
              <strong>{req.name}</strong>
              <span>Lv. {req.level} {req.title} · {req.mutual} mutual</span>
            </div>
            <div className="friend-actions">
              <button type="button" className="friend-accept">Accept</button>
              <button type="button" className="friend-decline">Decline</button>
            </div>
          </article>
        ))}
      </div>
    )}

    <span className="friends-kicker">ALL FRIENDS · {friends.length}</span>
    <ul className="friends-list">
      {friends.map((f) => (
        <li className="friend-row" key={f.id}>
          <span className={`friend-avatar status-${f.status}`}>
            {initials(f.name)}
            <i className={`status-dot ${f.status}`} />
          </span>
          <div className="friend-info">
            <strong>{f.name}</strong>
            <span>Lv. {f.level} {f.title} · {f.quests} quests</span>
          </div>
          <span className={`friend-status-label ${f.status}`}>
            {f.status === 'online' ? 'Online' : f.status === 'away' ? 'Away' : 'Offline'}
          </span>
        </li>
      ))}
    </ul>
    <p className="friends-note">Invite pathfinders you meet on quests to compare progress.</p>
  </section>
)}
      </main>

      <BottomNav current="profile" go={go} />
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('map')
  const [selectedQuestId, setSelectedQuestId] = useState<string>('easter-weaving')
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [profileTab, setProfileTab] = useState<'badges' | 'vouchers'>('badges')

  // any normal navigation opens Collection on Badges; only the quest-cleared button opens Vouchers
  function navigate(next: Screen) {
    setProfileTab('badges')
    setScreen(next)
  }

  if (!user) {
    return (
      <div className="app-shell">
        <AuthScreen
          onAuth={(u) => {
            saveSession(u)
            setUser(u)
            setScreen('map')
          }}
        />
      </div>
    )
  }

  function handleLogout() {
    clearSession()
    setUser(null)
    setScreen('map')
  }

  return (
    <div className="app-shell">
      {screen === 'map' && (
        <MapScreen
          user={user}
          go={navigate} 
          onSelectQuest={(id) => {
            setSelectedQuestId(id)
            setScreen('quest')
          }} 
        />
      )}
      {screen === 'quests' && (
        <QuestsScreen 
          go={(next) => navigate(next)} 
          onSelectQuest={(id) => {
            setSelectedQuestId(id)
            setScreen('quest')
          }} 
        />
      )}
      {screen === 'quest' && <DetailScreen questId={selectedQuestId} go={navigate} />}
      {screen === 'camera' && <CameraScreen go={navigate} />}
      {screen === 'clear' && <ClearScreen onViewVouchers={() => { setProfileTab('vouchers'); setScreen('profile') }} />}
      {screen === 'profile' && <ProfileScreen go={navigate} user={user} onLogout={handleLogout} initialTab={profileTab} />}
    </div>
  )
}