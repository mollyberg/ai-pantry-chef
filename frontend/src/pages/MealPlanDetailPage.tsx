import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { SavedMealPlan } from '../types/index.js';
import { getMealPlans } from '../api/index.js';

const MealPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SavedMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const userId = 'cmn9jejm80000iw4jgjt3jklb';
        const plans = await getMealPlans(userId);
        const found = plans.find((p) => p.id === id);
        if (!found) {
          navigate('/history');
          return;
        }
        setPlan(found);
      } catch (err) {
        setError('Failed to load this meal plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <p className="text-gray-500">Loading meal plan...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );

  if (!plan) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to History
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
        <p className="text-gray-500 mt-1">
          Saved on{' '}
          {new Date(plan.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* ingredients summary */}
      {plan.ingredientsUsed?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ingredients you had */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h2 className="text-sm font-medium text-green-700 uppercase tracking-wide mb-3">
              ✅ Ingredients You Had
            </h2>
            <div className="flex flex-wrap gap-2">
              {plan.ingredientsUsed.map((ingredient) => (
                <span
                  key={ingredient}
                  className="bg-white border border-green-200 text-green-800 text-sm px-3 py-1 rounded-full capitalize"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* ingredients needed */}
          {Object.keys(plan.missingIngredients).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h2 className="text-sm font-medium text-amber-700 uppercase tracking-wide mb-3">
                🛒 Ingredients to Buy
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  ...new Set(Object.values(plan.missingIngredients).flat()),
                ].map((ingredient) => (
                  <span
                    key={ingredient}
                    className="bg-white border border-amber-200 text-amber-800 text-sm px-3 py-1 rounded-full capitalize"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7 day plan */}
      <div className="grid gap-4">
        {Object.entries(plan.plan).map(([day, meals]) => (
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
                  <p className="text-sm text-gray-600 mt-2">{meal.recipe}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* shopping list */}
      {Object.keys(plan.missingIngredients).length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            🛒 Shopping List
          </h2>
          <div className="grid gap-2">
            {Object.entries(plan.missingIngredients).map(
              ([recipe, missing]) =>
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

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/upload')}
          className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Create New Meal Plan
        </button>
        <button
          onClick={() => navigate('/history')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to History
        </button>
      </div>
    </div>
  );
};

export default MealPlanDetailPage;
