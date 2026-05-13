import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Calendar,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/leads", label: "Leads", icon: Inbox },
  { to: "/dashboard/clients", label: "Clients", icon: Users },
  { to: "/dashboard/sessions", label: "Sessions", icon: Calendar },
  { to: "/dashboard/packages", label: "Packages", icon: Package },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="font-body min-h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur z-40">
        <Link to="/" className="font-display text-2xl tracking-wider px-6 h-20 flex items-center border-b border-white/10">
          HP<span className="text-[#C8FF00]">FIT</span>
        </Link>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C8FF00] text-black"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Signed in as</div>
            <div className="text-sm text-white/80 truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/10 h-14 flex items-center justify-between px-4">
        <Link to="/" className="font-display text-xl tracking-wider">
          HP<span className="text-[#C8FF00]">FIT</span>
        </Link>
        <button
          onClick={logout}
          aria-label="Logout"
          className="text-white/60 hover:text-white p-2"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Main content */}
      <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
        {current && (
          <div className="px-4 md:px-8 pt-6 pb-2 lg:pt-8 lg:pb-4 border-b border-white/5">
            <h1 className="font-display text-3xl md:text-4xl tracking-wide">{current.label.toUpperCase()}</h1>
          </div>
        )}
        <div className="px-4 md:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-black/90 backdrop-blur border-t border-white/10">
        <div className="grid grid-cols-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors min-h-[60px] ${
                  isActive ? "text-[#C8FF00]" : "text-white/50 hover:text-white"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
