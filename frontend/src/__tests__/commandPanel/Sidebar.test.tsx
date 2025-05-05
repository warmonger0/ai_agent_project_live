import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../../components/commandPanel/Sidebar';

test('renders Sidebar component', () => {
  render(<Sidebar />);
  expect(screen.getByText(/Phases/i)).toBeInTheDocument();
});
