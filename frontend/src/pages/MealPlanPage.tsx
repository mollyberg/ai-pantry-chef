import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SavedMealPlan } from '../types/index.js';
import { getMealPlans } from '../api/index.js';

const MealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState<SavedMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPlan = async () => {
      try {
        const plans = await getMealPlans();

        if (plans.length === 0) {
          navigate('/upload');
          return;
        }

        const sorted = plans.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMealPlan(sorted[0]);
      } catch (err) {
        setError('Failed to load your meal plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPlan();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <p className="text-gray-500">Loading your meal plan...</p>
    </div>
  );

  if (error) return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );

  if (!mealPlan) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Saved Meal Plan</h1>
          <p className="text-gray-500 mt-1">
            Saved on {new Date(mealPlan.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          View all plans →
        </button>
      </div>

      <div className="grid gap-4">
        {Object.entries(mealPlan.plan).map(([day, meals]) => (
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
                  <p className="text-sm text-gray-500 mt-1">{meal.ingredients.join(', ')}</p>
                  <p className="text-sm text-gray-600 mt-2">{meal.recipe}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(mealPlan.missingIngredients).length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">🛒 Shopping List</h2>
          <div className="grid gap-2">
            {Object.entries(mealPlan.missingIngredients).map(([recipe, missing]) =>
              missing.length > 0 && (
                <div key={recipe} className="text-sm">
                  <span className="font-medium text-gray-700">{recipe}:</span>{' '}
                  <span className="text-gray-600">{missing.join(', ')}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/upload')}
        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        Create New Meal Plan
      </button>
    </div>
  );
};

export default MealPlanPage;