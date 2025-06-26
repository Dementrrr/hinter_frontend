import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';

// Lazy-loaded страницы
const HomePage = lazy(() => import('./pages/HomePage'));
const LoadingPage = lazy(() => import('./pages/LoadingPage'));
const HintPage = lazy(() => import('./pages/HintPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));

// Обёртка для анимированных маршрутов
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/hint" element={<HintPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-8 text-center">Загрузка...</div>}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
