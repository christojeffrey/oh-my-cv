import { Link } from "@tanstack/react-router";
import { BrandName } from "@/components/shared/BrandName";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Palette, Globe, Smartphone } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Write in Markdown",
    items: ["Real-time preview with smooth editing", "Export to PDF with one click"]
  },
  {
    icon: Palette,
    title: "Customize Everything",
    items: [
      "Theme colors, fonts, margins, and more",
      "Pick from 1000+ Google Fonts",
      "Add custom CSS"
    ]
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    items: [
      "PWA - install to your home screen",
      "Your data stays in your browser",
      "No tracking, no ads"
    ]
  }
];

export function LandingPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="flex items-center justify-between px-4 h-12 border-b bg-background/95 backdrop-blur">
          <Link to="/" className="flex items-center gap-2 h-full">
            <Logo />
            <BrandName />
          </Link>

          <div className="flex items-center gap-4 h-full">
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <a
                href="https://github.com/Renovamen/oh-my-cv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Write Your Resume in Markdown
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              <span className="font-semibold text-foreground">
                <BrandName />
              </span>{" "}
              - Microsoft Word and LaTeX are too overkill for a resume.
            </p>
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-slate-900 hover:bg-slate-800 text-white"
              asChild
            >
              <Link to="/">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start text-muted-foreground text-sm"
                    >
                      <span className="mr-2 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Your data stays in your browser. No cloud, no tracking, no ads.{" "}
              <a
                href="https://github.com/Renovamen/oh-my-cv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Star us on GitHub
              </a>
              !
            </p>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
