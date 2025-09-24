export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'entree' | 'dessert' | 'beverage' | 'side';
  imageUrl: string;
  isAvailable: boolean;
}

export interface FoodItemFormData {
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'entree' | 'dessert' | 'beverage' | 'side';
  imageUrl: string;
  isAvailable: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}