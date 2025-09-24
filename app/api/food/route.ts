import { MenuItemSchema, transformToMenuItem } from '../../../lib/validation/menuItem';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Proxy to json-server so the UI can call a stable Next.js route
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = process.env.JSON_SERVER_ORIGIN ?? "http://localhost:3001"; // configurable for CI

    // Support basic filtering via query params (e.g., name_like, q, etc.)
    const jsonServerUrl = new URL("/menuItems", origin);
    url.searchParams.forEach((value, key) => {
      jsonServerUrl.searchParams.set(key, value);
    });

    const res = await fetch(jsonServerUrl.toString(), {
      // Forward method and headers if needed later; GET is enough now
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to fetch from json-server" }, { status: res.status });
    }

    const data: MenuItem[] = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

// Create new menu item
export async function POST(request: Request) {
  try {
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

    // Transform validated data to MenuItem format
    const menuItemData = transformToMenuItem(validationResult.data);

    // Forward to json-server
    const origin = process.env.JSON_SERVER_ORIGIN ?? "http://localhost:3001";
    const res = await fetch(`${origin}/menuItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItemData),
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to create item" }, { status: res.status });
    }

    const createdItem: MenuItem = await res.json();
    return Response.json(createdItem, { status: 201 });

  } catch (err) {
    if (err instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON format" }, { status: 400 });
    }
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}