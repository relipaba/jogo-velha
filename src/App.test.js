import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza a interface temática da floresta', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 1, name: /trilha do jogo da velha/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/próximo explorador/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /reiniciar trilha/i })).toBeInTheDocument();
});
