"use client";

import React from "react";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  User as UserIcon,
  LogOut,
  Edit3,
  Bookmark,
  GitCompare,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/authContext";
import { TARGET_CITY } from "@/lib/constants";
import { NavTab } from "./BottomNav";

interface NavbarProps {
  onOpenAuthModal?: () => void;
  onEditProfile?: () => void;
  onOpenApiHealth?: () => void;
  currentTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuthModal,
  onEditProfile,
  onOpenApiHealth,
  currentTab = "discover",
  onTabChange,
  savedCount = 0,
}) => {
  const { user, profile, isConfigured, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-raasta-canvas/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 border-b border-raasta-border/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-raasta-primary to-[#8A7CFA] flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
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

        {/* Desktop Center Navigation Tabs */}
        {onTabChange && (
          <nav className="hidden md:flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-raasta-border shadow-subtle">
            <button
              onClick={() => onTabChange("dashboard")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === "dashboard"
                  ? "bg-raasta-ink text-white shadow-sm"
                  : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onTabChange("discover")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === "discover"
                  ? "bg-raasta-ink text-white shadow-sm"
                  : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Personalized Feed</span>
            </button>
            <button
              onClick={() => onTabChange("saved")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === "saved"
                  ? "bg-raasta-ink text-white shadow-sm"
                  : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Pathways</span>
              {savedCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-raasta-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange("profile")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === "profile"
                  ? "bg-raasta-ink text-white shadow-sm"
                  : "text-raasta-inkMuted hover:text-raasta-ink hover:bg-raasta-subtle"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
          </nav>
        )}

        {/* User Auth & Profile Affordance */}
        <div className="flex items-center space-x-2">
          {onOpenApiHealth && (
            <button
              onClick={onOpenApiHealth}
              title="API Diagnostics & Live Services"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white hover:bg-raasta-subtle text-raasta-ink px-3 py-1.5 rounded-full border border-raasta-border shadow-subtle transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-raasta-primary" />
              <span className="hidden sm:inline">API Status</span>
            </button>
          )}

          {profile && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold bg-white hover:bg-raasta-subtle text-raasta-ink px-3 py-1.5 rounded-full border border-raasta-border shadow-subtle transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-raasta-primary" />
              <span>Edit Profile</span>
            </button>
          )}

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
                  {profile?.displayName?.charAt(0) || user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-xs font-medium text-raasta-ink max-w-[100px] truncate hidden sm:inline">
                {profile?.displayName || user.displayName || "Explorer"}
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
