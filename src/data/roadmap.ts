export type RoadmapPhase = {
  status: "done" | "in-progress" | "upcoming";
  title: string;
  summary: string;
  items: string[];
};

export const roadmapPhases: RoadmapPhase[] = [
  {
    status: "done",
    title: "Foundation",
    summary: "Set the technical and visual base so everything else lands cleanly.",
    items: [
      "Repo structure",
      "Design system",
      "Environment config",
      "Shared types",
      "App shell",
    ],
  },
  {
    status: "upcoming",
    title: "Auth + Profiles",
    summary: "Let users sign up, sign in, and build their identity.",
    items: [
      "Username/email auth",
      "Onboarding interests",
      "Profile setup",
      "Protected routes",
    ],
  },
  {
    status: "upcoming",
    title: "Messaging",
    summary: "Deliver the core social loop with realtime private chat.",
    items: [
      "Direct messages",
      "Typing indicators",
      "Read receipts",
      "Reactions and replies",
    ],
  },
  {
    status: "in-progress",
    title: "Presence + Rooms",
    summary: "Make the app feel alive with online state and public rooms.",
    items: [
      "Online presence",
      "Statuses",
      "Communities",
      "Room chat",
    ],
  },
  {
    status: "in-progress",
    title: "Discovery + Rank",
    summary: "Power social growth with discovery, XP, and progression.",
    items: [
      "Trending topics",
      "People discovery",
      "XP transactions",
      "Rank system",
    ],
  },
  {
    status: "upcoming",
    title: "Safety + Scale",
    summary: "Lock down moderation, auditing, and production performance.",
    items: [
      "Moderation tools",
      "Admin tools",
      "Search",
      "Performance and security",
    ],
  },
];
