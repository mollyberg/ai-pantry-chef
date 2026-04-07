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
      const result = await generateMealPlan(ingredients);
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
      await saveMealPlan(
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
        <div className="flex flex-col items-center gap-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Your Fridge Photo
            </h1>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Take a photo of your fridge or pantry and we'll detect your
              ingredients automatically.
            </p>
          </div>

          <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
            <span className="text-4xl mb-2">📸</span>
            <span className="text-sm font-medium text-gray-600">
              Click to upload a photo
            </span>
            <span className="text-xs text-gray-400 mt-1">
              JPEG, PNG, GIF, or WEBP up to 5MB
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {step === 'detecting' && (
        <div className="flex flex-col items-center gap-4 py-24">
          <div className="text-5xl animate-spin">⏳</div>
          <h2 className="text-xl font-semibold text-gray-900">
            Analyzing your photo...
          </h2>
          <p className="text-gray-500">
            Claude is scanning your fridge. This takes a few seconds.
          </p>
        </div>
      )}

      {step === 'ingredients' && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detected Ingredients
            </h1>
            <p className="text-gray-500 mt-1">
              Review and edit before generating your meal plan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-gray-800 capitalize">
                  {ingredient}
                </span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add an ingredient..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              onClick={handleAddIngredient}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>

          <button
            onClick={handleGenerateMealPlan}
            disabled={ingredients.length === 0}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Meal Plan →
          </button>
        </div>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center gap-4 py-24">
          <div className="text-5xl animate-spin">🍽️</div>
          <h2 className="text-xl font-semibold text-gray-900">
            Building your meal plan...
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            Claude is creating a personalized 7-day meal plan from your
            ingredients. This takes a few minutes. Please do not exit this page.
          </p>
        </div>
      )}

      {step === 'mealplan' && mealPlan && (
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your 7-Day Meal Plan
            </h1>
            <p className="text-gray-500 mt-1">
              Review your plan before saving.
            </p>
          </div>

          <div className="grid gap-4">
            {Object.entries(mealPlan.mealPlan).map(([day, meals]) => (
              <div key={day} className="border border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </h2>
                <div className="grid gap-3">
                  {Object.entries(meals).map(([mealType, meal]) => (
                    <div key={mealType} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {mealType}
                      </p>
                      <p className="font-medium text-gray-900">{meal.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {meal.ingredients.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {meal.recipe}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(mealPlan.missingIngredients).length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                🛒 Shopping List
              </h2>
              <div className="grid gap-2">
                {Object.entries(mealPlan.missingIngredients).map(
                  ([recipe, missing]) =>
                    missing.length > 0 && (
                      <div key={recipe} className="text-sm">
                        <span className="font-medium text-gray-700">
                          {recipe}:
                        </span>{' '}
                        <span className="text-gray-600">
                          {missing.join(', ')}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSaveMealPlan}
              disabled={isGenerating}
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Saving...' : '💾 Save Meal Plan'}
            </button>
            <button
              onClick={() => setStep('upload')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
