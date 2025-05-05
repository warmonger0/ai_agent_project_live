import { render, screen } from '@testing-library/react';
import IssuesTab from '../../components/commandPanel/IssuesTab';

describe('IssuesTab', () => {
  it('renders issues placeholder', () => {
    render(<IssuesTab />);
    expect(screen.getByText(/Issues/i)).toBeInTheDocument();
  });
});
