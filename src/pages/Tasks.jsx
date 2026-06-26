import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiCheckSquare, FiPlay, FiCheck, FiX, FiRefreshCw, FiPlus, FiClock } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import Field from '../components/ui/Field.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { selectSession, selectUser } from '../store/slices/authSlice'
import { fetchTasks, createTask, updateTaskStatus, selectTasks, selectTaskLoading } from '../store/slices/taskSlice'
import { fetchAllEmployeeData, selectEmployees } from '../store/slices/employeeSlice'

const getInitials = (name = 'Employee') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function Tasks() {
  const dispatch = useDispatch()
  const tasks = useSelector(selectTasks)
  const loading = useSelector(selectTaskLoading)
  const session = useSelector(selectSession)
  const currentUser = useSelector(selectUser)
  const employees = useSelector(selectEmployees)
  
  const userRole = session?.user?.role || currentUser?.role
  const isManagerOrAdmin = userRole === 'admin' || userRole === 'hr' || userRole === 'manager'
  const currentUserId = session?.user?._id || currentUser?._id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
  })

  useEffect(() => {
    dispatch(fetchTasks())
    if (isManagerOrAdmin) {
      dispatch(fetchAllEmployeeData())
    }
  }, [dispatch, isManagerOrAdmin])

  const reload = () => dispatch(fetchTasks())

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.deadline) {
      return toast.error("All fields are required")
    }

    const toastId = toast.loading("Assigning task...")
    const result = await dispatch(createTask(formData))
    
    if (createTask.fulfilled.match(result)) {
      toast.success("Task assigned successfully", { id: toastId })
      setFormData({ title: '', description: '', assignedTo: '', deadline: '' })
      reload()
    } else {
      toast.error(result.payload || "Failed to assign task", { id: toastId })
    }
  }

  const handleStatusUpdate = async (taskId, newStatus) => {
    const toastId = toast.loading(`Updating task to ${newStatus}...`)
    const result = await dispatch(updateTaskStatus({ taskId, status: newStatus }))
    
    if (updateTaskStatus.fulfilled.match(result)) {
      toast.success(`Task marked as ${newStatus}`, { id: toastId })
      reload()
    } else {
      toast.error(result.payload || "Failed to update status", { id: toastId })
    }
  }

  const getStatusTone = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'brand'
      case 'rejected': return 'danger'
      case 'accepted': return 'steel'
      default: return 'warning'
    }
  }

  return (
    <AppShell
      title="Tasks"
      action={
        <button className="primary-button" type="button" onClick={reload}>
          <FiRefreshCw /> Refresh
        </button>
      }
    >
      <header className="mb-4">
        <h1 className="page-title">Task Management</h1>
        <p className="mt-1 text-[12px] text-steel-400">
          Track, assign, and manage daily tasks.
        </p>
      </header>

      <section className={`mt-4 grid gap-4 ${isManagerOrAdmin ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : 'xl:grid-cols-1'}`}>
        <Panel title="Assigned Tasks" action={<span className="text-[11px] text-steel-400">{tasks.length} tasks</span>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[12px]">
              <thead className="border-b border-white/10 uppercase text-steel-400 bg-black/20">
                <tr>
                  <th className="px-4 py-3.5 font-bold tracking-wider">Task</th>
                  <th className="px-4 py-3.5 font-bold tracking-wider">Assignee</th>
                  <th className="px-4 py-3.5 font-bold tracking-wider">Assigned By</th>
                  <th className="px-4 py-3.5 font-bold tracking-wider">Deadline</th>
                  <th className="px-4 py-3.5 font-bold tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-right font-bold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const assigneeName = task.assignedTo?.user?.name || "Unknown"
                  const assignerName = task.assignedBy?.user?.name || "Unknown"
                  const isMyTask = task.assignedTo?.user?._id === currentUserId

                  return (
                    <tr key={task._id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-4 py-4">
                        <p className="font-medium text-steel-200">{task.title}</p>
                        <p className="text-[11px] text-steel-500 line-clamp-1">{task.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar person={{ name: assigneeName, avatar: getInitials(assigneeName) }} />
                          <span>{assigneeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-steel-400">{assignerName}</td>
                      <td className="px-4 py-4 text-steel-300">
                        <div className="flex items-center gap-1">
                          <FiClock className="text-steel-500" />
                          {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge tone={getStatusTone(task.status)}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {isMyTask && task.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button className="h-8 rounded bg-brand-300 px-3 text-[11px] font-semibold text-ink-950 hover:bg-brand-400" onClick={() => handleStatusUpdate(task._id, 'accepted')}>
                              Accept
                            </button>
                            <button className="h-8 rounded border border-danger/70 px-3 text-[11px] font-semibold text-danger hover:bg-danger/10" onClick={() => handleStatusUpdate(task._id, 'rejected')}>
                              Reject
                            </button>
                          </div>
                        )}
                        {isMyTask && task.status === 'accepted' && (
                          <button className="h-8 rounded bg-brand-300 px-3 text-[11px] font-semibold text-ink-950 hover:bg-brand-400" onClick={() => handleStatusUpdate(task._id, 'in-progress')}>
                            <FiPlay className="inline mr-1" /> Start
                          </button>
                        )}
                        {isMyTask && task.status === 'in-progress' && (
                          <button className="h-8 rounded bg-success px-3 text-[11px] font-semibold text-ink-950 hover:bg-success/90" onClick={() => handleStatusUpdate(task._id, 'completed')}>
                            <FiCheck className="inline mr-1" /> Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {!loading && tasks.length === 0 && (
            <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
              No tasks found.
            </div>
          )}
        </Panel>

        {isManagerOrAdmin && (
          <aside className="space-y-4">
            <Panel title="Assign New Task" action={<FiCheckSquare className="text-brand-300" />}>
              <form className="space-y-4" onSubmit={handleCreateTask}>
                <Field label="Task Title">
                  <input
                    className="field-dark mt-2 w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Design Homepage"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className="field-dark mt-2 w-full resize-none"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed task description..."
                  />
                </Field>
                <Field label="Assign To">
                  <select
                    className="field-dark mt-2 w-full"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.user?.name || emp.employeeId} ({emp.department?.departmentName || 'No Team'})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Deadline">
                  <input
                    type="date"
                    className="field-dark mt-2 w-full"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </Field>
                <button className="primary-button h-10 w-full" type="submit">
                  <FiPlus /> Assign Task
                </button>
              </form>
            </Panel>
          </aside>
        )}
      </section>
    </AppShell>
  )
}

export default Tasks
