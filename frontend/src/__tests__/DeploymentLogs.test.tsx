import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import DeploymentLogs from '../../src/pages/DeploymentLogs';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DeploymentLogs', () => {
  const mockLogList = ['test.log', 'deployment_2025-04-22.log'];
  const mockLogContent = '🚀 Deployment complete\n✅ System check passed';

  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('renders logs and shows content when clicked', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/logs') return Promise.resolve({ data: mockLogList });
      if (url === '/logs/test.log') return Promise.resolve({ data: mockLogContent });
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(<DeploymentLogs />);

    // Wait for log list
    await waitFor(() => expect(screen.getByText('test.log')).toBeInTheDocument());

    // Click on log
    fireEvent.click(screen.getByText('test.log'));

    // Wait for content
    await waitFor(() =>
      expect(screen.getByText(/Deployment complete/i)).toBeInTheDocument()
    );
  });
});
