import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkIn, checkOut, getAttendance } from '../../services/hrms'

// ─── Async Thunks ───

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAttendance()
      return data.attendance || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load attendance')
    }
  }
)

export const clockIn = createAsyncThunk(
  'attendance/clockIn',
  async (payload = {}, { rejectWithValue }) => {
    try {
      const data = await checkIn(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed')
    }
  }
)

export const clockOut = createAsyncThunk(
  'attendance/clockOut',
  async (payload = {}, { rejectWithValue }) => {
    try {
      const data = await checkOut(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed')
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    loading: false,
    actionLoading: false,  // for check-in / check-out
    error: null,
  },
  reducers: {
    clearAttendanceError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Clock In
    builder
      .addCase(clockIn.pending, (state) => { state.actionLoading = true })
      .addCase(clockIn.fulfilled, (state) => { state.actionLoading = false })
      .addCase(clockIn.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

    // Clock Out
    builder
      .addCase(clockOut.pending, (state) => { state.actionLoading = true })
      .addCase(clockOut.fulfilled, (state) => { state.actionLoading = false })
      .addCase(clockOut.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export const { clearAttendanceError } = attendanceSlice.actions

// ─── Selectors ───────────────────────────────────────────────────
export const selectAttendanceRecords = (state) => state.attendance.records
export const selectAttendanceLoading = (state) => state.attendance.loading
export const selectAttendanceActionLoading = (state) => state.attendance.actionLoading
export const selectAttendanceError = (state) => state.attendance.error

export default attendanceSlice.reducer
