'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Fade,
  Alert
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'sonner';
import { MenuItemForm } from '../components/MenuItemForm';
import { MenuItemList } from '../components/MenuItemList';
import { transformToMenuItem } from '../../lib/validation/menuItem';
import type { MenuItem, MenuItemFormData, AdminPageState } from '../../types/menuItem';

/**
 * Admin Page Component
 * Main interface for managing menu items (CRUD operations)
 */
export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<AdminPageState>({
    menuItems: [],
    isLoading: true,
    error: null,
    editingItem: null,
    showAddForm: false
  });

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  /**
   * Fetch all menu items from the API
   */
  const fetchMenuItems = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/food');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const menuItems: MenuItem[] = await response.json();
      setState(prev => ({
        ...prev,
        menuItems,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load menu items',
        isLoading: false
      }));
      toast.error('Failed to load menu items. Please refresh the page.');
    }
  };

  /**
   * Handle form submission for both create and update operations
   */
  const handleFormSubmit = async (formData: MenuItemFormData) => {
    try {
      const isEditing = state.editingItem !== null;
      const url = isEditing ? `/api/food/${state.editingItem!.id}` : '/api/food';
      const method = isEditing ? 'PUT' : 'POST';

      const submitData = {
        ...transformToMenuItem(formData),
        ...(isEditing && { id: state.editingItem!.id })
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save menu item');
      }

      // Show success message
      const successMessage = isEditing
        ? 'Menu item updated successfully!'
        : 'Menu item created successfully!';

      toast.success(successMessage);

      // Redirect to homepage as per requirements
      router.push('/');

    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item. Please try again.');
    }
  };

  /**
   * Handle canceling form operations
   */
  const handleFormCancel = () => {
    setState(prev => ({
      ...prev,
      editingItem: null,
      showAddForm: false
    }));
  };

  /**
   * Handle editing an existing menu item
   */
  const handleEditItem = (item: MenuItem) => {
    setState(prev => ({
      ...prev,
      editingItem: item,
      showAddForm: false
    }));
  };

  /**
   * Handle showing the add form
   */
  const handleShowAddForm = () => {
    setState(prev => ({
      ...prev,
      editingItem: null,
      showAddForm: true
    }));
  };

  /**
   * Navigate back to homepage
   */
  const handleBackToHome = () => {
    router.push('/');
  };

  const isFormVisible = state.showAddForm || state.editingItem !== null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrap form submission to handle loading state
  const wrappedFormSubmit = async (formData: MenuItemFormData) => {
    setIsSubmitting(true);
    try {
      await handleFormSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Admin - Menu Management
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToHome}
          aria-label="Go back to homepage"
        >
          Back to Home
        </Button>
      </Box>

      {/* Error State */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid>
          <Box>
            {!isFormVisible && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleShowAddForm}
                sx={{ mb: 3 }}
              >
                Add New Menu Item
              </Button>
            )}

            <Fade in={isFormVisible}>
              <Box>
                {isFormVisible && (
                  <MenuItemForm
                    initialData={state.editingItem || undefined}
                    onSubmit={wrappedFormSubmit}
                    onCancel={handleFormCancel}
                    isSubmitting={isSubmitting}
                    submitButtonText={
                      state.editingItem ? 'Update Item' : 'Save Item'
                    }
                  />
                )}
              </Box>
            </Fade>
          </Box>
        </Grid>

        {/* Menu Items List Section */}
        <Grid>
          <Box>
            <Typography variant="h6" gutterBottom>
              Current Menu Items
              {!state.isLoading && ` (${state.menuItems.length})`}
            </Typography>

            <MenuItemList
              items={state.menuItems}
              onEdit={handleEditItem}
              isLoading={state.isLoading}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Instructions for users */}
      {!state.isLoading && state.menuItems.length === 0 && !state.error && (
        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            Welcome to the admin panel! Use the form above to add your first menu item.
          </Typography>
        </Box>
      )}
    </Container>
  );
}