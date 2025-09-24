import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('/api/food API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/food', () => {
    it('should return list of food items', async () => {
      const mockFoodItems = [
        {
          id: '1',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan',
          price: 12.99,
          category: 'appetizer',
          imageUrl: 'https://example.com/caesar.jpg',
          isAvailable: true
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFoodItems
      });

      const request = new NextRequest('http://localhost:3000/api/food');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockFoodItems);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const request = new NextRequest('http://localhost:3000/api/food');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/food', () => {
    it('should create new food item with valid data', async () => {
      const newFoodItem = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs',
        price: 24.99,
        category: 'entree',
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const createdItem = { id: '2', ...newFoodItem };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdItem
      });

      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: JSON.stringify(newFoodItem),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdItem);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        price: -5, // Invalid: negative price
        category: 'invalid' // Invalid: not in enum
      };

      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});