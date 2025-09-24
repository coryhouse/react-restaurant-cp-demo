import { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/food/route';

// Mock fetch for json-server responses
global.fetch = jest.fn();

describe('/api/food', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    process.env.JSON_SERVER_ORIGIN = 'http://localhost:3001';
  });

  describe('GET /api/food', () => {
    it('should return menu items from json-server', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Test Burger', price: 12.99, description: 'Test description' }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMenuItems,
      });

      const request = new NextRequest('http://localhost:3000/api/food');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockMenuItems);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/menuItems', {
        cache: 'no-store',
      });
    });

    it('should support query parameters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const request = new NextRequest('http://localhost:3000/api/food?q=burger');
      await GET(request);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/menuItems?q=burger', {
        cache: 'no-store',
      });
    });

    it('should handle json-server errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const request = new NextRequest('http://localhost:3000/api/food');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch from json-server' });
    });
  });

  describe('POST /api/food', () => {
    it('should create a new menu item with valid data', async () => {
      const newItem = { name: 'Test Item', price: 15.99, description: 'Test description' };
      const createdItem = { id: 7, ...newItem };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdItem,
      });

      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: JSON.stringify(newItem),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdItem);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/menuItems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    });

    it('should reject invalid data with validation error', async () => {
      const invalidItem = { name: '', price: -5, description: '' };

      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: JSON.stringify(invalidItem),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('validation');
    });

    it('should handle json-server creation errors', async () => {
      const validItem = { name: 'Test Item', price: 15.99, description: 'Test description' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: JSON.stringify(validItem),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create item' });
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/food', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});