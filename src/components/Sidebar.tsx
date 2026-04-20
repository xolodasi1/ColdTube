import { Home, Compass, PlaySquare, Clock, History, Flame, Music, Gamepad2, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const mainLinks = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: PlaySquare, label: 'Subscriptions', path: '/feed/subscriptions' },
];

const libLinks = [
  { icon: Clock, label: 'Watch Later', path: '/playlist?list=WL' },
  { icon: History, label: 'History', path: '/feed/history' },
];

const categories = [
  { icon: Flame, label: 'Trending' },
  { icon: Music, label: 'Music' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Trophy, label: 'Sports' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-cold-800 bg-cold-950 hidden md:flex flex-col h-full overflow-y-auto scrollbar-hide py-4">
      <div className="px-3 pb-4 border-b border-cold-800">
        {mainLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-cold-800 text-white' 
                  : 'text-slate-400 hover:bg-cold-900 hover:text-slate-200'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-b border-cold-800">
        <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Library</h3>
        {libLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-cold-800 text-white' 
                  : 'text-slate-400 hover:bg-cold-900 hover:text-slate-200'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4">
        <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Explore</h3>
        {categories.map((category) => (
          <button
            key={category.label}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-cold-900 hover:text-slate-200 transition-colors"
          >
            <category.icon className="w-5 h-5 flex-shrink-0" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
