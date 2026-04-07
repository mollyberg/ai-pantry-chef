import { Hono } from 'hono';
import {
  getMealPlan,
  createMealPlan,
} from '../controllers/mealplan.js';

const mealPlan = new Hono();

mealPlan.get('/', getMealPlan);
mealPlan.post('/', createMealPlan);

export default mealPlan;