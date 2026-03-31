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
- Do not include packaging, containers, or non-food items`
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