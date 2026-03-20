import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import AITechnology from './pages/AITechnology';
import Benefits from './pages/Benefits';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AIChatbot from './components/AIChatbot';
import ParticleBackground from './components/ParticleBackground';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ParticleBackground />
        <ScrollToTop />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="ai-technology" element={<AITechnology />} />
              <Route path="benefits" element={<Benefits />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="user-dashboard"
                element={
                  <ProtectedRoute role="rider">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin-dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>

        <AIChatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
