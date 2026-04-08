import { Hono } from 'hono';
import {
  getUser,
  createUser,
} from '../controllers/user.js';

const user = new Hono();
user.get('/', getUser);
user.post('/', createUser);

export default user;
