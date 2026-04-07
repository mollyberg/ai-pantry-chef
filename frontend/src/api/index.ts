import axios from 'axios';
import type { DetectedIngredients, GeneratedMealPlan, SavedMealPlan } from '../types/index.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// add Clerk token to every request automatically
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// detect ingredients from a photo
export const detectIngredients = async (
  image: string,
  mediaType: string
): Promise<DetectedIngredients> => {
  const response = await api.post('/ai/detect-ingredients', { image, mediaType });
  return response.data;
};

// generate a meal plan from ingredients
export const generateMealPlan = async (
  ingredients: string[]
): Promise<GeneratedMealPlan> => {
  const response = await api.post('/ai/generate-mealplan', { ingredients });
  return response.data;
};

// save a meal plan to the database
export const saveMealPlan = async (
  plan: GeneratedMealPlan['mealPlan'],
  ingredientsUsed: string[],
  missingIngredients: Record<string, string[]>
): Promise<SavedMealPlan> => {
  const response = await api.post('/mealplan', {
    plan,
    ingredientsUsed,
    missingIngredients,
  });
  return response.data;
};

// get all saved meal plans for a user
export const getMealPlans = async (): Promise<SavedMealPlan[]> => {
  const response = await api.get(`/mealplan`);
  return response.data;
};

export default api;