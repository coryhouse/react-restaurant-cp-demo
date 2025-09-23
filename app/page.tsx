interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

async function getMenuItems(): Promise<MenuItem[]> {
  const response = await fetch('http://localhost:3000/api/food', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }

  return response.json();
}

export default async function Home() {
  const menuItems = await getMenuItems();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Restaurant Menu</h1>
          <p className="text-foreground/70">Discover our delicious offerings</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                <span className="text-lg font-bold text-foreground">${item.price}</span>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
