import Avatar from '../ui/Avatar.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

function LeaveRequestTable({
  requests = [],
  loading = false,
  onApprove,
  onReject,
}) {
  if (loading) {
    return (
      <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
        Loading leave requests from API...
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-650 text-[11px] uppercase text-steel-300">
            <th className="px-4 py-3 font-semibold">Employee</th>
            <th className="px-4 py-3 font-semibold">Leave Type</th>
            <th className="px-4 py-3 font-semibold">Duration</th>
            <th className="px-4 py-3 font-semibold">Reason</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request._id || request.employee.name}
              className="border-b border-ink-650 text-[12px] text-steel-300 last:border-0"
            >
              <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <Avatar person={request.employee} />
                  <div>
                    <p className="font-medium text-steel-200">
                      {request.employee.name}
                    </p>
                    <p className="text-[11px] text-steel-500">
                      {request.employee.role} · {request.employee.team}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-5">
                <span className="rounded-full bg-ink-650 px-3 py-1 text-[10px] font-semibold text-steel-300">
                  {request.type}
                </span>
              </td>
              <td className="px-4 py-5">
                <p>{request.duration}</p>
                <p className="text-[11px] text-steel-500">{request.days}</p>
              </td>
              <td className="px-4 py-5">{request.reason}</td>
              <td className="px-4 py-5">
                <StatusBadge tone={request.statusTone || 'warning'}>
                  {request.status || 'Pending'}
                </StatusBadge>
              </td>
              <td className="px-4 py-5">
                <div className="flex justify-end gap-2">
                  {onApprove && (
                    <button
                      className="h-8 rounded bg-brand-300 px-3 text-[11px] font-semibold text-ink-950 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      disabled={request.status?.toLowerCase() !== 'pending'}
                      onClick={() => onApprove(request._id)}
                    >
                      Approve
                    </button>
                  )}
                  {onReject && (
                    <button
                      className="h-8 rounded border border-danger/70 px-3 text-[11px] font-semibold text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      disabled={request.status?.toLowerCase() !== 'pending'}
                      onClick={() => onReject(request._id)}
                    >
                      Reject
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
          No leave requests found from API.
        </div>
      )}
    </div>
  )
}

export default LeaveRequestTable
