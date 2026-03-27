import { Hono } from 'hono';

const mealplan = new Hono();

mealplan.get('/', (c) => {
  return c.json({ message: 'GET mealplan — coming soon' });
});

mealplan.post('/', (c) => {
  return c.json({ message: 'POST mealplan — coming soon' });
});

export default mealplan;