import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiClock, FiDownload, FiEye, FiFileText, FiGift, FiPlus, FiSun } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { fetchCurrentUser, selectSession } from '../store/slices/authSlice'
import { clockIn, clockOut, fetchAttendance, selectAttendanceRecords } from '../store/slices/attendanceSlice'
import { fetchLeaves, selectLeaves, openLeaveModal } from '../store/slices/leaveSlice'
import { fetchPayrolls, selectPayrolls } from '../store/slices/payrollSlice'
import Task from '../components/ui/Task.jsx'

function Dashboard() {
  const dispatch = useDispatch()
  const session = useSelector(selectSession)
  const attendance = useSelector(selectAttendanceRecords) || []
  const leaves = useSelector(selectLeaves) || []
  const payrolls = useSelector(selectPayrolls) || []

  useEffect(() => {
    dispatch(fetchCurrentUser())
    dispatch(fetchAttendance())
    dispatch(fetchLeaves())
    dispatch(fetchPayrolls())
  }, [dispatch])

  const handleClockIn = async () => {
    const toastId = toast.loading('Clocking in...')
    const result = await dispatch(clockIn())
    if (clockIn.fulfilled.match(result)) {
      toast.success(result.payload?.message || 'Check-in successful', { id: toastId })
    } else {
      toast.error(result.payload || 'Check-in failed', { id: toastId })
    }
  }

  const handleClockOut = async () => {
    const toastId = toast.loading('Clocking out...')
    const result = await dispatch(clockOut())
    if (clockOut.fulfilled.match(result)) {
      toast.success(result.payload?.message || 'Check-out successful', { id: toastId })
    } else {
      toast.error(result.payload || 'Check-out failed', { id: toastId })
    }
  }

  const userName = session?.user?.name?.split(' ')[0] || 'there'
  const userRole = session?.user?.role || 'employee'
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const presentCount = attendance.filter((item) => item.status === 'present').length
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0
  
  let usedLeaves = 0;
  leaves.forEach(l => {
     if (l.status?.toLowerCase() === 'approved') {
       usedLeaves += (new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24) + 1;
     }
  });
  const totalLeavesAllowed = 20;
  const leaveBalance = totalLeavesAllowed - usedLeaves;

  const liveActivities = [
    ...leaves.map(l => ({ 
      title: `Leave: ${l.type}`, 
      date: new Date(l.createdAt || l.fromDate).toLocaleDateString(), 
      timestamp: new Date(l.createdAt || l.fromDate).getTime(),
      status: l.status === 'approved' ? 'Available' : 'Processing', 
      action: 'view',
      path: '/leave'
    })),
    ...payrolls.map(p => ({ 
      title: `Payroll: ${p.month}`, 
      date: new Date(p.createdAt || new Date()).toLocaleDateString(), 
      timestamp: new Date(p.createdAt || new Date()).getTime(),
      status: p.status === 'paid' ? 'Available' : 'Processing', 
      action: 'download',
      path: `/payroll/payslip/${p._id}`
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)

  const finalActivities = liveActivities.length > 0 ? liveActivities : []

  return (
    <AppShell title="Overview" search="Search requests, employee..." action={<button className="soft-button" type="button" onClick={() => dispatch(openLeaveModal())}><FiPlus /> Leave Request</button>}>
      <section className="rounded-lg border border-ink-650 bg-gradient-to-br from-ink-750 to-ink-800 p-6 shadow-insetLine">
        <h1 className="page-title">{greeting}, {userName}.</h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-5 text-steel-400">
          Your {userRole} workspace is connected to the backend session API. Attendance, leave, payroll, and employees now refresh from live routes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="primary-button h-8" type="button" onClick={handleClockIn}><FiClock /> Clock In</button>
          <button className="soft-button h-8" type="button" onClick={handleClockOut}><FiClock /> Clock Out</button>
          <button className="soft-button" type="button" onClick={() => dispatch(openLeaveModal())}><FiPlus /> Leave Request</button>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_310px]">
        <div className="grid min-w-0 gap-4 sm:grid-cols-3">
          <StatCard label="Attendance Rate" value={`${attendanceRate}%`} subtext={`${presentCount} present out of ${attendance.length}`} icon={FiClock} tone="success" />
          <StatCard label="Leave Balance" value={`${leaveBalance} Days`} subtext={`Used ${usedLeaves} of ${totalLeavesAllowed} total`} icon={FiGift} tone="warning" />
          <StatCard label="Upcoming Holiday" value="Independence Day" subtext="In 12 days July 4th" icon={FiSun} tone="brand" />
        </div>
        <Panel title="Your Tasks" action={<StatusBadge tone="brand">3</StatusBadge>} className="row-span-2">
          <Task title="Submit Q2 Expense Report" due="Due: June 30, 2023" />
          <Task title="Complete Security Training" due="Due: June 30, 2023" />
          <Task title="Sign Annual Policy Update" due="Due: July 05, 2023" />
          <div className="mt-4 overflow-hidden rounded-lg border border-ink-650 bg-ink-950">
            <div className="h-32 bg-[linear-gradient(135deg,#12384a,#09111f_60%,#1f2937)]" />
            <div className="p-4">
              <StatusBadge tone="warning">HR Announcement</StatusBadge>
              <h3 className="mt-2 text-sm font-semibold text-steel-200 dark:text-white">Company Offsite 2023</h3>
              <p className="mt-1 text-[12px] leading-5 text-steel-400">We are excited to announce our annual team-building retreat.</p>
              <button className="soft-button mt-3 w-full" type="button">Read More</button>
            </div>
          </div>
        </Panel>
        
        <Panel title="Recent Activity" action={<a className="text-[11px] text-brand-300" href="#all">View All</a>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[12px]">
              <thead className="border-b border-ink-650 text-[11px] uppercase text-steel-300">
                <tr>
                  <th className="px-3 py-3">Activity</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {finalActivities.length === 0 ? (
                  <tr><td colSpan="4" className="px-3 py-4 text-center text-steel-400">No recent activity</td></tr>
                ) : finalActivities.map((item, i) => (
                  <tr key={`${item.title}-${i}`} className="border-b border-ink-650 last:border-0">
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-brand-500/10 text-brand-300">
                          <FiFileText aria-hidden="true" />
                        </span>
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-steel-400">{item.date}</td>
                    <td className="px-3 py-4"><StatusBadge tone={item.status === 'Available' ? 'success' : 'brand'}>{item.status}</StatusBadge></td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end">
                        <Link to={item.path} className="icon-button flex items-center justify-center" aria-label={item.action}>
                          {item.action === 'download' ? <FiDownload /> : <FiEye />}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </AppShell>
  )
}

export default Dashboard
