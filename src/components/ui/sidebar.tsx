import {
  LayoutDashboard,
  Settings,
  BarChartBig,
  UserCog,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { pathname } = useLocation()
  const { signOut, user, session } = useAuth()

  const isAuthenticated = !!session?.user

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-background pb-10 transition-all md:block">
      <div className="flex h-20 items-center justify-center">
        <Link to="/" className="font-bold text-2xl">
          SeaYou Madeira
        </Link>
      </div>
      <div className="space-y-1 px-4 py-2">
        <Link
          to="/admin"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            pathname === "/admin"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          to="/admin/analytics"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            pathname === "/admin/analytics"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <BarChartBig className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          to="/admin/widget-settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            pathname === "/admin/widget-settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Widget Settings
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/admin/account"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                pathname === "/admin/account"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <UserCog className="h-4 w-4" />
              Account Settings
            </Link>
          </>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute bottom-4 left-4">
          <Button variant="ghost" className="w-56 justify-start px-4">
            <Avatar className="mr-2 h-6 w-6">
              <AvatarImage src={user?.user_metadata?.avatar_url as string} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.email}</div>
              <div className="text-muted-foreground text-xs">
                {user?.user_metadata?.role}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem>
            <Link to="/" className="w-full">
              Visit store
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}
