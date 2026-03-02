export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type MealDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export interface MealItem {
  id: string
  name: string
  description?: string
  imageUrl?: string
  isSpecial?: boolean
  specialNote?: string
  price?: number // Optional price for special meals
}

export interface DailyMenu {
  id: string
  messId: string
  date: string // ISO date string (YYYY-MM-DD)
  breakfast?: MealItem[]
  lunch?: MealItem[]
  dinner?: MealItem[]
  snack?: MealItem[]
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WeeklySchedule {
  id: string
  messId: string
  weekStartDate: string // ISO date string (Monday of the week)
  weekEndDate: string // ISO date string (Sunday of the week)
  schedule: {
    [key in MealDay]: {
      breakfast?: MealItem[]
      lunch?: MealItem[]
      dinner?: MealItem[]
      snack?: MealItem[]
    }
  }
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface MealTiming {
  messId: string
  breakfast: {
    startTime: string // HH:mm format
    endTime: string
    enabled: boolean
  }
  lunch: {
    startTime: string
    endTime: string
    enabled: boolean
  }
  dinner: {
    startTime: string
    endTime: string
    enabled: boolean
  }
  snack: {
    startTime: string
    endTime: string
    enabled: boolean
  }
  updatedAt: string
}

export interface MealPreference {
  id: string
  userId: string
  messId: string
  preferences: {
    category: MealCategory
    likedItems: string[] // Meal item IDs
    dislikedItems: string[] // Meal item IDs
    allergies?: string[]
    dietaryRestrictions?: string[]
  }[]
  createdAt: string
  updatedAt: string
}
