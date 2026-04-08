export { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { createClerkClient } from '@clerk/backend';
import type { MiddlewareHandler } from 'hono';
import { getAuth } from '@hono/clerk-auth';
import prisma from '../lib/prisma.js';

const clerkBackend = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const ensureUser: MiddlewareHandler = async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.userId) return next();

  // Fast path: user already exists
  const existing = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
  if (existing) {
    c.set('dbUserId', existing.id);
    return next();
  }

  // First login: fetch details from Clerk and upsert (handles concurrent requests)
  const clerkUser = await clerkBackend.users.getUser(auth.userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;

  const user = await prisma.user.upsert({
    where: { clerkId: auth.userId },
    update: {},
    create: { clerkId: auth.userId, email, name },
  });

  c.set('dbUserId', user.id);
  await next();
};
