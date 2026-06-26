import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { completeUserOnboarding, selectAuthLoading } from '../../store/slices/authSlice.js'
import Field from './Field.jsx'

function OnboardingModal() {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)

  const [formData, setFormData] = useState({
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // The thunk handles the API call and toasts
    await dispatch(completeUserOnboarding(formData))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-ink-650 bg-ink-900 p-6 shadow-2xl sm:p-8">
        
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-xl text-brand-400 border border-brand-500/20 shadow-[0_0_15px_rgba(37,201,121,0.2)]">
            <FiCheckCircle />
          </span>
          <h2 className="mt-4 text-xl font-bold text-steel-200">Welcome to HRMS!</h2>
          <p className="mt-2 text-sm text-steel-400">
            Before you can access your dashboard, please complete your profile setup. This information is required by HR.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Phone Number *" name="phone">
            <input
              required
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="field-dark mt-1.5 w-full"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-steel-300">Gender</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 transition-colors focus:border-brand-500 focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <Field label="Date of Birth" name="dateOfBirth">
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="field-dark mt-1.5 w-full"
              />
            </Field>
          </div>

          <Field label="Blood Group" name="bloodGroup">
            <input
              name="bloodGroup"
              type="text"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="e.g. O+"
              className="field-dark mt-1.5 w-full"
            />
          </Field>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-steel-300">Address</span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full resize-none rounded border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-steel-200 transition-colors focus:border-brand-500 focus:outline-none"
              placeholder="Enter your full home address"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="primary-button flex w-full items-center justify-center gap-2"
            >
              {loading ? 'Saving Profile...' : 'Complete Setup'}
              {!loading && <FiArrowRight />}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default OnboardingModal
