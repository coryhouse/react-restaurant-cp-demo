import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodItemCard from './FoodItemCard';
import type { FoodItem } from '../../types/food';

const mockFoodItem: FoodItem = {
  id: '1',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan cheese and croutons in a classic Caesar dressing',
  price: 12.99,
  category: 'appetizer',
  imageUrl: 'https://example.com/caesar.jpg',
  isAvailable: true
};

const unavailableItem: FoodItem = {
  ...mockFoodItem,
  id: '2',
  isAvailable: false
};

describe('FoodItemCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleAvailability = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render food item information', () => {
    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText(/fresh romaine lettuce/i)).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Appetizer')).toBeInTheDocument();
  });

  it('should display food item image', () => {
    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const image = screen.getByAltText('Caesar Salad');
    expect(image).toHaveAttribute('src', 'https://example.com/caesar.jpg');
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByTestId(`edit-${mockFoodItem.id}`));

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByTestId(`delete-${mockFoodItem.id}`));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('should show availability toggle when provided', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleAvailability={mockOnToggleAvailability}
      />
    );

    const toggleButton = screen.getByTitle('Mark as unavailable');
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    expect(mockOnToggleAvailability).toHaveBeenCalled();
  });

  it('should not show availability toggle when not provided', () => {
    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByTitle(/mark as/i)).not.toBeInTheDocument();
  });

  it('should show unavailable state for unavailable items', () => {
    render(
      <FoodItemCard
        item={unavailableItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleAvailability={mockOnToggleAvailability}
      />
    );

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByTitle('Mark as available')).toBeInTheDocument();
  });

  it('should format price correctly', () => {
    const expensiveItem: FoodItem = {
      ...mockFoodItem,
      price: 1234.56
    };

    render(
      <FoodItemCard
        item={expensiveItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('should display correct category colors', () => {
    const categories: Array<{ category: FoodItem['category']; label: string }> = [
      { category: 'appetizer', label: 'Appetizer' },
      { category: 'entree', label: 'Entree' },
      { category: 'dessert', label: 'Dessert' },
      { category: 'beverage', label: 'Beverage' },
      { category: 'side', label: 'Side' }
    ];

    categories.forEach(({ category, label }) => {
      const item: FoodItem = { ...mockFoodItem, category };
      const { unmount } = render(
        <FoodItemCard
          item={item}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('should truncate long descriptions', () => {
    const longDescriptionItem: FoodItem = {
      ...mockFoodItem,
      description: 'This is a very long description that should be truncated to show only the first few lines and then show an ellipsis to indicate that there is more content that is not visible in the card view'
    };

    render(
      <FoodItemCard
        item={longDescriptionItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const description = screen.getByText(/this is a very long description/i);
    expect(description).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    });
  });

  it('should have proper styling for unavailable items', () => {
    const { container } = render(
      <FoodItemCard
        item={unavailableItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = container.querySelector('[class*="MuiCard-root"]');
    expect(card).toHaveStyle({ opacity: 0.7 });
  });

  it('should handle image load errors with fallback', () => {
    render(
      <FoodItemCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const image = screen.getByAltText('Caesar Salad') as HTMLImageElement;

    // Simulate image error
    const errorEvent = new Event('error');
    Object.defineProperty(errorEvent, 'target', {
      value: image,
      writable: false
    });

    image.dispatchEvent(errorEvent);

    expect(image.src).toContain('placeholder');
  });
});