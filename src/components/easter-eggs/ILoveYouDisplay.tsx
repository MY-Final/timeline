export default function ILoveYouDisplay() {
  return (
    <div className="ilove-you-display">
      {/* 背景飘动小爱心 */}
      <div className="love-bg-hearts" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => (
          <span 
            key={i} 
            className="bg-heart" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              fontSize: `${12 + Math.random() * 18}px`
            }}
          >
            {['❤️', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)]}
          </span>
        ))}
      </div>
      
      <div className="love-heart-big">💖</div>
      <h1 className="love-text">我爱你</h1>
      
      <div className="love-sparkles">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="sparkle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}>✨</span>
        ))}
      </div>
    </div>
  )
}
