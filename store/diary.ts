import { create } from 'zustand';
import * as api from '@/lib/fake-data';

type DiaryState = {
  meals: api.MealLog[];
  streak: api.Streak | null;
  loading: boolean;
  pendingScan: api.AiAnalysisResult | null;
  pendingImageUri: string | null;

  fetchDay: (date: string) => Promise<void>;
  fetchStreak: () => Promise<void>;
  setPendingScan: (result: api.AiAnalysisResult, imageUri: string) => void;
  clearPendingScan: () => void;
  addMeal: (mealType: api.MealLog['mealType'], items: Omit<api.FoodItem, 'id' | 'mealLogId'>[]) => Promise<void>;

  // Derived totals for today
  totalCalories: () => number;
  totalProtein: () => number;
  totalCarbs: () => number;
  totalFat: () => number;
};

export const useDiaryStore = create<DiaryState>((set, get) => ({
  meals: [],
  streak: null,
  loading: false,
  pendingScan: null,
  pendingImageUri: null,

  fetchDay: async (date) => {
    set({ loading: true });
    const meals = await api.getMealsForDate(date);
    set({ meals, loading: false });
  },

  fetchStreak: async () => {
    const streak = await api.getStreak();
    set({ streak });
  },

  setPendingScan: (result, imageUri) => {
    set({ pendingScan: result, pendingImageUri: imageUri });
  },

  clearPendingScan: () => {
    set({ pendingScan: null, pendingImageUri: null });
  },

  addMeal: async (mealType, items) => {
    set({ loading: true });
    const meal = await api.addMeal(mealType, items);
    set(state => ({ meals: [meal, ...state.meals], loading: false }));
  },

  totalCalories: () =>
    get().meals.reduce((s, m) => s + m.totalCalories, 0),

  totalProtein: () =>
    get().meals.reduce((s, m) => s + m.totalProteinG, 0),

  totalCarbs: () =>
    get().meals.reduce((s, m) => s + m.totalCarbsG, 0),

  totalFat: () =>
    get().meals.reduce((s, m) => s + m.totalFatG, 0),
}));
