import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Image Detection', to: '/image-detection' },
  { label: 'Gaze Detection', to: '/gaze-detection' },
  { label: 'Text Verification', to: '/text-verification' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
      style={{ borderRadius: 0 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold gradient-text tracking-wider">
          AUTHENTIX
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.to ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link to="/login" className="glow-button text-xs py-2 px-5">Login</Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/30"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors ${
                    location.pathname === l.to ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="glow-button text-xs py-2 px-5 text-center" onClick={() => setOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
