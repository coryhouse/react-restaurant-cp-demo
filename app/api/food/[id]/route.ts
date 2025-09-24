import { MenuItemSchema, transformToMenuItem } from '../../../../lib/validation/menuItem';
import type { MenuItem } from '../../../../types/menuItem';

// Update existing menu item
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate ID parameter
    const itemId = parseInt(id, 10);
    if (isNaN(itemId) || itemId <= 0) {
      return Response.json({
        error: 'Invalid ID',
        message: 'Item ID must be a positive integer'
      }, { status: 400 });
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = MenuItemSchema.safeParse(body);
    if (!validationResult.success) {
      const details: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        details[path] = issue.message;
      });

      return Response.json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details
      }, { status: 400 });
    }

    // Transform validated data to MenuItem format with ID
    const menuItemData = {
      ...transformToMenuItem(validationResult.data),
      id: itemId
    };

    // Check if item exists and update via json-server
    const origin = process.env.JSON_SERVER_ORIGIN ?? "http://localhost:3001";

    // First check if item exists
    const checkRes = await fetch(`${origin}/menuItems/${itemId}`);
    if (!checkRes.ok) {
      if (checkRes.status === 404) {
        return Response.json({
          error: 'Not found',
          message: `Menu item with ID ${itemId} not found`
        }, { status: 404 });
      }
      return Response.json({ error: "Failed to check item existence" }, { status: checkRes.status });
    }

    // Update the item
    const updateRes = await fetch(`${origin}/menuItems/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItemData),
    });

    if (!updateRes.ok) {
      return Response.json({ error: "Failed to update item" }, { status: updateRes.status });
    }

    const updatedItem: MenuItem = await updateRes.json();
    return Response.json(updatedItem, { status: 200 });

  } catch (err) {
    if (err instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 });
    }
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}