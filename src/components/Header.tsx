
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sailboat, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { AuthModal } from './auth/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

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
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin">Manage Alerts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/embed">Embed Widget</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant={scrolled ? "default" : "outline"}
            className={cn(
              "transition-all",
              !scrolled && "border-white/20 text-white bg-white/10 hover:bg-white/20"
            )}
            onClick={openAuthModal}
          >
            Sign In
          </Button>
        )}

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="px-4 py-2 rounded-md hover:bg-gray-100">Home</Link>
                <Link to="/admin" className="px-4 py-2 rounded-md hover:bg-gray-100">Admin</Link>
                <Link to="/embed" className="px-4 py-2 rounded-md hover:bg-gray-100">Embed Widget</Link>
                {user ? (
                  <Button onClick={() => signOut()} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                ) : (
                  <Button onClick={() => { setAuthModalOpen(true); }}>
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
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
