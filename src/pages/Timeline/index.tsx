import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Heart, ArrowLeft } from 'lucide-react'
import { getImagesByDate } from '@/lib/images.ts'
import eventsJson from '@/data/events.json'
import './Timeline.css'

// ─────────────────────────────────────────────
// Scroll reveal hook — 用 IntersectionObserver 监听元素进入视口
// ─────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, revealed }
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
interface TimelineEventData {
  id: number
  date: string
  title: string
  description: string
  location: string
  images: string[]
  tags: string[]
}

const EVENTS: TimelineEventData[] = eventsJson.map((e) => ({
  ...e,
  images: getImagesByDate(e.date),
}))

// ─────────────────────────────────────────────
// SVG decorative icons
// ─────────────────────────────────────────────
function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor" />
    </svg>
  )
}

function QuoteIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 7H7a4 4 0 0 0-4 4v1a3 3 0 0 0 6 0 1 1 0 0 0-1-1H7a2 2 0 0 1 2-2h2V7ZM21 7h-4a4 4 0 0 0-4 4v1a3 3 0 0 0 6 0 1 1 0 0 0-1-1h-1a2 2 0 0 1 2-2h2V7Z" fill="currentColor" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Photo Gallery — poker hand spread
// ─────────────────────────────────────────────
interface PhotoGalleryProps {
  images: string[]
  isActive: boolean
}

function PhotoGallery({ images, isActive }: PhotoGalleryProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const count = images.length

  function getBaseAngle(i: number): number {
    if (count === 1) return 0
    const spread = count <= 2 ? 30 : count <= 3 ? 48 : 60
    return -spread / 2 + i * (spread / (count - 1))
  }

  function getBaseX(i: number): number {
    if (count === 1) return 0
    const totalSpread = count <= 2 ? 40 : count <= 3 ? 60 : 80
    return -totalSpread / 2 + i * (totalSpread / (count - 1))
  }

  function getTransform(i: number): string {
    const angle = getBaseAngle(i)
    const tx = getBaseX(i)
    if (hovered === i && isActive) {
      return `translateX(${tx}px) rotate(0deg) translateY(-60px) scale(1.1)`
    }
    if (hovered !== null && isActive) {
      const shift = i < hovered ? -12 : 12
      return `translateX(${tx + shift}px) rotate(${angle}deg) translateY(6px) scale(0.94)`
    }
    return `translateX(${tx}px) rotate(${angle}deg) translateY(0px) scale(1)`
  }

  return (
    <div className={`fan-gallery ${isActive ? 'fan-active' : 'fan-inactive'}`}>
      {images.map((src, i) => (
        <div
          key={i}
          className={`fan-card ${hovered === i && isActive ? 'fan-hovered' : ''}`}
          style={{
            transform: getTransform(i),
            zIndex: hovered === i && isActive ? count + 20 : i + 1,
          }}
          onMouseEnter={() => isActive && setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={src} alt={`记忆照片 ${i + 1}`} className="fan-card-image" />
          {count > 1 && <div className="fan-index">{i + 1}</div>}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Timeline event card
// ─────────────────────────────────────────────
interface EventCardProps {
  event: TimelineEventData
  index: number
  isActive: boolean
  cardRef: (el: HTMLDivElement | null) => void
  onActivate: () => void
}

function EventCard({ event, index, isActive, cardRef, onActivate }: EventCardProps) {
  const isEven = index % 2 === 0
  const { ref: revealRef, revealed } = useScrollReveal(0.12)

  return (
    <div
      ref={(el) => {
        revealRef.current = el
        cardRef(el)
      }}
      className={`timeline-card ${isActive ? 'active' : 'inactive'} ${isEven ? 'layout-left' : 'layout-right'} ${revealed ? 'revealed' : 'hidden-card'} ${isEven ? 'from-left' : 'from-right'}`}
      onClick={onActivate}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <div className="timeline-card-photo">
        <PhotoGallery images={event.images} isActive={isActive} />
      </div>

      <div className="timeline-card-connector" aria-hidden="true">
        <div className={`connector-heart ${isActive ? 'active' : ''}`}>
          <Heart size={16} fill={isActive ? '#fb7185' : 'transparent'} strokeWidth={1.5} />
        </div>
      </div>

      <div className="timeline-card-content">
        <div className={`event-date ${isActive ? 'active' : ''}`}>
          <Calendar size={13} strokeWidth={1.8} />
          <span>{event.date}</span>
        </div>

        <h2 className={`event-title font-serif-cn ${isActive ? 'active' : ''}`}>
          {event.title}
        </h2>

        <blockquote className={`event-description ${isActive ? 'active' : ''}`}>
          <p>{event.description}</p>
        </blockquote>

        {isActive && (
          <div className="event-tags">
            {event.tags.map((tag) => (
              <span key={tag} className="event-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Side navigation dots
// ─────────────────────────────────────────────
interface SideNavProps {
  events: TimelineEventData[]
  activeIndex: number
  onNavigate: (i: number) => void
}

function SideNav({ events, activeIndex, onNavigate }: SideNavProps) {
  return (
    <nav className="side-nav" aria-label="时间线导航">
      {events.map((ev, i) => (
        <button
          key={ev.id}
          onClick={() => onNavigate(i)}
          className={`side-nav-item ${activeIndex === i ? 'active' : ''}`}
          aria-label={`跳转到 ${ev.title}`}
        >
          <span className="side-nav-label">{ev.title}</span>
          <span className="side-nav-dot" />
        </button>
      ))}
    </nav>
  )
}

// ─────────────────────────────────────────────
// Decorative floating dots
// ─────────────────────────────────────────────
function FloatingDots() {
  return (
    <div className="floating-dots" aria-hidden="true">
      <span className="dot dot-1" />
      <span className="dot dot-2" />
      <span className="dot dot-3" />
      <span className="dot dot-4" />
      <span className="dot dot-5" />
    </div>
  )
}

// ─────────────────────────────────────────────
// Timeline page
// ─────────────────────────────────────────────
export default function TimelinePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const isScrollingManually = useRef(false)
  const activeIndexRef = useRef(0)

  function scrollToSection(index: number) {
    const el = sectionRefs.current[index]
    if (!el) return
    isScrollingManually.current = true
    activeIndexRef.current = index
    setActiveIndex(index)
    window.scrollTo({
      top: el.offsetTop - window.innerHeight * 0.25,
      behavior: 'smooth',
    })
    setTimeout(() => {
      isScrollingManually.current = false
    }, 900)
  }

  useEffect(() => {
    function handleScroll() {
      if (isScrollingManually.current) return

      if (window.scrollY < 80) {
        if (activeIndexRef.current !== 0) {
          activeIndexRef.current = 0
          setActiveIndex(0)
        }
        return
      }

      const center = window.scrollY + window.innerHeight * 0.5
      let next = 0
      let minDist = Infinity
      sectionRefs.current.forEach((ref, i) => {
        if (!ref) return
        const cardCenter = ref.offsetTop + ref.offsetHeight * 0.5
        const dist = Math.abs(cardCenter - center)
        if (dist < minDist) {
          minDist = dist
          next = i
        }
      })
      if (next !== activeIndexRef.current) {
        activeIndexRef.current = next
        setActiveIndex(next)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-shell">
      <FloatingDots />

      <header className="hero">
        <Link to="/" className="hero-back" aria-label="返回主页">
          <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>主页</span>
        </Link>
        <SparkleIcon className="hero-sparkle" />
        <QuoteIcon className="hero-quote" />
        <p className="hero-subtitle">THE JOURNEY OF US</p>
        <div className="hero-line" aria-hidden="true" />
        <div className="hero-scroll-circle" aria-hidden="true">
          <div className="scroll-ring" />
        </div>
      </header>

      <main className="timeline-main">
        <div className="timeline-line" aria-hidden="true" />
        <div className="timeline-events">
          {EVENTS.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isActive={activeIndex === index}
              cardRef={(el) => { sectionRefs.current[index] = el }}
              onActivate={() => scrollToSection(index)}
            />
          ))}
        </div>
      </main>

      <SideNav events={EVENTS} activeIndex={activeIndex} onNavigate={scrollToSection} />

      <div className="memory-counter">
        <span className="memory-counter-text">
          MEMORIES / {String(activeIndex + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
