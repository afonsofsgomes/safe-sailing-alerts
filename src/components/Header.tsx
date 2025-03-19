
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { UserCog, User, LayoutDashboard, BarChart2, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = !!user;
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const MobileNav = isMobile ? Drawer : Sheet;
  const MobileNavContent = isMobile ? DrawerContent : SheetContent;
  const MobileNavTrigger = isMobile ? DrawerTrigger : SheetTrigger;

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/admin",
      active: pathname === "/admin"
    },
    {
      label: "Analytics",
      icon: <BarChart2 className="h-4 w-4" />,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics"
    },
    {
      label: "Widget Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/admin/widget-settings",
      active: pathname === "/admin/widget-settings"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center sm:justify-between sm:space-x-0">
        <div className="flex-shrink-0 mr-4">
          <Link to="/" className="hidden font-bold sm:block">
            SeaYou Madeira
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <MobileNav open={open} onOpenChange={setOpen}>
            <MobileNavTrigger asChild>
              <Button variant="ghost" className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </MobileNavTrigger>
            <MobileNavContent side="left" className="sm:max-w-sm w-[75vw] pt-6">
              <div className="px-4 py-2 mb-2">
                <Link to="/" className="font-bold text-xl" onClick={() => setOpen(false)}>
                  SeaYou Madeira
                </Link>
              </div>
              <div className="flex flex-col space-y-2 px-4">
                {isAuthenticated && navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                      item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-border my-2" />
                    <Link
                      to="/admin/account"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                        pathname === "/admin/account" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      <UserCog className="h-4 w-4" />
                      Account Settings
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-primary hover:bg-muted"
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            </MobileNavContent>
          </MobileNav>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex flex-1 justify-center">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {isAuthenticated && navItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  item.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-1">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Logo */}
        <div className="sm:hidden flex-1 flex justify-center">
          <Link to="/" className="font-bold">
            SeaYou Madeira
          </Link>
        </div>
        
        <div className="flex items-center justify-end">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.full_name as string} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/account")}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
