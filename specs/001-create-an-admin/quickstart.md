# Quickstart: Admin Food Management

## Setup Prerequisites

1. **Start the development environment**:
   ```bash
   npm run dev    # Next.js development server (http://localhost:3000)
   npm run mock   # JSON Server API (http://localhost:3001)
   ```

2. **Navigate to admin interface**: Open http://localhost:3000/admin

## Integration Test Scenarios

### Scenario 1: Add New Food Item
**Given** administrator visits /admin
**When** they click "Add New Item"
**Then** form appears with empty fields

**When** they fill out all required fields:
- Name: "Grilled Chicken Sandwich"
- Description: "Juicy grilled chicken breast with lettuce and tomato on brioche bun"
- Price: 14.99
- Category: "entree"
- Image URL: "https://example.com/chicken-sandwich.jpg"
- Available: checked

**And** click "Save"
**Then** new item appears in the food list
**And** API POST request sent to /api/food
**And** success message displayed

### Scenario 2: Edit Existing Food Item
**Given** food items exist in the list
**When** administrator clicks "Edit" on "Caesar Salad"
**Then** form pre-populated with current values

**When** they modify the price from 12.99 to 13.99
**And** click "Save"
**Then** updated item shows new price
**And** API PUT request sent to /api/food/{id}
**And** success message displayed

### Scenario 3: Delete Food Item
**Given** food items exist in the list
**When** administrator clicks "Delete" on "Caesar Salad"
**Then** confirmation dialog appears

**When** they click "Confirm Delete"
**Then** item removed from the list
**And** API DELETE request sent to /api/food/{id}
**And** success message displayed

### Scenario 4: Form Validation Errors
**Given** administrator clicks "Add New Item"
**When** they submit form with missing required fields
**Then** error messages appear next to empty fields:
- "Name is required"
- "Description is required"
- "Price must be positive"
- "Please select a valid category"
- "Please enter a valid URL"

**When** they enter invalid data:
- Name: 150 characters (too long)
- Price: -5.99 (negative)
- Image URL: "not-a-url"

**Then** specific validation errors displayed:
- "Name too long"
- "Price must be positive"
- "Please enter a valid URL"

### Scenario 5: Network Error Handling
**Given** API server is unavailable
**When** administrator tries to save a food item
**Then** error message displayed: "Unable to save item. Please try again."
**And** form remains populated with user's data

## Manual Testing Checklist

### Form Functionality
- [ ] All form fields render correctly
- [ ] Field validation triggers on blur and submit
- [ ] Error messages clear when fields are corrected
- [ ] Form resets after successful submission
- [ ] Cancel button discards changes and returns to list

### List Management
- [ ] Food items load and display correctly
- [ ] Edit button opens form with pre-populated data
- [ ] Delete button shows confirmation dialog
- [ ] List updates immediately after CRUD operations
- [ ] Loading states shown during API calls

### Accessibility
- [ ] All form fields have proper labels
- [ ] Error messages announced by screen readers
- [ ] Keyboard navigation works throughout interface
- [ ] Focus management after form submission
- [ ] Color contrast meets WCAG guidelines

### Performance
- [ ] Form validation responds within 50ms
- [ ] List updates without full page refresh
- [ ] Images load with proper loading states
- [ ] No memory leaks during repeated operations

### Responsive Design
- [ ] Admin interface works on mobile devices
- [ ] Form layouts adapt to different screen sizes
- [ ] Touch targets are appropriately sized
- [ ] Horizontal scrolling not required

## Expected API Calls

### Load Food Items
```
GET /api/food
Response: 200 OK with array of food items
```

### Create Food Item
```
POST /api/food
Body: FoodItemInput (without id)
Response: 201 Created with new FoodItem including id
```

### Update Food Item
```
PUT /api/food/{id}
Body: Complete FoodItem
Response: 200 OK with updated FoodItem
```

### Delete Food Item
```
DELETE /api/food/{id}
Response: 200 OK with success message
```

## Success Criteria

✅ **Feature Complete** when:
- All CRUD operations work correctly
- Form validation prevents invalid submissions
- Error handling provides clear user feedback
- Interface is accessible and responsive
- API contracts match OpenAPI specification
- All integration test scenarios pass
- Manual testing checklist completed
- Performance goals met (form validation <50ms)