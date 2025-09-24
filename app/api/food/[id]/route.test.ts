import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';

// Mock fetch for API testing
global.fetch = jest.fn();

const mockFoodItem = {
  id: '1',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan',
  price: 12.99,
  category: 'appetizer' as const,
  imageUrl: 'https://example.com/caesar.jpg',
  isAvailable: true
};

describe('/api/food/[id] API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/food/[id]', () => {
    it('should return specific food item', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFoodItem
      });

      const request = new NextRequest('http://localhost:3000/api/food/1');
      const response = await GET(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockFoodItem);
    });

    it('should return 404 for non-existent item', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const request = new NextRequest('http://localhost:3000/api/food/999');
      const response = await GET(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/food/[id]', () => {
    it('should update existing food item', async () => {
      const updatedItem = { ...mockFoodItem, price: 13.99 };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedItem
      });

      const request = new NextRequest('http://localhost:3000/api/food/1', {
        method: 'PUT',
        body: JSON.stringify(updatedItem),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.price).toBe(13.99);
    });

    it('should validate update data', async () => {
      const invalidUpdate = {
        ...mockFoodItem,
        name: '', // Invalid: empty name
        price: -10 // Invalid: negative price
      };

      const request = new NextRequest('http://localhost:3000/api/food/1', {
        method: 'PUT',
        body: JSON.stringify(invalidUpdate),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await PUT(request, { params: { id: '1' } });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/food/[id]', () => {
    it('should delete existing food item', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Food item deleted successfully', id: '1' })
      });

      const request = new NextRequest('http://localhost:3000/api/food/1', {
        method: 'DELETE'
      });

      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain('deleted successfully');
      expect(data.id).toBe('1');
    });

    it('should return 404 for non-existent item', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const request = new NextRequest('http://localhost:3000/api/food/999', {
        method: 'DELETE'
      });

      const response = await DELETE(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });
});