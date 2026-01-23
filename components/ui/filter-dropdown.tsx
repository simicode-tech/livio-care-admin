"use client";

import { Button } from "./button";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { IoFilter } from "react-icons/io5";
interface FilterDropdownProps {
  children: React.ReactNode;
}

export function FilterDropdown({ children }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {/* <Filter className="w-4 h-4" /> */}
          <IoFilter />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        alignOffset={-10}
        className="w-[400px] p-6"
        sideOffset={10}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-secondary">Filter</h3>
            <Button variant="ghost" size="icon" className="h-auto p-0">
              <X className="h-4 w-4 text-[#666666]" />
            </Button>
          </div>
          {children}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}