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

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Decks from "./pages/Decks";
import CreateDeck from "./pages/CreateDeck";
import DeckDetail from "./pages/DeckDetail";
import CreateCard from "./pages/CreateCard";
import ImportCards from "./pages/ImportCards";
import SystemDecks from "./pages/SystemDecks";
import StudySession from "./pages/StudySession";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
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
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
