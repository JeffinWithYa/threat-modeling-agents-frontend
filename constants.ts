import { Code, ImageIcon, MessageSquare, Music, VideoIcon, ListChecks, User, Framer, Component, Network } from "lucide-react";

export const MAX_FREE_COUNTS = 100;

export const tools = [
  {
    label: 'Stakeholders Report (generates a PDF with data flow diagram)',
    icon: User,
    href: '/stakeholders',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'STRIDE Threat Model Report (generates a PDF with data flow diagram)',
    icon: Code,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/stride',
  },
  {
    label: 'Data Flow Diagram (generates image with PyTM)',
    icon: Component,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/dfd',
  },
  {
    label: 'Attack Tree (generates image with GraphViz)',
    icon: Network,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/attacktree',
  },
  {
    label: 'Read the Whitepaper',
    icon: ListChecks,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: '/whitepaper',
  },
];
