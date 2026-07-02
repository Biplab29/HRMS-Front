import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiDroplet } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import { selectSession } from '../store/slices/authSlice.js'
import { getSingleEmployee } from '../services/hrms.js'
import StatusBadge from '../components/ui/StatusBadge.jsx'

function Profile() {
  const session = useSelector(selectSession)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = session?.user
  const employeeSession = session?.employee

  useEffect(() => {
    async function fetchFullProfile() {
      if (!employeeSession?._id) {
        setLoading(false)
        return
      }
      try {
        const result = await getSingleEmployee(employeeSession._id)
        if (result.success) {
          setProfileData(result.employee)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchFullProfile()
    }
  }, [employeeSession, session])

  if (loading || !session) {
    return (
      <AppShell title="My Profile">
        <div className="flex h-64 items-center justify-center text-steel-400">
          Loading full profile API...
        </div>
      </AppShell>
    )
  }

  if (!user) return null

  // If user is an admin without an employee profile
  if (!employeeSession || !profileData) {
    return (
      <AppShell title="My Profile">
        <div className="mx-auto max-w-2xl">
          <Panel className="flex flex-col items-center text-center py-12">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="mb-4 h-24 w-24 rounded-full object-cover shadow-xl border-2 border-brand-500"
              />
            ) : (
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient text-3xl font-bold text-white shadow-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-xl font-semibold text-steel-200">{user.name}</h2>
            <p className="text-steel-400">{user.email}</p>
            <span className="mt-3 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-400 border border-brand-500/20">
              {user.role.toUpperCase()}
            </span>
            <p className="mt-8 text-sm text-steel-500">
              Administrative accounts do not possess extended employee profiles.
            </p>
          </Panel>
        </div>
      </AppShell>
    )
  }

  const managerName = profileData.manager?.user?.name || profileData.manager?.employeeId || 'None'

  return (
    <AppShell title="My Profile">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Top Header Card */}
        <Panel className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          {profileData.profileImage || profileData.user?.profileImage ? (
            <img
              src={profileData.profileImage || profileData.user.profileImage}
              alt={profileData.user.name}
              className="h-28 w-28 shrink-0 rounded-full object-cover shadow-xl border-2 border-brand-500"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-4xl font-bold text-white shadow-xl">
              {profileData.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-steel-200">{profileData.user.name}</h2>
            <p className="text-brand-300 font-medium">{profileData.designation?.title || 'No Designation'}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-steel-400">
              <span className="flex items-center gap-1.5"><FiMail /> {profileData.user.email}</span>
              <span className="flex items-center gap-1.5"><FiPhone /> {profileData.phone || 'N/A'}</span>
            </div>
            <div className="mt-4">
              <StatusBadge tone={profileData.user.isActive ? 'success' : 'warning'}>
                {profileData.user.isActive ? 'Active Employee' : 'Inactive'}
              </StatusBadge>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Work Details */}
          <Panel title="Employment Info" icon={FiBriefcase}>
            <ul className="divide-y divide-white/5 text-sm">
              <li className="flex justify-between py-3">
                <span className="text-steel-400">Employee ID</span>
                <span className="font-medium text-steel-200">{profileData.employeeId}</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-steel-400">Department</span>
                <span className="font-medium text-steel-200">{profileData.department?.departmentName || 'N/A'}</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-steel-400">Manager</span>
                <span className="font-medium text-steel-200">{managerName}</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="text-steel-400">Employment Type</span>
                <span className="font-medium capitalize text-steel-200">{profileData.employmentType}</span>
              </li>
              <li className="flex justify-between pt-3">
                <span className="text-steel-400">Joining Date</span>
                <span className="font-medium text-steel-200">
                  {profileData.joiningDate ? new Date(profileData.joiningDate).toLocaleDateString() : 'N/A'}
                </span>
              </li>
            </ul>
          </Panel>

          {/* Personal Details */}
          <Panel title="Personal Info" icon={FiUser}>
            <ul className="divide-y divide-white/5 text-sm">
              <li className="flex justify-between py-3">
                <span className="flex items-center gap-2 text-steel-400"><FiUser /> Gender</span>
                <span className="font-medium capitalize text-steel-200">{profileData.gender || 'N/A'}</span>
              </li>
              <li className="flex justify-between py-3">
                <span className="flex items-center gap-2 text-steel-400"><FiCalendar /> Date of Birth</span>
                <span className="font-medium text-steel-200">
                  {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'N/A'}
                </span>
              </li>
              <li className="flex justify-between py-3">
                <span className="flex items-center gap-2 text-steel-400"><FiDroplet /> Blood Group</span>
                <span className="font-medium text-steel-200">{profileData.bloodGroup || 'N/A'}</span>
              </li>
              <li className="flex justify-between pt-3">
                <span className="flex items-center gap-2 text-steel-400"><FiMapPin /> Address</span>
                <span className="font-medium text-steel-200 max-w-[200px] text-right">{profileData.address || 'N/A'}</span>
              </li>
            </ul>
          </Panel>
        </div>

      </div>
    </AppShell>
  )
}

export default Profile
