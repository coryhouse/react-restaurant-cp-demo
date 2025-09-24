# UI Components Contract Specification

## Component Architecture

### AdminPage Component
**Purpose**: Main container for admin food management interface

**Props Interface**:
```typescript
interface AdminPageProps {
  // No props - uses internal state management
}
```

**Responsibilities**:
- Route handling for `/admin`
- Menu items data fetching and management
- Form state coordination
- Toast notification integration

**State Management**:
```typescript
interface AdminPageState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  editingItem: MenuItem | null;
  showAddForm: boolean;
}
```

### MenuItemForm Component
**Purpose**: Reusable form for creating/editing menu items

**Props Interface**:
```typescript
interface MenuItemFormProps {
  initialData?: MenuItem;           // For edit mode
  onSubmit: (data: MenuItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}
```

**Features**:
- Tanstack Form integration
- Zod validation with real-time feedback
- Material UI form components
- Accessibility compliance (WCAG 2.1 AA)
- Loading states during submission

### MenuItemList Component
**Purpose**: Display existing menu items with edit/delete actions

**Props Interface**:
```typescript
interface MenuItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete?: (id: number) => void;  // Optional for future delete functionality
  isLoading?: boolean;
}
```

**Features**:
- Responsive grid/list layout
- Item cards with action buttons
- Loading skeleton states
- Empty state handling

### Toast Integration
**Purpose**: User feedback for CRUD operations

**Implementation**:
```typescript
import { toast } from 'sonner';

// Success notifications
toast.success('Menu item created successfully!');
toast.success('Menu item updated successfully!');

// Error notifications
toast.error('Failed to save menu item. Please try again.');
toast.error('Network error. Please check your connection.');
```

## Material UI Component Specifications

### Form Components
**TextField Configuration**:
```typescript
<TextField
  required
  fullWidth
  variant="outlined"
  error={!!fieldError}
  helperText={fieldError}
  aria-describedby={fieldError ? `${name}-error` : undefined}
/>
```

**Button Configuration**:
```typescript
<Button
  type="submit"
  variant="contained"
  disabled={isSubmitting}
  startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
  aria-label={submitButtonText}
>
  {isSubmitting ? 'Saving...' : submitButtonText}
</Button>
```

### Layout Components
**Container Setup**:
```typescript
<Container maxWidth="lg" sx={{ py: 4 }}>
  <Typography variant="h4" component="h1" gutterBottom>
    Admin - Menu Management
  </Typography>
  {/* Content */}
</Container>
```

**Grid Layout**:
```typescript
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {/* Form */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* Menu items list */}
  </Grid>
</Grid>
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Color Contrast**: Minimum 4.5:1 contrast ratio
4. **Focus Management**: Visible focus indicators and logical tab order

### Implementation Specifics
```typescript
// Form field accessibility
<TextField
  id={`menuitem-${fieldName}`}
  label={fieldLabel}
  required
  aria-required="true"
  aria-describedby={hasError ? `${fieldName}-error` : undefined}
  error={hasError}
  helperText={errorMessage}
/>

// Error message accessibility
<FormHelperText id={`${fieldName}-error`} error>
  {errorMessage}
</FormHelperText>

// Button accessibility
<Button
  aria-label="Save menu item"
  disabled={isSubmitting}
  aria-disabled={isSubmitting}
>
  Save Item
</Button>
```

## Responsive Design Contract

### Breakpoints (Material UI)
- `xs`: 0px and up (mobile)
- `sm`: 600px and up (tablet)
- `md`: 900px and up (desktop)
- `lg`: 1200px and up (large desktop)

### Layout Behavior
- **Mobile (xs-sm)**: Single column, stacked layout
- **Tablet (md)**: Two column layout with form and list side-by-side
- **Desktop (lg+)**: Wider spacing, larger form elements

### Component Responsiveness
```typescript
const responsive = {
  xs: { width: '100%', mb: 2 },
  md: { width: '48%', mb: 0 }
};

<Box sx={responsive}>
  <MenuItemForm />
</Box>
```

## Performance Requirements

### Bundle Size Optimization
- Import only required Material UI components
- Use tree-shaking for unused code elimination
- Lazy load admin page components

### Rendering Performance
- Memoize expensive calculations
- Optimize re-render cycles with React.memo
- Use efficient key props for list rendering

### Example Optimizations
```typescript
import { TextField, Button, Container } from '@mui/material';
// Instead of: import * from '@mui/material';

const MemoizedMenuItemForm = React.memo(MenuItemForm);
const MemoizedMenuItemList = React.memo(MenuItemList);
```

## Testing Contracts

### Component Testing (React Testing Library)
```typescript
// Form submission testing
test('submits form with valid data', async () => {
  const mockOnSubmit = jest.fn();
  render(<MenuItemForm onSubmit={mockOnSubmit} />);

  await user.type(screen.getByLabelText(/name/i), 'Test Item');
  await user.type(screen.getByLabelText(/price/i), '12.99');
  await user.type(screen.getByLabelText(/description/i), 'Test description');

  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(mockOnSubmit).toHaveBeenCalledWith({
    name: 'Test Item',
    price: '12.99',
    description: 'Test description'
  });
});
```

### End-to-End Testing (Playwright)
```typescript
test('admin can create new menu item', async ({ page }) => {
  await page.goto('/admin');

  await page.fill('[data-testid="name-input"]', 'E2E Test Item');
  await page.fill('[data-testid="price-input"]', '15.99');
  await page.fill('[data-testid="description-input"]', 'Created via E2E test');

  await page.click('[data-testid="submit-button"]');

  await expect(page).toHaveURL('/');
  await expect(page.getByText('Menu item created successfully!')).toBeVisible();
});
```