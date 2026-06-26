import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'
import { submitLeave, selectLeaveActionLoading, fetchLeaves } from '../../store/slices/leaveSlice'

function LeaveApplicationModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const submitting = useSelector(selectLeaveActionLoading)
  
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    fromDate: '',
    toDate: '',
    reason: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason) {
      toast.error('All fields are required')
      return
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error('From Date cannot be after To Date')
      return
    }

    const toastId = toast.loading('Submitting leave application...')
    const result = await dispatch(submitLeave(formData))
    
    if (submitLeave.fulfilled.match(result)) {
      toast.success('Leave applied successfully', { id: toastId })
      dispatch(fetchLeaves()) // Refresh leave list
      onClose()
      setFormData({ leaveType: 'annual', fromDate: '', toDate: '', reason: '' })
    } else {
      toast.error(result.payload || 'Failed to apply leave', { id: toastId })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-ink-650 bg-ink-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-ink-650 px-6 py-4">
          <h2 className="text-lg font-semibold text-steel-200">New Leave Request</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-steel-400 hover:bg-ink-700 hover:text-steel-200"
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-steel-300">Leave Type</span>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 focus:border-brand-500 focus:outline-none"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-steel-300">From Date</span>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="w-full rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-steel-300">To Date</span>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="w-full rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 focus:border-brand-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-steel-300">Reason</span>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full resize-none rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 focus:border-brand-500 focus:outline-none"
              placeholder="Please provide a brief reason for your leave..."
            />
          </label>

          <div className="mt-6 flex justify-end gap-3 border-t border-ink-650 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-ink-600 px-4 py-2 text-sm font-medium text-steel-300 hover:bg-ink-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeaveApplicationModal
