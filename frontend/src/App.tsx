import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Onboarding from './pages/Onboarding';
import AdminOnboarding from './pages/AdminOnboarding';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
import DevDashboard from './pages/DevDashboard';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has a profile, if not redirect to onboarding
  if (!user.profile) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Discover />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          user ? <Onboarding /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/admin-onboarding"
        element={
          user?.isAdmin ? <AdminOnboarding /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/profile-setup"
        element={
          user ? <ProfileSetup /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <Layout>
              <Messages />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/likes"
        element={
          <PrivateRoute>
            <Layout>
              <Likes />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:matchId"
        element={
          <PrivateRoute>
            <Layout>
              <Chat />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dev"
        element={
          <PrivateRoute>
            {user?.isAdmin ? (
              <Layout>
                <DevDashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )}
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

