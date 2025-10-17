import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
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

  return user ? <>{children}</> : <Navigate to="/login" />;
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
        path="/profile-setup"
        element={
          <PrivateRoute>
            <ProfileSetup />
          </PrivateRoute>
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
        path="/matches"
        element={
          <PrivateRoute>
            <Layout>
              <Matches />
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

