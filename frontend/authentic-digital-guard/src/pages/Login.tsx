import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const ok = await login(email, password);
    if (ok) navigate('/');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 sm:p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <LogIn className="w-8 h-8 text-primary mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to Authentix</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-muted/50 px-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-muted/50 px-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button type="submit" className="glow-button w-full">Login</button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
