import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
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
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* User avatar/name */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-foreground font-medium truncate max-w-[100px]">
                  {user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Login
              </Link>
              <Link to="/signup" className="glow-button text-xs py-2 px-5">
                Sign Up
              </Link>
            </div>
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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User className="w-4 h-4 text-primary" />
                    {user?.name || 'User'}
                  </div>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="glow-button text-xs py-2 px-5 text-center" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
