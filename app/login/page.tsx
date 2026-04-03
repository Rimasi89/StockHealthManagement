"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TrendingUp, Github } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If already logged in, go to dashboard
  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">StockCoach</h1>
          <p className="text-sm text-zinc-500 mt-1">Your personal investment manager</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-zinc-100 p-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-1">Welcome back</h2>
          <p className="text-sm text-zinc-500 mb-6">Sign in to access your portfolio</p>

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              By signing in, you agree that StockCoach provides tools for informational purposes only.{" "}
              <strong>This is not financial advice.</strong>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Free forever · No credit card required
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
