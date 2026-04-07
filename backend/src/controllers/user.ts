import type { Context } from 'hono';
import { getAuth } from '@hono/clerk-auth';
import prisma from '../lib/prisma.js';

export const getUser = async (c: Context) => {
  try {
    const { userId } = getAuth(c);
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const logs = await prisma.user.findUnique({
      where: { id: userId }
    });

    return c.json(logs);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
};

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { clerkId, email, name } = body;

    if (!clerkId || !email ) {
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
    //console.error(error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
};
