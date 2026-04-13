import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SavedMealPlan } from '../types/index.js';
import { getMealPlans } from '../api/index.js';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];

const HistoryPage = () => {
  const [plans, setPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await getMealPlans();
        const sorted = result.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPlans(sorted);
      } catch (err) {
        setError('Failed to load your meal plan history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <p className="text-gray-500">Loading your meal plan history...</p>
    </div>
  );

  if (error) return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="text-5xl">🍽️</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">No meal plans yet</h1>
          <p className="text-gray-500 mt-2">Upload a photo to generate your first meal plan.</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Create Your First Meal Plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal Plan History</h1>
          <p className="text-gray-500 mt-1">
            {plans.length} saved {plans.length === 1 ? 'plan' : 'plans'}
          </p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + New Plan
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-gray-200 rounded-xl overflow-hidden">

            {/* collapsed header — always visible */}
            <button
              onClick={() => handleExpand(plan.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {new Date(plan.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {/* <p className="text-sm text-gray-500 mt-0.5">
                  {Object.keys(plan.missingIngredients).length > 0
                    ? `${Object.keys(plan.missingIngredients).length} items to buy`
                    : 'All ingredients on hand'}
                </p> */}
              </div>
              <span className="text-gray-400 text-sm">
                {expandedId === plan.id ? '▲' : '▼'}
              </span>
            </button>

            {/* expanded view */}
            {expandedId === plan.id && (
              <div className="border-t border-gray-100 p-4 flex flex-col gap-4">
                <div className="grid gap-2">
                  {DAYS.map((day) => (
                    <div key={day} className="grid grid-cols-4 gap-2 text-sm">
                      <span className="font-medium text-gray-700 capitalize">{day}</span>
                      {MEALS.map((mealType) => (
                        <span key={mealType} className="text-gray-500 truncate">
                          {(plan.plan[day as keyof typeof plan.plan]?.[mealType as keyof object] as { title?: string } | undefined)?.title ?? '—'}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/history/${plan.id}`)}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  See Full Details →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;