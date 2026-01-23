"use client";
import  React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

const sessions = [
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  },
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  },
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  },
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  },
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  },
  {
    id: 1,
    person: "Jack Williams",
    browser: "Chrome on Mac Os",
    location: "Ontario, Canada",
    status: "Current Session"
  }
];

export default function SecurityPage() {
  const [currentPage, setCurrentPage] = useState(2); // Set to 2 to match the design
  const user = useUser();
  const isMainSuperAdmin = (user?.role === "Super Admin") || (user?.is_staff ?? false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white  border-b">
          <div>
            <h3 className="font-medium">Enforce two-step verification</h3>
            <p className="text-sm text-gray-500">Require a security code in addition to password.</p>
          </div>
          <Switch />
        </div>

        {isMainSuperAdmin && (
        <div className="flex items-center justify-between p-4 bg-white  border-b">
          <div>
            <h3 className="font-medium">Logout everyone</h3>
            <p className="text-sm text-gray-500">This will require everyone to logout from the system.</p>
          </div>
          <Button variant="outline" size="sm">
            Log out everyone
          </Button>
        </div>
        )}

        <div className="flex items-center justify-between p-4 bg-white  border-b">
          <div>
            <h3 className="font-medium">Change Password</h3>
            <p className="text-sm text-gray-500">Update your password for better security.</p>
          </div>
          <Button variant="outline" size="sm">
            Change password
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white  border-b">
            <div>
              <h3 className="font-medium">Current Sessions</h3>
              <p className="text-sm text-gray-500">These devices are currently signed to people&apos;s account</p>
            </div>
            <Switch />
          </div>

          <div className="bg-white rounded-lg p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Most recent activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{session.id}</TableCell>
                    <TableCell>{session.person}</TableCell>
                    <TableCell>{session.browser}</TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>{session.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination 
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}