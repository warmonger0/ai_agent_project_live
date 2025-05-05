import { render, screen } from '@testing-library/react';
import ChatPanel from '../../components/commandPanel/ChatPanel';

describe('ChatPanel', () => {
  it('renders chat panel title', () => {
    render(<ChatPanel />);
    expect(screen.getByText(/DeepSeek Chat/i)).toBeInTheDocument();
  });
});
