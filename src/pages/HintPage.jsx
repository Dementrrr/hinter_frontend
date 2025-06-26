import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import './HintPage.css';

function HintPage() {
  const navigate = useNavigate();
  const hint = JSON.parse(sessionStorage.getItem('hint') || '{}');
  const yesButtonRef = useRef(null); // для автофокуса на первой кнопке

  useEffect(() => {
    setTimeout(() => {
      yesButtonRef.current?.focus();
    }, 100);
  }, []);

  const handleYes = async () => {
    const contestId = sessionStorage.getItem('contestId');
    const submissionId = sessionStorage.getItem('submissionId');

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contestId: Number(contestId),
        submissionId: Number(submissionId)
      })
    });

    const data = await res.json();
    sessionStorage.setItem('recommendations', JSON.stringify(data));
    navigate('/recommendations');
  };

  const handleNo = () => navigate('/');

  return (
    <motion.div
      className="main"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="main" role="main">
        <h1 className="text-big" id="hint-title">Подсказка</h1>

        <section
          className="hint-block"
          aria-labelledby="hint-title"
        >
          <div className="text-hint">
            <ReactMarkdown
              children={hint.hint || ''}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              skipHtml={true}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div" {...props}>
                      {String(children).replace(/\\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                }
              }}
            />
          </div>
        </section>

        <section className="good-enough">
          <h2 className="text-sub" id="feedback-title">Подсказка была полезна?</h2>
          <div className="buttons" role="group" aria-labelledby="feedback-title">
            <button
              onClick={handleYes}
              className="button"
              ref={yesButtonRef}
              aria-label="Да, подсказка была полезна, перейти к рекомендациям"
            >
              Да
            </button>
            <button
              onClick={handleNo}
              className="button"
              aria-label="Нет, вернуться на главную страницу"
            >
              Нет
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default HintPage;
