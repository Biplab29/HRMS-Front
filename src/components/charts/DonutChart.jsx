function DonutChart({ value = 82, label = 'Ready', tone = 'brand' }) {
  const color = tone === 'success' ? '#25c979' : tone === 'warning' ? '#ffb84d' : '#4a8cff'

  return (
    <div className="mx-auto grid h-40 w-40 place-items-center rounded-full" style={{
      background: `radial-gradient(circle, #171c25 0 52%, transparent 53%), conic-gradient(${color} ${value}%, #2d3543 0)`,
    }}>
      <div className="text-center">
        <strong className="block text-3xl font-semibold text-steel-200">{value}%</strong>
        <span className="text-[12px] font-semibold text-steel-400">{label}</span>
      </div>
    </div>
  )
}

export default DonutChart
