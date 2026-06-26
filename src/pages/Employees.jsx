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
  const [departmentForm, setDepartmentForm] = useState(initialDepartmentForm)
  const [designationForm, setDesignationForm] = useState(initialDesignationForm)
  const [setupLoading, setSetupLoading] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchAllEmployeeData())
  }, [dispatch])

  const reload = () => dispatch(fetchAllEmployeeData())


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

  const handleRegisterEmployee = async (event) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.department || !formData.designation) {
      return toast.error('Name, email, department and designation are required')
    }

    const payload = {
      ...formData,
      manager: formData.manager || undefined,
      salary: formData.salary || undefined,
      joiningDate: formData.joiningDate || undefined,
    }

    const toastId = toast.loading('Registering employee...')
    const result = await dispatch(addEmployee(payload))

    if (addEmployee.fulfilled.match(result)) {
      toast.success(result.payload.message || 'Employee registered successfully', { id: toastId })
      setFormData(initialEmployeeForm)
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
        >
          <FiRefreshCw /> Refresh API
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
            <table className="w-full min-w-[820px] text-left text-[12px]">
              <thead className="border-b border-white/10 uppercase text-steel-400 bg-black/20">
                <tr>
                  {['Employee', 'Role', 'Department', 'Designation', 'Status', 'Manager', 'Action'].map((head) => (
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
                      <td className="px-3 py-4 text-steel-300">{person.role}</td>
                      <td className="px-3 py-4 text-steel-400">{person.team}</td>
                      <td className="px-3 py-4 text-steel-400">{getDesignationName(employee.designation)}</td>
                      <td className="px-3 py-4">
                        <StatusBadge tone={employee.user?.isActive ? 'success' : 'warning'}>
                          {employee.user?.isActive ? 'Active' : 'Invited'}
                        </StatusBadge>
                      </td>
                      <td className="px-3 py-4 text-steel-400">{manager}</td>
                      <td className="px-3 py-4">
                        <button className="icon-button" type="button" aria-label={`Actions for ${person.name}`}>
                          <FiMoreVertical />
                        </button>
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
        <aside className="space-y-4">
          <Panel
            title="Register Employee"
            action={<span className="muted-label text-brand-300">API Connected</span>}
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

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Role">
                  <select
                    className="field-dark mt-2 w-full"
                    name="role"
                    value={formData.role}
                    onChange={handleEmployeeChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </Field>

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
              </div>

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

              <button
                className="primary-button h-10 w-full"
                type="submit"
                disabled={submitting}
              >
                <FiSend />
                {submitting ? 'Sending Invite...' : 'Register & Send Invite'}
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
    </AppShell>
  )
}

export default Employees
