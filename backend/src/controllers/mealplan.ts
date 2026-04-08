import type { Context } from 'hono';
import prisma from '../lib/prisma.js';

export const getMealPlan = async (c: Context) => {
  try {
    const dbUserId = c.get('dbUserId') as string;

    if (!dbUserId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const logs = await prisma.mealPlan.findMany({
      where: { userId: dbUserId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json(logs);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch meal plan(s)' }, 500);
  }
};

export const createMealPlan = async (c: Context) => {
  try {
    const dbUserId = c.get('dbUserId') as string;
    if (!dbUserId) return c.json({ error: 'Unauthorized' }, 401);

    const body = await c.req.json();

    const { ingredientsUsed, missingIngredients, plan } = body;

    if (!ingredientsUsed || !missingIngredients || !plan) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: dbUserId,
        ingredientsUsed,
        missingIngredients,
        plan,
      },
    });

    return c.json(mealPlan, 201);
  } catch (error) {
    console.error('Full error:', error);
    return c.json({ error: 'Failed to create mealplan' }, 500);
  }
};
