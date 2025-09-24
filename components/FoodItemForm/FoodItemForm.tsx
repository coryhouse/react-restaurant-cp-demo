'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { FoodItemFormSchema } from '../../lib/schemas/food';
import type { FoodItem, FoodItemFormData } from '../../types/food';

interface FoodItemFormProps {
  initialData?: FoodItem;
  onSubmit: (data: FoodItemFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function FoodItemForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: FoodItemFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || 'entree',
      imageUrl: initialData?.imageUrl || '',
      isAvailable: initialData?.isAvailable ?? true
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null);

        // Validate with Zod schema
        const validatedData = FoodItemFormSchema.parse(value);
        await onSubmit(validatedData);
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError('An unexpected error occurred');
        }
      }
    }
  });

  const validateField = (value: unknown, fieldName: string) => {
    try {
      const fieldSchema = FoodItemFormSchema.pick({ [fieldName]: true });
      fieldSchema.parse({ [fieldName]: value });
      return undefined;
    } catch (error: unknown) {
      const validationError = error as { errors?: Array<{ message: string }> };
      return validationError.errors?.[0]?.message || 'Invalid value';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialData ? 'Edit Food Item' : 'Add New Food Item'}
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
        <form.Field
          name="name"
          validators={{
            onBlur: ({ value }) => validateField(value, 'name')
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(', ')}
              margin="normal"
              required
              inputProps={{ maxLength: 100 }}
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name="description"
          validators={{
            onBlur: ({ value }) => validateField(value, 'description')
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Description"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(', ')}
              margin="normal"
              multiline
              rows={3}
              required
              inputProps={{ maxLength: 500 }}
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name="price"
          validators={{
            onBlur: ({ value }) => validateField(value, 'price')
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(', ')}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name="category"
          validators={{
            onBlur: ({ value }) => validateField(value, 'category')
          }}
        >
          {(field) => (
            <FormControl fullWidth margin="normal" required error={!!field.state.meta.errors.length}>
              <InputLabel>Category</InputLabel>
              <Select
                value={field.state.value}
                label="Category"
                onChange={(e) => field.handleChange(e.target.value as FoodItemFormData['category'])}
                onBlur={field.handleBlur}
                disabled={isLoading}
              >
                <MenuItem value="appetizer">Appetizer</MenuItem>
                <MenuItem value="entree">Entree</MenuItem>
                <MenuItem value="dessert">Dessert</MenuItem>
                <MenuItem value="beverage">Beverage</MenuItem>
                <MenuItem value="side">Side</MenuItem>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <FormHelperText>{field.state.meta.errors.join(', ')}</FormHelperText>
              )}
            </FormControl>
          )}
        </form.Field>

        <form.Field
          name="imageUrl"
          validators={{
            onBlur: ({ value }) => validateField(value, 'imageUrl')
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Image URL"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(', ')}
              margin="normal"
              required
              disabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field name="isAvailable">
          {(field) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Available for ordering"
              sx={{ mt: 2, display: 'block' }}
            />
          )}
        </form.Field>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}