import { render, screen } from '@testing-library/react';
import UnderstandingTab from '../../components/planning/UnderstandingTab';

describe('UnderstandingTab', () => {
  it('renders understanding placeholder', () => {
    render(<UnderstandingTab />);
    expect(screen.getByText(/Project understanding/i)).toBeInTheDocument();
  });
});
