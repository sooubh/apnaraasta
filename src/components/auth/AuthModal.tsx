"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/firebase/authContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { signInWithGoogle, isConfigured } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg(null);
      setSigningIn(true);
      await signInWithGoogle();
      setSigningIn(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setSigningIn(false);
      console.warn("Google sign-in error:", err);
      if (err?.code === "auth/popup-closed-by-user") {
        setErrorMsg("Sign-in cancelled. You can continue exploring as a guest.");
      } else {
        setErrorMsg(err?.message || "Failed to sign in with Google.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-raasta-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-floating border border-raasta-border animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <div className="w-8 h-8 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <button
            onClick={onClose}
            className="text-raasta-inkMuted hover:text-raasta-ink p-1 rounded-full hover:bg-raasta-subtle transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-bold text-lg text-raasta-ink mb-1">
          Save Your Pune Pathways
        </h3>
        <p className="text-xs text-raasta-inkMuted mb-5 leading-relaxed">
          Sign in with Google to bookmark your personalized 3-step cultural
          journeys, explore your saved history, and revisit official source details anytime.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isConfigured && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Firebase credentials are not configured in environment variables. Add
              NEXT_PUBLIC_FIREBASE_* in .env.local to enable real Google authentication.
            </span>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 rounded-full bg-raasta-ink text-white font-semibold text-xs shadow-md hover:bg-neutral-800 transition-all disabled:opacity-50"
        >
          {/* Google Icon SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{signingIn ? "Connecting..." : "Continue with Google"}</span>
        </button>

        <p className="text-[11px] text-center text-raasta-inkMuted mt-4">
          Guest mode is always free and requires no account to discover pathways.
        </p>
      </div>
    </div>
  );
};
