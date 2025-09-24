import { render, screen } from '@testing-library/react';
import Page from './page';

// Mock the components that will be created
jest.mock('../../components/FoodItemList/FoodItemList', () => {
  return function MockFoodItemList() {
    return <div data-testid="food-item-list">Food Item List</div>;
  };
});

jest.mock('../../components/FoodItemForm/FoodItemForm', () => {
  return function MockFoodItemForm() {
    return <div data-testid="food-item-form">Food Item Form</div>;
  };
});

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });
  });

  it('should render admin page with title', async () => {
    render(<Page />);

    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('should render food item list component', async () => {
    render(<Page />);

    expect(screen.getByTestId('food-item-list')).toBeInTheDocument();
  });

  it('should render add new item button', async () => {
    render(<Page />);

    expect(screen.getByText(/add new item/i)).toBeInTheDocument();
  });

  it('should have proper page structure', async () => {
    render(<Page />);

    // Should have main container
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Should have proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});