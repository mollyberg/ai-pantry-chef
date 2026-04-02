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
        // hardcoded userId for now — Phase 5 replaces with Clerk
        const userId = 'cmn9jejm80000iw4jgjt3jklb';
        const plans = await getMealPlans(userId);

        if (plans.length === 0) {
          navigate('/upload');
          return;
        }

        // get the most recently saved plan
        const sorted = plans.sort(
          (a, b) =>
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

  if (loading) return <p>Loading your meal plan...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!mealPlan) return null;

  return (
    <div>
      <h1>Your Saved Meal Plan</h1>
      <p>Saved on {new Date(mealPlan.createdAt).toLocaleDateString()}</p>

      {Object.entries(mealPlan.plan).map(([day, meals]) => (
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

      <button onClick={() => navigate('/upload')}>Create New Meal Plan</button>

      <button onClick={() => navigate('/history')}>View All Plans</button>
    </div>
  );
};

export default MealPlanPage;
