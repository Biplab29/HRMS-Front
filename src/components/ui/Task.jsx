function Task({ title, due }) {
  return (
    <label className="mb-3 flex gap-3 rounded border border-ink-650 bg-ink-800 p-3 text-[12px] text-steel-300">
      <input type="checkbox" className="mt-1 h-3 w-3 rounded border-ink-650 bg-ink-950" />
      <span>
        <strong className="block text-steel-200">{title}</strong>
        <span className="text-[11px] text-steel-500">{due}</span>
      </span>
    </label>
  )
}

export default Task
