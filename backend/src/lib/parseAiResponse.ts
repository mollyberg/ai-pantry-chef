export const parseAiResponse = (text: string) => {
  const cleaned = text
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse AI response:', cleaned);
    throw new Error('AI returned invalid response, please try again');
  }
};