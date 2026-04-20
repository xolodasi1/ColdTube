import { Link } from 'react-router-dom';
import { Menu, Search, Video, Bell, User, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-cold-800 bg-cold-950 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-cold-800 rounded-full transition-colors md:hidden">
          <Menu className="w-5 h-5 text-slate-300" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-cold-accent p-1.5 rounded-lg">
            <Video className="w-5 h-5 text-cold-950" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">ColdTube</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4 flex justify-center">
        <div className="w-full relative flex items-center">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-cold-900 border border-cold-800 text-slate-200 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-cold-accent focus:ring-1 focus:ring-cold-accent transition-all placeholder:text-slate-500"
          />
          <button className="absolute right-2 p-1.5 hover:bg-cold-800 rounded-full transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <Link to="/upload" className="flex items-center gap-2 px-3 py-1.5 hover:bg-cold-800 rounded-full transition-colors group">
              <div className="bg-cold-800 group-hover:bg-cold-700 p-1 rounded-full transition-colors">
                <Plus className="w-4 h-4 text-slate-200" />
              </div>
              <span className="text-sm font-medium text-slate-300 hidden md:block mr-2 text-nowrap">Create</span>
            </Link>
            
            <button className="p-2 hover:bg-cold-800 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-slate-300" />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-500">Member</span>
              </div>
              <button onClick={logout} className="w-8 h-8 rounded-full bg-cold-800 flex items-center justify-center border border-cold-800 hover:border-cold-accent transition-colors">
                <User className="w-4 h-4 text-cold-accent" />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-cold-accent hover:bg-cold-accent-hover text-cold-950 font-medium text-sm rounded-full transition-colors">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
