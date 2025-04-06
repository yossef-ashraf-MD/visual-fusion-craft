
import React from 'react';
import { Image } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5">
            <Image className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ImageAI</span>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
