import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signup } from "../utils/api";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signup(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="bg-panel-bg p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">
          Sign Up
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-sidebar-bg border border-gray-600 rounded text-text-primary focus:border-accent focus:outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-sidebar-bg border border-gray-600 rounded text-text-primary focus:border-accent focus:outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-indigo-600 text-white py-2 rounded font-semibold disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-text-secondary text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
