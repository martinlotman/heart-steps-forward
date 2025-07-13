
import { Heart, Home, Calendar, BookOpen, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/medications', icon: Calendar, label: 'Meds' },
    { path: '/health', icon: Heart, label: 'Health' },
    { path: '/education', icon: BookOpen, label: 'Learn' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
              location.pathname === path
                ? 'text-primary bg-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
