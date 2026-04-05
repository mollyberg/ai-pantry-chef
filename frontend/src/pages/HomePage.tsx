import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">🥘 AI Pantry Chef</h1>
      <p className="text-lg text-gray-500 text-center max-w-md">
        Upload a photo of your fridge and get a personalized weekly meal plan in seconds.
      </p>
      <Button onClick={() => navigate('/upload')}>
        Get Started →
      </Button>
    </div>
  );
};

export default HomePage;