import { useState, useEffect } from 'react'
import { FiX, FiCheck } from 'react-icons/fi'
import Field from './Field.jsx'

function PromptModal({ isOpen, title = "Input Required", message = "Please enter the details:", placeholder = "Type here...", onConfirm, onCancel }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (isOpen) {
      setValue('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(value)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-console animate-scale-up text-left"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onCancel} className="icon-button" aria-label="Close modal">
            <FiX size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label={message}>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows="3"
              className="field-dark mt-2 w-full resize-none"
              required
            />
          </Field>

          <footer className="flex justify-end gap-2 border-t border-white/5 pt-4">
            <button 
              type="button" 
              onClick={onCancel} 
              className="soft-button h-9 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-button h-9 px-4 text-xs font-semibold"
            >
              Submit
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default PromptModal
