"use client";

import { CustomDialog } from "@/components/ui/custom-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ShiftsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShiftsDialog({ open, onOpenChange }: ShiftsDialogProps) {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} title="Upcoming Shifts">
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-normal text-gray-500">Date</TableHead>
              <TableHead className="font-normal text-gray-500">Time</TableHead>
              <TableHead className="font-normal text-gray-500">Shift Type</TableHead>
              <TableHead className="font-normal text-gray-500">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell className="py-4">Feb 25</TableCell>
                <TableCell className="py-4">8:00 AM - 12:00 PM</TableCell>
                <TableCell className="py-4">Morning</TableCell>
                <TableCell className="py-4">Maple Care home</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CustomDialog>
  );
}