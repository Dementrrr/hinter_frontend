import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../HomePage';

// Мокаем useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  it('рендерит заголовок', () => {
    expect(screen.getByText(/Введите данные/i)).toBeInTheDocument();
  });

  it('показывает ошибки при пустых полях', () => {
    const button = screen.getByRole('button', { name: /Получить подсказку/i });
    fireEvent.click(button);
    expect(screen.getAllByText(/Обязательное поле/i).length).toBe(2);
  });

  it('показывает ошибки при неверном формате', () => {
    const contestInput = screen.getByPlaceholderText('contestId');
    const submissionInput = screen.getByPlaceholderText('submissionId');
    fireEvent.change(contestInput, { target: { value: 'abc' } });
    fireEvent.change(submissionInput, { target: { value: 'xyz' } });
    const button = screen.getByRole('button', { name: /Получить подсказку/i });
    fireEvent.click(button);
    expect(screen.getAllByText(/Только цифры/i).length).toBe(2);
  });
});
