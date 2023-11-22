"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Grid, GraduationCap, User, MessageSquare, Settings, Info, ListChecks, Component, Network, Code } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Dashboard',
    icon: Grid,
    href: '/dashboard',
    color: "text-yellow-500"
  },
  {
    label: 'STRIDE Report',
    icon: Code,
    color: "text-pink-700",
    href: '/stride',
  },
  {
    label: 'Data Flow Diagram',
    icon: Component,
    color: "text-violet-700",
    href: '/dfd',
  },
  {
    label: 'Attack Tree',
    icon: Network,
    color: "text-yellow-500",
    href: '/attacktree',
  },
  {
    label: 'Stakeholder Report',
    icon: User,
    color: "text-pink-700",
    href: '/stakeholders',
  }
];

// Separate array for bottom links
const bottomRoutes = [
  {
    label: 'Whitepaper',
    icon: Info,
    href: '/whitepaper',
  },
  {
    label: 'Terms of Service',
    icon: Info, // You can change this icon
    href: '/terms',
    color: "text-zinc-500",
  },
  {
    label: 'Privacy Policy',
    icon: Info, // You can change this icon
    href: '/privacy',
    color: "text-zinc-500",
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  }
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#163006] text-white">
    <div className="px-3 py-2 flex-1">
      <Link href="/dashboard" className="flex items-center pl-3 mb-14">
        <h1 className={cn("text-2xl font-bold", poppins.className)}>
          Threat Modeling with Generative AI
        </h1>
      </Link>
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href} 
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
              pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
    <div className="space-y-1">
      {bottomRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
            pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
          )}
        >
          <div className="flex items-center flex-1">
            <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
            {route.label}
          </div>
        </Link>
      ))}
    </div>
    <FreeCounter 
      apiLimitCount={apiLimitCount} 
      isPro={isPro}
    />
  </div>
  );
};