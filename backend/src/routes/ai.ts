import { Hono } from 'hono';
import { detectIngredients, generateMealplan } from '../controllers/ai.js';

const ai = new Hono();

ai.post('/detect-ingredients', detectIngredients);
ai.post('/generate-mealplan', generateMealplan);


export default ai;