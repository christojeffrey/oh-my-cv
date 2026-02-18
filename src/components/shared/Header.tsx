import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BrandName } from "./BrandName";
import { Logo } from "./Logo";
import { ToggleDark } from "./ToggleDark";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {

  return (
    <header className="flex items-center justify-between px-3 sm:px-5 h-14 border-b border-border/60 bg-background/80 backdrop-elevated">
      <div className="flex items-center gap-4 h-full">
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 h-full transition-opacity hover:opacity-80 min-w-0">
          <Logo />
          <span className="hidden sm:inline"><BrandName /></span>
        </Link>
        <Link to="/guide" className="hidden sm:inline-flex items-center h-full text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
          Guide
        </Link>
      </div>

      <div className="flex items-center gap-1 h-full">
        {children}

        <ToggleDark />

        <div className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="h-9 rounded-sm font-medium shadow-subtle px-2 sm:px-4 text-xs sm:text-sm" data-umami-event="sign-in-button">
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
