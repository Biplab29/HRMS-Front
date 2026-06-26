import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/task')
      return response.data.tasks || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks',
      )
    }
  },
)

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/task', taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task',
      )
    }
  },
)

export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/task/${taskId}/status`, { status })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task status',
      )
    }
  },
)

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload.task) {
          state.tasks.unshift(action.payload.task)
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        if (action.payload.task) {
          const index = state.tasks.findIndex(t => t._id === action.payload.task._id)
          if (index !== -1) {
            state.tasks[index] = action.payload.task
          }
        }
      })
  },
})

export const { clearTaskError } = taskSlice.actions
export const selectTasks = (state) => state.task.tasks
export const selectTaskLoading = (state) => state.task.loading
export const selectTaskError = (state) => state.task.error

export default taskSlice.reducer
