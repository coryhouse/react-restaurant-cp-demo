# Data Model: Admin Food Management

## Core Data Types

### MenuItem (Database/API)
```typescript
interface MenuItem {
  id: number;           // Primary key, auto-generated for new items
  name: string;         // Required, 1-100 characters
  price: number;        // Required, positive decimal (0.01-999.99)
  description: string;  // Required, 1-500 characters
}
```

### Form Data Types
```typescript
interface MenuItemFormData {
  name: string;         // Input field value
  price: string;        // String input, converted to number after validation
  description: string;  // Textarea input value
}

interface MenuItemFormErrors {
  name?: string;
  price?: string;
  description?: string;
  submit?: string;      // General submission errors
}
```

### API Request/Response Types
```typescript
// Create new menu item
interface CreateMenuItemRequest {
  name: string;
  price: number;
  description: string;
}

interface CreateMenuItemResponse {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Update existing menu item
interface UpdateMenuItemRequest {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface UpdateMenuItemResponse {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Error responses
interface APIErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, string>;
}
```

## Zod Validation Schemas

### Menu Item Validation
```typescript
import { z } from 'zod';

export const MenuItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Price must be a valid number')
    .refine((val) => Number(val) > 0, 'Price must be greater than 0')
    .refine((val) => Number(val) <= 999.99, 'Price must be less than $1000')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must have at most 2 decimal places'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .trim()
});

export type MenuItemFormData = z.infer<typeof MenuItemSchema>;

// Transform for API submission
export const transformToMenuItem = (formData: MenuItemFormData): Omit<MenuItem, 'id'> => ({
  name: formData.name,
  price: Number(formData.price),
  description: formData.description
});
```

## Component State Types

### Form Component State
```typescript
interface FormState {
  data: MenuItemFormData;
  errors: MenuItemFormErrors;
  isLoading: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

interface AdminPageState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  editingItem: MenuItem | null;
  showForm: boolean;
}
```

## API Contract Types

### HTTP Methods and Endpoints
```typescript
// GET /api/food - List all menu items
type GetMenuItemsResponse = MenuItem[];

// POST /api/food - Create new menu item
type CreateMenuItemEndpoint = {
  method: 'POST';
  body: CreateMenuItemRequest;
  response: CreateMenuItemResponse | APIErrorResponse;
};

// PUT /api/food/[id] - Update existing menu item
type UpdateMenuItemEndpoint = {
  method: 'PUT';
  params: { id: string };
  body: UpdateMenuItemRequest;
  response: UpdateMenuItemResponse | APIErrorResponse;
};

// DELETE /api/food/[id] - Delete menu item (if needed)
type DeleteMenuItemEndpoint = {
  method: 'DELETE';
  params: { id: string };
  response: { success: boolean } | APIErrorResponse;
};
```

## Database Schema (json-server)

### Current Structure (db.json)
```json
{
  "menuItems": [
    {
      "id": 1,
      "name": "Classic Burger",
      "price": 12.99,
      "description": "Juicy beef patty with lettuce, tomato, and our special sauce"
    }
  ]
}
```

### Constraints and Validation Rules
1. **ID Field**: Auto-incremented by json-server
2. **Name Field**: Required, unique preferred but not enforced
3. **Price Field**: Positive decimal, stored as number
4. **Description Field**: Required, no HTML content allowed

## Type Safety Strategy
1. **Runtime Validation**: Zod schemas validate all user inputs
2. **Compile-time Safety**: TypeScript interfaces ensure type consistency
3. **API Validation**: Server-side validation mirrors client-side rules
4. **Form Integration**: Tanstack Form + Zod resolver provides seamless validation