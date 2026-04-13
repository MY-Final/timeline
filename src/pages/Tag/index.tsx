import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagesByDate } from '@/lib/images.ts'
import { ImageLightbox } from '@/components/ui/common/ImageLightbox.tsx'
import eventsJson from '@/data/events.json'
import './Tag.css'

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

const allTags = [...new Set(EVENTS.flatMap(e => e.tags))]

// ─────────────────────────────────────────────
// Floating dots
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
// Photo Carousel
// ─────────────────────────────────────────────
interface PhotoCarouselProps {
  images: string[]
}

function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const count = images.length

  useEffect(() => {
    if (count <= 1 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count)
    }, 3000) // Auto advance every 3 seconds

    return () => clearInterval(interval)
  }, [count, isHovered])

  function nextImage() {
    setCurrentIndex((currentIndex + 1) % count)
  }

  function prevImage() {
    setCurrentIndex((currentIndex - 1 + count) % count)
  }

  function openLightbox() {
    setLightboxIndex(currentIndex)
  }

  if (count === 0) return null

  return (
    <>
      <div
        className="tag-carousel"
        onClick={openLightbox}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentIndex]}
          alt={`照片 ${currentIndex + 1}`}
          className="tag-carousel-image"
        />
        {count > 1 && (
          <>
            <button
              className="tag-carousel-nav tag-carousel-prev"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              aria-label="上一张"
            >
              ‹
            </button>
            <button
              className="tag-carousel-nav tag-carousel-next"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              aria-label="下一张"
            >
              ›
            </button>
            <div className="tag-carousel-indicators">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`tag-carousel-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                  aria-label={`切换到照片 ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + count) % count)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % count)}
          onJump={(i) => setLightboxIndex(i)}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// Tag Chip
// ─────────────────────────────────────────────
interface TagChipProps {
  tag: string
  isSelected: boolean
  onToggle: (tag: string) => void
}

function TagChip({ tag, isSelected, onToggle }: TagChipProps) {
  return (
    <motion.button
      className={`tag-chip ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(tag)}
      transition={{ duration: 0.25 }}
    >
      {tag}
    </motion.button>
  )
}

// ─────────────────────────────────────────────
// Event Card
// ─────────────────────────────────────────────
interface EventCardProps {
  event: TimelineEventData
}

function EventCard({ event }: EventCardProps) {
  return (
    <motion.div
      className="tag-event-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="tag-event-photo">
        <PhotoCarousel images={event.images} />
      </div>

      <div className="tag-event-content">
        <div className="tag-event-date">
          <span>{event.date}</span>
        </div>

        <h3 className="tag-event-title font-serif-cn">
          {event.title}
        </h3>

        <p className="tag-event-description">
          {event.description}
        </p>

        <div className="tag-event-tags">
          {event.tags.map((tag) => (
            <span key={tag} className="tag-event-tag">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Tag Page
// ─────────────────────────────────────────────
export default function TagPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredEvents = selectedTags.length === 0
    ? EVENTS
    : EVENTS.filter(event => selectedTags.some(tag => event.tags.includes(tag)))

  return (
    <div className="tag-shell">
      <FloatingDots />

      {/* Header */}
      <header className="tag-header">
        <Link to="/timeline" className="hero-nav-btn tag-back" aria-label="返回时间线">
          <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>时间线</span>
        </Link>
      </header>

      {/* Tag Selection */}
      <div className="tag-selection">
        <div className="tag-chips">
          {allTags.map(tag => (
            <TagChip
              key={tag}
              tag={tag}
              isSelected={selectedTags.includes(tag)}
              onToggle={toggleTag}
            />
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <main className="tag-main">
        <AnimatePresence mode="popLayout">
          <motion.div
            className="tag-grid"
            layout
            transition={{ duration: 0.3 }}
          >
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="tag-footer">
        <div className="tag-counter">
          <span>共 {filteredEvents.length} 个时刻</span>
        </div>
      </footer>
    </div>
  )
}