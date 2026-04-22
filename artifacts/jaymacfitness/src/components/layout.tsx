import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Menu, Dumbbell, Users, Calendar, Package, BookOpen, Inbox } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const trainerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Dumbbell },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/sessions", label: "Sessions", icon: Calendar },
    { href: "/packages", label: "Packages", icon: Package },
    { href: "/bookings", label: "Bookings", icon: BookOpen },
    { href: "/leads", label: "Leads", icon: Inbox },
  ];

  const clientLinks = [
    { href: "/portal", label: "My Portal", icon: Dumbbell },
  ];

  const links = user?.role === "TRAINER" ? trainerLinks : user?.role === "CLIENT" ? clientLinks : [];

  const NavLinks = () => (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span>JayMac<span className="text-primary">Fitness</span></span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <NavLinks />
              </div>
              <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">
                Logout
              </Button>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col gap-6 py-6 h-full">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl" onClick={() => setOpen(false)}>
                      <Dumbbell className="h-6 w-6 text-primary" />
                      <span>JayMac<span className="text-primary">Fitness</span></span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                      <NavLinks />
                    </nav>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); }}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
