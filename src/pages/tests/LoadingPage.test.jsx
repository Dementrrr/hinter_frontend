import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoadingPage from '../LoadingPage';

// Мокаем useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoadingPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
  });

  it('показывает спиннер и загружает данные, затем показывает кнопку', async () => {
    sessionStorage.setItem('contestId', '123');
    sessionStorage.setItem('submissionId', '456');

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ statement: 'Тестовое условие' }),
      })
    );

    render(
      <MemoryRouter>
        <LoadingPage />
      </MemoryRouter>
    );

    // Проверяем наличие текста загрузки
    expect(screen.getByText(/Генерируем подсказку/i)).toBeInTheDocument();
    expect(screen.getByText(/Условие задачи/i)).toBeInTheDocument();

    // Ждём появления кнопки с точным aria-label (именно такой, как в компоненте)
    const button = await screen.findByRole('button', {
      name: /Посмотреть сгенерированную подсказку/i,
    });

    expect(button).toBeInTheDocument();

    // Проверяем, что statement отобразился
    expect(screen.getByText(/Тестовое условие/i)).toBeInTheDocument();

    // Проверяем sessionStorage
    const hint = sessionStorage.getItem('hint');
    const statement = sessionStorage.getItem('statement');
    expect(hint).toBeTruthy();
    expect(statement).toBe('Тестовое условие');
  });

  it('при ошибке fetch выполняет навигацию на "/"', async () => {
    sessionStorage.setItem('contestId', '123');
    sessionStorage.setItem('submissionId', '456');

    global.fetch = vi.fn(() => Promise.reject(new Error('Ошибка сети')));

    render(
      <MemoryRouter>
        <LoadingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('кнопка вызывает навигацию на "/hint"', async () => {
    sessionStorage.setItem('contestId', '123');
    sessionStorage.setItem('submissionId', '456');

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ statement: 'Тестовое условие' }),
      })
    );

    render(
      <MemoryRouter>
        <LoadingPage />
      </MemoryRouter>
    );

    // Ждём появления кнопки
    const button = await screen.findByRole('button', {
      name: /Посмотреть сгенерированную подсказку/i,
    });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/hint');
  });
});
