import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FiCalendar, FiDownload, FiFilter, FiRefreshCw, FiSliders } from 'react-icons/fi'
import AppShell from '../components/layout/AppShell.jsx'
import Panel from '../components/ui/Panel.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import {
  fetchAttendance,
  selectAttendanceLoading,
  selectAttendanceRecords,
} from '../store/slices/attendanceSlice'
import { fetchAllEmployeeData, selectDepartments } from '../store/slices/employeeSlice'
import CalendarCell from '../components/ui/CalendarCell.jsx'
import Presence from '../components/ui/Presence.jsx'

const getInitials = (name = 'Employee') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const formatTitle = (value) =>
  String(value || '')
    .replace('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatDate = (value) => {
  if (!value) return 'N/A'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

const formatTime = (value) => {
  if (!value) return '--'

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const getTotalHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '--'

  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end - start

  if (Number.isNaN(diff) || diff <= 0) return '--'

  return `${(diff / 3600000).toFixed(1)}h`
}

const getStatusTone = (status) => {
  if (status === 'present') return 'success'
  if (status === 'late' || status === 'half-day') return 'warning'
  if (status === 'leave') return 'brand'
  return 'danger'
}

const mapAttendanceRow = (item) => {
  const employeeName = item.employee?.user?.name || item.employee?.employeeId || 'Employee'

  return {
    _id: item._id,
    employee: employeeName,
    date: formatDate(item.date),
    in: formatTime(item.checkIn),
    out: formatTime(item.checkOut),
    total: getTotalHours(item.checkIn, item.checkOut),
    status: formatTitle(item.status),
    tone: getStatusTone(item.status),
  }
}

function Attendance() {
  const dispatch = useDispatch()
  const attendance = useSelector(selectAttendanceRecords)
  const loading = useSelector(selectAttendanceLoading)
  const departments = useSelector(selectDepartments)

  const [selectedDept, setSelectedDept] = useState('All Departments')

  useEffect(() => {
    dispatch(fetchAttendance())
    dispatch(fetchAllEmployeeData())
  }, [dispatch])

  const reload = () => {
    dispatch(fetchAttendance())
    dispatch(fetchAllEmployeeData())
  }

  const filteredAttendance = useMemo(() => {
    if (selectedDept === 'All Departments') return attendance
    return attendance.filter(item => {
      const deptName = item.employee?.department?.departmentName || item.employee?.department
      return deptName === selectedDept
    })
  }, [attendance, selectedDept])

  const rows = filteredAttendance.map(mapAttendanceRow)
  
  const liveExceptions = filteredAttendance
    .filter(item => item.status && item.status !== 'present')
    .map(item => {
      const name = item.employee?.user?.name || item.employee?.employeeId || 'Employee'
      const type = item.status === 'late' ? 'Late' : item.status === 'half-day' ? 'Half-day' : item.status === 'leave' ? 'Leave' : 'Absent'
      return {
        employee: { name, avatar: getInitials(name) },
        reason: item.status === 'late' ? 'Clocked in late' : type,
        type,
        tone: getStatusTone(item.status)
      }
    })
    .slice(0, 5)

  const calendarCells = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDayOfWeek = firstDay.getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const prevMonthTotalDays = new Date(year, month, 0).getDate()

    const cells = []

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthTotalDays - i,
        muted: true,
        bars: []
      })
    }

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const recordsForDay = filteredAttendance.filter(item => {
        if (!item.date) return false
        const d = new Date(item.date)
        return d.getDate() === dayNum && d.getMonth() === month && d.getFullYear() === year
      })

      const bars = recordsForDay.map(record => {
        return record.status === 'present' ? 'bg-success' : 
               record.status === 'late' ? 'bg-warning' : 
               record.status === 'leave' ? 'bg-brand-400' : 'bg-danger'
      })

      cells.push({
        day: dayNum,
        muted: false,
        bars
      })
    }

    return cells
  }, [filteredAttendance])

  const presentCount = filteredAttendance.filter((item) => item.status === 'present').length
  const lateCount = filteredAttendance.filter((item) => item.status === 'late').length
  const leaveCount = filteredAttendance.filter((item) => item.status === 'leave').length
  const onTimeRate = filteredAttendance.length
    ? Math.round((presentCount / filteredAttendance.length) * 100)
    : 0

  const handleExportCSV = () => {
    if (filteredAttendance.length === 0) return toast.error("No attendance records to export")
    const headers = ["Employee", "Date", "Check-in", "Check-out", "Total Hours", "Status"]
    const csvRows = filteredAttendance.map(item => [
      item.employee?.user?.name || item.employee?.employeeId || "N/A",
      formatDate(item.date),
      formatTime(item.checkIn),
      formatTime(item.checkOut),
      getTotalHours(item.checkIn, item.checkOut),
      formatTitle(item.status)
    ])
    const csvContent = [
      headers.join(","),
      ...csvRows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_export_${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Attendance CSV exported successfully")
  }


  return (
    <AppShell
      title="Attendance Tracking"
      search="Search employees or dates..."
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
        <StatCard label="On-time Rate" value={`${onTimeRate}%`} subtext="Live API" tone="success" />
        <StatCard label="Attendance Records" value={String(attendance.length)} subtext="Total entries" />
        <StatCard label="Leave Ratio" value={String(leaveCount)} subtext="Leave records" tone="warning" />
        <StatCard label="Late Clock-ins" value={String(lateCount)} subtext="Tracked records" tone="danger" />
      </section>

      <Panel className="mt-4">
        <div className="grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-end">
          <label>
            <span className="muted-label">Department</span>
            <select 
              className="field-dark mt-2 w-full"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All Departments">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept.departmentName}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="muted-label">Date Range</span>
            <span className="mt-2 flex h-8 items-center gap-2 rounded border border-ink-650 bg-ink-950 px-3 text-[12px] text-steel-300">
              <FiCalendar />
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </label>
          <div className="flex gap-2">
            <button className="soft-button" type="button" onClick={handleExportCSV}>
              <FiDownload className="mr-1 inline" /> Export CSV
            </button>
          </div>
        </div>
      </Panel>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_300px]">
        <Panel title="Attendance Calendar" action={<span className="text-[12px] text-brand-300">Live Calendar</span>}>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded border border-ink-650 bg-ink-650 text-[11px]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="bg-ink-800 px-3 py-3 text-steel-400">{day}</div>
            ))}
            {calendarCells.map((cell, idx) => (
              <CalendarCell key={`${cell.day}-${cell.muted}-${idx}`} {...cell} />
            ))}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel title="Daily Exceptions" action={<span className="text-[11px] text-brand-300">Live API feed</span>}>
            <div className="space-y-3">
              {liveExceptions.length === 0 ? (
                <p className="text-[12px] text-steel-400">No recent exceptions.</p>
              ) : liveExceptions.map((item, index) => (
                <div key={`${item.employee.name}-${index}`} className="flex items-center gap-3 rounded border-l-2 border-danger bg-ink-750 p-3">
                  <Avatar person={item.employee} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-steel-200">{item.employee.name}</p>
                    <p className="truncate text-[11px] text-steel-500">{item.reason}</p>
                  </div>
                  <StatusBadge tone={item.tone === 'warning' ? 'warning' : item.tone === 'brand' ? 'brand' : 'danger'}>
                    {item.type}
                  </StatusBadge>
                </div>
              ))}
            </div>
            <button className="soft-button mt-4 w-full" type="button">View All Activity Items</button>
          </Panel>
          <Panel title="Team Presence">
            <Presence label="Present" value={`${presentCount}/${attendance.length}`} progress={onTimeRate} />
            <Presence label="Late" value={`${lateCount} Records`} progress={attendance.length ? Math.round((lateCount / attendance.length) * 100) : 0} tone="brand" />
            <Presence label="Leave" value={`${leaveCount} Records`} progress={attendance.length ? Math.round((leaveCount / attendance.length) * 100) : 0} tone="warning" />
          </Panel>
        </aside>
      </section>

      <Panel className="mt-4" title="Recent Check-ins" action={<span className="text-[11px] text-brand-300">Backend API</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead className="border-b border-ink-650 uppercase text-steel-300">
              <tr>
                {['Employee', 'Date', 'Check-in', 'Check-out', 'Total', 'Status', 'Action'].map((head) => (
                  <th key={head} className="px-3 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item._id} className="border-b border-ink-650 last:border-0">
                  <td className="px-3 py-4 text-steel-200">{item.employee}</td>
                  <td className="px-3 py-4 text-steel-400">{item.date}</td>
                  <td className="px-3 py-4">{item.in}</td>
                  <td className="px-3 py-4">{item.out}</td>
                  <td className="px-3 py-4">{item.total}</td>
                  <td className="px-3 py-4"><StatusBadge tone={item.tone}>{item.status}</StatusBadge></td>
                  <td className="px-3 py-4"><FiSliders /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && rows.length === 0 && (
            <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
              No attendance records found from API.
            </div>
          )}

          {loading && (
            <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
              Loading attendance records from API...
            </div>
          )}
        </div>
      </Panel>
    </AppShell>
  )
}

export default Attendance
