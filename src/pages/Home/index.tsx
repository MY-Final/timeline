import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, User, BookOpen } from 'lucide-react'
import './Home.css'

// ─── 修改这里来设置恋爱开始日期 ───────────────────
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')

// ─── 修改这里来设置两人的名字 ────────────────────
const PERSON_A = '阳阳'
const PERSON_B = '湘湘'

// QQ 头像链接
const avatarA: string | null = 'http://q.qlogo.cn/headimg_dl?dst_uin=3486159271&spec=640&img_type=jpg'
const avatarB: string | null = 'http://q.qlogo.cn/headimg_dl?dst_uin=1789859045&spec=640&img_type=jpg'

// ─────────────────────────────────────────────
// Timer hook
// ─────────────────────────────────────────────
interface TimerValue {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function useLoveTimer(startDate: Date): TimerValue {
  const calc = (): TimerValue => {
    const diff = Math.max(0, Date.now() - startDate.getTime())
    const totalSeconds = Math.floor(diff / 1000)
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    }
  }

  const [value, setValue] = useState<TimerValue>(calc)

  useEffect(() => {
    const id = setInterval(() => setValue(calc()), 1000)
    return () => clearInterval(id)
  }, [startDate])

  return value
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────
function Avatar({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="avatar-col">
      <div className="avatar-frame">
        <div className="avatar-img-wrap">
          {src ? (
            <img src={src} alt={`${name}的头像`} />
          ) : (
            <User className="avatar-placeholder-icon" size={44} strokeWidth={1.2} aria-hidden="true" />
          )}
        </div>
      </div>
      <span className="avatar-name-label">{name}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────
export default function HomePage() {
  const { days, hours, minutes, seconds } = useLoveTimer(LOVE_START_DATE)
  const [hearts, setHearts] = useState<{ id: number, x: number, delay: number }[]>([])
  const heartId = useRef(0)
  const secretClicks = useRef(0)
  const lastClick = useRef(0)
  const [secretMode, setSecretMode] = useState(false)

  const startDateStr = LOVE_START_DATE.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  function spawnHearts() {
    const newHearts = Array.from({ length: 12 }, () => ({
      id: heartId.current++,
      x: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)))
    }, 2500)
  }

  function handleSecretClick() {
    const now = Date.now()
    if (now - lastClick.current < 400) {
      secretClicks.current++
      if (secretClicks.current >= 10) {
        setSecretMode(v => !v)
        secretClicks.current = 0
      }
    } else {
      secretClicks.current = 1
    }
    lastClick.current = now
  }

  // 特殊日期检测
  const today = new Date()
  const isAnniversary = today.getDate() === LOVE_START_DATE.getDate() && 
                        today.getMonth() === LOVE_START_DATE.getMonth()

  return (
    <main className={`home-shell ${secretMode ? 'secret-mode' : ''} ${isAnniversary ? 'anniversary' : ''}`}>
      {/* Ambient orbs */}
      <div className="home-orb home-orb-1" aria-hidden="true" />
      <div className="home-orb home-orb-2" aria-hidden="true" />
      <div className="home-orb home-orb-3" aria-hidden="true" />

      {/* Top: date drop-line */}
      <div className="home-top">
        <div className="date-badge">
          <div className="date-badge-line" />
          <p className="date-badge-text">Since {startDateStr}</p>
        </div>
      </div>

      {/* Center content */}
      <div className="home-center">
        <p className="home-title">our story</p>

        {/* Couple avatars */}
        <div className="couple-section" role="img" aria-label="我们的头像">
          <Avatar src={avatarA} name={PERSON_A} />

          <div className="heart-bridge" aria-hidden="true" onClick={(e) => { e.stopPropagation(); spawnHearts(); handleSecretClick(); }}>
            <div className="bridge-line" />
            <Heart className="bridge-heart" size={30} fill="currentColor" strokeWidth={0} />
            <div className="bridge-line" />
            {hearts.map(h => (
              <span 
                key={h.id} 
                className="floating-heart-fullscreen" 
                style={{ left: `${h.x}%`, animationDelay: `${h.delay}s` }}
              >❤️</span>
            ))}
          </div>

          <Avatar src={avatarB} name={PERSON_B} />
        </div>

        {/* Days big number */}
        <div className="days-display">
          <p className="days-eyebrow">在一起</p>
          <div className="days-num-row">
            <span className="days-num">{days}</span>
            <span className="days-unit">天</span>
          </div>
        </div>

        {/* hh : mm : ss */}
        <div className="hms-row" aria-label={`${hours}小时${minutes}分${seconds}秒`}>
          <div className="hms-unit">
            <span className="hms-value">{pad(hours)}</span>
            <span className="hms-label">小时</span>
          </div>
          <span className="hms-sep" aria-hidden="true">:</span>
          <div className="hms-unit">
            <span className="hms-value">{pad(minutes)}</span>
            <span className="hms-label">分钟</span>
          </div>
          <span className="hms-sep" aria-hidden="true">:</span>
          <div className="hms-unit">
            <span className="hms-value">{pad(seconds)}</span>
            <span className="hms-label">秒</span>
          </div>
        </div>

        {/* CTA */}
        <Link to="/timeline" className="home-cta">
          <BookOpen size={15} strokeWidth={1.5} aria-hidden="true" />
          查看我们的故事
        </Link>
      </div>

      {/* Bottom tagline */}
      <div className="home-bottom">
        <div className="bottom-tagline">
          <p className="bottom-tagline-text">每一天都值得被记住</p>
          <div className="bottom-tagline-line" />
        </div>
      </div>
    </main>
  )
}
