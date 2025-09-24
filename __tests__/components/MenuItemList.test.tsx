import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../lib/theme';
import { MenuItemList } from '../../app/components/MenuItemList';
import type { MenuItem } from '../../types/menuItem';

// Mock theme wrapper
const MockThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('MenuItemList', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  const sampleMenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Classic Burger',
      price: 12.99,
      description: 'Juicy beef patty with lettuce and tomato'
    },
    {
      id: 2,
      name: 'Veggie Pizza',
      price: 15.99,
      description: 'Fresh vegetables on crispy crust'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      price: 9.99,
      description: 'Crisp romaine with parmesan and croutons'
    }
  ];

  const defaultProps = {
    items: sampleMenuItems,
    onEdit: mockOnEdit,
  };

  it('renders list of menu items correctly', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    // Check that all items are displayed
    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Juicy beef patty with lettuce and tomato')).toBeInTheDocument();

    expect(screen.getByText('Veggie Pizza')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('Fresh vegetables on crispy crust')).toBeInTheDocument();

    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Crisp romaine with parmesan and croutons')).toBeInTheDocument();
  });

  it('displays edit buttons for each item', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    const editButtons = screen.getAllByLabelText(/edit/i);
    expect(editButtons).toHaveLength(3);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    const editButtons = screen.getAllByLabelText(/edit/i);
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(sampleMenuItems[0]);
  });

  it('displays delete buttons when onDelete prop is provided', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} onDelete={mockOnDelete} />
      </MockThemeWrapper>
    );

    const deleteButtons = screen.getAllByLabelText(/delete/i);
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} onDelete={mockOnDelete} />
      </MockThemeWrapper>
    );

    const deleteButtons = screen.getAllByLabelText(/delete/i);
    await user.click(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(sampleMenuItems[1].id);
  });

  it('displays empty state when no items provided', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} items={[]} />
      </MockThemeWrapper>
    );

    expect(screen.getByText(/no menu items found/i)).toBeInTheDocument();
    expect(screen.getByText(/start by adding your first menu item/i)).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} isLoading={true} />
      </MockThemeWrapper>
    );

    // Check for loading skeleton components
    const skeletons = screen.getAllByTestId('menu-item-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('formats prices correctly', () => {
    const itemsWithVariousPrices: MenuItem[] = [
      { id: 1, name: 'Cheap Item', price: 5, description: 'Test' },
      { id: 2, name: 'Regular Item', price: 12.5, description: 'Test' },
      { id: 3, name: 'Expensive Item', price: 99.99, description: 'Test' },
    ];

    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} items={itemsWithVariousPrices} />
      </MockThemeWrapper>
    );

    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('$12.50')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('has proper keyboard accessibility', async () => {
    const user = userEvent.setup();

    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    const editButtons = screen.getAllByLabelText(/edit/i);

    // Tab to first edit button
    await user.tab();
    expect(editButtons[0]).toHaveFocus();

    // Enter should trigger edit
    await user.keyboard('{Enter}');
    expect(mockOnEdit).toHaveBeenCalledWith(sampleMenuItems[0]);
  });

  it('displays items in responsive grid layout', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    // Check for Material UI Grid container
    const gridContainer = screen.getByRole('list');
    expect(gridContainer).toHaveClass('MuiGrid-container');
  });

  it('applies hover effects to cards', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    const cards = screen.getAllByRole('listitem');
    cards.forEach(card => {
      expect(card).toHaveStyle({ cursor: 'pointer' });
    });
  });

  it('shows proper item count', () => {
    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} />
      </MockThemeWrapper>
    );

    // Should show 3 items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('handles long descriptions gracefully', () => {
    const itemsWithLongDescription: MenuItem[] = [
      {
        id: 1,
        name: 'Test Item',
        price: 10.99,
        description: 'This is a very long description that should be handled gracefully by the component. '.repeat(10)
      }
    ];

    render(
      <MockThemeWrapper>
        <MenuItemList {...defaultProps} items={itemsWithLongDescription} />
      </MockThemeWrapper>
    );

    // Should still render the item
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
  });
});