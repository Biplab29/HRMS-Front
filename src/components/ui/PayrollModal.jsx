import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { FiX, FiCheck } from 'react-icons/fi'
import { createPayroll, editPayroll } from '../../store/slices/payrollSlice'
import Field from './Field.jsx'

function PayrollModal({ isOpen, onClose, employees = [], editingRecord = null }) {
  const dispatch = useDispatch()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    basicSalary: '',
    bonus: '0',
    deduction: '0',
  })

  // Format month to "Month Year" (e.g. "July 2026")
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        setFormData({
          employee: editingRecord.employee?._id || editingRecord.employee || '',
          month: editingRecord.month || '',
          basicSalary: String(editingRecord.basicSalary || ''),
          bonus: String(editingRecord.bonus || '0'),
          deduction: String(editingRecord.deduction || '0'),
        })
      } else {
        const now = new Date()
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const currentMonthYear = `${months[now.getMonth()]} ${now.getFullYear()}`
        setFormData({
          employee: '',
          month: currentMonthYear,
          basicSalary: '',
          bonus: '0',
          deduction: '0',
        })
      }
    }
  }, [isOpen, editingRecord])

  if (!isOpen) return null

  // Pre-fill basic salary when employee is selected
  const handleEmployeeChange = (e) => {
    const empId = e.target.value
    const selectedEmp = employees.find(emp => emp._id === empId)
    setFormData(prev => ({
      ...prev,
      employee: empId,
      basicSalary: selectedEmp ? String(selectedEmp.salary || 0) : '',
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Compute Net Salary preview
  const basic = Number(formData.basicSalary || 0)
  const bonus = Number(formData.bonus || 0)
  const deduction = Number(formData.deduction || 0)
  const netSalary = basic + bonus - deduction

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.employee || !formData.month || !formData.basicSalary) {
      return toast.error("Employee, Month, and Basic Salary are required")
    }

    setSubmitting(true)
    const toastId = toast.loading(editingRecord ? "Updating payroll..." : "Generating payroll...")
    
    let result
    if (editingRecord) {
      result = await dispatch(editPayroll({
        payrollId: editingRecord._id,
        payrollData: {
          basicSalary: Number(formData.basicSalary),
          bonus: Number(formData.bonus),
          deduction: Number(formData.deduction),
        }
      }))
    } else {
      result = await dispatch(createPayroll({
        employee: formData.employee,
        month: formData.month,
        basicSalary: Number(formData.basicSalary),
        bonus: Number(formData.bonus),
        deduction: Number(formData.deduction),
      }))
    }

    setSubmitting(false)
    if (editingRecord ? editPayroll.fulfilled.match(result) : createPayroll.fulfilled.match(result)) {
      toast.success(editingRecord ? "Payroll record updated successfully" : "Payroll record generated successfully", { id: toastId })
      onClose()
    } else {
      toast.error(result.payload || (editingRecord ? "Failed to update payroll" : "Failed to generate payroll"), { id: toastId })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-console animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-base font-bold text-white">{editingRecord ? "Edit Employee Payroll" : "Generate Employee Payroll"}</h2>
          <button 
            onClick={onClose} 
            className="icon-button"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Select Employee">
            <select
              name="employee"
              value={formData.employee}
              onChange={handleEmployeeChange}
              className="field-dark mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={editingRecord !== null}
            >
              <option value="">Select employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.user?.name || emp.employeeId} ({emp.department?.departmentName || 'No Team'})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pay Month">
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="e.g. July 2026"
              className="field-dark mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={editingRecord !== null}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Basic Salary (₹)">
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                placeholder="Basic"
                className="field-dark mt-2 w-full"
                min="0"
                required
              />
            </Field>

            <Field label="Bonus (₹)">
              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                placeholder="Bonus"
                className="field-dark mt-2 w-full"
                min="0"
              />
            </Field>

            <Field label="Deduction (₹)">
              <input
                type="number"
                name="deduction"
                value={formData.deduction}
                onChange={handleChange}
                placeholder="Deduction"
                className="field-dark mt-2 w-full"
                min="0"
              />
            </Field>
          </div>

          <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
            <p className="text-[11px] font-semibold uppercase text-brand-300">Net Salary Preview</p>
            <h3 className="mt-1 text-2xl font-bold text-white">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(netSalary)}
            </h3>
            <p className="text-[10px] text-steel-400 mt-1">Calculated as: Basic + Bonus - Deduction</p>
          </div>

          <footer className="flex justify-end gap-2 border-t border-white/5 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="soft-button h-10 px-4"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-button h-10 px-4"
              disabled={submitting}
            >
              <FiCheck /> {editingRecord ? "Update" : "Generate"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default PayrollModal
