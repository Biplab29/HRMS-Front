import { FiCheckCircle, FiEye, FiMoreVertical } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

function PayrollTable({ records = [], loading = false, onMarkPaid, canManagePayroll = true }) {
  if (loading) {
    return (
      <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
        Loading payroll records from API...
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-ink-650 uppercase text-steel-300">
            <th className="px-4 py-3 font-semibold">Employee</th>
            <th className="px-4 py-3 font-semibold">Basic Pay</th>
            <th className="px-4 py-3 font-semibold">Deductions</th>
            <th className="px-4 py-3 font-semibold">Net Pay</th>
            <th className="px-4 py-3 font-semibold">Payment Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record._id || record.employee.name}
              className="border-b border-ink-650 text-steel-300 last:border-0"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar person={record.employee} />
                  <div>
                    <p className="font-medium text-steel-200">
                      {record.employee.name}
                    </p>
                    <p className="text-[11px] text-steel-500">
                      {record.employee.role}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">{record.basic}</td>
              <td className="px-4 py-4 text-danger">{record.deductions}</td>
              <td className="px-4 py-4 font-semibold text-steel-200">
                {record.net}
              </td>
              <td className="px-4 py-4">
                <StatusBadge tone={record.status === 'Paid' || record.status === 'Processed' ? 'success' : 'brand'}>
                  {record.status}
                </StatusBadge>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  {onMarkPaid && record.status !== 'Paid' && (
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`Mark ${record.employee.name} paid`}
                      onClick={() => onMarkPaid(record._id)}
                    >
                      <FiCheckCircle aria-hidden="true" />
                    </button>
                  )}
                  <Link
                    to={`/payroll/payslip/${record._id}`}
                    className="icon-button flex items-center justify-center"
                    aria-label={`View ${record.employee.name}`}
                  >
                    <FiEye aria-hidden="true" />
                  </Link>
                  {canManagePayroll && (
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`More actions for ${record.employee.name}`}
                    >
                      <FiMoreVertical aria-hidden="true" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && (
        <div className="rounded border border-ink-650 bg-ink-900 p-6 text-center text-[12px] text-steel-400">
          No payroll records found from API.
        </div>
      )}
    </div>
  )
}

export default PayrollTable
