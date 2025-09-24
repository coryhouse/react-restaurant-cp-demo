# Quickstart Guide: Admin Food Management

## Overview
This guide provides step-by-step instructions for implementing the admin food management feature using Tanstack Form, Zod validation, Material UI components, Sonner toasts, and comprehensive testing.

## Prerequisites
- Node.js and npm installed
- Existing React Restaurant Demo project setup
- Basic familiarity with TypeScript and React

## Phase 1: Dependencies Installation

### Install Required Packages
```bash
# Form management and validation
npm install @tanstack/react-form zod

# UI Components
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Toast notifications
npm install sonner

# Testing dependencies
npm install --save-dev playwright @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Initialize Playwright
```bash
npx playwright install
```

## Phase 2: API Extension

### 1. Extend Food API Route
Update `app/api/food/route.ts`:
```typescript
// Add POST method handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation logic
    const validatedData = MenuItemSchema.parse(body);

    // Forward to json-server
    const origin = process.env.JSON_SERVER_ORIGIN ?? "http://localhost:3001";
    const res = await fetch(`${origin}/menuItems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData)
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to create item" }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

### 2. Add PUT Method Handler
```typescript
export async function PUT(request: Request) {
  // Similar implementation for updates
  // Include ID validation and existence checks
}
```

## Phase 3: Core Components

### 1. Create Validation Schema
Create `lib/validation/menuItem.ts`:
```typescript
import { z } from 'zod';

export const MenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Invalid price')
    .refine((val) => Number(val) > 0, 'Price must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long')
});
```

### 2. Create Form Component
Create `app/components/MenuItemForm.tsx`:
```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { TextField, Button, Stack } from '@mui/material';
import { MenuItemSchema } from '../lib/validation/menuItem';

export function MenuItemForm({ onSubmit, initialData, isSubmitting }) {
  const form = useForm({
    defaultValues: initialData || { name: '', price: '', description: '' },
    onSubmit: async ({ value }) => onSubmit(value),
    validatorAdapter: zodValidator(),
    validators: {
      onChange: MenuItemSchema
    }
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <Stack spacing={3}>
        <form.Field name="name">
          {(field) => (
            <TextField
              required
              fullWidth
              label="Item Name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        {/* Similar fields for price and description */}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Item'}
        </Button>
      </Stack>
    </form>
  );
}
```

### 3. Create Admin Page
Create `app/admin/page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { toast } from 'sonner';
import { MenuItemForm } from '../components/MenuItemForm';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem ? `/api/food/${editingItem.id}` : '/api/food';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          ...(editingItem && { id: editingItem.id })
        })
      });

      if (response.ok) {
        toast.success(`Menu item ${editingItem ? 'updated' : 'created'} successfully!`);
        router.push('/');
      } else {
        throw new Error('Failed to save item');
      }
    } catch (error) {
      toast.error('Failed to save menu item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin - Menu Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MenuItemForm
            onSubmit={handleSubmit}
            initialData={editingItem}
            isSubmitting={isSubmitting}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Menu items list */}
        </Grid>
      </Grid>
    </Container>
  );
}
```

## Phase 4: Toast Integration

### 1. Add Toast Provider
Update `app/layout.tsx`:
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

## Phase 5: Testing Setup

### 1. Component Tests
Create `__tests__/components/MenuItemForm.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuItemForm } from '../../app/components/MenuItemForm';

test('validates required fields', async () => {
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();

  render(<MenuItemForm onSubmit={mockOnSubmit} />);

  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(mockOnSubmit).not.toHaveBeenCalled();
});
```

### 2. E2E Tests
Create `tests/admin.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('admin can create new menu item', async ({ page }) => {
  await page.goto('/admin');

  await page.fill('[data-testid="name-input"]', 'Test Item');
  await page.fill('[data-testid="price-input"]', '12.99');
  await page.fill('[data-testid="description-input"]', 'Test description');

  await page.click('[data-testid="submit-button"]');

  await expect(page).toHaveURL('/');
  await expect(page.getByText(/created successfully/i)).toBeVisible();
});
```

## Phase 6: Development Commands

### Start Development Servers
```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: json-server mock API
npm run mock
```

### Run Tests
```bash
# Component tests
npm test

# E2E tests
npx playwright test

# Run both with coverage
npm run test:all
```

### Build and Lint
```bash
npm run build
npm run lint
```

## Troubleshooting

### Common Issues
1. **Material UI SSR Warnings**: Add proper theme provider setup
2. **Form Validation Not Working**: Ensure zodValidator is properly imported
3. **API Errors**: Check json-server is running on port 3001
4. **Toast Not Showing**: Verify Toaster component is in layout

### Debug Commands
```bash
# Check API endpoints
curl -X GET http://localhost:3000/api/food

# Test form data
curl -X POST http://localhost:3000/api/food \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":12.99,"description":"Test desc"}'
```

## Success Criteria Checklist
- [ ] Admin page accessible at `/admin` route
- [ ] Form validates all required fields
- [ ] New items can be created via API
- [ ] Existing items can be edited
- [ ] Success toast appears after save
- [ ] Redirects to homepage after save
- [ ] All tests passing (80%+ coverage)
- [ ] Accessibility requirements met
- [ ] Performance targets achieved