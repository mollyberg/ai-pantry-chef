import { Context } from 'hono';

export const getMealPlan = async (c: Context) => {
  return c.json({ message: 'getMealPlan — coming soon' });
};

export const createMealPlan = async (c: Context) => {
  return c.json({ message: 'createMealPlan — coming soon' });
};