import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { clerkMiddleware, ensureUser } from './middleware/clerk.js';
import ingredients from './routes/ingredients.js';
import mealplan from './routes/mealplan.js';
import user from './routes/user.js';
import ai from './routes/ai.js';

const app = new Hono();

const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use('*', cors({
  origin: allowedOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// protected routes — require auth
app.use('/ingredients/*', clerkMiddleware(), ensureUser);
app.use('/mealplan/*', clerkMiddleware(), ensureUser);
app.use('/ai/*', clerkMiddleware(), ensureUser);
app.use('/user/*', clerkMiddleware(), ensureUser);

app.route('/ingredients', ingredients);
app.route('/mealplan', mealplan);
app.route('/user', user);
app.route('/ai', ai);

serve({
  fetch: app.fetch,
  port: 3001,
}, (info) => {
  console.log(`Server running on port ${info.port}`);
});