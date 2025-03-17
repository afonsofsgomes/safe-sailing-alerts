
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sailboat } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300',
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center space-x-1">
        <Sailboat className="h-6 w-6 text-sea-500" />
        <span className="font-semibold text-lg">SafeSailing.io</span>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <NavLink to="/" current={location.pathname === "/"}>
          Home
        </NavLink>
        <NavLink to="/admin" current={location.pathname === "/admin"}>
          Admin
        </NavLink>
        <NavLink to="/embed" current={location.pathname === "/embed"}>
          Embed Widget
        </NavLink>
      </nav>

      <div className="flex items-center space-x-4">
        <Button 
          asChild
          variant={scrolled ? "default" : "outline"}
          className={cn(
            "transition-all",
            !scrolled && "border-white/20 text-white bg-white/10 hover:bg-white/20"
          )}
        >
          <Link to="/admin">
            Manage Alerts
          </Link>
        </Button>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium py-1 transition-colors relative",
        current
          ? "text-sea-700 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sea-500"
          : "text-foreground/80 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
