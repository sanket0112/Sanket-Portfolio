import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const isNewVisitor = !localStorage.getItem('visited_before');
        await axios.post('/api/analytics/track', { isNewVisitor });
        if (isNewVisitor) {
          localStorage.setItem('visited_before', 'true');
        }
      } catch (error) {
        console.error("Analytics tracking failed", error);
      }
    };
    trackVisit();
  }, []);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    return token ? children : <Navigate to="/signup" replace />;
  };

  return (
    <Router>
      <ParticleBackground />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;

