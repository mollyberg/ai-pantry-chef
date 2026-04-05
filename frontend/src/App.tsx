import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MealPlanPage from './pages/MealPlanPage';
import HistoryPage from './pages/HistoryPage';
import MealPlanDetailPage from './pages/MealPlanDetailPage';


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/mealplan" element={<MealPlanPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<MealPlanDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;