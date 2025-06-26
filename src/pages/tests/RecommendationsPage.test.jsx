import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationsPage from '../RecommendationsPage';
import '@testing-library/jest-dom';

describe('RecommendationsPage', () => {
  const recommendations = [
    { title: 'Задача 1', url: 'https://example.com/1' },
    { title: 'Задача 2', url: '' },
    { title: 'Задача 3', url: 'https://example.com/3' },
    { title: 'Задача 4', url: 'https://example.com/4' },
  ];

  beforeEach(() => {
    sessionStorage.setItem('recommendations', JSON.stringify({ recommendations }));
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('рендерит заголовок и первые три рекомендации', () => {
    render(<RecommendationsPage />);

    expect(screen.getByText('Похожие задачи')).toBeInTheDocument();

    expect(screen.getByText('Задача 1')).toBeInTheDocument();
    expect(screen.getByText('Задача 2')).toBeInTheDocument();
    expect(screen.getByText('Задача 3')).toBeInTheDocument();
    expect(screen.queryByText('Задача 4')).not.toBeInTheDocument();

    // Получаем все элементы <a> с aria-label начинающимся на "Перейти к задаче"
    const links = screen.getAllByRole('link', {
      name: /Перейти к задаче:/i,
    });

    // Должно быть ровно 2 (у первой и третьей рекомендации)
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', 'https://example.com/1');
    expect(links[1]).toHaveAttribute('href', 'https://example.com/3');

    expect(screen.getByText('Ссылка недоступна')).toBeInTheDocument();
  });

  it('кнопка "Вернуться к вводу" меняет location.href', () => {
    render(<RecommendationsPage />);

    // Мокаем location.href
    delete window.location;
    window.location = { href: '' };

    // Находим кнопку по aria-label
    const button = screen.getByRole('button', {
      name: /Вернуться на главную страницу для ввода данных/i,
    });

    fireEvent.click(button);

    expect(window.location.href).toBe('/');
  });
});
