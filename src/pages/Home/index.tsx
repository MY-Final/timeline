import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, User, BookOpen } from 'lucide-react'
import './Home.css'

// ─── 修改这里来设置恋爱开始日期 ───────────────────
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')

// ─── 修改这里来设置两人的名字 ────────────────────
const PERSON_A = '你'
const PERSON_B = 'Ta'

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
// Avatar component
// ─────────────────────────────────────────────
function Avatar({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="avatar-wrap">
      <div className="avatar-ring">
        <div className="avatar-inner">
          {src ? (
            <img src={src} alt={`${name}的头像`} />
          ) : (
            <User className="avatar-placeholder-icon" size={40} strokeWidth={1.5} aria-hidden="true" />
          )}
        </div>
      </div>
      <span className="avatar-name">{name}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────
export default function HomePage() {
  const { days, hours, minutes, seconds } = useLoveTimer(LOVE_START_DATE)

  const startDateStr = LOVE_START_DATE.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="home-shell">
      {/* Decorative petals */}
      <div className="home-petal home-petal-1" aria-hidden="true" />
      <div className="home-petal home-petal-2" aria-hidden="true" />
      <div className="home-petal home-petal-3" aria-hidden="true" />

      <div className="home-card">
        {/* Sub label */}
        <p className="home-label">Our Story</p>

        {/* Couple avatars */}
        <div className="couple-row">
          <Avatar src={avatarA} name={PERSON_A} />

          <div className="heart-connector" aria-hidden="true">
            <div className="connector-dot" />
            <Heart className="heart-icon" size={28} fill="currentColor" strokeWidth={0} />
            <div className="connector-dot" />
          </div>

          <Avatar src={avatarB} name={PERSON_B} />
        </div>

        {/* Start date */}
        <p className="start-date-text">自 {startDateStr} 起</p>

        {/* Days counter */}
        <div className="timer-block">
          <p className="timer-title">在一起</p>
          <div className="timer-days-row">
            <span className="timer-days-num">{days}</span>
            <span className="timer-days-label">天</span>
          </div>

          {/* h : m : s */}
          <div className="timer-row" aria-label={`${hours}小时${minutes}分${seconds}秒`}>
            <div className="timer-unit">
              <span className="timer-value">{pad(hours)}</span>
              <span className="timer-label">小时</span>
            </div>
            <span className="timer-sep" aria-hidden="true">:</span>
            <div className="timer-unit">
              <span className="timer-value">{pad(minutes)}</span>
              <span className="timer-label">分钟</span>
            </div>
            <span className="timer-sep" aria-hidden="true">:</span>
            <div className="timer-unit">
              <span className="timer-value">{pad(seconds)}</span>
              <span className="timer-label">秒</span>
            </div>
          </div>
        </div>

        <div className="home-divider" aria-hidden="true" />

        {/* CTA */}
        <Link to="/timeline" className="home-cta">
          <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
          查看我们的故事
        </Link>
      </div>
    </main>
  )
}
