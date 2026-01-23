"use client";

import { useUser } from "@/store";
import { Input } from "./ui/input";
import { Bell, Search, MapPin, X, ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage } from "./ui/avatar";
import { removeInitialsFromName } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Notification Item Component
function NotificationItem({ notification }: { notification: Notification }) {
  const getTimeAgo = (timestamp: string) => {
    if(!timestamp) return "";
    // Simple time ago calculation - you can use a library like date-fns
    return "1 day ago";
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
      !notification.read ? "bg-purple-50" : ""
    }`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Livio Care"
            width={40}
            height={40}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm text-[#1A1A1A]">
              {notification.title}
            </h4>
            <span className="text-xs text-[#666666] whitespace-nowrap">
              {getTimeAgo(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-[#666666] mb-2">
            {notification.message}
          </p>
          <div className="flex justify-end items-center">
          <button className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            View
            <ChevronRight className="w-4 h-4" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample notifications data - replace with actual data from your API
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "3",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: true,
    },
    {
      id: "4",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: true,
    },
    {
      id: "5",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: true,
    },
    {
      id: "6",
      type: "swap_request",
      title: "Swap Request",
      message: "Caregiver Ruby requested for a swap with caregiver jane",
      timestamp: new Date().toISOString(),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatPathname = (path: string) => {
    const cleanPath = path.replace(/^\/(\(home\)|\(auth\))\//, "");
    const lastSegment = cleanPath.split("/").pop() || "";
    return (
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace(/-/g, " ")
    );
  };

  return (
    <>
      <div className="h-[72px] px-4 md:px-6 border-b border-[#E5E7EB] bg-white flex items-center left-0 justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6 text-[#666666]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar className="flex w-full border-none h-full" onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
          </Sheet>
          <h1 className="text-base md:text-lg font-semibold capitalize truncate">
            {formatPathname(pathname)}
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] w-4 h-4" />
            <Input
              type="search"
              placeholder="Find anything"
              className="pl-9 h-10 bg-[#F9FAFB] border-[#E5E7EB] placeholder:text-[#666666] rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-full border-2 border-primary">
              <AvatarImage
                src={
                  user?.profile_picture ??
                  `https://avatar.iran.liara.run/username?username=${removeInitialsFromName(
                    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
                  )}`
                }
              />
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-[#1A1A1A]">
                {user?.role} {user?.first_name}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#666666]">
                <MapPin className="w-3 h-3" />
                <span>Ontario, Cananda</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-[#666666] cursor-pointer" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Notification Dropdown */}
          <div className="fixed right-6 top-[68px] w-[400px] bg-white shadow-2xl border border-[#E5E7EB] z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Notifications
              </h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#666666]" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="relative mb-6">
                    <Image
                      src="/EmptyNotification.svg"
                      alt="Empty Notification"
                      width={120}
                      height={120}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    No notification yet!
                  </h3>
                  <p className="text-sm text-[#666666] text-center">
                    All your notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}