import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi'

function ConfirmModal({ isOpen, title = "Confirm Action", message = "Are you sure you want to proceed?", onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-console animate-scale-up text-left"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <FiAlertTriangle size={18} />
          </span>
          <h2 className="text-base font-bold text-white">{title}</h2>
        </header>

        <div className="mt-4">
          <p className="text-sm text-steel-400 leading-relaxed">{message}</p>
        </div>

        <footer className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="soft-button h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="danger-button h-9 px-4 text-xs font-semibold"
          >
            Confirm
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ConfirmModal
