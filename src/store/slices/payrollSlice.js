import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPayrolls, markPayrollPaid, addPayroll } from '../../services/hrms'

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchPayrolls = createAsyncThunk(
  'payroll/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPayrolls()
      return data.payrolls || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load payroll')
    }
  }
)

export const markPaid = createAsyncThunk(
  'payroll/markPaid',
  async (payrollId, { rejectWithValue }) => {
    try {
      const data = await markPayrollPaid(payrollId)
      return { payrollId, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment update failed')
    }
  }
)

export const createPayroll = createAsyncThunk(
  'payroll/create',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await addPayroll(payload)
      return data.payroll
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not create payroll')
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    payrolls: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearPayrollError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchPayrolls.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.loading = false
        state.payrolls = action.payload
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Mark paid — optimistic update
    builder
      .addCase(markPaid.pending, (state) => { state.actionLoading = true })
      .addCase(markPaid.fulfilled, (state, action) => {
        state.actionLoading = false
        const target = state.payrolls.find((p) => p._id === action.payload.payrollId)
        if (target) target.paymentStatus = 'paid'
      })
      .addCase(markPaid.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

    // Create payroll
    builder
      .addCase(createPayroll.pending, (state) => { state.actionLoading = true })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.actionLoading = false
        state.payrolls.unshift(action.payload)
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export const { clearPayrollError } = payrollSlice.actions

// ─── Selectors ───────────────────────────────────────────────────
export const selectPayrolls = (state) => state.payroll.payrolls
export const selectPayrollLoading = (state) => state.payroll.loading
export const selectPayrollActionLoading = (state) => state.payroll.actionLoading
export const selectPayrollError = (state) => state.payroll.error

export default payrollSlice.reducer
