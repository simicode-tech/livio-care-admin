"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GeneralSettingsPage from "./general";
import AccountSettingsPage from "./account";
import SecurityPage from "./security";
import SubscriptionsPage from "./subscriptions";

const tabs = [
  {
    value: "general",
    label: "General Settings",
    component: GeneralSettingsPage,
  },
  {
    value: "account",
    label: "Account Settings",
    component: AccountSettingsPage,
  },
  { value: "security", label: "Security", component: SecurityPage },

  {
    value: "subscriptions",
    label: "Manage Subscriptions",
    component: SubscriptionsPage,
  },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "general";

  const activeTab = tabs.find(tab => tab.value === currentTab) || tabs[0];
  const ActiveComponent = activeTab.component;

  return (
    <div className="p-4 md:p-6 md:px-8 space-y-6">
      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          router.push(`/settings?tab=${value}`);
        }}
        className="w-full overflow-hidden"
      >
        <div className="overflow-x-auto w-full pb-1">
          <TabsList className="w-max justify-start border-b rounded-none h-auto p-0 bg-transparent flex">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent cursor-pointer data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-transparent px-4 py-2"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="mt-6 bg-white rounded-lg p-4 md:p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}