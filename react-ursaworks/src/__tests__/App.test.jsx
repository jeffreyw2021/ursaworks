import { render, screen } from '@testing-library/react';
import App from '../App';

test('homepage renders all four teaser sections', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
  expect(screen.getByText('The Robots')).toBeInTheDocument();
  expect(screen.getByText('Latest Event')).toBeInTheDocument();
  expect(screen.getByText('Join Ursaworks')).toBeInTheDocument();
});

test('homepage does not render the About page content', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(screen.queryByAltText('About')).not.toBeInTheDocument();
});

test('the /about route renders the About "Our Mission" section', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
});
