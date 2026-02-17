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
    <header className="flex items-center justify-between px-4 h-12 border-b bg-background/95 backdrop-blur">
      <Link to="/dashboard" className="flex items-center gap-2 h-full">
        <Logo />
        <BrandName />
      </Link>

      <div className="flex items-center gap-1 h-full">
        {children}

        <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
          <Link to="/dashboard">
            <Menu className="w-4 h-4 text-foreground" />
            <span className="hidden sm:inline text-foreground">{t("dashboard.my_resumes")}</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">
                {i18n.language?.toUpperCase().substring(0, 2)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-28">
            {languages.map((lang) => (
              <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleDark />

        <div className="ml-2 flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
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
