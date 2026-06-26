import ProgressBar from './ProgressBar.jsx'

function Quota({ label, value, progress, tone = 'brand' }) {
  return (
    <div className="mb-4 rounded border border-ink-650 bg-ink-750 p-4">
      <div className="mb-3 flex justify-between text-[12px] text-steel-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <ProgressBar value={progress} tone={tone} />
    </div>
  )
}

export default Quota
