"use client";

import React from "react";
import { Compass, MapPin, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/firebase/authContext";
import { TARGET_CITY } from "@/lib/constants";

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  const { user, isConfigured, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-raasta-canvas/90 backdrop-blur-md px-4 py-3 border-b border-raasta-border/60">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-raasta-primary to-[#8A7CFA] flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-raasta-ink tracking-tight">
                ApnaRaasta
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold bg-raasta-primaryLight text-raasta-primary px-2 py-0.5 rounded-full border border-raasta-border">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                {TARGET_CITY}
              </span>
            </div>
            <p className="text-[11px] text-raasta-inkMuted leading-none hidden sm:block">
              From Your Interests to Your People
            </p>
          </div>
        </div>

        {/* User Auth Affordance */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-full border border-raasta-border shadow-subtle">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-raasta-primaryLight text-raasta-primary flex items-center justify-center text-xs font-bold">
                  {user.displayName ? user.displayName.charAt(0) : "U"}
                </div>
              )}
              <span className="text-xs font-medium text-raasta-ink max-w-[90px] truncate hidden sm:inline">
                {user.displayName || "Explorer"}
              </span>
              <button
                onClick={() => signOutUser()}
                title="Sign out"
                className="text-raasta-inkMuted hover:text-rose-600 transition-colors p-1"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-raasta-ink px-3 py-1.5 rounded-full border border-raasta-border shadow-subtle transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-raasta-primary" />
              <span>{isConfigured ? "Sign in" : "Guest Mode"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
