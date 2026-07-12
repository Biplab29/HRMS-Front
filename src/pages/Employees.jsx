import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  FiBriefcase,
  FiCheckCircle,
  FiCopy,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiUserPlus,
} from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import {
  addDepartment,
  addDesignation,
  addEmployee,
  clearInviteLink,
  fetchAllEmployeeData,
  selectDepartments,
  selectDesignations,
  selectEmployeeLoading,
  selectEmployeeSubmitting,
  selectEmployees,
  selectInviteLink,
} from '../store/slices/employeeSlice'
import { selectSession, selectUser } from '../store/slices/authSlice'
import { updateEmployee as updateEmployeeApi, deleteEmployee as deleteEmployeeApi } from '../services/hrms'
import Field from '../components/ui/Field.jsx'

const initialEmployeeForm = {
  name: '',
  email: '',
  role: 'employee',
  department: '',
  designation: '',
  manager: '',
  joiningDate: '',
  employmentType: 'full-time',
  salary: '',
}

const initialDepartmentForm = {
  departmentName: '',
  description: '',
}

const initialDesignationForm = {
  title: '',
  department: '',
}

const formatRole = (role) =>
  String(role || 'employee')
    .replace('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getInitials = (name = 'Employee') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const getDepartmentId = (department) =>
  typeof department === 'object' && department !== null ? department._id : department

const getDepartmentName = (department) =>
  typeof department === 'object' && department !== null
    ? department.departmentName || 'Unassigned'
    : 'Unassigned'

const getDesignationName = (designation) =>
  typeof designation === 'object' && designation !== null
    ? designation.title || 'Unassigned'
    : 'Unassigned'

const toEmployeePerson = (employee) => {
  const name = employee.user?.name || employee.employeeId || 'Employee'

  return {
    name,
    avatar: getInitials(name),
    image: employee.profileImage || employee.user?.profileImage,
    role: formatRole(employee.user?.role),
    team: getDepartmentName(employee.department),
  }
}

function Employees() {
  const dispatch = useDispatch()
  const employees = useSelector(selectEmployees)
  const departments = useSelector(selectDepartments)
  const designations = useSelector(selectDesignations)
  const loading = useSelector(selectEmployeeLoading)
  const submitting = useSelector(selectEmployeeSubmitting)
  const inviteLink = useSelector(selectInviteLink)
  const session = useSelector(selectSession)
  const currentUser = useSelector(selectUser)
  const userRole = session?.user?.role || currentUser?.role
  const canManageEmployees = userRole === 'admin' || userRole === 'hr'

  const [formData, setFormData] = useState(initialEmployeeForm)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [departmentForm, setDepartmentForm] = useState(initialDepartmentForm)
  const [designationForm, setDesignationForm] = useState(initialDesignationForm)
  const [setupLoading, setSetupLoading] = useState('')
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState("")

  const isEmployeeProfile = formData.role === 'employee' || formData.role === 'manager'

  useEffect(() => {
    if (userRole !== 'employee') {
      dispatch(fetchAllEmployeeData())
    }
  }, [dispatch, userRole])

  const reload = () => {
    if (userRole !== 'employee') {
      dispatch(fetchAllEmployeeData())
    }
  }

  if (userRole === 'employee') {
    return (
      <AppShell title="Access Denied" search="Search employees...">
        <div className="console-card p-8 text-center max-w-md mx-auto mt-10">
          <h2 className="text-xl font-bold text-danger">Access Denied</h2>
          <p className="text-sm text-steel-400 mt-2">You do not have permission to view the employee directory.</p>
        </div>
      </AppShell>
    )
  }


  const filteredDesignations = designations.filter((designation) => {
    if (!formData.department) return true
    return String(getDepartmentId(designation.department)) === formData.department
  })

  const managers = employees.filter((employee) => employee.user?.role === 'manager')

  const filteredEmployees = employees.filter((employee) => {
    const person = toEmployeePerson(employee)
    const haystack = [
      person.name,
      employee.user?.email,
      person.role,
      person.team,
      employee.employeeId,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(search.toLowerCase())
  })

  const activeEmployees = employees.filter(
    (employee) => employee.user?.isActive !== false,
  ).length
  const pendingOnboarding = employees.filter(
    (employee) => !employee.onboardingCompleted,
  ).length

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { designation: '' } : {}),
    }))
  }

  const handleStartEdit = (employee) => {
    setIsEditing(true)
    setEditingId(employee._id)
    setFormData({
      name: employee.user?.name || '',
      email: employee.user?.email || '',
      role: employee.user?.role || 'employee',
      department: getDepartmentId(employee.department) || '',
      designation: employee.designation?._id || employee.designation || '',
      manager: employee.manager?._id || employee.manager || '',
      joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
      employmentType: employee.employmentType || 'full-time',
      salary: employee.salary || '',
    })
    setProfileImage(null)
    const formElement = document.getElementById('employeeRegisterPanel')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData(initialEmployeeForm)
    setProfileImage(null)
    const fileInput = document.getElementById('employeeProfileImageInput')
    if (fileInput) fileInput.value = ''
  }

  const handleDeleteEmployee = (employeeId, name) => {
    setConfirmDeleteId(employeeId)
    setConfirmDeleteName(name)
  }

  const handleConfirmDeleteEmployee = async () => {
    if (!confirmDeleteId) return
    const toastId = toast.loading('Deleting employee...')
    try {
      const result = await deleteEmployeeApi(confirmDeleteId)
      setConfirmDeleteId(null)
      setConfirmDeleteName("")
      if (result.success) {
        toast.success('Employee deleted successfully', { id: toastId })
        reload()
      } else {
        toast.error(result.message || 'Deletion failed', { id: toastId })
      }
    } catch (error) {
      setConfirmDeleteId(null)
      setConfirmDeleteName("")
      toast.error(error.response?.data?.message || 'Deletion failed', { id: toastId })
    }
  }

  const handleRegisterEmployee = async (event) => {
    event.preventDefault()

    const isEmployeeProfile = formData.role === 'employee' || formData.role === 'manager'

    if (!formData.name || !formData.email) {
      return toast.error('Name and email are required')
    }

    if (isEmployeeProfile && (!formData.department || !formData.designation)) {
      return toast.error('Department and designation are required')
    }

    const data = new FormData()
    data.append('name', formData.name.trim())
    data.append('email', formData.email.trim().toLowerCase())
    data.append('role', formData.role)

    if (isEmployeeProfile) {
      data.append('department', formData.department)
      data.append('designation', formData.designation)
      data.append('employmentType', formData.employmentType)
      if (formData.manager) data.append('manager', formData.manager)
      if (formData.salary) data.append('salary', formData.salary)
      if (formData.joiningDate) data.append('joiningDate', formData.joiningDate)
    }

    if (profileImage) data.append('profileImage', profileImage)

    const toastId = toast.loading(isEditing ? 'Updating employee...' : 'Registering user...')

    if (isEditing) {
      try {
        const result = await updateEmployeeApi(editingId, data)
        if (result.success) {
          toast.success(result.message || 'Employee updated successfully', { id: toastId })
          handleCancelEdit()
          reload()
        } else {
          toast.error(result.message || 'Update failed', { id: toastId })
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed', { id: toastId })
      }
      return
    }

    const result = await dispatch(addEmployee(data))

    if (addEmployee.fulfilled.match(result)) {
      toast.success(result.payload.message || 'Employee registered successfully', { id: toastId })
      setFormData(initialEmployeeForm)
      setProfileImage(null)
      // Reset the file input element if needed by reloading or resetting state
      const fileInput = document.getElementById('employeeProfileImageInput')
      if (fileInput) fileInput.value = ''
      reload()
    } else {
      toast.error(result.payload || 'Employee registration failed', { id: toastId })
    }
  }

  const handleCreateDepartment = async (event) => {
    event.preventDefault()

    if (!departmentForm.departmentName) {
      return toast.error('Department name is required')
    }

    setSetupLoading('department')
    const toastId = toast.loading('Creating department...')
    const result = await dispatch(addDepartment(departmentForm))
    setSetupLoading('')

    if (addDepartment.fulfilled.match(result)) {
      toast.success('Department created', { id: toastId })
      setDepartmentForm(initialDepartmentForm)
      reload()
    } else {
      toast.error(result.payload || 'Department create failed', { id: toastId })
    }
  }

  const handleCreateDesignation = async (event) => {
    event.preventDefault()

    if (!designationForm.title || !designationForm.department) {
      return toast.error('Designation title and department are required')
    }

    setSetupLoading('designation')
    const toastId = toast.loading('Creating designation...')
    const result = await dispatch(addDesignation(designationForm))
    setSetupLoading('')

    if (addDesignation.fulfilled.match(result)) {
      toast.success('Designation created', { id: toastId })
      setDesignationForm(initialDesignationForm)
      reload()
    } else {
      toast.error(result.payload || 'Designation create failed', { id: toastId })
    }
  }

  const handleCopyInvite = async () => {
    if (!inviteLink) return

    try {
      await navigator.clipboard.writeText(inviteLink)
      toast.success('Invite link copied')
      dispatch(clearInviteLink())
    } catch {
      toast.error('Could not copy invite link')
    }
  }


  return (
    <AppShell
      title="Employees"
      search="Search employees..."
      action={
        <button
          className="primary-button"
          type="button"
          onClick={reload}
          title="Refresh"
        >
          <FiRefreshCw />
        </button>
      }
    >
      <header className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="mt-1 text-[12px] text-steel-400">
            Live employee data, invite registration, departments, and designations from backend APIs.
          </p>
        </div>
        <label className="flex h-9 items-center gap-2 rounded border border-ink-650 bg-ink-900 px-3 text-steel-500 md:w-72">
          <FiSearch />
          <input
            className="w-full bg-transparent text-[12px] outline-none"
            placeholder="Find employee"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Total Employees', String(employees.length)],
          ['Active Accounts', String(activeEmployees)],
          ['Pending Onboarding', String(pendingOnboarding)],
          ['Departments', String(departments.length)],
        ].map(([label, value]) => (
          <article key={label} className="console-card p-4">
            <p className="muted-label">{label}</p>
            <strong className="mt-3 block text-3xl text-steel-200">{value}</strong>
          </article>
        ))}
      </section>

      <section className={`mt-4 grid gap-4 ${canManageEmployees ? 'lg:grid-cols-[minmax(0,1fr)_380px]' : 'lg:grid-cols-1'}`}>
        <Panel
          title="Employee Profiles"
          action={
            <span className="text-[11px] text-steel-400">
              {loading ? 'Loading API...' : `${filteredEmployees.length} shown`}
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-[12px]">
              <thead className="border-b border-white/10 uppercase text-steel-400 bg-black/20">
                <tr>
                  {['Employee', 'ID', 'Role', 'Department', 'Designation', 'Status', 'Manager', 'Action'].map((head) => (
                    <th key={head} className="px-4 py-3.5 font-bold tracking-wider">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const person = toEmployeePerson(employee)
                  const manager = employee.manager?.user?.name || employee.manager?.employeeId || 'Not assigned'

                  return (
                    <tr key={employee._id} className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/5">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar person={person} />
                          <div>
                            <p className="font-medium text-steel-200">{person.name}</p>
                            <p className="text-[11px] text-steel-500">
                              {employee.user?.email || employee.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="font-mono text-[12px] text-steel-300">
                          {employee.employeeId}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-steel-300">{person.role}</td>
                      <td className="px-3 py-4 text-steel-400">{person.team}</td>
                      <td className="px-3 py-4 text-steel-400">{getDesignationName(employee.designation)}</td>
                      <td className="px-3 py-4">
                        <StatusBadge tone={employee.user?.isActive ? 'success' : 'warning'}>
                          {employee.user?.isActive ? 'Active' : 'Invited'}
                        </StatusBadge>
                      </td>
                      <td className="px-3 py-4 text-steel-400">{manager}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {canManageEmployees ? (
                          <div className="flex gap-2">
                            <button
                              className="h-7 rounded bg-brand-500/20 px-2 text-[10px] font-semibold text-brand-300 hover:bg-brand-500/30 border border-brand-500/20 transition-colors"
                              type="button"
                              onClick={() => handleStartEdit(employee)}
                            >
                              Edit
                            </button>
                            <button
                              className="h-7 rounded border border-danger/40 bg-danger/10 px-2 text-[10px] font-semibold text-danger hover:bg-danger/25 transition-colors"
                              type="button"
                              onClick={() => handleDeleteEmployee(employee._id, person.name)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-steel-600">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!loading && filteredEmployees.length === 0 && (
            <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
              No employees found from API yet. Register one from the panel.
            </div>
          )}
        </Panel>

        {canManageEmployees && (
        <aside id="employeeRegisterPanel" className="space-y-4">
          <Panel
            title={isEditing ? 'Update Employee' : 'Register Employee'}
            action={
              isEditing ? (
                <button
                  className="text-[11px] font-semibold text-danger hover:underline"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              ) : (
                <span className="muted-label text-brand-300">API Connected</span>
              )
            }
          >
            <form className="space-y-4" onSubmit={handleRegisterEmployee}>
              <Field label="Full Name">
                <input
                  className="field-dark mt-2 w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleEmployeeChange}
                  placeholder="Elena Rodriguez"
                />
              </Field>

              <Field label="Work Email">
                <input
                  className="field-dark mt-2 w-full"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmployeeChange}
                  placeholder="elena@company.com"
                />
              </Field>

              <Field label="Profile Image">
                <input
                  id="employeeProfileImageInput"
                  className="field-dark mt-2 w-full file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500/20 file:text-brand-300 hover:file:bg-brand-500/30"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </Field>

              <div className={isEmployeeProfile ? "grid gap-3 sm:grid-cols-2" : "w-full"}>
                <Field label="Role">
                  <select
                    className="field-dark mt-2 w-full"
                    name="role"
                    value={formData.role}
                    onChange={handleEmployeeChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    {userRole === 'admin' && (
                      <>
                        <option value="hr">HR Manager</option>
                        <option value="admin">Administrator</option>
                      </>
                    )}
                  </select>
                </Field>

                {isEmployeeProfile && (
                  <Field label="Employment">
                    <select
                      className="field-dark mt-2 w-full"
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleEmployeeChange}
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="intern">Intern</option>
                      <option value="contract">Contract</option>
                    </select>
                  </Field>
                )}
              </div>

              {isEmployeeProfile && (
                <>
                  <Field label="Department">
                    <select
                      className="field-dark mt-2 w-full"
                      name="department"
                      value={formData.department}
                      onChange={handleEmployeeChange}
                    >
                      <option value="">Select department</option>
                      {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                          {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Designation">
                    <select
                      className="field-dark mt-2 w-full"
                      name="designation"
                      value={formData.designation}
                      onChange={handleEmployeeChange}
                      disabled={!formData.department}
                    >
                      <option value="">Select designation</option>
                      {filteredDesignations.map((designation) => (
                        <option key={designation._id} value={designation._id}>
                          {designation.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Manager (Optional)">
                    <select
                      className="field-dark mt-2 w-full"
                      name="manager"
                      value={formData.manager}
                      onChange={handleEmployeeChange}
                    >
                      <option value="">Select manager</option>
                      {managers.map((manager) => {
                        const name = manager.user?.name || manager.employeeId || 'Manager'
                        return (
                          <option key={manager._id} value={manager._id}>
                            {name} ({getDepartmentName(manager.department)})
                          </option>
                        )
                      })}
                    </select>
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Joining Date">
                      <input
                        className="field-dark mt-2 w-full"
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={handleEmployeeChange}
                      />
                    </Field>

                    <Field label="Salary">
                      <input
                        className="field-dark mt-2 w-full"
                        name="salary"
                        type="number"
                        min="0"
                        value={formData.salary}
                        onChange={handleEmployeeChange}
                        placeholder="35000"
                      />
                    </Field>
                  </div>
                </>
              )}

              <button
                className="primary-button h-10 w-full"
                type="submit"
                disabled={submitting}
              >
                {!isEditing && <FiSend />}
                {isEditing ? 'Update Employee' : (submitting ? 'Sending Invite...' : 'Register & Send Invite')}
              </button>
            </form>

            {inviteLink && (
              <div className="mt-4 rounded border border-brand-400/30 bg-brand-500/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-brand-300">
                  <FiCheckCircle />
                  Invite link generated
                </div>
                <p className="break-all text-[11px] leading-5 text-steel-300">{inviteLink}</p>
                <button className="soft-button mt-3 w-full" type="button" onClick={handleCopyInvite}>
                  <FiCopy /> Copy Invite Link
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Quick Setup" action={<FiBriefcase className="text-brand-300" />}>
            <form className="space-y-3" onSubmit={handleCreateDepartment}>
              <Field label="New Department">
                <input
                  className="field-dark mt-2 w-full"
                  value={departmentForm.departmentName}
                  onChange={(event) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      departmentName: event.target.value,
                    }))
                  }
                  placeholder="Engineering"
                />
              </Field>
              <button
                className="soft-button w-full"
                type="submit"
                disabled={setupLoading === 'department'}
              >
                <FiPlus /> Add Department
              </button>
            </form>

            <form className="mt-5 space-y-3 border-t border-ink-650 pt-5" onSubmit={handleCreateDesignation}>
              <Field label="New Designation">
                <input
                  className="field-dark mt-2 w-full"
                  value={designationForm.title}
                  onChange={(event) =>
                    setDesignationForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Product Designer"
                />
              </Field>
              <Field label="For Department">
                <select
                  className="field-dark mt-2 w-full"
                  value={designationForm.department}
                  onChange={(event) =>
                    setDesignationForm((prev) => ({
                      ...prev,
                      department: event.target.value,
                    }))
                  }
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </Field>
              <button
                className="soft-button w-full"
                type="submit"
                disabled={setupLoading === 'designation'}
              >
                <FiUserPlus /> Add Designation
              </button>
            </form>
          </Panel>
        </aside>
        )}
      </section>
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Delete Employee"
        message={`Are you sure you want to delete ${confirmDeleteName}? This action cannot be undone.`}
        onConfirm={handleConfirmDeleteEmployee}
        onCancel={() => {
          setConfirmDeleteId(null)
          setConfirmDeleteName("")
        }}
      />
    </AppShell>
  )
}

export default Employees
