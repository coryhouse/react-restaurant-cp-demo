'use client';

import React from 'react';
import { useForm } from '@tanstack/react-form';
import {
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { MenuItemSchema, transformToFormData } from '../../lib/validation/menuItem';
import type { MenuItemFormProps } from '../../types/menuItem';

/**
 * MenuItemForm Component
 * Reusable form for creating and editing menu items
 */
export function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save Item'
}: MenuItemFormProps) {
  // Initialize form with Tanstack Form
  const form = useForm({
    defaultValues: initialData
      ? transformToFormData(initialData)
      : {
          name: '',
          price: '',
          description: ''
        },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    }
  });

  return (
    <Box component="form" onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <Stack spacing={3}>
        <Typography variant="h6" component="h2">
          {initialData ? 'Edit Menu Item' : 'Add New Menu Item'}
        </Typography>

        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = MenuItemSchema.shape.name.safeParse(value);
              return result.success ? undefined : result.error.message;
            }
          }}
        >
          {(field) => (
            <TextField
              label="Item Name"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors[0]}
              disabled={isSubmitting}
              inputProps={{
                'aria-required': true,
                'aria-describedby': field.state.meta.errors.length > 0 ? `name-error` : undefined
              }}
              id="menu-item-name"
              data-testid="name-input"
            />
          )}
        </form.Field>

        {/* Price Field */}
        <form.Field
          name="price"
          validators={{
            onChange: ({ value }) => {
              const result = MenuItemSchema.shape.price.safeParse(value);
              return result.success ? undefined : result.error.message;
            }
          }}
        >
          {(field) => (
            <TextField
              label="Price"
              required
              type="text"
              inputMode="decimal"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors[0] || 'Enter price in dollars (e.g., 12.99)'}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <span style={{ marginRight: 4, color: '#666' }}>$</span>
              }}
              inputProps={{
                'aria-required': true,
                'aria-describedby': field.state.meta.errors.length > 0 ? `price-error` : undefined,
                pattern: '[0-9]+(\\.[0-9]{1,2})?'
              }}
              id="menu-item-price"
              data-testid="price-input"
            />
          )}
        </form.Field>

        {/* Description Field */}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const result = MenuItemSchema.shape.description.safeParse(value);
              return result.success ? undefined : result.error.message;
            }
          }}
        >
          {(field) => (
            <TextField
              label="Description"
              required
              multiline
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors[0] || `${field.state.value.length}/500 characters`}
              disabled={isSubmitting}
              inputProps={{
                'aria-required': true,
                'aria-describedby': field.state.meta.errors.length > 0 ? `description-error` : undefined,
                maxLength: 500
              }}
              id="menu-item-description"
              data-testid="description-input"
            />
          )}
        </form.Field>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            startIcon={<CancelIcon />}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !form.state.isValid}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            aria-label={isSubmitting ? 'Saving menu item' : submitButtonText}
            data-testid="submit-button"
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </Stack>

        {/* Form-level error display */}
        {form.state.errors.length > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
              borderRadius: 1,
              mt: 2
            }}
            role="alert"
            aria-live="polite"
          >
            <Typography variant="body2">
              Please correct the errors above and try again.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}