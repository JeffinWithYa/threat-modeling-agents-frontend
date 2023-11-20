import { Code, ImageIcon, MessageSquare, Music, VideoIcon, ListChecks, User, Framer, Component, Network } from "lucide-react";

export const MAX_FREE_COUNTS = 100;

export const tools = [
  {
    label: 'Stakeholders Report',
    icon: User,
    href: '/licenses',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'STRIDE Threat Model Report',
    icon: Code,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/persona',
  },
  {
    label: 'Data Flow Diagram',
    icon: Component,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/frameworks',
  },
  {
    label: 'Attack Tree',
    icon: Network,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/frameworks',
  },
];
