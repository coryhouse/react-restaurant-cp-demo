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