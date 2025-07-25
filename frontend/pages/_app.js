import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkAuth } from "../utils/api";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyAuth = async () => {
    try {
      const response = await checkAuth();
      setIsAuthenticated(response.authenticated || false);
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

  useEffect(() => {
    verifyAuth();
  }, []); // Run once on app load

  // Check auth on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      // If user goes to dashboard and not authenticated, redirect to login
      if (router.pathname === "/dashboard" && !isAuthenticated) {
        router.push("/login");
      }
      // If user goes to login/signup and is authenticated, redirect to dashboard
      if (
        (router.pathname === "/login" || router.pathname === "/signup") &&
        isAuthenticated
      ) {
        router.push("/dashboard");
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

  return (
    <Component
      {...pageProps}
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
    />
  );
}
