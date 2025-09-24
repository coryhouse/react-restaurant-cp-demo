'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FoodItemList from '../../components/FoodItemList/FoodItemList';
import FoodItemForm from '../../components/FoodItemForm/FoodItemForm';
import type { FoodItem, FoodItemFormData } from '../../types/food';

export default function AdminPage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load food items on component mount
  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/food');
      if (!response.ok) {
        throw new Error('Failed to load food items');
      }

      const data = await response.json();
      setFoodItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (item: FoodItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (formData: FoodItemFormData) => {
    try {
      setIsSubmitting(true);

      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/food/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData })
        });

        if (!response.ok) {
          throw new Error('Failed to update food item');
        }

        const updatedItem = await response.json();
        setFoodItems(prev =>
          prev.map(item => item.id === editingItem.id ? updatedItem : item)
        );
        showSnackbar('Food item updated successfully');
      } else {
        // Create new item
        const response = await fetch('/api/food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to create food item');
        }

        const newItem = await response.json();
        setFoodItems(prev => [...prev, newItem]);
        showSnackbar('Food item created successfully');
      }

      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      showSnackbar(errorMessage, 'error');
      throw err; // Re-throw to prevent form from closing
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/food/${itemToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete food item');
      }

      setFoodItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      showSnackbar('Food item deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete food item';
      showSnackbar(errorMessage, 'error');
    } finally {
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleToggleAvailability = async (item: FoodItem) => {
    try {
      const updatedItem = { ...item, isAvailable: !item.isAvailable };

      const response = await fetch(`/api/food/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const savedItem = await response.json();
      setFoodItems(prev =>
        prev.map(i => i.id === item.id ? savedItem : i)
      );

      const status = savedItem.isAvailable ? 'available' : 'unavailable';
      showSnackbar(`${savedItem.name} marked as ${status}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update availability';
      showSnackbar(errorMessage, 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <main>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h1">
            Food Admin
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            disabled={showForm}
          >
            Add New Item
          </Button>
        </Box>

        {!showForm && (
          <FoodItemList
            items={foodItems}
            isLoading={isLoading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
          />
        )}

        {showForm && (
          <FoodItemForm
            initialData={editingItem || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &ldquo;{itemToDelete?.name}&rdquo;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={hideSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </Container>
  );
}