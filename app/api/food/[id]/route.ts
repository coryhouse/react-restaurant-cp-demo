import { NextRequest, NextResponse } from 'next/server';
import { FoodItemUpdateSchema, FoodItemSchema } from '../../../../lib/schemas/food';

const JSON_SERVER_ORIGIN = process.env.JSON_SERVER_ORIGIN || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${JSON_SERVER_ORIGIN}/menuItems/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Food item not found' },
          { status: 404 }
        );
      }
      throw new Error(`JSON Server error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response data
    const validationResult = FoodItemSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Invalid food item data:', data, validationResult.error);
      throw new Error('Invalid response data from server');
    }

    return NextResponse.json(validationResult.data);
  } catch (error) {
    console.error('GET /api/food/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = FoodItemUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Ensure the ID matches the route parameter
    if (validatedData.id !== id) {
      return NextResponse.json(
        { error: 'ID in request body must match route parameter' },
        { status: 400 }
      );
    }

    // Send to JSON Server
    const response = await fetch(`${JSON_SERVER_ORIGIN}/menuItems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Food item not found' },
          { status: 404 }
        );
      }
      throw new Error(`JSON Server error: ${response.status}`);
    }

    const updatedItem = await response.json();

    // Validate response data
    const validatedResponse = FoodItemSchema.safeParse(updatedItem);
    if (!validatedResponse.success) {
      console.error('Invalid updated item data:', updatedItem);
      throw new Error('Invalid response data from server');
    }

    return NextResponse.json(validatedResponse.data);
  } catch (error) {
    console.error('PUT /api/food/[id] error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update food item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${JSON_SERVER_ORIGIN}/menuItems/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Food item not found' },
          { status: 404 }
        );
      }
      throw new Error(`JSON Server error: ${response.status}`);
    }

    return NextResponse.json({
      message: 'Food item deleted successfully',
      id
    });
  } catch (error) {
    console.error('DELETE /api/food/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    );
  }
}