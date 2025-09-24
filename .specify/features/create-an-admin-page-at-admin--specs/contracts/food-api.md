# Food API Contract Specification

## Base Configuration
- **Base URL**: `/api/food`
- **Content Type**: `application/json`
- **Authentication**: None (admin access assumed)
- **Rate Limiting**: None

## Endpoints

### GET /api/food
**Purpose**: Retrieve all menu items

**Request**:
- Method: `GET`
- Headers: None required
- Query Parameters:
  - `q` (optional): Full-text search
  - `name_like` (optional): Partial name matching

**Response**:
- Status: `200 OK`
- Body: `MenuItem[]`

**Example**:
```typescript
// Request
GET /api/food

// Response
[
  {
    "id": 1,
    "name": "Classic Burger",
    "price": 12.99,
    "description": "Juicy beef patty with lettuce, tomato, and our special sauce"
  }
]
```

### POST /api/food
**Purpose**: Create new menu item

**Request**:
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: `CreateMenuItemRequest`

**Response**:
- Status: `201 Created` (success)
- Status: `400 Bad Request` (validation error)
- Status: `500 Internal Server Error` (server error)
- Body: `MenuItem` | `APIErrorResponse`

**Example**:
```typescript
// Request
POST /api/food
{
  "name": "Veggie Burger",
  "price": 11.99,
  "description": "Plant-based patty with fresh vegetables"
}

// Success Response (201)
{
  "id": 7,
  "name": "Veggie Burger",
  "price": 11.99,
  "description": "Plant-based patty with fresh vegetables"
}

// Error Response (400)
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": {
    "price": "Price must be a positive number"
  }
}
```

### PUT /api/food/[id]
**Purpose**: Update existing menu item

**Request**:
- Method: `PUT`
- Headers: `Content-Type: application/json`
- Path Parameters: `id` (number) - Menu item ID
- Body: `UpdateMenuItemRequest`

**Response**:
- Status: `200 OK` (success)
- Status: `404 Not Found` (item not found)
- Status: `400 Bad Request` (validation error)
- Status: `500 Internal Server Error` (server error)
- Body: `MenuItem` | `APIErrorResponse`

**Example**:
```typescript
// Request
PUT /api/food/1
{
  "id": 1,
  "name": "Premium Burger",
  "price": 15.99,
  "description": "Premium beef patty with truffle sauce"
}

// Success Response (200)
{
  "id": 1,
  "name": "Premium Burger",
  "price": 15.99,
  "description": "Premium beef patty with truffle sauce"
}

// Error Response (404)
{
  "error": "Not found",
  "message": "Menu item with ID 1 not found"
}
```

## Error Handling Standards

### Error Response Format
```typescript
interface APIErrorResponse {
  error: string;          // Error category/type
  message?: string;       // Human-readable message
  details?: Record<string, string>; // Field-specific errors
}
```

### HTTP Status Codes
- `200 OK`: Successful GET, PUT operations
- `201 Created`: Successful POST operations
- `400 Bad Request`: Invalid input, validation failures
- `404 Not Found`: Resource not found (PUT operations)
- `500 Internal Server Error`: Server-side errors

### Validation Rules
1. **Name**: Required, 1-100 characters, trimmed
2. **Price**: Required, positive number, max 2 decimal places, ≤ 999.99
3. **Description**: Required, 1-500 characters, trimmed
4. **ID**: Required for PUT operations, must exist in database

## Implementation Requirements

### json-server Integration
- Extend existing proxy pattern in `/api/food/route.ts`
- Add POST and PUT method handling
- Maintain compatibility with existing GET functionality
- Preserve query parameter support for filtering

### Constitutional Compliance
- **Input Validation**: All inputs validated server-side
- **Error Handling**: Comprehensive error responses
- **Type Safety**: TypeScript interfaces for all API contracts
- **Security**: Input sanitization to prevent injection attacks

### Performance Considerations
- **Caching**: No caching for POST/PUT operations
- **Validation**: Server-side validation mirrors client-side rules
- **Response Size**: Minimal response payloads
- **Error Reporting**: Structured error responses for debugging