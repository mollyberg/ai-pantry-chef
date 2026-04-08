import { Hono } from 'hono';
import {
  getIngredients,
  createIngredients,
} from '../controllers/ingredients.js';

const ingredients = new Hono();
ingredients.get('/', getIngredients);
ingredients.post('/', createIngredients);

export default ingredients;
