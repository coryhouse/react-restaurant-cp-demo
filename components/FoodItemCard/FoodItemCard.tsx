'use client';

import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import type { FoodItem } from '../../types/food';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability?: () => void;
}

export default function FoodItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability
}: FoodItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      appetizer: 'primary',
      entree: 'secondary',
      dessert: 'warning',
      beverage: 'info',
      side: 'success'
    } as const;

    return colors[category as keyof typeof colors] || 'default';
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: item.isAvailable ? 1 : 0.7,
        border: item.isAvailable ? 'none' : '2px dashed',
        borderColor: 'grey.400'
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={item.imageUrl}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
        onError={(e) => {
          // Fallback for broken images
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="h3" sx={{ mb: 0 }}>
            {item.name}
          </Typography>
          {onToggleAvailability && (
            <IconButton
              size="small"
              onClick={onToggleAvailability}
              color={item.isAvailable ? 'primary' : 'default'}
              title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
            >
              {item.isAvailable ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatPrice(item.price)}
          </Typography>
          <Chip
            label={getCategoryLabel(item.category)}
            color={getCategoryColor(item.category)}
            size="small"
          />
        </Box>

        {!item.isAvailable && (
          <Chip
            label="Unavailable"
            color="error"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={onEdit}
          data-testid={`edit-${item.id}`}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          data-testid={`delete-${item.id}`}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}