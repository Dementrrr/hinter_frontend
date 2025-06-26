import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HintPage from '../HintPage';

// Мокируем useNavigate из react-router-dom
const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('HintPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    navigateMock.mockClear();

    // Мокаем fetch глобально перед каждым тестом
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('рендерит подсказку из sessionStorage', () => {
    const hint = { text: 'Подсказка' };
    sessionStorage.setItem('hint', JSON.stringify(hint));

    render(<HintPage />);

    expect(screen.getByText('Подсказка')).toBeInTheDocument();
  });

  test('при клике "Да" отправляет запрос и переходит на /recommendations', async () => {
    sessionStorage.setItem('hint', JSON.stringify({ text: 'Подсказка' }));

    render(<HintPage />);

    const yesButton = screen.getByText('Да');
    fireEvent.click(yesButton);

    // Ждём навигацию
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/search', expect.any(Object));
      expect(navigateMock).toHaveBeenCalledWith('/recommendations');
    });
  });

  test('при клике "Нет" выполняет навигацию на /', () => {
    sessionStorage.setItem('hint', JSON.stringify({ text: 'Подсказка' }));

    render(<HintPage />);

    const noButton = screen.getByText('Нет');
    fireEvent.click(noButton);

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
