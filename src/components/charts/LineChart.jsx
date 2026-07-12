function LineChart({ 
  data = [218, 196, 185, 105, 142, 130, 72], 
  labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'], 
  compact = false 
}) {
  const maxVal = Math.max(...data, 10)
  
  const points = data.map((val, idx) => {
    const x = 35 + idx * (655 / Math.max(data.length - 1, 1))
    const y = 250 - (val / maxVal) * 180
    return { x, y }
  })

  let linePath = ""
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`
    }
  }

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} 260 L ${points[0].x} 260 Z`
    : ""

  return (
    <svg
      className={compact ? 'h-52 w-full text-brand-400' : 'h-72 w-full text-brand-400'}
      viewBox="0 0 720 300"
      role="img"
      aria-label="Employee growth line chart"
    >
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.00" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <g stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1">
        {[70, 120, 170, 220, 270].map((y) => (
          <line key={y} x1="35" x2="690" y1={y} y2={y} />
        ))}
      </g>
      
      {areaPath && (
        <path d={areaPath} fill="url(#lineFill)" />
      )}

      {linePath && (
        <>
          {/* Outer glow stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            opacity="0.3"
            filter="url(#neonGlow)"
          />
          {/* Main stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
        </>
      )}

      {points.map((pt, idx) => (
        <g key={idx} className="group cursor-pointer">
          <circle
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill="currentColor"
            stroke="#0a0f1d"
            strokeWidth="2"
          />
          <circle
            cx={pt.x}
            cy={pt.y}
            r="8"
            fill="currentColor"
            opacity="0"
            className="hover:opacity-20 transition-opacity"
          />
          <title>{labels[idx]}: {data[idx]} Employee{data[idx] !== 1 ? 's' : ''}</title>
        </g>
      ))}

      {labels.map((month, index) => {
        const x = 35 + index * (655 / Math.max(labels.length - 1, 1))
        return (
          <text 
            key={`${month}-${index}`} 
            x={x} 
            y="286" 
            fill="#97a3b4" 
            fontSize="10" 
            textAnchor="middle"
          >
            {month}
          </text>
        )
      })}
    </svg>
  )
}

export default LineChart
