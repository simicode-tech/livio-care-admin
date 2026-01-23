"use client";

import { CustomDialog } from "@/components/ui/custom-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StarRating } from "@/components/ui/star-rating";

interface PastShiftsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PastShiftsDialog({ open, onOpenChange }: PastShiftsDialogProps) {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} title="Past Shifts">
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-normal text-gray-500">Date</TableHead>
              <TableHead className="font-normal text-gray-500">Hours worked</TableHead>
              <TableHead className="font-normal text-gray-500">Client Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell className="py-4">Feb 25</TableCell>
                <TableCell className="py-4">{i === 0 ? "8 hours" : "7 hours"}</TableCell>
                <TableCell className="py-4">
                  <StarRating rating={i === 0 ? 4.5 : i === 1 ? 5.0 : 3.0} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CustomDialog>
  );
}