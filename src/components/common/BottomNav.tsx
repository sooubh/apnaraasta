"use client";

import React from "react";
import { Compass, Bookmark, User } from "lucide-react";

export type NavTab = "discover" | "saved" | "profile";

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  savedCount = 0,
}) => {
  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <div className="bg-white/95 backdrop-blur-lg border border-raasta-border shadow-floating rounded-full px-3 py-1.5 flex items-center space-x-1.5 pointer-events-auto">
        <button
          onClick={() => onTabChange("discover")}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            currentTab === "discover"
              ? "bg-raasta-ink text-white shadow-sm"
              : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => onTabChange("saved")}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all relative ${
            currentTab === "saved"
              ? "bg-raasta-ink text-white shadow-sm"
              : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="ml-1 w-4 h-4 rounded-full bg-raasta-primary text-white text-[10px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange("profile")}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            currentTab === "profile"
              ? "bg-raasta-ink text-white shadow-sm"
              : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};
