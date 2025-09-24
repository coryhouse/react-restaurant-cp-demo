'use client';

import React from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import FoodItemCard from '../FoodItemCard/FoodItemCard';
import type { FoodItem } from '../../types/food';

interface FoodItemListProps {
  items: FoodItem[];
  isLoading?: boolean;
  error?: string | null;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
  onToggleAvailability?: (item: FoodItem) => void;
}

export default function FoodItemList({
  items,
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  onToggleAvailability
}: FoodItemListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No food items found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first menu item to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Menu Items ({items.length})
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3
      }}>
        {items.map((item) => (
          <FoodItemCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            onToggleAvailability={onToggleAvailability ? () => onToggleAvailability(item) : undefined}
          />
        ))}
      </Box>
    </Box>
  );
}