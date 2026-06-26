function FlowStep({ title, text, note, active = false }) {
  return (
    <div className="relative flex gap-4 text-[12px] before:absolute before:left-[7px] before:top-7 before:h-10 before:w-px before:bg-ink-650 last:before:hidden">
      <span className={`mt-1 h-4 w-4 rounded-full border ${active ? 'border-success bg-success/20' : 'border-ink-650 bg-ink-750'}`} />
      <div>
        <h3 className="font-semibold text-steel-200">{title}</h3>
        <p className="text-steel-400">{text}</p>
        {note && <span className="mt-2 inline-flex rounded border border-ink-650 bg-ink-950 px-3 py-1 text-[11px] text-steel-300">{note}</span>}
      </div>
    </div>
  )
}

export default FlowStep
