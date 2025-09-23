interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: 12.99,
    description: "Juicy beef patty with lettuce, tomato, and our special sauce"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 14.99,
    description: "Fresh mozzarella, tomatoes, and basil on our homemade crust"
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 9.99,
    description: "Crisp romaine lettuce with parmesan and croutons"
  },
  {
    id: 4,
    name: "Grilled Salmon",
    price: 18.99,
    description: "Atlantic salmon with roasted vegetables and lemon butter"
  },
  {
    id: 5,
    name: "Chicken Tacos",
    price: 11.99,
    description: "Three soft tacos with seasoned chicken, salsa, and avocado"
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    price: 13.99,
    description: "Creamy pasta with bacon, parmesan, and fresh herbs"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Restaurant Menu</h1>
          <p className="text-foreground/70">Discover our delicious offerings</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMenuItems.map((item) => (
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
