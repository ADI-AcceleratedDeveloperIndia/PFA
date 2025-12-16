'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/transactions', label: 'Transactions', icon: '💳' },
    { href: '/recommendations', label: 'Cards', icon: '🎯' },
    { href: '/connect', label: 'Connect', icon: '🔗' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            PFA
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors tap-target ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium tap-target"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 tap-target"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMenu(false)}
                className={`block px-4 py-3 rounded-lg font-medium tap-target ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium tap-target"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

