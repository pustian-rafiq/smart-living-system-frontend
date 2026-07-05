/**
 * Mess sub-domain accessors — wrap mock modules for mechanical backend swap.
 * Import from here in pages instead of `@/data/mockMeals` etc.
 */
export {
  getDailyMenuByDate,
  getDailyMenusByMess,
  getWeeklyScheduleByMess,
  getMealTimingByMess,
  getMealPreferenceByUser,
  addDailyMenu,
  updateDailyMenu,
  addWeeklySchedule,
  updateMealTiming,
  updateMealPreference,
  mockDailyMenus,
  mockWeeklySchedules,
  mockMealTimings,
  mockMealPreferences,
} from '@/data/mockMeals'

export {
  mockAttendanceRecords,
  getAttendanceByMess,
  getAttendanceByStudent,
  getAttendanceByDate,
  getAttendanceSummary,
  markAttendance,
  bulkMarkAttendance,
  generateAttendanceReport,
} from '@/data/mockAttendance'

export {
  mockSMSTemplates,
  mockSMSGroups,
  mockSMSMessages,
  getSMSTemplatesByMess,
  getSMSGroupsByMess,
  getSMSMessagesByMess,
  getSMSHistory,
  sendBulkSMS,
  addSMSTemplate,
  updateSMSTemplate,
  deleteSMSTemplate,
  addSMSGroup,
  updateSMSGroup,
  deleteSMSGroup,
} from '@/data/mockSMS'

export {
  mockMessRules,
  mockRuleAcceptances,
  mockRuleViolations,
  getRulesByMess,
  getRuleById,
  getAcceptancesByStudent,
  getViolationsByMess,
  addRule,
  updateRule,
  deleteRule,
  acceptRule,
  addViolation,
  updateViolation,
} from '@/data/mockMessRules'

export {
  mockMessExpenses,
  getExpensesByMess,
  getExpenseById,
  getMonthlyExpenseSummary,
  addExpense,
  updateExpense,
  deleteExpense,
  generateExpenseReport,
} from '@/data/mockMessExpenses'
