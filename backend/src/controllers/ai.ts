import type { Context } from 'hono';
import anthropic from '../lib/anthropic.js';

export const detectIngredients = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { image, mediaType } = body;

    if (!image || !mediaType) {
      return c.json({ error: 'Missing image or mediaType' }, 400);
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: 'text',
              text: `You are a helpful kitchen assistant. Analyze this image of a fridge or pantry and identify all visible food ingredients.

Return ONLY a valid JSON object in this exact format, with no other text:
{
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
}

Rules:
- Only include actual food items
- Use simple, common names (e.g. "eggs" not "large grade A eggs")
- If this is not a fridge or pantry image, return { "ingredients": [] }
- Do not include packaging, containers, or non-food items`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content == null || content.type !== 'text') {
      return c.json({ error: 'Unexpected response from AI' }, 500);
    }

    const parsed = JSON.parse(content.text);
    return c.json(parsed);
  } catch (error) {
    console.error('Full error:', error);
    return c.json({ error: 'Failed to detect ingredients' }, 500);
  }
};

export const generateMealplan = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { ingredients, userId } = body;

    if (!ingredients || !userId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a helpful kitchen assistant. Here are the available ingredients:
            ${ingredients.join(', ')}
              
              Take this list of ingredients and generate a 7 day meal plan including meals for breakfast, lunch, and dinner.

Return ONLY a valid JSON object in this exact format, with no other text:
{
  "mealPlan": {
    "monday": { "breakfast": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."}, "lunch": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."}, "dinner": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."} },
    "tuesday": { "breakfast": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."}, "lunch": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."}, "dinner": {"title":"title of recipe","ingredients":["ingredient1","ingredient2"],"recipe":"..."} },
    ...
  },
  "missingIngredients": {
    "recipe title": ["missingIngredient1", "missingIngredient2"],
    ...
    }
}

Rules:
- Make sure JSON mealPlan is valid. Do not wrap the JSON in markdown code blocks or backticks
- Each meal in the meal plan should be worded in simple language and include the ingredients used. Example: "breakfast":"mushroom cheese omlet"
- Recipe steps should be numbered and follow simple clear instructions. Example: "1. Scramble eggs in a bowl"
- Ingredients should have measurements. Example "2 eggs"
- Meals should be well rounded even if it requires purchasing additional ingredients. Prioritize using existing ingredients when possible, 
but add ingredients when they are needed to make a more well-rounded meal or when a few purchases can make a big impact. 
If existing ingredient list is limited, try to pick missing ingredients that can be used in multiple recipes.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content == null || content.type !== 'text') {
      return c.json({ error: 'Unexpected response from AI' }, 500);
    }

    //This strips ` ```json ` or ` ``` ` from the start and end of the response before parsing, so it works regardless of whether Claude wraps it or not.
    const cleaned = content.text
      .replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return c.json(parsed);
  } catch (error) {
    console.error('Full error:', error);
    return c.json({ error: 'Failed to generate mealplan' }, 500);
  }
};
