import { render, screen } from '@testing-library/react';
import TabbedPanel from '../../components/commandPanel/TabbedPanel';

describe('TabbedPanel', () => {
  it('renders tab buttons', () => {
    render(<TabbedPanel />);
    expect(screen.getByText(/Understanding/i)).toBeInTheDocument();
    expect(screen.getByText(/File Tree/i)).toBeInTheDocument();
    expect(screen.getByText(/Issues/i)).toBeInTheDocument();
  });
});
