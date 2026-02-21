import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-lg">
        <p className="font-body text-[0.6rem] font-medium tracking-[0.25em] uppercase text-dim mb-8">
          Error — 404
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground leading-tight mb-6">
          You've left the trail.
        </h1>
        <p className="font-body text-sm italic text-body-muted leading-relaxed mb-10">
          This page doesn't exist. Maybe it did. Maybe it didn't.
          <br className="hidden sm:block" />
          Maybe someone made sure it doesn't anymore.
        </p>
        <a
          href="/"
          className="font-body text-xs text-primary hover:underline underline-offset-4 transition-colors"
        >
          Return to the site
        </a>
      </div>
    </div>
  );
};

export default NotFound;
