import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the mission section heading', () => {
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});
