import { type LucideIcon, Flame, MessageCircle, Radio, Star, Users } from "lucide-react";

export type OnlinePerson = {
  name: string;
  rank: string;
  activity: string;
  status: string;
};

export type HomeStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export const homeStats: HomeStat[] = [
  { label: "People online", value: "0", icon: Users },
  { label: "Active rooms", value: "0", icon: Radio },
  { label: "Trending topics", value: "0", icon: Flame },
];

export const onlinePeople: OnlinePerson[] = [];

export const trendingTopics: { title: string; count: string }[] = [];

export const roomCards: { name: string; online: string; members: string }[] = [];

export const statusBites: { name: string; text: string; tag: string }[] = [];
