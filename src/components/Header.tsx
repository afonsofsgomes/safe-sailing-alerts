
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
import { UserCog, User, LayoutDashboard, BarChart2, Settings } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center sm:justify-between sm:space-x-0">
        <div className="flex-shrink-0 mr-4">
          <Link to="/" className="hidden font-bold sm:block">
            SeaYou Madeira
          </Link>
          <Button variant="ghost" className="sm:hidden">
            Menu
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {isAuthenticated && (
              <>
                <Link 
                  to="/admin" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
                <Link 
                  to="/admin/analytics" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/admin/analytics" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    Analytics
                  </span>
                </Link>
                <Link 
                  to="/admin/widget-settings" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/admin/widget-settings" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Widget Settings
                  </span>
                </Link>
              </>
            )}
          </nav>
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
