import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkAuth } from "../utils/api";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        // Only redirect if user is trying to access protected routes
        if (router.pathname === "/dashboard") {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []); // Remove router.pathname from dependencies to prevent infinite loops

  // Handle route changes separately
  useEffect(() => {
    const handleRouteChange = () => {
      // Only check auth on protected routes, don't run full auth check
      if (router.pathname === "/dashboard" && !isAuthenticated) {
        router.push("/login");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return <Component {...pageProps} isAuthenticated={isAuthenticated} />;
}
// This file is the custom App component for Next.js, which wraps all pages
