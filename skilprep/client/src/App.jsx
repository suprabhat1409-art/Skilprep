import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Background3D from './components/layout/Background3D';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProblemsListPage from './pages/ProblemsListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CodeExecutorPage from './pages/CodeExecutorPage';
import LearningTracksPage from './pages/LearningTracksPage';
import WorkspacePage from './pages/WorkspacePage';
import CommunityPage from './pages/CommunityPage';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Background3D />
          <div className="min-h-screen relative z-10 flex flex-col">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/workspace" element={<WorkspacePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/problems" element={<ProblemsListPage />} />
                  <Route path="/problems/:slug" element={<ProblemDetailPage />} />
                  <Route
                    path="/code-executor"
                    element={
                      <ProtectedRoute>
                        <CodeExecutorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/learning-tracks" element={<LearningTracksPage />} />
                  <Route path="/communities" element={<CommunityPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </AuthProvider>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
