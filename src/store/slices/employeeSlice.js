import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createDepartment,
  createDesignation,
  getDepartments,
  getDesignations,
  getEmployees,
  registerEmployee,
} from '../../services/hrms'

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getEmployees()
      return data.employees || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load employees')
    }
  }
)

export const fetchDepartments = createAsyncThunk(
  'employee/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDepartments()
      return (data.departments || []).filter((d) => d.isActive !== false)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load departments')
    }
  }
)

export const fetchDesignations = createAsyncThunk(
  'employee/fetchDesignations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDesignations()
      return (data.designations || []).filter((d) => d.isActive !== false)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not load designations')
    }
  }
)

export const fetchAllEmployeeData = createAsyncThunk(
  'employee/fetchAll',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchEmployees()),
      dispatch(fetchDepartments()),
      dispatch(fetchDesignations()),
    ])
  }
)

export const addEmployee = createAsyncThunk(
  'employee/add',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerEmployee(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Employee registration failed')
    }
  }
)

export const addDepartment = createAsyncThunk(
  'employee/addDepartment',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createDepartment(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Department create failed')
    }
  }
)

export const addDesignation = createAsyncThunk(
  'employee/addDesignation',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createDesignation(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Designation create failed')
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    departments: [],
    designations: [],
    inviteLink: '',
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearEmployeeError(state) {
      state.error = null
    },
    clearInviteLink(state) {
      state.inviteLink = ''
    },
  },
  extraReducers: (builder) => {
    // Fetch employees
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch departments
    builder
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.payload
      })

    // Fetch designations
    builder
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.designations = action.payload
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.error = action.payload
      })

    // fetchAll (parent thunk) — drives loading state for entire page
    builder
      .addCase(fetchAllEmployeeData.pending, (state) => { state.loading = true })
      .addCase(fetchAllEmployeeData.fulfilled, (state) => { state.loading = false })
      .addCase(fetchAllEmployeeData.rejected, (state) => { state.loading = false })

    // Add employee
    builder
      .addCase(addEmployee.pending, (state) => { state.submitting = true })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.submitting = false
        state.inviteLink = action.payload.inviteLink || ''
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload
      })

    // Add department
    builder
      .addCase(addDepartment.pending, (state) => { state.submitting = true })
      .addCase(addDepartment.fulfilled, (state) => { state.submitting = false })
      .addCase(addDepartment.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload
      })

    // Add designation
    builder
      .addCase(addDesignation.pending, (state) => { state.submitting = true })
      .addCase(addDesignation.fulfilled, (state) => { state.submitting = false })
      .addCase(addDesignation.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload
      })
  },
})

export const { clearEmployeeError, clearInviteLink } = employeeSlice.actions

// ─── Selectors ───────────────────────────────────────────────────
export const selectEmployees = (state) => state.employee.employees
export const selectDepartments = (state) => state.employee.departments
export const selectDesignations = (state) => state.employee.designations
export const selectInviteLink = (state) => state.employee.inviteLink
export const selectEmployeeLoading = (state) => state.employee.loading
export const selectEmployeeSubmitting = (state) => state.employee.submitting
export const selectEmployeeError = (state) => state.employee.error

export default employeeSlice.reducer
