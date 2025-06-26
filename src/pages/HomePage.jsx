import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [contestId, setContestId] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [errors, setErrors] = useState({});
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const validate = (cid, sid) => {
    const errs = {};
    const validateField = (value, fieldName) => {
      if (value === '') {
        errs[fieldName] = 'Обязательное поле';
      } else if (!/^\d+$/.test(value)) {
        errs[fieldName] = 'Только цифры';
      } else if (BigInt(value) > 10_000_000_000n) {
        errs[fieldName] = 'Не больше 10 000 000 000';
      }
    };
    validateField(cid, 'contestId');
    validateField(sid, 'submissionId');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // предотвращаем перезагрузку страницы
    setWasSubmitted(true);
    const valid = validate(contestId, submissionId);
    if (!valid) return;

    sessionStorage.setItem('contestId', contestId);
    sessionStorage.setItem('submissionId', submissionId);
    navigate('/loading');
  };

  return (
    <motion.div
      className="main"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="main">
        <div className="text-big" id="form-title">Введите данные</div>

        <form
          role="form"
          aria-labelledby="form-title"
          onSubmit={handleSubmit}
        >
          <div className="input-form">
            <div className="input-block">
              <label htmlFor="contestIdInput" className="visually-hidden">
                Contest ID
              </label>
              <input
                id="contestIdInput"
                type="text"
                placeholder="contestId"
                value={contestId}
                onChange={e => setContestId(e.target.value)}
                aria-label="Contest ID"
                aria-required="true"
                aria-invalid={wasSubmitted && errors.contestId ? 'true' : 'false'}
                aria-describedby={errors.contestId ? 'contestIdError' : undefined}
              />
              <div
                id="contestIdError"
                className={`error ${wasSubmitted && errors.contestId ? 'visible' : ''}`}
                role={wasSubmitted && errors.contestId ? 'alert' : undefined}
              >
                {errors.contestId || ''}
              </div>
            </div>

            <div className="input-block">
              <label htmlFor="submissionIdInput" className="visually-hidden">
                Submission ID
              </label>
              <input
                id="submissionIdInput"
                type="text"
                placeholder="submissionId"
                value={submissionId}
                onChange={e => setSubmissionId(e.target.value)}
                aria-label="Submission ID"
                aria-required="true"
                aria-invalid={wasSubmitted && errors.submissionId ? 'true' : 'false'}
                aria-describedby={errors.submissionId ? 'submissionIdError' : undefined}
              />
              <div
                id="submissionIdError"
                className={`error ${wasSubmitted && errors.submissionId ? 'visible' : ''}`}
                role={wasSubmitted && errors.submissionId ? 'alert' : undefined}
              >
                {errors.submissionId || ''}
              </div>
            </div>
          </div>

          <button
            className="button"
            type="submit"
            aria-label="Получить подсказку"
          >
            Дай подсказку
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default HomePage;
