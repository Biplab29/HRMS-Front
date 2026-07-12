import { api } from "./api";



/** POST /auth/bootstrap-admin — first-time admin setup (no auth required) */
export const bootstrapAdmin = async (payload) => {
  const { data } = await api.post("/auth/bootstrap-admin", payload);
  return data;
};

/** GET /auth/invite/verify?token=... — validate an invite token */
export const verifyInviteToken = async (token) => {
  const { data } = await api.get("/auth/invite/verify", { params: { token } });
  return data;
};

/** POST /auth/accept-invite — set password via invite token */
export const acceptInvite = async (payload) => {
  const { data } = await api.post("/auth/accept-invite", payload);
  return data;
};

/** GET /auth/me — get current logged-in user */
export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

/** POST /auth/logout */
export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEES  (/api/v1/employee)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /employee — list all employees (admin / hr / manager) */
export const getEmployees = async () => {
  const { data } = await api.get("/employee");
  return data;
};

/** GET /employee/:id — single employee */
export const getSingleEmployee = async (id) => {
  const { data } = await api.get(`/employee/${id}`);
  return data;
};

/** PUT /employees/profile/update */
export const updateOwnProfile = async (payload) => {
  const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  const { data } = await api.put("/employee/profile/update", payload, { headers });
  return data;
};

/**
 * POST /employee/register — invite a new employee/manager user.
 * Payload: { name, email, role, department, designation, manager?,
 *            joiningDate?, employmentType?, salary? }
 */
export const registerEmployee = async (payload) => {
  const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  const { data } = await api.post("/auth/register", payload, { headers });
  return data;
};

/** PUT /employee/:id — update employee profile (admin / hr) */
export const updateEmployee = async (id, payload) => {
  const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  const { data } = await api.put(`/employee/${id}`, payload, { headers });
  return data;
};

/** DELETE /employee/:id — delete employee (admin only) */
export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employee/${id}`);
  return data;
};

/** PUT /employee/onboarding/complete — employee completes their own profile */
export const completeOnboarding = async (payload) => {
  const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  const { data } = await api.put("/employee/onboarding/complete", payload, { headers });
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENTS  (/api/v1/department)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /department — all departments */
export const getDepartments = async () => {
  const { data } = await api.get("/department");
  return data;
};

/** GET /department/:id */
export const getDepartmentById = async (id) => {
  const { data } = await api.get(`/department/${id}`);
  return data;
};

/**
 * POST /department/add — create a department (admin / hr).
 * Payload: { departmentName, description?, managerId? }
 */
export const createDepartment = async (payload) => {
  const { data } = await api.post("/department/add", payload);
  return data;
};

/** PUT /department/:id — update department (admin / hr) */
export const updateDepartment = async (id, payload) => {
  const { data } = await api.put(`/department/${id}`, payload);
  return data;
};

/** DELETE /department/:id — soft-delete (sets isActive=false) */
export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/department/${id}`);
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGNATIONS  (/api/v1/designation)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /designation — all designations */
export const getDesignations = async () => {
  const { data } = await api.get("/designation");
  return data;
};

/** GET /designation/:id */
export const getDesignationById = async (id) => {
  const { data } = await api.get(`/designation/${id}`);
  return data;
};

/**
 * POST /designation/add — create a designation (admin / hr).
 * Payload: { title, department (ObjectId), description? }
 */
export const createDesignation = async (payload) => {
  const { data } = await api.post("/designation/add", payload);
  return data;
};

/** PUT /designation/:id — update designation (admin / hr) */
export const updateDesignation = async (id, payload) => {
  const { data } = await api.put(`/designation/${id}`, payload);
  return data;
};

/** DELETE /designation/:id — soft-delete (sets isActive=false) */
export const deleteDesignation = async (id) => {
  const { data } = await api.delete(`/designation/${id}`);
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE  (/api/v1/attendance)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /attendance — all records (role-filtered by backend) */
export const getAttendance = async () => {
  const { data } = await api.get("/attendance");
  return data;
};

/** GET /attendance/:id */
export const getAttendanceById = async (id) => {
  const { data } = await api.get(`/attendance/${id}`);
  return data;
};

/**
 * POST /attendance/add — manually add attendance (admin / hr).
 * Payload: { employee (ObjectId), date, checkIn?, checkOut?, status? }
 */
export const addAttendance = async (payload) => {
  const { data } = await api.post("/attendance/add", payload);
  return data;
};

/** POST /attendance/check-in — employee clocks in */
export const checkIn = async (payload = {}) => {
  const { data } = await api.post("/attendance/check-in", payload);
  return data;
};

/** POST /attendance/check-out — employee clocks out */
export const checkOut = async (payload = {}) => {
  const { data } = await api.post("/attendance/check-out", payload);
  return data;
};

/** PUT /attendance/:id — update record (admin / hr) */
export const updateAttendance = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, payload);
  return data;
};

/** DELETE /attendance/:id — delete record (admin / hr) */
export const deleteAttendance = async (id) => {
  const { data } = await api.delete(`/attendance/${id}`);
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE  (/api/v1/leave)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /leave — all leaves (role-filtered by backend) */
export const getLeaves = async () => {
  const { data } = await api.get("/leave");
  return data;
};

/** GET /leave/:id */
export const getLeaveById = async (id) => {
  const { data } = await api.get(`/leave/${id}`);
  return data;
};

/**
 * POST /leave/apply — submit a leave request.
 * Payload: { employee (ObjectId), leaveType, fromDate, toDate, reason }
 */
export const applyLeave = async (payload) => {
  const { data } = await api.post("/leave/apply", payload);
  return data;
};

/** PUT /leave/:id — update leave (any authenticated user) */
export const updateLeave = async (id, payload) => {
  const { data } = await api.put(`/leave/${id}`, payload);
  return data;
};

/** PUT /leave/approve/:id — approve leave (admin / hr / manager) */
export const approveLeave = async (leaveId) => {
  const { data } = await api.put(`/leave/approve/${leaveId}`);
  return data;
};

/** PUT /leave/reject/:id — reject leave (admin / hr / manager) */
export const rejectLeave = async (leaveId, payload = {}) => {
  const { data } = await api.put(`/leave/reject/${leaveId}`, payload);
  return data;
};

/** DELETE /leave/:id — delete leave (admin / hr) */
export const deleteLeave = async (id) => {
  const { data } = await api.delete(`/leave/${id}`);
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// PAYROLL  (/api/v1/payroll)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /payroll — all payroll records (role-filtered by backend) */
export const getPayrolls = async () => {
  const { data } = await api.get("/payroll");
  return data;
};

/** GET /payroll/:id */
export const getPayrollById = async (id) => {
  const { data } = await api.get(`/payroll/${id}`);
  return data;
};

/**
 * POST /payroll/add — create payroll entry (admin / hr).
 * Payload: { employee (ObjectId), month, basicSalary, bonus?, deduction? }
 */
export const addPayroll = async (payload) => {
  const { data } = await api.post("/payroll/add", payload);
  return data;
};

/** PUT /payroll/:id — update payroll (admin / hr) */
export const updatePayroll = async (id, payload) => {
  const { data } = await api.put(`/payroll/${id}`, payload);
  return data;
};

/** PUT /payroll/paid/:id — mark salary as paid (admin / hr) */
export const markPayrollPaid = async (payrollId) => {
  const { data } = await api.put(`/payroll/paid/${payrollId}`);
  return data;
};

/** DELETE /payroll/:id — delete payroll record (admin / hr) */
export const deletePayroll = async (id) => {
  const { data } = await api.delete(`/payroll/${id}`);
  return data;
};

/** POST /auth/forgot-password — trigger reset email */
export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

/** POST /auth/reset-password — apply new password */
export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};
