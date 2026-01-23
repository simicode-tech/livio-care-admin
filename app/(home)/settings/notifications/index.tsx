"use client";

import { Switch } from "@/components/ui/switch";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <p className="text-sm text-gray-500">
          Select the kind of notifications you get .
        </p>
      </div>

      <div className="divide-y border rounded-lg">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">
              Get emails to find out what&apos;s going on when you are not
              online. You can turn these off
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">News and Updates</h4>
                <p className="text-sm text-gray-500">
                  News about features and updates
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">Tips and Tutorials</h4>
                <p className="text-sm text-gray-500">
                  Tips on getting more out of Livio
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <p className="text-sm text-gray-500">
              Get push notifications in-app to find out what&apos;s going on when you
              are online.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">Reminder</h4>
                <p className="text-sm text-gray-500">
                  To remind you of updates you might have missed
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">More activity about you</h4>
                <p className="text-sm text-gray-500">
                  More notifications on your dashboard
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}