function Info({ label, value, success = false }) {
  return (
    <div>
      <p className="muted-label">{label}</p>
      <p className={success ? 'font-semibold text-success' : 'mt-1 text-steel-200'}>{value}</p>
    </div>
  )
}

export default Info
