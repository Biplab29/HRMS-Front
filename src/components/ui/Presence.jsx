import ProgressBar from './ProgressBar.jsx'

function Presence({ label, value, progress, tone = 'success' }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-[12px]">
        <span className="text-steel-300">{label}</span>
        <span className="text-steel-400">{value}</span>
      </div>
      <ProgressBar value={progress} tone={tone} />
    </div>
  )
}

export default Presence
