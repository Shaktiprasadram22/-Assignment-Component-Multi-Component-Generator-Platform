import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home({ isAuthenticated }) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-accent to-ai-bubble bg-clip-text text-transparent">
            AI Component Generator
          </h1>
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Generate beautiful React components with AI. Simply describe what
            you want, and watch your ideas come to life with clean, modern code.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-accent hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
