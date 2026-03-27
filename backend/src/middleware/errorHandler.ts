import { Context } from 'hono';

export const errorHandler = async (err: Error, c: Context) => {
  console.error(err.message);
  return c.json(
    { error: 'Internal server error', message: err.message },
    500
  );
};