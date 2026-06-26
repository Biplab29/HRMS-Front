function Field({ label, children }) {
  return (
    <label className="block">
      <span className="muted-label">{label}</span>
      {children}
    </label>
  )
}

export default Field
