import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, User, BookOpen } from 'lucide-react'
import {
  useFloatingHearts,
  useSecretClick,
  useKonamiCode,
  useLongPress,
  useILoveYou,
  isAnniversary
} from '@/lib/easter-eggs.ts'
import './Home.css'

// ─── 修改这里来设置恋爱开始日期 ───────────────────
const LOVE_START_DATE = new Date('2026-03-08T18:35:00')

// ─── 修改这里来设置两人的名字 ────────────────────
const PERSON_A = '阳阳'
const PERSON_B = '湘湘'

// QQ 头像链接
const avatarA: string | null = 'https://q1.qlogo.cn/g?b=qq&nk=3486159271&s=640'
const avatarB: string | null = 'https://q1.qlogo.cn/g?b=qq&nk=1789859045&s=640'

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
  
  // Easter Eggs
  const { hearts, spawn: spawnHearts } = useFloatingHearts(12)
  const { active: secretMode, click: handleSecretClick } = useSecretClick(10, 400)
  const { active: konamiMode, progress: konamiProgress, sequence: konamiSequence } = useKonamiCode()
  const { progress: holdProgress, active: loveMode, start: handleHeartHoldStart, end: handleHeartHoldEnd } = useLongPress(2000)
  const { active: iLoveYouActive, stage: iLoveYouStage, inputProgress, target } = useILoveYou()
  const anniversaryToday = isAnniversary(LOVE_START_DATE)

  const startDateStr = LOVE_START_DATE.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className={`home-shell ${secretMode ? 'secret-mode' : ''} ${anniversaryToday ? 'anniversary' : ''} ${konamiMode ? 'konami-mode' : ''} ${loveMode ? 'love-mode' : ''} ${iLoveYouActive ? `ilove-you-stage-${iLoveYouStage}` : ''}`}>
      {/* Ambient orbs */}
      <div className="home-orb home-orb-1" aria-hidden="true" />
      <div className="home-orb home-orb-2" aria-hidden="true" />
      <div className="home-orb home-orb-3" aria-hidden="true" />

      {/* Konami input indicator */}
      {konamiProgress > 0 && (
        <div className="konami-indicator">
          {konamiSequence.map((key, i) => (
            <span key={key} className={`konami-key ${i < konamiProgress ? 'pressed' : ''}`}>
              {key.replace('Arrow', '')}
            </span>
          ))}
        </div>
      )}

      {/* I Love You input indicator */}
      {inputProgress > 0 && (
        <div className="ilove-you-indicator">
          <span className="ilove-you-text">I Love You: </span>
          {target.split('').map((char, i) => {
            const targetChar = char === ' ' ? '\u00A0' : char
            const isTyped = i < inputProgress
            return (
              <span key={i} className={`ilove-you-char ${isTyped ? 'typed' : ''}`}>
                {targetChar}
              </span>
            )
          })}
        </div>
      )}

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

          <div className="heart-bridge" aria-hidden="true" 
            onClick={(e) => { e.stopPropagation(); spawnHearts(); handleSecretClick(); }}
            onMouseDown={handleHeartHoldStart}
            onMouseUp={handleHeartHoldEnd}
            onMouseLeave={handleHeartHoldEnd}
            onTouchStart={handleHeartHoldStart}
            onTouchEnd={handleHeartHoldEnd}
          >
            <div className="bridge-line" />
            <Heart className="bridge-heart" size={30} fill="currentColor" strokeWidth={0} />
            <div className="bridge-line" />
            
            {holdProgress > 0 && (
              <div className="heart-hold-progress" style={{ width: `${holdProgress}%` }} />
            )}
            
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

      {/* I Love You Easter Egg */}
      {iLoveYouStage === 4 && (
        <div className="ilove-you-display">
          <div className="love-heart-big">💖</div>
          <h1 className="love-text">我爱你</h1>
          <div className="love-sparkles">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="sparkle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}>✨</span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
