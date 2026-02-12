import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateIssuePage } from './pages/CreateIssuePage';
import { AllIssuesPage } from './pages/AllIssuesPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { EditIssuePage } from './pages/EditIssuePage';
import RegisterPage from './pages/RegisterPage';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <AllIssuesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues/create"
          element={
            <ProtectedRoute>
              <CreateIssuePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues/:id/edit"
          element={
            <ProtectedRoute>
              <EditIssuePage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;