'use client'

import Link from 'next/link';
import { Home, UserPlus, LogOut, Ruler } from 'lucide-react';
import { Button } from './ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter, usePathname } from 'next/navigation';

export function AppSidebar() {
  const [, setAuthenticated] = useLocalStorage('tailor-track-session', false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    setAuthenticated(false);
    router.replace('/login');
  };
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/new', label: 'New Customer', icon: UserPlus },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-card border-r flex-col shadow-md">
      <div className="p-6 border-b flex items-center gap-2">
         <Ruler className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline text-primary font-bold">TailorTrack</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start text-base"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
