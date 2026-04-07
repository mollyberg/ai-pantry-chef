import type { Context } from 'hono';
import { getAuth } from '@hono/clerk-auth';
import prisma from '../lib/prisma.js';

export const getIngredients = async (c: Context) => {
  try {
    const { userId } = getAuth(c);
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const logs = await prisma.ingredientLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return c.json(logs);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch ingredients' }, 500);
  }
};

export const createIngredients = async (c: Context) => {
  try {
    const { userId } = getAuth(c);
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const { type, ingredients } = body;

    if (!type || !ingredients) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const log = await prisma.ingredientLog.create({
      data: {
        userId,
        type,
        ingredients,
      },
    });

    return c.json(log, 201);
  } catch (error) {
    console.error('Full error:', error);
    //console.error(error);
    return c.json({ error: 'Failed to create ingredient log' }, 500);
  }
};
