import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────
// 爱心飘散效果 Hook
// ─────────────────────────────────────────────
export function useFloatingHearts(count = 12) {
  const [hearts, setHearts] = useState<{ id: number, x: number, delay: number }[]>([])
  const heartId = useRef(0)

  const spawn = useCallback(() => {
    const newHearts = Array.from({ length: count }, () => ({
      id: heartId.current++,
      x: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)))
    }, 2500)
  }, [count])

  return { hearts, spawn }
}

// ─────────────────────────────────────────────
// 秘密点击计数 Hook
// ─────────────────────────────────────────────
export function useSecretClick(threshold = 7, windowMs = 500) {
  const [active, setActive] = useState(false)
  const clicks = useRef(0)
  const lastClick = useRef(0)

  const click = useCallback(() => {
    const now = Date.now()
    if (now - lastClick.current < windowMs) {
      clicks.current++
      if (clicks.current >= threshold) {
        setActive(v => !v)
        clicks.current = 0
      }
    } else {
      clicks.current = 1
    }
    lastClick.current = now
  }, [threshold, windowMs])

  return { active, click }
}

// ─────────────────────────────────────────────
// Konami 代码 Hook
// ─────────────────────────────────────────────
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
]

export function useKonamiCode() {
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const index = useRef(0)

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // 忽略输入框里的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      const key = e.key.toLowerCase()
      const expected = KONAMI_SEQUENCE[index.current].toLowerCase()
      
      if (key === expected || e.code.toLowerCase() === expected) {
        index.current++
        setProgress(index.current)
        if (index.current === KONAMI_SEQUENCE.length) {
          setActive(v => !v)
          index.current = 0
          setProgress(0)
        }
      } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
        index.current = 0
        setProgress(0)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return { active, progress, sequence: KONAMI_SEQUENCE }
}

// ─────────────────────────────────────────────
// 长按填充 Hook
// ─────────────────────────────────────────────
export function useLongPress(durationMs = 2000) {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)
  const timer = useRef<number | null>(null)
  const steps = durationMs / 50

  const start = useCallback(() => {
    setProgress(0)
    timer.current = window.setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer.current!)
          setActive(v => !v)
          return 0
        }
        return p + (100 / steps)
      })
    }, 50)
  }, [steps])

  const end = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    setProgress(0)
  }, [])

  return { progress, active, start, end }
}

// ─────────────────────────────────────────────
// 纪念日检测
// ─────────────────────────────────────────────
export function isAnniversary(date: Date): boolean {
  const today = new Date()
  return today.getDate() === date.getDate() && 
         today.getMonth() === date.getMonth()
}

// ─────────────────────────────────────────────
// 鼠标轨迹效果
// ─────────────────────────────────────────────
export function useMouseTrail() {
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const dot = document.createElement('div')
      dot.className = 'mouse-trail'
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
      document.body.appendChild(dot)
      setTimeout(() => dot.remove(), 800)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
}
