import { z } from 'zod';

export const FoodItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  price: z.number().positive('Price must be positive').multipleOf(0.01, 'Price must have at most 2 decimal places'),
  category: z.enum(['appetizer', 'entree', 'dessert', 'beverage', 'side']),
  imageUrl: z.string().url('Please enter a valid URL'),
  isAvailable: z.boolean().default(true)
});

export const FoodItemFormSchema = FoodItemSchema.omit({ id: true });

export const FoodItemCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  price: z.number().positive('Price must be positive').multipleOf(0.01, 'Price must have at most 2 decimal places'),
  category: z.enum(['appetizer', 'entree', 'dessert', 'beverage', 'side']),
  imageUrl: z.string().url('Please enter a valid URL'),
  isAvailable: z.boolean().default(true)
});

export const FoodItemUpdateSchema = FoodItemSchema;

// Type exports inferred from schemas
export type FoodItem = z.infer<typeof FoodItemSchema>;
export type FoodItemForm = z.infer<typeof FoodItemFormSchema>;
export type FoodItemCreate = z.infer<typeof FoodItemCreateSchema>;
export type FoodItemUpdate = z.infer<typeof FoodItemUpdateSchema>;