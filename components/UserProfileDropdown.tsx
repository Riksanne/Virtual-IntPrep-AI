"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, ChevronDown, LogOut, FileText, X } from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

interface Interview {
  id: string;
  role: string;
  type: string;
  createdAt: string;
}

interface UserProfileDropdownProps {
  user: { name: string; email: string; id: string } | null;
  interviews: Interview[];
}

const UserProfileDropdown = ({ user, interviews }: UserProfileDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || displayName[0]?.toUpperCase() || "?";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-dark-200/80 border border-white/10 hover:border-primary-200/50 hover:bg-dark-300 transition-all duration-200 group"
      >
        <div className="size-8 rounded-full bg-gradient-to-br from-primary-200/80 to-primary-200/30 flex items-center justify-center text-dark-100 font-bold text-sm shrink-0">
          {initials}
        </div>
        <span className="text-sm font-medium text-white">
          {displayName}
        </span>
        <ChevronDown
          className={`size-4 text-light-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-80 rounded-2xl bg-dark-200 border border-white/10 shadow-2xl shadow-black/40 z-50 overflow-hidden animate-fadeIn">
          {/* User Info Header */}
          <div className="p-5 bg-gradient-to-br from-dark-300 to-dark-200 border-b border-white/5">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-xl bg-gradient-to-br from-primary-200/80 to-primary-200/30 flex items-center justify-center text-dark-100 font-bold text-lg shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-bold text-white text-base truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="size-3 text-primary-200/60 shrink-0" />
                  <p className="text-xs text-light-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto p-1 rounded-lg hover:bg-white/10 text-light-400 hover:text-white transition-colors shrink-0"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Interviews List */}
          <div className="p-3">
            <div className="flex items-center gap-2 px-2 mb-2">
              <FileText className="size-3.5 text-primary-200/60" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-200/60">
                Your Interviews ({interviews.length})
              </p>
            </div>

            {interviews.length > 0 ? (
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                {interviews.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/interview/${interview.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-300 group transition-colors duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-6 rounded-lg bg-primary-200/10 flex items-center justify-center shrink-0">
                        <User className="size-3 text-primary-200" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white capitalize truncate group-hover:text-primary-200 transition-colors">
                          {interview.role}
                        </p>
                        <p className="text-[10px] text-light-400">{interview.type}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-light-400 shrink-0">
                      {new Date(interview.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-xs text-light-400">No interviews yet.</p>
                <Link
                  href="/interview"
                  onClick={() => setOpen(false)}
                  className="text-xs text-primary-200 hover:underline mt-1 inline-block"
                >
                  Start your first one →
                </Link>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors duration-150"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
