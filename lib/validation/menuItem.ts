import { z } from 'zod';
import type { MenuItem, MenuItemFormData as MenuItemFormDataType } from '../../types/menuItem';

/**
 * Zod validation schema for menu item form data
 */
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
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      'Price must have at most 2 decimal places'
    ),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .trim()
});

/**
 * Infer TypeScript type from Zod schema
 */
export type MenuItemFormData = z.infer<typeof MenuItemSchema>;

/**
 * Transform form data to MenuItem format for API submission
 */
export const transformToMenuItem = (formData: MenuItemFormData): Omit<MenuItem, 'id'> => ({
  name: formData.name,
  price: Number(formData.price),
  description: formData.description
});

/**
 * Transform MenuItem to form data format
 */
export const transformToFormData = (menuItem: MenuItem): MenuItemFormData => ({
  name: menuItem.name,
  price: menuItem.price.toString(),
  description: menuItem.description
});

/**
 * Validate menu item form data
 * @param data - Form data to validate
 * @returns Validation result with parsed data or errors
 */
export const validateMenuItemFormData = (data: unknown) => {
  return MenuItemSchema.safeParse(data);
};

/**
 * Custom validation helper for Tanstack Form integration
 */
export const createMenuItemValidator = () => {
  return {
    onChange: ({ value }: { value: MenuItemFormDataType }) => {
      const result = MenuItemSchema.safeParse(value);
      if (!result.success) {
        return result.error.message
      }
      return undefined;
    },
    onSubmit: ({ value }: { value: MenuItemFormDataType }) => {
      const result = MenuItemSchema.safeParse(value);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return errors;
      }
      return undefined;
    }
  };
};