import { configureStore } from '@reduxjs/toolkit'
import attendanceReducer from './slices/attendanceSlice'
import authReducer from './slices/authSlice'
import employeeReducer from './slices/employeeSlice'
import leaveReducer from './slices/leaveSlice'
import payrollReducer from './slices/payrollSlice'
import notificationReducer from './slices/notificationSlice'
import taskReducer from './slices/taskSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    payroll: payrollReducer,
    notification: notificationReducer,
    task: taskReducer,
  },
  devTools: import.meta.env.DEV,
})

export default store
