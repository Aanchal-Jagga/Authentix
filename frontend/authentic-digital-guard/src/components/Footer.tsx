import { Github, FileText, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-display text-sm gradient-text font-bold tracking-wider">AUTHENTIX</span>

        <div className="flex items-center gap-6">
          {[
            { icon: Github, label: 'GitHub', href: '#' },
            { icon: FileText, label: 'Docs', href: '#' },
            { icon: Mail, label: 'Contact', href: '#' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-destructive" /> for digital trust
        </p>
      </div>
    </footer>
  );
};

export default Footer;
