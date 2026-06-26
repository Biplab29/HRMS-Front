import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { applyLeave, approveLeave, getLeaves, rejectLeave } from '../../services/hrms'

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchLeaves = createAsyncThunk(
  'leave/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getLeaves()
      return data.leaves || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load leaves')
    }
  }
)

export const submitLeave = createAsyncThunk(
  'leave/apply',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await applyLeave(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Leave application failed')
    }
  }
)

export const approveLeaveById = createAsyncThunk(
  'leave/approve',
  async (leaveId, { rejectWithValue }) => {
    try {
      const data = await approveLeave(leaveId)
      return { leaveId, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Approve failed')
    }
  }
)

export const rejectLeaveById = createAsyncThunk(
  'leave/reject',
  async (leaveId, { rejectWithValue }) => {
    try {
      const data = await rejectLeave(leaveId)
      return { leaveId, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Reject failed')
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaves: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearLeaveError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch leaves
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Apply leave
    builder
      .addCase(submitLeave.pending, (state) => { state.actionLoading = true })
      .addCase(submitLeave.fulfilled, (state) => { state.actionLoading = false })
      .addCase(submitLeave.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

    // Approve leave — optimistic status update
    builder
      .addCase(approveLeaveById.pending, (state) => { state.actionLoading = true })
      .addCase(approveLeaveById.fulfilled, (state, action) => {
        state.actionLoading = false
        const target = state.leaves.find((l) => l._id === action.payload.leaveId)
        if (target) target.status = 'approved'
      })
      .addCase(approveLeaveById.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

    // Reject leave — optimistic status update
    builder
      .addCase(rejectLeaveById.pending, (state) => { state.actionLoading = true })
      .addCase(rejectLeaveById.fulfilled, (state, action) => {
        state.actionLoading = false
        const target = state.leaves.find((l) => l._id === action.payload.leaveId)
        if (target) target.status = 'rejected'
      })
      .addCase(rejectLeaveById.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export const { clearLeaveError } = leaveSlice.actions

// ─── Selectors ───────────────────────────────────────────────────
export const selectLeaves = (state) => state.leave.leaves
export const selectLeaveLoading = (state) => state.leave.loading
export const selectLeaveActionLoading = (state) => state.leave.actionLoading
export const selectLeaveError = (state) => state.leave.error

export default leaveSlice.reducer
