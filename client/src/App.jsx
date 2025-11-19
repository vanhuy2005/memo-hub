import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import LoadingFallback from "./components/LoadingFallback";

// Critical Pages (Load immediately)
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy Load Heavy Pages (Load on demand)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudySession = lazy(() => import("./pages/StudySession"));
const Decks = lazy(() => import("./pages/Decks"));
const CreateDeck = lazy(() => import("./pages/CreateDeck"));
const DeckDetail = lazy(() => import("./pages/DeckDetail"));
const CreateCard = lazy(() => import("./pages/CreateCard"));
const ImportCards = lazy(() => import("./pages/ImportCards"));
const SystemDecks = lazy(() => import("./pages/SystemDecks"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                        <BottomNav />
                      </ProtectedRoute>
                    }
                  />
                <Route
                  path="/decks"
                  element={
                    <ProtectedRoute>
                      <Decks />
                      <BottomNav />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/create"
                  element={
                    <ProtectedRoute>
                      <CreateDeck />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/:deckId"
                  element={
                    <ProtectedRoute>
                      <DeckDetail />
                      <BottomNav />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/:deckId/cards/create"
                  element={
                    <ProtectedRoute>
                      <CreateCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/:deckId/cards/import"
                  element={
                    <ProtectedRoute>
                      <ImportCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/:deckId/cards/:cardId/edit"
                  element={
                    <ProtectedRoute>
                      <CreateCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/system-decks"
                  element={
                    <ProtectedRoute>
                      <SystemDecks />
                      <BottomNav />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/study"
                  element={
                    <ProtectedRoute>
                      <StudySession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <ProtectedRoute>
                      <Statistics />
                      <BottomNav />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                      <BottomNav />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <ProtectedRoute>
                      <Privacy />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <ProtectedRoute>
                      <Terms />
                    </ProtectedRoute>
                  }
                />

                {/* Default Route */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
              </Suspense>
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
