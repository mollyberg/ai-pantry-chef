import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          🥘 AI Pantry Chef
        </Link>
        <div className="flex items-center gap-6">
          <SignedIn>
            <Link
              to="/upload"
              className={`text-sm font-medium transition-colors ${
                isActive('/upload') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              New Plan
            </Link>
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors ${
                isActive('/history') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              History
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;