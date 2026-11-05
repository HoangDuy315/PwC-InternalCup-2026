import { Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { DrawProvider } from './context/DrawContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Draw from './pages/Draw.jsx';
import Teams from './pages/Teams.jsx';
import Schedule from './pages/Schedule.jsx';
import Login from './pages/Login.jsx';
import Rules from './pages/Rules.jsx';

// Layout chung: Navbar cố định + nội dung + Footer
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <DrawProvider>
          <ScrollToTop />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-pwc-black"
          >
            Bỏ qua tới nội dung chính
          </a>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/draw"
                  element={
                    <ProtectedRoute>
                      <Draw />
                    </ProtectedRoute>
                  }
                />
                <Route path="/teams" element={<Teams />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DrawProvider>
      </AuthProvider>
    </MotionConfig>
  );
}