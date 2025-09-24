import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodItemForm from './FoodItemForm';
import type { FoodItem } from '../../types/food';

const mockFoodItem: FoodItem = {
  id: '1',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan',
  price: 12.99,
  category: 'appetizer',
  imageUrl: 'https://example.com/caesar.jpg',
  isAvailable: true
};

describe('FoodItemForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty form for new item', () => {
    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Add New Food Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/price/i)).toHaveValue(0);
    expect(screen.getByLabelText(/category/i)).toHaveValue('entree');
    expect(screen.getByLabelText(/image url/i)).toHaveValue('');
    expect(screen.getByLabelText(/available for ordering/i)).toBeChecked();
  });

  it('should render form with initial data for editing', () => {
    render(
      <FoodItemForm
        initialData={mockFoodItem}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Food Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fresh romaine lettuce with parmesan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('appetizer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/caesar.jpg')).toBeInTheDocument();
    expect(screen.getByLabelText(/available for ordering/i)).toBeChecked();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'Grilled Salmon');
    await user.type(screen.getByLabelText(/description/i), 'Fresh Atlantic salmon');
    await user.type(screen.getByLabelText(/price/i), '24.99');
    await user.selectOptions(screen.getByLabelText(/category/i), 'entree');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/salmon.jpg');

    // Submit form
    await user.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon',
        price: 24.99,
        category: 'entree',
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      });
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.click(screen.getByText(/cancel/i));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Submit without filling required fields
    await user.click(screen.getByText(/save/i));

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate price field', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const priceInput = screen.getByLabelText(/price/i);
    await user.clear(priceInput);
    await user.type(priceInput, '-5');
    await user.tab(); // Trigger onBlur validation

    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });

  it('should validate URL field', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const urlInput = screen.getByLabelText(/image url/i);
    await user.type(urlInput, 'not-a-valid-url');
    await user.tab(); // Trigger onBlur validation

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });
  });

  it('should disable form when loading', () => {
    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByLabelText(/price/i)).toBeDisabled();
    expect(screen.getByLabelText(/category/i)).toBeDisabled();
    expect(screen.getByLabelText(/image url/i)).toBeDisabled();
    expect(screen.getByLabelText(/available for ordering/i)).toBeDisabled();
    expect(screen.getByText(/saving.../i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeDisabled();
  });

  it('should show submit error', async () => {
    const failingSubmit = jest.fn().mockRejectedValue(new Error('API Error'));

    render(
      <FoodItemForm
        onSubmit={failingSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill out form with valid data
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Item');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description');
    await userEvent.type(screen.getByLabelText(/price/i), '10.99');
    await userEvent.type(screen.getByLabelText(/image url/i), 'https://example.com/test.jpg');

    // Submit form
    await userEvent.click(screen.getByText(/save/i));

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });

  it('should handle checkbox toggle', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const checkbox = screen.getByLabelText(/available for ordering/i);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should limit name input to 100 characters', () => {
    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveAttribute('maxlength', '100');
  });

  it('should limit description input to 500 characters', () => {
    render(
      <FoodItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const descInput = screen.getByLabelText(/description/i);
    expect(descInput).toHaveAttribute('maxlength', '500');
  });
});