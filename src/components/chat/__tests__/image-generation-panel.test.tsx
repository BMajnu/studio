import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageGenerationPanel } from '../image-generation-panel';

// Mock hooks
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}));

jest.mock('@/lib/hooks/use-user-profile', () => ({
  useUserProfile: () => ({ profile: { name: 'Test User', communicationStyleNotes: '' } })
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ images: [{ dataUri: 'data:image/png;base64,abc', alt: 'Test' }], prompt: 'Prompt' })
  })
) as jest.Mock;


describe('ImageGenerationPanel', () => {
  it('renders and generates images', async () => {
    const handleClose = jest.fn();
    render(<ImageGenerationPanel prompt="Test prompt" onClose={handleClose} />);

    // Click generate
    const generateButton = screen.getByRole('button', { name: /generate images/i });
    fireEvent.click(generateButton);

    // Wait for loading skeleton to appear and then images
    await waitFor(() => expect(screen.getByText(/Generated Images/i)).toBeInTheDocument());
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
}); 