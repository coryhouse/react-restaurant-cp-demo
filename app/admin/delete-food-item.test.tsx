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

describe('Delete Food Item Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockFoodItem]
    });
  });

  it('should show confirmation dialog when Delete is clicked', async () => {
    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Delete button
    const deleteButton = screen.getByTestId(`delete-${mockFoodItem.id}`);
    fireEvent.click(deleteButton);

    // Should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });
  });

  it('should delete item when confirmed', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockFoodItem]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Food item deleted successfully', id: '1' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [] // Empty list after deletion
      });

    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Delete button
    const deleteButton = screen.getByTestId(`delete-${mockFoodItem.id}`);
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText(/confirm delete/i);
    await user.click(confirmButton);

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/food/1', {
        method: 'DELETE'
      });
    });

    // Should show success message
    expect(screen.getByText(/deleted successfully/i)).toBeInTheDocument();

    // Item should be removed from list
    expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
  });

  it('should cancel deletion when Cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Delete button
    const deleteButton = screen.getByTestId(`delete-${mockFoodItem.id}`);
    await user.click(deleteButton);

    // Cancel deletion
    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    // Dialog should be closed
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();

    // Item should still be in list
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();

    // No API call should be made
    expect(fetch).toHaveBeenCalledTimes(1); // Only initial load
  });

  it('should handle delete errors gracefully', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockFoodItem]
      })
      .mockRejectedValueOnce(new Error('Network error'));

    render(<Page />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    // Click Delete button
    const deleteButton = screen.getByTestId(`delete-${mockFoodItem.id}`);
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText(/confirm delete/i);
    await user.click(confirmButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Item should still be in list
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
  });
});