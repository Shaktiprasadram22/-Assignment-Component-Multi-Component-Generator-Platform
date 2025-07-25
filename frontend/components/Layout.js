import { useState } from "react";
import { useRouter } from "next/router";
import { logout } from "../utils/api";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="bg-panel-bg border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-text-primary">
          AI Component Generator
        </h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-73px)]">{children}</main>
    </div>
  );
}
