import type {
  DailyMenu,
  WeeklySchedule,
  MealTiming,
  MealPreference,
  MealItem,
  MealDay,
} from '@/types/meal'
import { format, startOfWeek, endOfWeek, addDays, formatISO } from 'date-fns'

// Sample meal items
const sampleMealItems: MealItem[] = [
  { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
  { id: 'item2', name: 'Dal', description: 'Lentil curry' },
  { id: 'item3', name: 'Chicken Curry', description: 'Spicy chicken curry' },
  { id: 'item4', name: 'Fish Curry', description: 'Traditional fish curry' },
  { id: 'item5', name: 'Vegetable Curry', description: 'Mixed vegetables' },
  { id: 'item6', name: 'Egg Curry', description: 'Boiled egg curry' },
  { id: 'item7', name: 'Roti', description: 'Fresh flatbread' },
  { id: 'item8', name: 'Paratha', description: 'Fried flatbread' },
  {
    id: 'item9',
    name: 'Khichuri',
    description: 'Rice and lentil dish',
    isSpecial: true,
  },
  {
    id: 'item10',
    name: 'Biriyani',
    description: 'Spiced rice with meat',
    isSpecial: true,
    price: 150,
  },
  {
    id: 'item11',
    name: 'Fried Rice',
    description: 'Chinese-style fried rice',
    isSpecial: true,
    price: 120,
  },
  { id: 'item12', name: 'Tea', description: 'Hot tea' },
  { id: 'item13', name: 'Bread', description: 'Fresh bread' },
  { id: 'item14', name: 'Egg', description: 'Boiled egg' },
  { id: 'item15', name: 'Banana', description: 'Fresh banana' },
]

export const mockDailyMenus: DailyMenu[] = [
  {
    id: 'menu1',
    messId: 'm1',
    date: formatISO(new Date(), { representation: 'date' }),
    breakfast: [
      { id: 'item13', name: 'Bread', description: 'Fresh bread' },
      { id: 'item14', name: 'Egg', description: 'Boiled egg' },
      { id: 'item12', name: 'Tea', description: 'Hot tea' },
    ],
    lunch: [
      { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
      { id: 'item2', name: 'Dal', description: 'Lentil curry' },
      {
        id: 'item3',
        name: 'Chicken Curry',
        description: 'Spicy chicken curry',
      },
      { id: 'item5', name: 'Vegetable Curry', description: 'Mixed vegetables' },
    ],
    dinner: [
      { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
      { id: 'item2', name: 'Dal', description: 'Lentil curry' },
      {
        id: 'item4',
        name: 'Fish Curry',
        description: 'Traditional fish curry',
      },
      { id: 'item5', name: 'Vegetable Curry', description: 'Mixed vegetables' },
    ],
    createdBy: 'owner1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'menu2',
    messId: 'm1',
    date: formatISO(addDays(new Date(), 1), { representation: 'date' }),
    breakfast: [
      { id: 'item8', name: 'Paratha', description: 'Fried flatbread' },
      { id: 'item14', name: 'Egg', description: 'Boiled egg' },
      { id: 'item12', name: 'Tea', description: 'Hot tea' },
    ],
    lunch: [
      {
        id: 'item10',
        name: 'Biriyani',
        description: 'Spiced rice with meat',
        isSpecial: true,
        price: 150,
      },
      {
        id: 'item3',
        name: 'Chicken Curry',
        description: 'Spicy chicken curry',
      },
    ],
    dinner: [
      { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
      { id: 'item2', name: 'Dal', description: 'Lentil curry' },
      { id: 'item6', name: 'Egg Curry', description: 'Boiled egg curry' },
      { id: 'item5', name: 'Vegetable Curry', description: 'Mixed vegetables' },
    ],
    notes: 'Special biriyani available for lunch',
    createdBy: 'owner1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockWeeklySchedules: WeeklySchedule[] = [
  {
    id: 'schedule1',
    messId: 'm1',
    weekStartDate: formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }), {
      representation: 'date',
    }),
    weekEndDate: formatISO(endOfWeek(new Date(), { weekStartsOn: 1 }), {
      representation: 'date',
    }),
    schedule: {
      monday: {
        breakfast: [
          { id: 'item13', name: 'Bread', description: 'Fresh bread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item3',
            name: 'Chicken Curry',
            description: 'Spicy chicken curry',
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item4',
            name: 'Fish Curry',
            description: 'Traditional fish curry',
          },
        ],
      },
      tuesday: {
        breakfast: [
          { id: 'item8', name: 'Paratha', description: 'Fried flatbread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          { id: 'item6', name: 'Egg Curry', description: 'Boiled egg curry' },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item3',
            name: 'Chicken Curry',
            description: 'Spicy chicken curry',
          },
        ],
      },
      wednesday: {
        breakfast: [
          { id: 'item13', name: 'Bread', description: 'Fresh bread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          {
            id: 'item10',
            name: 'Biriyani',
            description: 'Spiced rice with meat',
            isSpecial: true,
            price: 150,
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item5',
            name: 'Vegetable Curry',
            description: 'Mixed vegetables',
          },
        ],
      },
      thursday: {
        breakfast: [
          { id: 'item8', name: 'Paratha', description: 'Fried flatbread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item3',
            name: 'Chicken Curry',
            description: 'Spicy chicken curry',
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item4',
            name: 'Fish Curry',
            description: 'Traditional fish curry',
          },
        ],
      },
      friday: {
        breakfast: [
          { id: 'item13', name: 'Bread', description: 'Fresh bread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          {
            id: 'item11',
            name: 'Fried Rice',
            description: 'Chinese-style fried rice',
            isSpecial: true,
            price: 120,
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          { id: 'item6', name: 'Egg Curry', description: 'Boiled egg curry' },
        ],
      },
      saturday: {
        breakfast: [
          { id: 'item8', name: 'Paratha', description: 'Fried flatbread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item3',
            name: 'Chicken Curry',
            description: 'Spicy chicken curry',
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item5',
            name: 'Vegetable Curry',
            description: 'Mixed vegetables',
          },
        ],
      },
      sunday: {
        breakfast: [
          { id: 'item13', name: 'Bread', description: 'Fresh bread' },
          { id: 'item14', name: 'Egg', description: 'Boiled egg' },
          { id: 'item12', name: 'Tea', description: 'Hot tea' },
        ],
        lunch: [
          {
            id: 'item9',
            name: 'Khichuri',
            description: 'Rice and lentil dish',
            isSpecial: true,
          },
        ],
        dinner: [
          { id: 'item1', name: 'Rice', description: 'Steamed basmati rice' },
          { id: 'item2', name: 'Dal', description: 'Lentil curry' },
          {
            id: 'item4',
            name: 'Fish Curry',
            description: 'Traditional fish curry',
          },
        ],
      },
    },
    isActive: true,
    createdBy: 'owner1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockMealTimings: MealTiming[] = [
  {
    messId: 'm1',
    breakfast: {
      startTime: '07:00',
      endTime: '09:00',
      enabled: true,
    },
    lunch: {
      startTime: '12:00',
      endTime: '14:00',
      enabled: true,
    },
    dinner: {
      startTime: '19:00',
      endTime: '21:00',
      enabled: true,
    },
    snack: {
      startTime: '16:00',
      endTime: '17:00',
      enabled: false,
    },
    updatedAt: new Date().toISOString(),
  },
]

export const mockMealPreferences: MealPreference[] = [
  {
    id: 'pref1',
    userId: 'r1',
    messId: 'm1',
    preferences: [
      {
        category: 'lunch',
        likedItems: ['item3', 'item10'],
        dislikedItems: ['item6'],
        allergies: [],
        dietaryRestrictions: [],
      },
      {
        category: 'dinner',
        likedItems: ['item4'],
        dislikedItems: [],
        allergies: ['peanuts'],
        dietaryRestrictions: ['no-pork'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Helper functions
export function getDailyMenuByDate(
  messId: string,
  date: string
): DailyMenu | undefined {
  return mockDailyMenus.find(
    menu => menu.messId === messId && menu.date === date
  )
}

export function getDailyMenusByMess(
  messId: string,
  limit?: number
): DailyMenu[] {
  const menus = mockDailyMenus
    .filter(menu => menu.messId === messId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return limit ? menus.slice(0, limit) : menus
}

export function getWeeklyScheduleByMess(
  messId: string
): WeeklySchedule | undefined {
  return mockWeeklySchedules.find(
    schedule => schedule.messId === messId && schedule.isActive
  )
}

export function getMealTimingByMess(messId: string): MealTiming | undefined {
  return mockMealTimings.find(timing => timing.messId === messId)
}

export function getMealPreferenceByUser(
  userId: string,
  messId: string
): MealPreference | undefined {
  return mockMealPreferences.find(
    pref => pref.userId === userId && pref.messId === messId
  )
}

export function addDailyMenu(
  menu: Omit<DailyMenu, 'id' | 'createdAt' | 'updatedAt'>
): DailyMenu {
  const newMenu: DailyMenu = {
    ...menu,
    id: `menu${mockDailyMenus.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockDailyMenus.unshift(newMenu)
  return newMenu
}

export function updateDailyMenu(
  menuId: string,
  updates: Partial<DailyMenu>
): DailyMenu | undefined {
  const index = mockDailyMenus.findIndex(m => m.id === menuId)
  if (index === -1) return undefined

  mockDailyMenus[index] = {
    ...mockDailyMenus[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockDailyMenus[index]
}

export function addWeeklySchedule(
  schedule: Omit<WeeklySchedule, 'id' | 'createdAt' | 'updatedAt'>
): WeeklySchedule {
  // Deactivate other schedules for the same mess
  mockWeeklySchedules.forEach(s => {
    if (s.messId === schedule.messId) {
      s.isActive = false
    }
  })

  const newSchedule: WeeklySchedule = {
    ...schedule,
    id: `schedule${mockWeeklySchedules.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockWeeklySchedules.push(newSchedule)
  return newSchedule
}

export function updateMealTiming(
  messId: string,
  timing: Partial<MealTiming>
): MealTiming | undefined {
  const index = mockMealTimings.findIndex(t => t.messId === messId)
  if (index === -1) {
    const newTiming: MealTiming = {
      messId,
      breakfast: { startTime: '07:00', endTime: '09:00', enabled: true },
      lunch: { startTime: '12:00', endTime: '14:00', enabled: true },
      dinner: { startTime: '19:00', endTime: '21:00', enabled: true },
      snack: { startTime: '16:00', endTime: '17:00', enabled: false },
      updatedAt: new Date().toISOString(),
      ...timing,
    } as MealTiming
    mockMealTimings.push(newTiming)
    return newTiming
  }

  mockMealTimings[index] = {
    ...mockMealTimings[index],
    ...timing,
    updatedAt: new Date().toISOString(),
  }
  return mockMealTimings[index]
}

export function updateMealPreference(
  userId: string,
  messId: string,
  preferences: MealPreference['preferences']
): MealPreference {
  const existing = getMealPreferenceByUser(userId, messId)
  if (existing) {
    existing.preferences = preferences
    existing.updatedAt = new Date().toISOString()
    return existing
  }

  const newPreference: MealPreference = {
    id: `pref${mockMealPreferences.length + 1}`,
    userId,
    messId,
    preferences,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockMealPreferences.push(newPreference)
  return newPreference
}
