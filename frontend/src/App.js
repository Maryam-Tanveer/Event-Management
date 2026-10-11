import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import LandingPage from "./Pages/LandingPage";
import EventPage from "./Pages/EventPage";
import TicketPage from "./Pages/TicketPage";
import MyEventsPage from "./Pages/MyEventsPage";
import OrganizePage from "./Pages/OrganizePage";
import SignInPage from "./Pages/SignInPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import NotFoundPage from "./Pages/NotFoundPage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const hideLayout = [
    "/signin",
    "/forgot-password",
    "/create-account",
    "/reset-password",
    "/",
  ].includes(location.pathname) && !user;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF3EC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8b2d3a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {!hideLayout && <Navbar />}
        <main className="flex-1">
          <Routes>
            {/* Root: LandingPage for guests, EventPage for logged-in users */}
            <Route
              path="/"
              element={
                user ? (
                  <EventPage />
                ) : (
                  <LandingPage />
                )
              }
            />

            <Route path="/events" element={<EventPage />} />
            <Route path="/tickets" element={<TicketPage />} />
            <Route path="/tickets/:id" element={<TicketPage />} />

            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organize"
              element={
                <ProtectedRoute>
                  <OrganizePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organize/edit/:eventId"
              element={
                <ProtectedRoute>
                  <OrganizePage />
                </ProtectedRoute>
              }
            />

            <Route path="/signin" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />

            {/* 404 — Dedicated page instead of inline JSX */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!hideLayout && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
