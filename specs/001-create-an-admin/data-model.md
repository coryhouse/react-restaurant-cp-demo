# Data Model: Admin Food Management

## Entities

### Food Item
**Purpose**: Represents a menu item that can be managed by restaurant administrators

**Fields**:
- `id`: string - Unique identifier for the food item
- `name`: string - Display name of the food item (required, max 100 characters)
- `description`: string - Detailed description of the food item (required, max 500 characters)
- `price`: number - Price in dollars (required, positive number with 2 decimal places)
- `category`: string - Food category (required, one of: "appetizer", "entree", "dessert", "beverage", "side")
- `imageUrl`: string - URL to food item image (required, valid HTTP/HTTPS URL)
- `isAvailable`: boolean - Whether item is currently available for ordering (required, defaults to true)

**Validation Rules**:
- All fields are required for form submission
- `name` must be unique across all food items
- `price` must be positive and formatted to 2 decimal places
- `category` must be one of the predefined enum values
- `imageUrl` must be a valid URL format
- `description` cannot be empty or only whitespace

**State Transitions**:
- Create: New food item with all required fields → Saved to database
- Update: Existing food item modified → Updated in database with validation
- Delete: Existing food item → Removed from database permanently
- Toggle availability: `isAvailable` can be toggled without form validation

**Relationships**:
- No direct relationships to other entities in current scope
- Future: May relate to Order Items, Inventory, etc.

## Zod Schema Definition

```typescript
export const FoodItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  price: z.number().positive("Price must be positive").multipleOf(0.01),
  category: z.enum(["appetizer", "entree", "dessert", "beverage", "side"], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  imageUrl: z.string().url("Please enter a valid URL"),
  isAvailable: z.boolean().default(true)
});

export const FoodItemFormSchema = FoodItemSchema.omit({ id: true });
export type FoodItem = z.infer<typeof FoodItemSchema>;
export type FoodItemForm = z.infer<typeof FoodItemFormSchema>;
```

## API Data Contracts

### GET /api/food
**Response**: Array of Food Items
```json
[
  {
    "id": "1",
    "name": "Caesar Salad",
    "description": "Fresh romaine lettuce with parmesan cheese and croutons",
    "price": 12.99,
    "category": "appetizer",
    "imageUrl": "https://example.com/caesar-salad.jpg",
    "isAvailable": true
  }
]
```

### POST /api/food
**Request**: Food Item (without id)
**Response**: Created Food Item with id
```json
{
  "id": "2",
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon with herbs and lemon",
  "price": 24.99,
  "category": "entree",
  "imageUrl": "https://example.com/salmon.jpg",
  "isAvailable": true
}
```

### PUT /api/food/:id
**Request**: Complete Food Item
**Response**: Updated Food Item
```json
{
  "id": "1",
  "name": "Caesar Salad Deluxe",
  "description": "Fresh romaine lettuce with parmesan cheese, croutons, and grilled chicken",
  "price": 15.99,
  "category": "appetizer",
  "imageUrl": "https://example.com/caesar-salad-deluxe.jpg",
  "isAvailable": true
}
```

### DELETE /api/food/:id
**Response**: Success message
```json
{
  "message": "Food item deleted successfully",
  "id": "1"
}
```