import { Hono } from 'hono';
import { detectIngredients } from '../controllers/ai.js';

const ai = new Hono();

ai.post('/detect-ingredients', detectIngredients);

export default ai;