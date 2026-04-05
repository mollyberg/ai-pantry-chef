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
        const found = plans.find(p => p.id === id);
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

  if (loading) return <p>Loading meal plan...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!plan) return null;

  return (
    <div>
      <button onClick={() => navigate('/history')}>← Back to History</button>

      <h1>Meal Plan</h1>
      <p>Saved on {new Date(plan.createdAt).toLocaleDateString()}</p>

      {Object.entries(plan.plan).map(([day, meals]) => (
        <div key={day}>
          <h2>{day.charAt(0).toUpperCase() + day.slice(1)}</h2>
          {Object.entries(meals).map(([mealType, meal]) => (
            <div key={mealType}>
              <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {meal.title}</h3>
              <p><strong>Ingredients:</strong> {meal.ingredients.join(', ')}</p>
              <p><strong>Recipe:</strong> {meal.recipe}</p>
            </div>
          ))}
        </div>
      ))}

      {Object.keys(plan.missingIngredients).length > 0 && (
        <div>
          <h2>Shopping List</h2>
          {Object.entries(plan.missingIngredients).map(([recipe, missing]) => (
            missing.length > 0 && (
              <div key={recipe}>
                <strong>{recipe}:</strong> {missing.join(', ')}
              </div>
            )
          ))}
        </div>
      )}

      <button onClick={() => navigate('/upload')}>
        Create New Meal Plan
      </button>
    </div>
  );
};

export default MealPlanDetailPage;