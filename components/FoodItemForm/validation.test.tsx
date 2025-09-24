import { FoodItemFormSchema, FoodItemCreateSchema } from '../../lib/schemas/food';
import type { FoodItem } from '../../types/food';

describe('Food Item Form Validation', () => {
  describe('FoodItemFormSchema', () => {
    it('should validate valid food item data', () => {
      const validData = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs and lemon',
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        description: 'Fresh Atlantic salmon',
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('should reject name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const invalidData = {
        name: longName,
        description: 'Fresh Atlantic salmon',
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name too long');
      }
    });

    it('should reject empty description', () => {
      const invalidData = {
        name: 'Grilled Salmon',
        description: '',
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description is required');
      }
    });

    it('should reject description longer than 500 characters', () => {
      const longDescription = 'A'.repeat(501);
      const invalidData = {
        name: 'Grilled Salmon',
        description: longDescription,
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description too long');
      }
    });

    it('should reject negative price', () => {
      const invalidData = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon',
        price: -5.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be positive');
      }
    });

    it('should reject price with more than 2 decimal places', () => {
      const invalidData = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon',
        price: 24.999,
        category: 'entree' as const,
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must have at most 2 decimal places');
      }
    });

    it('should reject invalid category', () => {
      const invalidData = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon',
        price: 24.99,
        category: 'invalid' as FoodItem['category'],
        imageUrl: 'https://example.com/salmon.jpg',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a valid category');
      }
    });

    it('should reject invalid URL', () => {
      const invalidData = {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon',
        price: 24.99,
        category: 'entree' as const,
        imageUrl: 'not-a-valid-url',
        isAvailable: true
      };

      const result = FoodItemFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid URL');
      }
    });

    it('should validate all valid categories', () => {
      const categories = ['appetizer', 'entree', 'dessert', 'beverage', 'side'] as const;

      categories.forEach(category => {
        const validData = {
          name: 'Test Item',
          description: 'Test description',
          price: 10.99,
          category,
          imageUrl: 'https://example.com/test.jpg',
          isAvailable: true
        };

        const result = FoodItemFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('should default isAvailable to true when not provided', () => {
      const dataWithoutAvailability = {
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'entree' as const,
        imageUrl: 'https://example.com/test.jpg'
      };

      const result = FoodItemCreateSchema.safeParse(dataWithoutAvailability);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailable).toBe(true);
      }
    });
  });
});