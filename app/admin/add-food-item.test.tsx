import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from './page';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Add Food Item Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });
  });

  it('should show form when Add New Item is clicked', async () => {
    render(<Page />);

    const addButton = screen.getByText(/add new item/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          name: 'Grilled Chicken',
          description: 'Juicy grilled chicken breast',
          price: 14.99,
          category: 'entree',
          imageUrl: 'https://example.com/chicken.jpg',
          isAvailable: true
        })
      });

    render(<Page />);

    // Click Add New Item
    const addButton = screen.getByText(/add new item/i);
    await user.click(addButton);

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'Grilled Chicken');
    await user.type(screen.getByLabelText(/description/i), 'Juicy grilled chicken breast');
    await user.type(screen.getByLabelText(/price/i), '14.99');
    await user.selectOptions(screen.getByLabelText(/category/i), 'entree');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/chicken.jpg');

    // Submit form
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Grilled Chicken',
          description: 'Juicy grilled chicken breast',
          price: 14.99,
          category: 'entree',
          imageUrl: 'https://example.com/chicken.jpg',
          isAvailable: true
        })
      });
    });

    // Should show success message
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<Page />);

    // Click Add New Item
    const addButton = screen.getByText(/add new item/i);
    await user.click(addButton);

    // Submit empty form
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });
});