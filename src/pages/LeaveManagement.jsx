import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiDownload, FiFilter, FiPlus, FiRefreshCw } from 'react-icons/fi'
import LeaveRequestTable from '../components/tables/LeaveRequestTable.jsx'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import {
  approveLeaveById,
  fetchLeaves,
  rejectLeaveById,
  selectLeaveLoading,
  selectLeaves,
} from '../store/slices/leaveSlice'
import { selectSession, selectUser } from '../store/slices/authSlice'
import FlowStep from '../components/ui/FlowStep.jsx'
import Quota from '../components/ui/Quota.jsx'
import LeaveApplicationModal from '../components/ui/LeaveApplicationModal.jsx'

const formatTitle = (value) =>
  String(value || '')
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

const formatDate = (value) => {
  if (!value) return 'N/A'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

const getLeaveDays = (fromDate, toDate) => {
  const from = new Date(fromDate)
  const to = new Date(toDate)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 1

  return Math.max(1, Math.round((to - from) / 86400000) + 1)
}

const getStatusTone = (status) => {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'warning'
}

const mapLeaveRequest = (leave) => {
  const employeeName = leave.employee?.user?.name || leave.employee?.employeeId || 'Employee'
  const role = leave.employee?.user?.role || 'Employee'
  const team = leave.employee?.department?.departmentName || leave.employee?.phone || 'HRMS'
  const days = getLeaveDays(leave.fromDate, leave.toDate)

  return {
    _id: leave._id,
    employee: {
      name: employeeName,
      avatar: getInitials(employeeName),
      role: formatTitle(role),
      team,
    },
    type: formatTitle(leave.leaveType),
    duration: `${formatDate(leave.fromDate)} - ${formatDate(leave.toDate)}`,
    days: `${days} ${days === 1 ? 'Day' : 'Days'}`,
    reason: leave.reason,
    status: formatTitle(leave.status),
    statusTone: getStatusTone(leave.status),
  }
}

function LeaveManagement() {
  const dispatch = useDispatch()
  const leaves = useSelector(selectLeaves)
  const loading = useSelector(selectLeaveLoading)
  const session = useSelector(selectSession)
  const currentUser = useSelector(selectUser)
  const userRole = session?.user?.role || currentUser?.role
  const isApprover = userRole === 'admin' || userRole === 'hr' || userRole === 'manager'
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)


  useEffect(() => {
    dispatch(fetchLeaves())
  }, [dispatch])

  const reload = () => dispatch(fetchLeaves())

  const requests = leaves.map(mapLeaveRequest)
  const pendingCount = leaves.filter((leave) => leave.status === 'pending').length
  const approvedCount = leaves.filter((leave) => leave.status === 'approved').length
  const rejectedCount = leaves.filter((leave) => leave.status === 'rejected').length

  const handleApprove = async (leaveId) => {
    const toastId = toast.loading('Approving leave...')
    const result = await dispatch(approveLeaveById(leaveId))
    if (approveLeaveById.fulfilled.match(result)) {
      toast.success('Leave approved', { id: toastId })
    } else {
      toast.error(result.payload || 'Approve failed', { id: toastId })
    }
  }

  const handleReject = async (leaveId) => {
    const toastId = toast.loading('Rejecting leave...')
    const result = await dispatch(rejectLeaveById(leaveId))
    if (rejectLeaveById.fulfilled.match(result)) {
      toast.success('Leave rejected', { id: toastId })
    } else {
      toast.error(result.payload || 'Reject failed', { id: toastId })
    }
  }


  return (
    <AppShell
      title="Leave Management"
      search="Search requests..."
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
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Pending Requests" value={String(pendingCount)} subtext="Live API" />
        <StatCard label="Approved Leaves" value={String(approvedCount)} subtext="All time" tone="success" />
        <StatCard label="Rejected Leaves" value={String(rejectedCount)} subtext="All time" tone="danger" />
        <article className="console-card p-4">
          <p className="muted-label">Remaining Quota</p>
          <strong className="mt-4 block text-[30px] leading-none text-steel-200">84%</strong>
          <div className="mt-4"><ProgressBar value={84} tone="steel" /></div>
        </article>
      </section>

      <Panel
        className="mt-4"
        action={
          <div className="flex gap-2">
            <button className="icon-button" type="button" aria-label="Filter"><FiFilter /></button>
            <button className="icon-button" type="button" aria-label="Download"><FiDownload /></button>
          </div>
        }
      >
        <div className="mb-2 flex border-b border-ink-650 text-[12px]">
          {['Pending Requests', 'History', 'Leave Policy'].map((tab, index) => (
            <button
              key={tab}
              className={`h-10 px-8 ${index === 0 ? 'border-b border-brand-300 text-brand-300' : 'text-steel-400 hover:text-steel-200 dark:text-white'}`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <LeaveRequestTable
          requests={requests}
          loading={loading}
          onApprove={isApprover ? handleApprove : null}
          onReject={isApprover ? handleReject : null}
        />
        <footer className="mt-4 flex items-center justify-between text-[11px] text-steel-400">
          <span>Showing {requests.length} leave requests from API</span>
          <div className="flex gap-1">
            {['‹', '1', '›'].map((item) => (
              <button key={item} className={`h-7 w-7 rounded border border-ink-650 ${item === '1' ? 'bg-brand-500 text-white' : 'text-steel-400'}`} type="button">
                {item}
              </button>
            ))}
          </div>
        </footer>
      </Panel>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel title="Active Approval Flow" action={<span className="muted-label text-brand-300">Multi-stage</span>}>
          <div className="space-y-6">
            <FlowStep active title="Employee Submission" text={`${pendingCount} pending requests awaiting review`} />
            <FlowStep active title="Department Head Review" text="Manager or HR can approve directly from the table" note="API action enabled" />
            <FlowStep title="HR Final Validation" text="Approved/rejected status refreshes from backend" />
          </div>
        </Panel>

        <Panel title="Leave Quotas">
          <Quota label="Annual Leave" value="18/24 Days" progress={75} />
          <Quota label="Sick Leave" value="04/12 Days" progress={34} tone="warning" />
          <Quota label="Personal Days" value="01/05 Days" progress={20} tone="steel" />
          <button className="soft-button mt-5 w-full" type="button">View Full Policy</button>
        </Panel>
      </section>

      <button 
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-300 text-xl text-ink-950 shadow-console transition hover:bg-brand-400" 
        type="button" 
        aria-label="Create leave request"
        onClick={() => setIsLeaveModalOpen(true)}
      >
        <FiPlus aria-hidden="true" />
      </button>
      <LeaveApplicationModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} />
    </AppShell>
  )
}

export default LeaveManagement
