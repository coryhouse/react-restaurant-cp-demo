import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodItemList from './FoodItemList';
import type { FoodItem } from '../../types/food';

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan',
    price: 12.99,
    category: 'appetizer',
    imageUrl: 'https://example.com/caesar.jpg',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs',
    price: 24.99,
    category: 'entree',
    imageUrl: 'https://example.com/salmon.jpg',
    isAvailable: false
  }
];

describe('FoodItemList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleAvailability = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of food items', () => {
    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleAvailability={mockOnToggleAvailability}
      />
    );

    expect(screen.getByText('Menu Items (2)')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Grilled Salmon')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <FoodItemList
        items={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(
      <FoodItemList
        items={[]}
        error="Failed to load items"
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Failed to load items')).toBeInTheDocument();
  });

  it('should show empty state when no items', () => {
    render(
      <FoodItemList
        items={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No food items found')).toBeInTheDocument();
    expect(screen.getByText('Add your first menu item to get started.')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByTestId('edit-1'));

    expect(mockOnEdit).toHaveBeenCalledWith(mockFoodItems[0]);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByTestId('delete-1'));

    expect(mockOnDelete).toHaveBeenCalledWith(mockFoodItems[0]);
  });

  it('should call onToggleAvailability when toggle button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleAvailability={mockOnToggleAvailability}
      />
    );

    const toggleButtons = screen.getAllByTitle(/mark as/i);
    await user.click(toggleButtons[0]);

    expect(mockOnToggleAvailability).toHaveBeenCalledWith(mockFoodItems[0]);
  });

  it('should not show toggle button when onToggleAvailability is not provided', () => {
    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByTitle(/mark as/i)).not.toBeInTheDocument();
  });

  it('should render items in grid layout', () => {
    render(
      <FoodItemList
        items={mockFoodItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const gridContainer = screen.getByText('Menu Items (2)').parentElement?.querySelector('[class*="MuiGrid2-container"]');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should display correct item count', () => {
    render(
      <FoodItemList
        items={[mockFoodItems[0]]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Menu Items (1)')).toBeInTheDocument();
  });
});