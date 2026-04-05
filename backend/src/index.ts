import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ingredients from './routes/ingredients.js';
import mealplan from './routes/mealplan.js';
import user from './routes/user.js';
import ai from './routes/ai.js';
import anthropic from './lib/anthropic.js';
import { cors } from 'hono/cors';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

//allow traffic from local frontend
app.use('*', cors({
  origin: ['http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.route('/ingredients', ingredients);
app.route('/user', user);
app.route('/mealplan', mealplan);
app.route('/ai', ai);


app.get('/test-ai', async (c) => {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    messages: [
      { role: 'user', content: 'Say "AI Pantry Chef is working!" and nothing else.' }
    ],
  });
  return c.json({ response: message.content[0] });
});

serve({
  fetch: app.fetch,
  port: 3001,
}, (info) => {
  console.log(`Server running on port ${info.port}`);
});