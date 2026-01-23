"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
// import { IoReceiptOutline } from "react-icons/io5";
import { useSetReset } from "@/store";


const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Organization", href: "/organization" },
  { icon: MessageSquare, label: "Members", href: "/members" },
  { icon: FileText, label: "Subscription", href: "/subscription" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const reset = useSetReset();
  // const [isHRExpanded, setIsHRExpanded] = useState(true);
  
  // const isHRActive = humanResourcesItems.some(item => pathname === item.href);
  
  return (
    <aside className={cn("w-[200px] pt-6 bg-white border-r border-[#E5E7EB] h-screen sticky top-0 flex-col left-0 hidden md:flex", className)}>
      <div className="px-4 flex items-center mb-6">
        <Image
          src="/logo.svg"
          alt="Livio Care Logo"
          width={100}
          height={32}
          priority
          className="object-contain"
        />
      </div>

      <nav className="flex-1 py-3 gap-1 flex flex-col overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
         
          return (
            <Link
              key={index}
              href={item.href!}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 mx-2 px-3 py-2 rounded-lg text-[#505050] hover:bg-[#FDF7FA] hover:text-primary transition-colors",
                pathname === item.href &&
                  "bg-primary-foreground text-primary font-medium"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <button
          className="mt-8 flex cursor-pointer items-center gap-2 mx-2 px-3 py-2 rounded-lg text-[#FF6467] hover:bg-[#FF646730] hover:text-[#FF6467] transition-colors"
          onClick={reset}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </nav>
    </aside>
  );
}