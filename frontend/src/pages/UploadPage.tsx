import { useState } from 'react';
import type { UploadStep } from '../types/index.js';
import { detectIngredients } from '../api/index.js';

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const UploadPage = () => {
  const [step, setStep] = useState<UploadStep>('upload');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStep('detecting');

    try {
      const base64 = await convertToBase64(file);
      const result = await detectIngredients(base64, file.type);

      if (result.ingredients.length === 0) {
        setError(
          'No ingredients were detected. Make sure your photo shows food items clearly and try again.'
        );
        setStep('upload');
        return;
      }

      setIngredients(result.ingredients);
      setStep('ingredients');
    } catch (err) {
      console.error('Upload error:', err);

      setError('Something went wrong analyzing your photo. Please try again.');
      setStep('upload');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() === '') return;

    if (ingredients.includes(newIngredient.trim().toLowerCase())) {
      setError('That ingredient is already in your list.');
      return;
    }

    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient('');
  };

  const handleGenerateMealPlan = async () => {
    // we'll build this in Session 3
    console.log('Generating meal plan with:', ingredients);
  };

  return (
    <div>
      {step === 'upload' && (
        <div>
          <h1>Upload Your Fridge Photo</h1>
          <p>
            Take a photo of your fridge or pantry and we'll detect your
            ingredients automatically.
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
          />
        </div>
      )}

      {step === 'detecting' && (
        <div>
          <h1>Analyzing your photo...</h1>
          <p>Claude is scanning your fridge. This takes a few seconds.</p>
        </div>
      )}

      {step === 'ingredients' && (
        <div>
          <h1>Detected Ingredients</h1>
          <p>Review and edit your ingredients before generating a meal plan.</p>

          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>
                <span>{ingredient}</span>
                <button onClick={() => handleRemoveIngredient(ingredient)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div>
            <input
              type="text"
              placeholder="Add an ingredient..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
            />
            <button onClick={handleAddIngredient}>Add</button>
          </div>

          <button
            onClick={handleGenerateMealPlan}
            disabled={ingredients.length === 0}
          >
            Generate Meal Plan
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadPage;
