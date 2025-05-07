import { render, screen } from '@testing-library/react';
import TabbedPanel from '../../components/planning/TabbedPanel';

describe('TabbedPanel', () => {
  it('renders tab buttons only (no duplicate text match)', () => {
    render(<TabbedPanel />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.map(btn => btn.textContent)).toEqual(
      expect.arrayContaining(['Understanding', 'File Tree', 'Issues'])
    );
  });
});
