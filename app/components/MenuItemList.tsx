'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Skeleton,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestaurantMenu as RestaurantIcon
} from '@mui/icons-material';
import type { MenuItemListProps } from '../../types/menuItem';

/**
 * Formats price for display
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Loading skeleton component for menu items
 */
const MenuItemSkeleton = () => (
  <Grid container spacing={3} data-testid="menu-item-skeleton">
    <Card>
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width={80} height={36} />
      </CardActions>
    </Card>
  </Grid>
);

/**
 * Empty state component
 */
const EmptyState = () => (
  <Grid>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={2}
    >
      <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Menu Items Found
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Start by adding your first menu item using the form above.
      </Typography>
    </Box>
  </Grid>
);

/**
 * MenuItemList Component
 * Displays a responsive grid of menu items with edit/delete actions
 */
export function MenuItemList({
  items,
  onEdit,
  onDelete,
  isLoading = false
}: MenuItemListProps) {
  // Show loading skeletons
  if (isLoading) {
    return (
      <Grid container spacing={3} component="ul" role="list" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <MenuItemSkeleton key={index} />
        ))}
      </Grid>
    );
  }

  // Show empty state
  if (items.length === 0) {
    return (
      <Grid container spacing={3}>
        <EmptyState />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} component="ul" role="list" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {items.map((item) => (
        <Grid key={item.id} component="li">
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              },
              '&:focus-within': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </Typography>

              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {formatPrice(item.price)}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.4,
                  minHeight: '4.2em' // 3 lines × 1.4 line-height
                }}
              >
                {item.description}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <IconButton
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.name}`}
                color="primary"
                size="small"
                sx={{
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px'
                  }
                }}
              >
                <EditIcon />
              </IconButton>

              {onDelete && (
                <IconButton
                  onClick={() => onDelete(item.id)}
                  aria-label={`Delete ${item.name}`}
                  color="error"
                  size="small"
                  sx={{
                    '&:focus': {
                      outline: '2px solid',
                      outlineColor: 'error.main',
                      outlineOffset: '2px'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}