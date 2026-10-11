// Fake data layer — same function signatures as the real Supabase client.
// Swap this file for lib/supabase.ts once the project is set up.
// No screen code changes needed.

export type User = {
  id: string;
  email: string;
  name: string | null;
  dailyCaloriesTarget: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  userTimezone: string;
  rgpdConsentAt: string | null;
  createdAt: string;
};

export type MealLog = {
  id: string;
  userId: string;
  loggedAt: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  items: FoodItem[];
};

export type FoodItem = {
  id: string;
  mealLogId: string;
  name: string;
  quantityG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  scanMethod: 'photo' | 'barcode' | 'search' | 'manual';
  aiConfidenceScore: number | null;
  imageUrl: string | null;
};

export type AiAnalysisResult = {
  items: {
    nomePt: string;
    nomeEn: string;
    quantidadeG: number;
    calorias: number;
    proteinaG: number;
    hidratosG: number;
    gorduraG: number;
    confianca: number;
  }[];
};

export type Streak = {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null;
};

// ── In-memory store (resets on app restart) ──
let currentUser: User | null = null;
const mealLogs: MealLog[] = [];

// ── Auth ──

export async function signUp(email: string, _password: string): Promise<User> {
  await delay(600);
  const user: User = {
    id: uuid(),
    email,
    name: null,
    dailyCaloriesTarget: 2000,
    proteinG: 120,
    carbsG: 250,
    fatG: 65,
    userTimezone: 'Europe/Lisbon',
    rgpdConsentAt: null,
    createdAt: new Date().toISOString(),
  };
  currentUser = user;
  return user;
}

export async function signIn(email: string, _password: string): Promise<User> {
  await delay(600);
  if (!currentUser) {
    const user: User = {
      id: uuid(),
      email,
      name: 'Demo',
      dailyCaloriesTarget: 2000,
      proteinG: 120,
      carbsG: 250,
      fatG: 65,
      userTimezone: 'Europe/Lisbon',
      rgpdConsentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    currentUser = user;
    // Seed some demo meals
    seedDemoMeals(user.id);
  }
  return currentUser;
}

export async function signOut(): Promise<void> {
  await delay(300);
  currentUser = null;
}

export async function getUser(): Promise<User | null> {
  await delay(100);
  return currentUser;
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  await delay(400);
  if (!currentUser) throw new Error('Não autenticado');
  currentUser = { ...currentUser, ...updates };
  return currentUser;
}

// ── AI Analysis ──

export async function analyzePhoto(_base64: string): Promise<AiAnalysisResult> {
  // Simulate Gemini API call with realistic PT food examples
  await delay(1800);

  const ptFoodExamples: AiAnalysisResult[] = [
    {
      items: [{
        nomePt: 'Bacalhau à Brás',
        nomeEn: 'Codfish with eggs and potatoes',
        quantidadeG: 350,
        calorias: 350,
        proteinaG: 28,
        hidratosG: 22,
        gorduraG: 14,
        confianca: 0.87,
      }],
    },
    {
      items: [{
        nomePt: 'Frango Assado',
        nomeEn: 'Roasted Chicken',
        quantidadeG: 250,
        calorias: 310,
        proteinaG: 42,
        hidratosG: 2,
        gorduraG: 14,
        confianca: 0.92,
      }],
    },
    {
      items: [
        {
          nomePt: 'Arroz branco',
          nomeEn: 'White rice',
          quantidadeG: 150,
          calorias: 195,
          proteinaG: 4,
          hidratosG: 43,
          gorduraG: 0,
          confianca: 0.95,
        },
        {
          nomePt: 'Feijão preto',
          nomeEn: 'Black beans',
          quantidadeG: 120,
          calorias: 132,
          proteinaG: 8,
          hidratosG: 24,
          gorduraG: 0,
          confianca: 0.90,
        },
      ],
    },
  ];

  return ptFoodExamples[Math.floor(Math.random() * ptFoodExamples.length)];
}

// ── Meals ──

export async function getMealsForDate(date: string): Promise<MealLog[]> {
  await delay(300);
  return mealLogs.filter(m => m.loggedAt.startsWith(date));
}

export async function addMeal(
  mealType: MealLog['mealType'],
  items: Omit<FoodItem, 'id' | 'mealLogId'>[],
): Promise<MealLog> {
  await delay(400);
  if (!currentUser) throw new Error('Não autenticado');

  const logId = uuid();
  const foodItems: FoodItem[] = items.map(item => ({
    ...item,
    id: uuid(),
    mealLogId: logId,
  }));

  const meal: MealLog = {
    id: logId,
    userId: currentUser.id,
    loggedAt: new Date().toISOString(),
    mealType,
    totalCalories: foodItems.reduce((s, i) => s + i.calories, 0),
    totalProteinG: foodItems.reduce((s, i) => s + i.proteinG, 0),
    totalCarbsG: foodItems.reduce((s, i) => s + i.carbsG, 0),
    totalFatG: foodItems.reduce((s, i) => s + i.fatG, 0),
    totalFiberG: foodItems.reduce((s, i) => s + i.fiberG, 0),
    items: foodItems,
  };

  mealLogs.unshift(meal);
  return meal;
}

export async function getStreak(): Promise<Streak> {
  await delay(200);
  return { currentStreak: 3, longestStreak: 12, lastLoggedDate: today() };
}

// ── Helpers ──

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function seedDemoMeals(userId: string) {
  const t = today();
  mealLogs.push({
    id: uuid(),
    userId,
    loggedAt: `${t}T08:30:00.000Z`,
    mealType: 'breakfast',
    totalCalories: 320,
    totalProteinG: 12,
    totalCarbsG: 48,
    totalFatG: 8,
    totalFiberG: 3,
    items: [{
      id: uuid(),
      mealLogId: '',
      name: 'Torrada com manteiga',
      quantityG: 120,
      calories: 320,
      proteinG: 12,
      carbsG: 48,
      fatG: 8,
      fiberG: 3,
      scanMethod: 'manual',
      aiConfidenceScore: null,
      imageUrl: null,
    }],
  });

  mealLogs.push({
    id: uuid(),
    userId,
    loggedAt: `${t}T13:00:00.000Z`,
    mealType: 'lunch',
    totalCalories: 520,
    totalProteinG: 32,
    totalCarbsG: 55,
    totalFatG: 18,
    totalFiberG: 5,
    items: [{
      id: uuid(),
      mealLogId: '',
      name: 'Bacalhau à Brás',
      quantityG: 350,
      calories: 520,
      proteinG: 32,
      carbsG: 55,
      fatG: 18,
      fiberG: 5,
      scanMethod: 'photo',
      aiConfidenceScore: 0.87,
      imageUrl: null,
    }],
  });
}
