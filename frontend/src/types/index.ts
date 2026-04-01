// A single meal — title, ingredients list, and recipe steps
export type Meal = {
  title: string;
  ingredients: string[];
  recipe: string;
};

// One day's worth of meals
export type DayPlan = {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
};

// The full 7-day meal plan
export type MealPlanData = {
  monday: DayPlan;
  tuesday: DayPlan;
  wednesday: DayPlan;
  thursday: DayPlan;
  friday: DayPlan;
  saturday: DayPlan;
  sunday: DayPlan;
};

// What Claude returns from generate-mealplan
export type GeneratedMealPlan = {
  mealPlan: MealPlanData;
  missingIngredients: Record<string, string[]>;
};

// What your database returns from GET /mealplan/:userId
export type SavedMealPlan = {
  id: string;
  userId: string;
  plan: MealPlanData;
  ingredientsUsed: string[];
  missingIngredients: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
};

// What Claude returns from detect-ingredients
export type DetectedIngredients = {
  ingredients: string[];
};