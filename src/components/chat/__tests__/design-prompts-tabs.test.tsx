import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesignPromptsTabs } from '../design-prompts-tabs';

jest.mock('../image-generation-panel', () => ({
  ImageGenerationPanel: () => <div data-testid="image-generation-panel">Panel</div>
}));

describe('DesignPromptsTabs', () => {
  const sampleData = [
    {
      category: 'Graphics',
      prompts: ['Prompt 1']
    }
  ];

  it('shows generate button and opens panel on click', () => {
    render(<DesignPromptsTabs promptsData={sampleData} />);

    // Expect sparkles icon button exists
    const generateButton = screen.getAllByRole('button', { name: /generate images/i })[0];
    fireEvent.click(generateButton);

    // Panel should appear
    expect(screen.getByTestId('image-generation-panel')).toBeInTheDocument();
  });
}); 