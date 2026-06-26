function CalendarCell({ day, bars = [], muted = false }) {
  return (
    <div className={`min-h-[74px] bg-ink-800 p-2 ${muted ? 'text-steel-600' : 'text-steel-400'} ${day === 26 ? 'ring-1 ring-brand-500' : ''}`}>
      <span className="text-[11px]">{day}</span>
      <div className="mt-6 space-y-1">
        {bars.map((bar, index) => <span key={`${day}-${bar}-${index}`} className={`block h-1 rounded ${bar}`} />)}
      </div>
      {day === 26 && <span className="mt-1 block text-[9px] uppercase text-brand-300">Today</span>}
    </div>
  )
}

export default CalendarCell
