import { Hono } from 'hono';

const ingredients = new Hono();

ingredients.get('/', (c) => {
  return c.json({ message: 'GET ingredients — coming soon' });
});

ingredients.post('/', (c) => {
  return c.json({ message: 'POST ingredients — coming soon' });
});

export default ingredients;