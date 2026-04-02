import { useState } from 'react';
import type { UploadStep } from '../types/index.js';
import type { GeneratedMealPlan } from '../types/index.js';
import {
  detectIngredients,
  generateMealPlan,
  saveMealPlan,
} from '../api/index.js';
import { useNavigate } from 'react-router-dom';

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
  const [mealPlan, setMealPlan] = useState<GeneratedMealPlan | null>(null);
  const navigate = useNavigate();

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
    setError(null);
    setStep('generating');

    try {
      // hardcoding userId for now — Phase 5 will get this from Clerk auth
      const userId = 'cmn9jejm80000iw4jgjt3jklb';
      const result = await generateMealPlan(userId, ingredients);
      setMealPlan(result);
      setStep('mealplan');
    } catch (err) {
      console.error('Meal plan error:', err);
      setError(
        'Something went wrong generating your meal plan. Please try again.'
      );
      setStep('ingredients');
    }
  };

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;
    setError(null);
    setIsGenerating(true);

    try {
      // hardcoded userId for now — Phase 5 replaces with Clerk
      const userId = 'cmn9jejm80000iw4jgjt3jklb';
      await saveMealPlan(
        userId,
        mealPlan.mealPlan,
        ingredients,
        mealPlan.missingIngredients
      );
      navigate('/mealplan');
    } catch (err) {
      console.error('Save error:', err);
      setError('Something went wrong saving your meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

      {step === 'generating' && (
        <div>
          <h1>Building your meal plan...</h1>
          <p>
            Claude is creating a personalized 7-day meal plan from your
            ingredients. This can take a few minutes. Please do not exit this
            screen.
          </p>
        </div>
      )}

      {step === 'mealplan' && mealPlan && (
        <div>
          <h1>Your 7-Day Meal Plan</h1>

          {Object.entries(mealPlan.mealPlan).map(([day, meals]) => (
            <div key={day}>
              <h2>{day.charAt(0).toUpperCase() + day.slice(1)}</h2>

              {Object.entries(meals).map(([mealType, meal]) => (
                <div key={mealType}>
                  <h3>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:{' '}
                    {meal.title}
                  </h3>
                  <p>
                    <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
                  </p>
                  <p>
                    <strong>Recipe:</strong> {meal.recipe}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {Object.keys(mealPlan.missingIngredients).length > 0 && (
            <div>
              <h2>Shopping List</h2>
              <p>You'll need to buy these ingredients:</p>
              <ul>
                {Object.entries(mealPlan.missingIngredients).map(
                  ([recipe, missing]) =>
                    missing.length > 0 && (
                      <li key={recipe}>
                        <strong>{recipe}:</strong> {missing.join(', ')}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          <button onClick={handleSaveMealPlan} disabled={isGenerating}>
            {isGenerating ? 'Saving...' : 'Save Meal Plan'}
          </button>

          <button onClick={() => setStep('upload')}>Start Over</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadPage;
