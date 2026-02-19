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
    <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border/60 bg-background/80 backdrop-elevated">
      <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 h-full transition-opacity hover:opacity-80 min-w-0">
        <Logo />
        <span className="hidden sm:inline"><BrandName /></span>
      </Link>

      <div className="flex items-center gap-1 h-full">
        {children}

        <ToggleDark />

        <div className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="h-7 rounded-sm font-medium px-2 sm:px-4 text-xs sm:text-sm" data-umami-event="sign-in-button">
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
