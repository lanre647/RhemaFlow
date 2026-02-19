import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Upload,
  Library,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Bell,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Upload', icon: Upload, path: '/dashboard/upload' },
  { label: 'Library', icon: Library, path: '/dashboard/library' },
  { label: 'Transcripts', icon: FileText, path: '/dashboard/transcripts' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-white border-r border-border flex flex-col z-50 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <Link to="/" className="font-heading font-bold text-lg text-dark tracking-tight">
            RhemaFlows
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-lime/15 text-dark'
                    : 'text-text-secondary hover:bg-offwhite hover:text-dark'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? 'text-lime-dark' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-offwhite transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
              <span className="text-xs font-bold text-dark">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">John Doe</p>
              <p className="text-xs text-text-secondary truncate">john@church.org</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/signin')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all w-full mt-1"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-white border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-secondary hover:text-dark"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
              <input
                type="text"
                placeholder="Search transcripts..."
                className="w-[200px] md:w-[280px] h-9 rounded-xl border border-border bg-offwhite pl-9 pr-4 text-sm text-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-offwhite transition-colors">
              <Bell className="w-4 h-4 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime rounded-full" />
            </button>
            <button className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border hover:bg-offwhite transition-colors">
              <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-dark">JD</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
