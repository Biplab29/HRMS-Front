import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { api } from '../../services/api'
import { getCurrentUser, logout as logoutApi, updateOwnProfile, completeOnboarding } from '../../services/hrms'

// ─── Async Thunks ───────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser()
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Could not fetch current user'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout API failed:', error)
    } finally {
      localStorage.removeItem('user')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateOwnProfile(payload)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Could not update profile'
      )
    }
  }
)

export const completeUserOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await completeOnboarding(payload)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Could not complete onboarding'
      )
    }
  }
)

// ─── Initial State ───────────────────────────────────────────────

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
})()

const initialState = {
  user: storedUser,
  session: null,   // full session from /auth/me
  loading: false,
  error: null,
}

// ─── Slice ───────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    setUser(state, action) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.session = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        // The API returns the updated employee object. We should update the session.employee
        if (state.session && action.payload.employee) {
          state.session.employee = action.payload.employee
        }
        toast.success('Profile updated successfully')
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })

    // Complete Onboarding
    builder
      .addCase(completeUserOnboarding.pending, (state) => {
        state.loading = true
      })
      .addCase(completeUserOnboarding.fulfilled, (state, action) => {
        state.loading = false
        if (state.session && action.payload.employee) {
          state.session.employee = action.payload.employee
        }
        toast.success('Onboarding completed successfully!')
      })
      .addCase(completeUserOnboarding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.session = null
        toast.success('Logged out successfully')
      })
  },
})

export const { clearAuthError, setUser } = authSlice.actions

// ─── Selectors ───────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user
export const selectSession = (state) => state.auth.session
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
