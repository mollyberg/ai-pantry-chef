import { Context } from 'hono';

export const getIngredients = async (c: Context) => {
  return c.json({ message: 'getIngredients — coming soon' });
};

export const createIngredients = async (c: Context) => {
  return c.json({ message: 'createIngredients — coming soon' });
};