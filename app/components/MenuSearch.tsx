'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface MenuSearchProps {
  menuItems: MenuItem[];
}

export default function MenuSearch({ menuItems }: MenuSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get('search') || '';

  const handleSearchChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenuItems.map((item) => (
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

      {filteredMenuItems.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-foreground/70">No menu items found matching &ldquo;{searchTerm}&rdquo;</p>
        </div>
      )}
    </>
  );
}