import type { Context } from 'hono';
import anthropic from '../lib/anthropic.js';
import { parseAiResponse } from '../lib/parseAiResponse.js';
import Anthropic from '@anthropic-ai/sdk';

const callClaude = async (
  messages: Anthropic.MessageParam[],
  maxTokens = 1024
) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages,
  });

  const content = response.content[0];
  if (content == null || content.type !== 'text') {
    throw new Error('Unexpected response from AI');
  }

  return parseAiResponse(content.text);
};

export const detectIngredients = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { image, mediaType } = body;

    if (!image || !mediaType) {
      return c.json({ error: 'Missing image or mediaType' }, 400);
    }

    //verify image type is valid
    const validMediaTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validMediaTypes.includes(mediaType)) {
      return c.json(
        {
          error: 'Invalid image type. Please upload a JPEG, PNG, GIF, or WEBP.',
        },
        400
      );
    }

    // base64 string length / 1.37 ≈ original file size in bytes
    const approximateSizeInMB = image.length / 1.37 / (1024 * 1024);
    if (approximateSizeInMB > 5) {
      return c.json(
        { error: 'Image too large. Please upload an image under 5MB.' },
        400
      );
    }

    const claudeInput: Anthropic.MessageParam[] = [
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
    ];

    const content = await callClaude(claudeInput);
    return c.json(content);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return c.json({ error: 'Request timed out, please try again' }, 504);
    }
    console.error('Full error:', error);
    return c.json({ error: 'Failed to generate mealplan' }, 500);
  }
};

export const generateMealplan = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { ingredients, userId } = body;

    if (!ingredients || !userId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const claudeInput: Anthropic.MessageParam[] = [
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
    ];

    const content = await callClaude(claudeInput, 4096);
    return c.json(content);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return c.json({ error: 'Request timed out, please try again' }, 504);
    }
    console.error('Full error:', error);
    return c.json({ error: 'Failed to generate mealplan' }, 500);
  }
};
