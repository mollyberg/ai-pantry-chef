import { Hono } from 'hono';
import {
  getIngredients,
  createIngredients,
} from '../controllers/ingredients.js';

const ingredients = new Hono();
ingredients.get('/:userId', getIngredients);
ingredients.post('/', createIngredients);

export default ingredients;
