import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion } from 'framer-motion';
import './RecommendationsPage.css';

function RecommendationsPage() {
  const recommendationsData = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
  const recommendations = recommendationsData.recommendations || [];
  console.log(recommendations);
  const backButtonRef = useRef(null); // для автофокуса на кнопке

  useEffect(() => {
    setTimeout(() => {
      backButtonRef.current?.focus();
    }, 100);
  }, []);

  return (
    <motion.div
      className="main"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="main" role="main">
        <h1 className="text-big" id="recommendations-title">Похожие задачи</h1>

        <section
          className="recommendations-list"
          aria-labelledby="recommendations-title"
        >
          {recommendations.length === 0 ? (
            <p className="text-sub" role="status" aria-live="polite">
              Рекомендации не найдены.
            </p>
          ) : (
            recommendations.slice().map((rec, i) => (
              <div
                key={i}
                className="recommendation"
                role="region"
                aria-labelledby={`rec-title-${i}`}
              >
                <h2 className="text-title" id={`rec-title-${i}`}>
                  <ReactMarkdown
                    children={rec.title || ''}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    skipHtml={true}
                  />
                </h2>
                {rec.url ? (
                  <a
                    href={rec.url.trim()}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Перейти к задаче: ${rec.title}`}
                  >
                    Перейти к задаче (откроется в новой вкладке)
                  </a>
                ) : (
                  <p className="text-link-disabled" aria-disabled="true">
                    Ссылка недоступна
                  </p>
                )}
              </div>
            ))
          )}
        </section>

        <button
          onClick={() => location.href = '/'}
          className="button"
          ref={backButtonRef}
          aria-label="Вернуться на главную страницу для ввода данных"
        >
          Вернуться к вводу
        </button>
      </div>
    </motion.div>
  );
}

export default RecommendationsPage;
