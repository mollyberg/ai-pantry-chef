import axios from 'axios';
import type { DetectedIngredients, GeneratedMealPlan, SavedMealPlan } from '../types/index.js';

// create one axios instance — all calls go through this
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

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
  userId: string,
  ingredients: string[]
): Promise<GeneratedMealPlan> => {
  const response = await api.post('/ai/generate-mealplan', { userId, ingredients });
  return response.data;
};

// save a meal plan to the database
export const saveMealPlan = async (
  userId: string,
  plan: GeneratedMealPlan['mealPlan'],
  ingredientsUsed: string[],
  missingIngredients: Record<string, string[]>
): Promise<SavedMealPlan> => {
  const response = await api.post('/mealplan', {
    userId,
    plan,
    ingredientsUsed,
    missingIngredients,
  });
  return response.data;
};

// get all saved meal plans for a user
export const getMealPlans = async (userId: string): Promise<SavedMealPlan[]> => {
  const response = await api.get(`/mealplan/${userId}`);
  return response.data;
};

export default api;