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
  { label: "People online", value: "247", icon: Users },
  { label: "Active rooms", value: "18", icon: Radio },
  { label: "Trending topics", value: "9", icon: Flame },
];

export const onlinePeople: OnlinePerson[] = [
  { name: "David", rank: "Professional", activity: "In Football room", status: "Online now" },
  { name: "Tolu", rank: "Expert", activity: "Listening to music", status: "1 min ago" },
  { name: "Jay", rank: "Amateur", activity: "Starting a new chat", status: "Online now" },
  { name: "Praise", rank: "Master", activity: "Building in Tech room", status: "Away" },
];

export const trendingTopics = [
  { title: "Champions League predictions", count: "189 people talking" },
  { title: "Who is still awake?", count: "127 people talking" },
  { title: "Best Nigerian artist right now?", count: "94 people talking" },
];

export const roomCards = [
  { name: "Football", online: "147 online", members: "1,284 members" },
  { name: "Music", online: "96 online", members: "882 members" },
  { name: "Tech", online: "84 online", members: "654 members" },
];

export const statusBites = [
  { name: "Zina", text: "Who is awake and coming to room?", tag: "Online" },
  { name: "Korede", text: "This match go hard tonight.", tag: "Listening" },
  { name: "Muna", text: "Need beta friends in Tech.", tag: "Building" },
];
