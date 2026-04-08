import type { Context } from 'hono';
import prisma from '../lib/prisma.js';

export const getUser = async (c: Context) => {
  try {
    const dbUserId = c.get('dbUserId') as string;
    if (!dbUserId) return c.json({ error: 'Unauthorized' }, 401);

    const user = await prisma.user.findUnique({
      where: { id: dbUserId },
    });

    return c.json(user);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
};

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { clerkId, email, name } = body;

    if (!clerkId || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const log = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
      },
    });

    return c.json(log, 201);
  } catch (error) {
    console.error('Full error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
};
