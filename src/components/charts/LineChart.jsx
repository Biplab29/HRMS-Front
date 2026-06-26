function LineChart({ compact = false }) {
  return (
    <svg
      className={compact ? 'h-52 w-full text-brand-400' : 'h-72 w-full text-brand-400'}
      viewBox="0 0 720 300"
      role="img"
      aria-label="Employee growth line chart"
    >
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <g stroke="#2d3543" strokeWidth="1">
        {[70, 120, 170, 220, 270].map((y) => (
          <line key={y} x1="35" x2="690" y1={y} y2={y} />
        ))}
      </g>
      <path
        d="M38 218 C120 196 158 198 220 185 C300 168 324 107 405 105 C482 104 500 158 568 142 C620 130 650 104 690 72 L690 260 L38 260 Z"
        fill="url(#lineFill)"
      />
      <path
        d="M38 218 C120 196 158 198 220 185 C300 168 324 107 405 105 C482 104 500 158 568 142 C620 130 650 104 690 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M38 218 C128 206 214 190 296 180 C386 170 452 136 534 128 C598 123 643 116 690 96"
        fill="none"
        stroke="#9fb9ff"
        strokeDasharray="5 6"
        strokeWidth="2"
      />
      {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'].map((month, index) => (
        <text key={month} x={42 + index * 92} y="286" fill="#97a3b4" fontSize="11">
          {month}
        </text>
      ))}
    </svg>
  )
}

export default LineChart
