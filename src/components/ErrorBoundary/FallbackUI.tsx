import { AlertTriangle, RefreshCw } from "lucide-react";

interface FallbackUIProps {
  error?: Error;
}

export function FallbackUI({ error }: FallbackUIProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <div className="max-w-md w-full bg-card border border-destructive/50 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 text-destructive mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          {error?.message || "An unexpected error occurred while rendering this page."}
        </p>
        <button
          onClick={handleReload}
          className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Page
        </button>
      </div>
    </div>
  );
}
