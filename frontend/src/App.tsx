import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={
            <>
              <SignedIn><UploadPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/mealplan" element={
            <>
              <SignedIn><MealPlanPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/history" element={
            <>
              <SignedIn><HistoryPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/history/:id" element={
            <>
              <SignedIn><MealPlanDetailPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;