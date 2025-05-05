import { render, screen } from '@testing-library/react';
import Sidebar from '../../components/commandPanel/Sidebar';

describe('Sidebar', () => {
  it('displays all phases', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Phase 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 4/i)).toBeInTheDocument();
  });
});
