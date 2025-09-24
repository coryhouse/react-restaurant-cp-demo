import { z } from 'zod';
import Link from 'next/link';
import MenuSearch from './components/MenuSearch';

const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
});

const MenuItemsSchema = z.array(MenuItemSchema);

type MenuItem = z.infer<typeof MenuItemSchema>;

async function getMenuItems(): Promise<MenuItem[]> {
  const response = await fetch('http://localhost:3000/api/food', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }

  const data = await response.json();
  return MenuItemsSchema.parse(data);
}

export default async function Home() {
  const menuItems = await getMenuItems();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Restaurant Menu</h1>
              <p className="text-foreground/70">Discover our delicious offerings</p>
            </div>
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Admin
            </Link>
          </div>
        </header>

        <MenuSearch menuItems={menuItems} />
      </div>
    </div>
  );
}
