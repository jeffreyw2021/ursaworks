import { render, screen } from '@testing-library/react';
import App from './App';

test('homepage does not render the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.queryByText('Our Mission')).not.toBeInTheDocument();
});

test('the /about route renders the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});