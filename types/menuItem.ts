/**
 * Core data types for menu item management
 */

/**
 * MenuItem interface - represents a menu item in the database
 */
export interface MenuItem {
  /** Primary key, auto-generated for new items */
  id: number;
  /** Item name - required, 1-100 characters */
  name: string;
  /** Item price - required, positive decimal (0.01-999.99) */
  price: number;
  /** Item description - required, 1-500 characters */
  description: string;
}

/**
 * Form data interface for menu item input
 */
export interface MenuItemFormData {
  /** Input field value for item name */
  name: string;
  /** String input for price, converted to number after validation */
  price: string;
  /** Textarea input value for description */
  description: string;
}

/**
 * Form validation errors interface
 */
export interface MenuItemFormErrors {
  /** Name field validation error */
  name?: string;
  /** Price field validation error */
  price?: string;
  /** Description field validation error */
  description?: string;
  /** General submission error */
  submit?: string;
}

/**
 * API request types
 */

/** Request body for creating a new menu item */
export interface CreateMenuItemRequest {
  name: string;
  price: number;
  description: string;
}

/** Response body for created menu item */
export interface CreateMenuItemResponse extends MenuItem {}

/** Request body for updating an existing menu item */
export interface UpdateMenuItemRequest extends MenuItem {}

/** Response body for updated menu item */
export interface UpdateMenuItemResponse extends MenuItem {}

/**
 * API error response interface
 */
export interface APIErrorResponse {
  /** Error category/type */
  error: string;
  /** Human-readable message */
  message?: string;
  /** Field-specific validation errors */
  details?: Record<string, string>;
}

/**
 * Component prop interfaces
 */

/** Props for MenuItemForm component */
export interface MenuItemFormProps {
  /** Initial data for edit mode */
  initialData?: MenuItem;
  /** Form submission handler */
  onSubmit: (data: MenuItemFormData) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
  /** Submission loading state */
  isSubmitting?: boolean;
  /** Custom submit button text */
  submitButtonText?: string;
}

/** Props for MenuItemList component */
export interface MenuItemListProps {
  /** Array of menu items to display */
  items: MenuItem[];
  /** Edit button click handler */
  onEdit: (item: MenuItem) => void;
  /** Delete button click handler (optional) */
  onDelete?: (id: number) => void;
  /** Loading state for the list */
  isLoading?: boolean;
}

/**
 * State management interfaces
 */

/** Admin page state interface */
export interface AdminPageState {
  /** Current menu items list */
  menuItems: MenuItem[];
  /** Loading state for initial data fetch */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Currently editing item (null for create mode) */
  editingItem: MenuItem | null;
  /** Whether to show the add form */
  showAddForm: boolean;
}

/** Form component state interface */
export interface FormState {
  /** Current form data */
  data: MenuItemFormData;
  /** Validation errors */
  errors: MenuItemFormErrors;
  /** Form loading state */
  isLoading: boolean;
  /** Form dirty state (has unsaved changes) */
  isDirty: boolean;
  /** Form submission state */
  isSubmitting: boolean;
}