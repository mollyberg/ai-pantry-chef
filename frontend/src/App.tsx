import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import api from './api/index.js';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MealPlanPage from './pages/MealPlanPage';
import HistoryPage from './pages/HistoryPage';
import MealPlanDetailPage from './pages/MealPlanDetailPage';
import TermsPage from './pages/TermsPage';

const App = () => {
  const { getToken } = useAuth();

  useEffect(() => {
  const interceptorId = api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // cleanup — remove interceptor when component unmounts
  return () => {
    api.interceptors.request.eject(interceptorId);
  };
}, [getToken]);
  return (
    <BrowserRouter>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <UploadPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/mealplan"
            element={
              <>
                <SignedIn>
                  <MealPlanPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <SignedIn>
                  <HistoryPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/history/:id"
            element={
              <>
                <SignedIn>
                  <MealPlanDetailPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      <footer className="border-t mt-12 py-6 text-center text-sm text-gray-400">
        <p>
          AI Pantry Chef is a portfolio project.{' '}
          <a href="/terms" className="underline hover:text-gray-600">Terms & Privacy</a>
        </p>
      </footer>
    </BrowserRouter>
  );
};

export default App;
