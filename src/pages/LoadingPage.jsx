import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion } from 'framer-motion';
import './LoadingPage.css';
import 'katex/dist/katex.min.css';

// Toast-компонент
function Toast({ message, onRetry, onClose }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: '#333',
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 1000,
        maxWidth: 320,
      }}
    >
      <div>{message}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button
          onClick={onRetry}
          style={{
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 4,
            cursor: 'pointer',
            flexGrow: 1,
          }}
          aria-label="Повторить запрос"
        >
          Повторить
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: '#aaa',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            lineHeight: 1,
            padding: '0 0.3rem',
          }}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function LoadingPage() {
  const navigate = useNavigate();
  const [statement, setStatement] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null); // состояние для ошибки
  const buttonRef = useRef(null);

  const fetchHint = async () => {
    setIsLoaded(false);
    setError(null);
    try {
      const contestId = Number(sessionStorage.getItem('contestId'));
      const submissionId = Number(sessionStorage.getItem('submissionId'));

      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId, submissionId }),
      });

      if (!res.ok) throw new Error('Ошибка сервера');

      const data = await res.json();
      sessionStorage.setItem('hint', JSON.stringify(data));

      if (data.statement) {
        sessionStorage.setItem('statement', data.statement);
        setStatement(data.statement);
      }

      setIsLoaded(true);
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 100);
    } catch (err) {
      console.error('Ошибка при получении подсказки:', err);
      setError(err.message || 'Ошибка сети');
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    fetchHint();
  }, []);

  const goToHint = () => navigate('/hint');

  return (
    <motion.div
      className="main"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="main">
        <div className="text-big" id="statement-title">
          Условие задачи
        </div>

        <div className="statement-block" aria-labelledby="statement-title">
          <div className="text-statement">
            <ReactMarkdown
              children={statement}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              skipHtml={true}
            />
          </div>
        </div>

        {!isLoaded ? (
          <div className="loading-section" role="status" aria-live="polite">
            <div className="text-sub">Генерируем подсказку...</div>
            <div className="ring-loader" aria-label="Идёт загрузка"></div>
          </div>
        ) : (
          <button
            className="button"
            onClick={goToHint}
            ref={buttonRef}
            aria-label="Посмотреть сгенерированную подсказку"
          >
            Посмотреть подсказку
          </button>
        )}

        {error && (
          <Toast
            message={error}
            onRetry={fetchHint}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </motion.div>
  );
}

export default LoadingPage
