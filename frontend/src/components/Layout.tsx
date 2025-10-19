import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Dating.ai
            </Link>
            <nav className="flex space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/')
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Discover
              </Link>
              <Link
                to="/likes"
                className={`${
                  isActive('/likes')
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Likes
              </Link>
              <Link
                to="/matches"
                className={`${
                  isActive('/matches')
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Matches
              </Link>
              <Link
                to="/profile"
                className={`${
                  isActive('/profile')
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Profile
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/dev"
                  className={`${
                    isActive('/dev')
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  🔧 Dev
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

