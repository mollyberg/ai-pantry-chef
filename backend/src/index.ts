import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ingredients from './routes/ingredients.js';
import mealplan from './routes/mealplan.js';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/ingredients', ingredients);
app.route('/mealplan', mealplan);

serve({
  fetch: app.fetch,
  port: 3001,
}, (info) => {
  console.log(`Server running on port ${info.port}`);
});