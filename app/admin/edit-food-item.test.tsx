import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from './page';

// Mock fetch for API calls
global.fetch = jest.fn();

const mockFoodItem = {
  id: '1',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan',
  price: 12.99,
  category: 'appetizer' as const,
  imageUrl: 'https://example.com/caesar.jpg',
  isAvailable: true
};

describe('Edit Food Item Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockFoodItem]
    });
  });

  it('should show form with pre-populated data when Edit is clicked', async () => {
    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Edit button
    const editButton = screen.getByTestId(`edit-${mockFoodItem.id}`);
    fireEvent.click(editButton);

    // Form should be pre-populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Fresh romaine lettuce with parmesan')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12.99')).toBeInTheDocument();
      expect(screen.getByDisplayValue('appetizer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/caesar.jpg')).toBeInTheDocument();
    });
  });

  it('should update food item with modified data', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockFoodItem]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockFoodItem, price: 13.99 })
      });

    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Edit button
    const editButton = screen.getByTestId(`edit-${mockFoodItem.id}`);
    await user.click(editButton);

    // Modify price
    const priceInput = screen.getByDisplayValue('12.99');
    await user.clear(priceInput);
    await user.type(priceInput, '13.99');

    // Save changes
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/food/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mockFoodItem,
          price: 13.99
        })
      });
    });

    // Should show success message
    expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
  });

  it('should cancel edit and return to list view', async () => {
    const user = userEvent.setup();

    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Edit button
    const editButton = screen.getByTestId(`edit-${mockFoodItem.id}`);
    await user.click(editButton);

    // Click Cancel button
    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    // Should return to list view
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Caesar Salad')).not.toBeInTheDocument();
    });
  });
});