import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../lib/theme';
import { MenuItemForm } from '../../app/components/MenuItemForm';
import type { MenuItem } from '../../types/menuItem';

// Mock form component wrapper
const MockThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('MenuItemForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  it('renders form with empty fields in create mode', () => {
    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/price/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /save item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('pre-populates form with initial data in edit mode', () => {
    const initialData: MenuItem = {
      id: 1,
      name: 'Test Burger',
      price: 12.99,
      description: 'A delicious test burger'
    };

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} initialData={initialData} />
      </MockThemeWrapper>
    );

    expect(screen.getByDisplayValue('Test Burger')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A delicious test burger')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /save item/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    // Should not call onSubmit with invalid data
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates price field correctly', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    const priceInput = screen.getByLabelText(/price/i);

    // Test negative price
    await user.type(priceInput, '-5.99');
    await user.tab(); // Trigger validation

    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
    });

    // Clear and test invalid format
    await user.clear(priceInput);
    await user.type(priceInput, 'abc');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/price must be a valid number/i)).toBeInTheDocument();
    });

    // Test too many decimal places
    await user.clear(priceInput);
    await user.type(priceInput, '12.999');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/price must have at most 2 decimal places/i)).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    // Fill form with valid data
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/price/i), '15.99');
    await user.type(screen.getByLabelText(/description/i), 'A test item description');

    // Submit form
    await user.click(screen.getByRole('button', { name: /save item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Item',
        price: '15.99',
        description: 'A test item description'
      });
    });
  });

  it('handles form submission loading state', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} isSubmitting={true} />
      </MockThemeWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    // Check for required attributes
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/price/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/description/i)).toHaveAttribute('required');

    // Check for proper ARIA labels
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/price/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/description/i)).toHaveAttribute('aria-required', 'true');
  });

  it('shows custom submit button text', () => {
    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} submitButtonText="Update Item" />
      </MockThemeWrapper>
    );

    expect(screen.getByRole('button', { name: /update item/i })).toBeInTheDocument();
  });

  it('validates field length constraints', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemForm {...defaultProps} />
      </MockThemeWrapper>
    );

    // Test name too long
    const longName = 'a'.repeat(101);
    await user.type(screen.getByLabelText(/name/i), longName);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name must be less than 100 characters/i)).toBeInTheDocument();
    });

    // Test description too long
    const longDescription = 'a'.repeat(501);
    await user.type(screen.getByLabelText(/description/i), longDescription);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/description must be less than 500 characters/i)).toBeInTheDocument();
    });
  });
});