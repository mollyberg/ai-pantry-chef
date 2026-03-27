import type { Context } from 'hono';
import prisma from '../lib/prisma.js';

export const getMealPlan = async (c: Context) => {
  try {
    const userId = c.req.param('userId');

    if (!userId) {
      return c.json({ error: 'Missing user id' }, 400);
    }

    const logs = await prisma.mealPlan.findMany({
      where: { userId },
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
    const body = await c.req.json();
    const { userId, ingredientsUsed, missingIngredients, plan } = body;

    if (!userId || !ingredientsUsed || !missingIngredients || !plan) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        ingredientsUsed,
        missingIngredients,
        plan,
      },
    });

    return c.json(mealPlan, 201);
  } catch (error) {
    console.error('Full error:', error);
    //console.error(error);
    return c.json({ error: 'Failed to create mealplan' }, 500);
  }
};
