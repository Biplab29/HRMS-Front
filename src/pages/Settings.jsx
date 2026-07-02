import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiSave, FiUser } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import Field from '../components/ui/Field.jsx'
import { selectSession, selectAuthLoading, updateUserProfile, fetchCurrentUser } from '../store/slices/authSlice.js'

function Settings() {
  const dispatch = useDispatch()
  const session = useSelector(selectSession)
  const loading = useSelector(selectAuthLoading)

  const user = session?.user
  const employee = session?.employee

  const [formData, setFormData] = useState({
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
  })
  const [profileImage, setProfileImage] = useState(null)

  // Initialize form with current employee data
  useEffect(() => {
    if (employee) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        phone: employee.phone || '',
        gender: employee.gender || 'male',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        address: employee.address || '',
      })
    }
  }, [employee])

  // Fetch current user if not already loaded
  useEffect(() => {
    if (!session) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, session])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const toastId = toast.loading('Saving profile...')
    
    const data = new FormData()
    data.append('phone', formData.phone)
    data.append('gender', formData.gender)
    data.append('dateOfBirth', formData.dateOfBirth)
    data.append('address', formData.address)
    if (profileImage) {
      data.append('profileImage', profileImage)
    }

    const result = await dispatch(updateUserProfile(data))
    
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully', { id: toastId })
      setProfileImage(null)
      const fileInput = document.getElementById('settingsProfileImageInput')
      if (fileInput) fileInput.value = ''
      dispatch(fetchCurrentUser())
    } else {
      toast.error(result.payload || 'Failed to update profile', { id: toastId })
    }
  }

  if (loading || !session) {
    return (
      <AppShell title="Account Settings">
        <div className="flex h-64 items-center justify-center text-steel-400">
          Loading...
        </div>
      </AppShell>
    )
  }

  if (!user) return null;

  return (
    <AppShell title="Account Settings">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Panel className="flex flex-col items-center text-center">
            {user.profileImage || employee?.profileImage ? (
              <img
                src={user.profileImage || employee.profileImage}
                alt={user.name}
                className="mb-4 h-24 w-24 rounded-full object-cover shadow-xl border-2 border-brand-500"
              />
            ) : (
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient text-3xl font-bold text-white shadow-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-lg font-semibold text-steel-200">{user.name}</h3>
            <p className="text-sm text-steel-400">{user.email}</p>
            <span className="mt-3 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 border border-brand-500/20">
              {user.role.toUpperCase()}
            </span>

            <div className="mt-6 w-full border-t border-ink-650 pt-6 text-left">
              <h4 className="mb-3 text-xs font-semibold uppercase text-steel-500">Employment Details</h4>
              <div className="space-y-2 text-sm text-steel-300">
                {employee ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-steel-500">Employee ID:</span>
                      <span className="font-medium text-steel-200">{employee.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-500">Department:</span>
                      <span className="font-medium text-steel-200">{employee.department?.departmentName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-500">Designation:</span>
                      <span className="font-medium text-steel-200">{employee.designation?.title || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-steel-400">Admin Account - No Employee Profile</div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          {employee ? (
            <Panel title="Edit Profile Details" icon={FiUser}>
              <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Phone Number">
                    <input
                      className="field-dark mt-2 w-full"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 234 567 8900"
                    />
                  </Field>
                  
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

                  <Field label="Date of Birth">
                    <input
                      className="field-dark mt-2 w-full"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field label="Profile Image">
                    <input
                      id="settingsProfileImageInput"
                      className="field-dark mt-2 w-full file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500/20 file:text-brand-300 hover:file:bg-brand-500/30"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                  </Field>
                </div>

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

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-button flex items-center gap-2"
                  >
                    <FiSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Panel>
          ) : (
            <Panel title="Edit Profile Details" icon={FiUser}>
              <div className="py-12 text-center text-steel-400">
                You are an administrator. Administrative accounts do not possess an editable employee profile.
              </div>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  )
}

export default Settings
