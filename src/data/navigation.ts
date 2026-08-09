import type { LucideIcon } from "lucide-react";
import { Compass, Home, MessageSquareText, Sparkles, UserRound } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavigation: NavigationItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/chats", label: "Chats", icon: MessageSquareText },
  { href: "/rooms", label: "Rooms", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export const utilityNavigation: NavigationItem[] = [];
