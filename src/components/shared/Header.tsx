import { Link } from "@tanstack/react-router";
import { Languages, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BrandName } from "./BrandName";
import { Logo } from "./Logo";
import { ToggleDark } from "./ToggleDark";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "zh-cn", name: "中文" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-5 h-14 border-b border-border/60 bg-background/80 backdrop-elevated">
      <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 h-full transition-opacity hover:opacity-80 min-w-0">
        <Logo />
        <span className="hidden sm:inline"><BrandName /></span>
      </Link>

      <div className="flex items-center gap-1 h-full">
        {children}

        <Button variant="ghost" size="sm" className="h-9 gap-2 text-sm font-medium rounded-sm px-2 sm:px-3" asChild>
          <Link to="/dashboard">
            <Menu className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">{t("dashboard.my_resumes")}</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-sm px-2 sm:px-3">
              <Languages className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline text-xs font-medium tracking-wide">
                {i18n.language?.toUpperCase().substring(0, 2)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px] rounded-sm border-border/60 shadow-elevated">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="text-sm rounded-sm"
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleDark />

        <div className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="h-9 rounded-sm font-medium shadow-subtle px-2 sm:px-4 text-xs sm:text-sm">
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
