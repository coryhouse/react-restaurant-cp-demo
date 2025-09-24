import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../lib/theme';
import AdminPage from '../../app/admin/page';
import type { MenuItem } from '../../types/menuItem';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock fetch
global.fetch = jest.fn();

const MockThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('AdminPage', () => {
  const mockPush = jest.fn();
  const mockMenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Test Burger',
      price: 12.99,
      description: 'A delicious test burger'
    },
    {
      id: 2,
      name: 'Test Pizza',
      price: 15.99,
      description: 'A tasty test pizza'
    }
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });

    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/food')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    jest.clearAllMocks();
  });

  it('renders admin page with title', async () => {
    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    expect(screen.getByRole('heading', { name: /admin.*menu management/i })).toBeInTheDocument();
  });

  it('loads and displays menu items on mount', async () => {
    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
      expect(screen.getByText('Test Pizza')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/food');
  });

  it('shows loading state initially', () => {
    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Should show loading skeletons
    expect(screen.getAllByTestId('menu-item-skeleton').length).toBeGreaterThan(0);
  });

  it('handles create new menu item', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes('/api/food') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 3,
            name: 'New Item',
            price: 10.99,
            description: 'New test item'
          })
        });
      }
      if (url.includes('/api/food') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });

    // Fill form with new item data
    await user.type(screen.getByLabelText(/name/i), 'New Item');
    await user.type(screen.getByLabelText(/price/i), '10.99');
    await user.type(screen.getByLabelText(/description/i), 'New test item');

    // Submit form
    await user.click(screen.getByRole('button', { name: /save item/i }));

    // Should make POST request
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Item',
          price: 10.99,
          description: 'New test item'
        })
      });
    });

    // Should show success toast and redirect
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Menu item created successfully!');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles edit existing menu item', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes('/api/food/1') && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 1,
            name: 'Updated Burger',
            price: 13.99,
            description: 'An updated test burger'
          })
        });
      }
      if (url.includes('/api/food') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Wait for menu items to load
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });

    // Click edit on first item
    const editButtons = screen.getAllByLabelText(/edit/i);
    await user.click(editButtons[0]);

    // Form should be pre-populated
    expect(screen.getByDisplayValue('Test Burger')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.99')).toBeInTheDocument();

    // Update the item
    const nameInput = screen.getByDisplayValue('Test Burger');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Burger');

    const priceInput = screen.getByDisplayValue('12.99');
    await user.clear(priceInput);
    await user.type(priceInput, '13.99');

    // Submit the update
    await user.click(screen.getByRole('button', { name: /save item/i }));

    // Should make PUT request
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/food/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          name: 'Updated Burger',
          price: 13.99,
          description: 'A delicious test burger'
        })
      });
    });

    // Should show success toast and redirect
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Menu item updated successfully!');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Validation failed' })
        });
      }
      if (url.includes('/api/food') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });

    // Try to submit form with invalid data
    await user.type(screen.getByLabelText(/name/i), 'Test');
    await user.type(screen.getByLabelText(/price/i), 'invalid');
    await user.type(screen.getByLabelText(/description/i), 'Test');

    await user.click(screen.getByRole('button', { name: /save item/i }));

    // Should show error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save menu item. Please try again.');
    });

    // Should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles network errors', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return Promise.reject(new Error('Network error'));
      }
      if (url.includes('/api/food') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/price/i), '10.99');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    await user.click(screen.getByRole('button', { name: /save item/i }));

    // Should show error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save menu item. Please try again.');
    });
  });

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup();

    // Mock slow API response
    (fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === 'POST') {
        return new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ id: 3, name: 'New Item', price: 10.99, description: 'Test' })
          }), 1000)
        );
      }
      if (url.includes('/api/food') && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMenuItems)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MockThemeWrapper>
        <AdminPage />
      </MockThemeWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
    });

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/price/i), '10.99');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    await user.click(screen.getByRole('button', { name: /save item/i }));

    // Should show loading state
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });
});