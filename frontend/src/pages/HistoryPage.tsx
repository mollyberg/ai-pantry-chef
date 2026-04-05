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
        const userId = 'cmn9jejm80000iw4jgjt3jklb';
        const result = await getMealPlans(userId);
        setPlans(result);
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

  if (loading) return <p>Loading your meal plan history...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (plans.length === 0) {
    return (
      <div>
        <h1>Meal Plan History</h1>
        <p>You haven't saved any meal plans yet.</p>
        <button onClick={() => navigate('/upload')}>
          Create Your First Meal Plan
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Meal Plan History</h1>
      <p>{plans.length} saved {plans.length === 1 ? 'plan' : 'plans'}</p>

      {plans.map((plan) => (
        <div key={plan.id}>

          {/* collapsed view — always visible */}
          <div onClick={() => handleExpand(plan.id)} style={{ cursor: 'pointer' }}>
            <h2>
              {new Date(plan.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p>{expandedId === plan.id ? '▲ Hide details' : '▼ Show details'}</p>
          </div>

          {/* expanded view — only visible when this plan is expanded */}
          {expandedId === plan.id && (
            <div>
              {DAYS.map((day) => (
                <div key={day}>
                  <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                  {MEALS.map((mealType) => (
                    <p key={mealType}>
                      <strong>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</strong>{' '}
                      {plan.plan[day as keyof typeof plan.plan]?.[mealType as keyof object]?.title ?? 'N/A'}
                    </p>
                  ))}
                </div>
              ))}

              <button onClick={() => navigate(`/history/${plan.id}`)}>
                See Full Details →
              </button>
            </div>
          )}

        </div>
      ))}

      <button onClick={() => navigate('/upload')}>
        Create New Meal Plan
      </button>
    </div>
  );
};

export default HistoryPage;